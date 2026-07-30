import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { createAtlasRoutes } from './routes/atlasRoutes';
import { buildConnectorRegistry } from './connectors/ConnectorRegistry';
import { buildEventBus, EVENTS } from './services/eventBus';
import { AgentOrchestrator } from './agents/orchestrator';
import {
  traceMiddleware,
  meteringMiddleware,
  auditMiddleware,
} from './middleware/integrationGateway';
import type { AIConnector } from './connectors/AIConnector';
import type { ObservabilityConnector } from './connectors/ObservabilityConnector';
import type { BlockchainConnector } from './connectors/BlockchainConnector';
import { wireIntegrationLayer } from './middleware/integrationWiring';

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'atlas_sanctum',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Build integration layer
const registry = buildConnectorRegistry();
const eventBus = buildEventBus();
const obs = registry.get<ObservabilityConnector>('observability-connector');
const ai = registry.get<AIConnector>('ai-connector');
const orchestrator = ai ? new AgentOrchestrator(ai, eventBus, obs) : null;
const blockchain = registry.get<BlockchainConnector>('blockchain-connector');

// Wire the Trust Pipeline — connects trust-engine, oracle staking, covenant engine,
// blockchain anchoring, agent dispatch, and event bus into one turning wheel.
const integrationLayer = orchestrator && blockchain
  ? wireIntegrationLayer({ eventBus, orchestrator, blockchain })
  : null;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(traceMiddleware);
app.use(meteringMiddleware(obs));
app.use(auditMiddleware(eventBus));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', async (_req, res) => {
  const connectorHealth = await registry.healthReport();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'atlas-sanctum-api',
    connectors: connectorHealth,
    agents: orchestrator
      ? { queueDepth: orchestrator.queueDepth, running: orchestrator.runningCount, pendingHumanOverrides: orchestrator.pendingHumanOverrides.length }
      : null,
  });
});

// Integration: connector registry status
app.get('/v1/integration/connectors', async (_req, res) => {
  res.json(await registry.healthReport());
});

// Integration: agent task submission
app.post('/v1/integration/agents/tasks', async (req, res) => {
  if (!orchestrator) { res.status(503).json({ error: 'Agent orchestrator unavailable' }); return; }
  try {
    const taskId = await orchestrator.submit(req.body);
    res.status(202).json({ taskId });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Task submission failed' });
  }
});

// Integration: human override resolution
app.post('/v1/integration/agents/overrides/:taskId/resolve', async (req, res) => {
  if (!orchestrator) { res.status(503).json({ error: 'Agent orchestrator unavailable' }); return; }
  try {
    const { decision, actorId, notes } = req.body;
    await orchestrator.resolveHumanOverride(req.params.taskId, decision, actorId, notes);
    res.json({ resolved: true });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Override resolution failed' });
  }
});

// Integration: pending human overrides
app.get('/v1/integration/agents/overrides', (_req, res) => {
  if (!orchestrator) { res.status(503).json({ error: 'Agent orchestrator unavailable' }); return; }
  res.json({ items: orchestrator.pendingHumanOverrides });
});

// Integration: event bus dead-letter queue
app.get('/v1/integration/events/dead-letter', (_req, res) => {
  res.json({ items: eventBus.getDeadLetterQueue() });
});

// Trust Pipeline routes: /trust/*, /oracle/*, /governance/review, /health/pipeline
if (integrationLayer) {
  app.use('/api/v2', integrationLayer.router);
}

// API routes
app.use('/', createAtlasRoutes(pool));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    await registry.connectAll();
    const health = await registry.healthReport();
    console.log(`Connectors: ${health.healthy} healthy, ${health.degraded} degraded, ${health.offline} offline`);

    // Wire event bus dead-letter to observability
    eventBus.onDeadLetter(({ event, error }) => {
      obs?.sendLog({ level: 'error', message: `Dead-letter event: ${event.type} — ${error}`, service: 'event-bus' });
    });

    app.listen(PORT, () => {
      console.log(`Atlas Sanctum API running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API base: http://localhost:${PORT}/v1`);
      console.log(`Trust Pipeline: ${integrationLayer ? 'ACTIVE' : 'OFFLINE (missing AI or blockchain connector)'}`);
      if (integrationLayer) {
        console.log(`  POST /api/v2/trust/ingest        — evidence → trust score → chain anchor`);
        console.log(`  POST /api/v2/trust/preview       — trust score preview (no side effects)`);
        console.log(`  POST /api/v2/governance/review   — constitutional constraint check`);
        console.log(`  POST /api/v2/oracle/register     — register oracle with stake`);
        console.log(`  POST /api/v2/oracle/:id/slash    — slash oracle for fraud`);
        console.log(`  GET  /api/v2/oracle/stakes       — list all oracle stakes`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  await registry.disconnectAll();
  await pool.end();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();

export default app;
