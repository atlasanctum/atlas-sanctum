/**
 * integrationWiring.ts
 *
 * This is where the wheel gets its spokes connected to the hub.
 *
 * Call wirePipeline(app, services) once at server startup.
 * It registers:
 *   1. EventBus handlers that close the feedback loops
 *   2. Constitution middleware for governance routes
 *   3. REST routes: /trust/*, /oracle/*, /governance/review
 *
 * Nothing in this file is new capability — it connects what already exists.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { EventBus, EVENTS } from '../services/eventBus';
import { AgentOrchestrator } from '../agents/orchestrator';
import { BlockchainConnector } from '../connectors/BlockchainConnector';
import { TrustPipeline, getTrustPipeline, type IngestEvidenceInput } from '../services/TrustPipeline';
import { reviewProposal, type AmendmentTier } from '../lib/constitution';

// ─── Event Bus Wiring ─────────────────────────────────────────────────────────

/**
 * Register all event handlers that close the feedback loops.
 * This is what makes the system self-reinforcing rather than a collection of
 * independent services.
 */
export function wireEventHandlers(
  eventBus: EventBus,
  pipeline: TrustPipeline,
  orchestrator: AgentOrchestrator,
): void {

  // EVIDENCE_SUBMITTED → trigger trust pipeline
  // This is the primary entry point — every new evidence record flows through here
  eventBus.subscribe(EVENTS.EVIDENCE_SUBMITTED, async (event) => {
    const payload = event.payload as IngestEvidenceInput;
    try {
      await pipeline.ingestEvidence(payload);
    } catch (err) {
      console.error('[TrustPipeline] Evidence ingestion failed:', event.aggregateId, err);
      // Dispatch security sentinel to investigate
      await orchestrator.submit({
        role: 'security-sentinel',
        instruction: `TrustPipeline ingestion failed for evidence ${event.aggregateId}. Investigate and retry.`,
        context: { evidenceId: event.aggregateId, error: String(err) },
        priority: 1,
      });
    }
  });

  // ANOMALY_DETECTED → dispatch auditor agent
  eventBus.subscribe(EVENTS.ANOMALY_DETECTED, async (event) => {
    const payload = event.payload as { type?: string; oracleAddress?: string };
    if (payload.type === 'oracle_slashed') return; // already handled in pipeline

    await orchestrator.submit({
      role: 'fragility-analyst',
      instruction: `Anomaly detected: ${event.aggregateId}. Analyze pattern, check for oracle collusion, recommend response.`,
      context: event.payload as Record<string, unknown>,
      priority: 1,
    });
  });

  // HUMAN_REVIEW_REQUIRED → IoT monitor for sensor-related reviews
  eventBus.subscribe(EVENTS.HUMAN_REVIEW_REQUIRED, async (event) => {
    const payload = event.payload as { role: string };
    if (payload.role === 'iot-monitor') {
      await orchestrator.submit({
        role: 'iot-monitor',
        instruction: `Human review escalation for: ${event.aggregateId}. Confirm sensor data integrity.`,
        context: event.payload as Record<string, unknown>,
        priority: 1,
        requiresHumanApproval: true,
      });
    }
  });

  // DAO_PROPOSAL_SUBMITTED → constitutional review gate
  eventBus.subscribe(EVENTS.DAO_PROPOSAL_SUBMITTED, async (event) => {
    const payload = event.payload as {
      type: string;
      description: string;
      affectedParameters: string[];
      proposerVotingWeight: number;
      targetAmendmentTier: AmendmentTier;
    };

    const review = reviewProposal(payload);

    if (!review.permitted) {
      // Constitutional violation — emit anomaly, block proposal
      await eventBus.publish(EVENTS.ANOMALY_DETECTED, event.aggregateId, 'governance', {
        type: 'constitutional_violation',
        proposalId: event.aggregateId,
        violations: review.violations,
      });

      await orchestrator.submit({
        role: 'governance-advisor',
        instruction: `Constitutional violations in proposal ${event.aggregateId}: ${review.violations.join('; ')}. Draft explanation for proposer.`,
        context: { proposalId: event.aggregateId, review },
        priority: 1,
      });
      return;
    }

    // Permitted — dispatch governance agent for analysis
    await orchestrator.submit({
      role: 'governance-advisor',
      instruction: `Analyse governance proposal ${event.aggregateId}. Model second-order effects. Check for unrepresented stakeholders. Publish analysis before vote opens.`,
      context: { proposalId: event.aggregateId, review, proposal: payload },
      priority: 2,
    });
  });

  // Dead letter handler — log and alert
  eventBus.onDeadLetter(async ({ event, error }) => {
    console.error('[EventBus] Dead letter:', event.type, event.aggregateId, error);
    await orchestrator.submit({
      role: 'security-sentinel',
      instruction: `Event processing failed: ${event.type} for ${event.aggregateId}. Error: ${error}`,
      context: { eventType: event.type, aggregateId: event.aggregateId, error },
      priority: 2,
    });
  });
}

// ─── Constitution Middleware ──────────────────────────────────────────────────

/**
 * Express middleware that gates governance proposal routes against the constitution.
 * Mount this on any route that accepts governance proposals.
 *
 * Usage: router.post('/proposals', constitutionGate, handler)
 */
export function constitutionGate(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as {
    type?: string;
    description?: string;
    affectedParameters?: string[];
    proposerVotingWeight?: number;
    targetAmendmentTier?: AmendmentTier;
  };

  if (!body.type || !body.targetAmendmentTier) {
    next(); // not a typed proposal, pass through
    return;
  }

  const review = reviewProposal({
    type: body.type,
    description: body.description ?? '',
    affectedParameters: body.affectedParameters ?? [],
    proposerVotingWeight: body.proposerVotingWeight ?? 0,
    targetAmendmentTier: body.targetAmendmentTier,
  });

  // Attach review to request for downstream handlers
  (req as any).constitutionReview = review;

  if (!review.permitted) {
    res.status(403).json({
      error: 'Constitutional violation',
      violations: review.violations,
      message: `This proposal violates immutable rights and cannot be submitted.`,
    });
    return;
  }

  next();
}

// ─── REST Routes ──────────────────────────────────────────────────────────────

export function buildIntegrationRouter(
  pipeline: TrustPipeline,
  eventBus: EventBus,
): Router {
  const router = Router();

  /**
   * POST /trust/ingest
   * Submit evidence directly through the trust pipeline.
   * In production this is called by MrvService after evidence creation.
   */
  router.post('/trust/ingest', async (req: Request, res: Response) => {
    try {
      const input = req.body as IngestEvidenceInput;
      if (!input.evidenceId || !input.projectId || !input.providerId) {
        res.status(400).json({ error: 'evidenceId, projectId, and providerId are required' });
        return;
      }
      const result = await pipeline.ingestEvidence(input);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  /**
   * POST /trust/preview
   * Compute trust score without side effects — for provider self-assessment.
   * Returns trust score, grade, price multiplier, and explanation.
   */
  router.post('/trust/preview', (req: Request, res: Response) => {
    try {
      const inputs = req.body;
      if (!inputs.attestations || !Array.isArray(inputs.attestations)) {
        res.status(400).json({ error: 'attestations array required' });
        return;
      }
      const score = pipeline.previewTrustScore(inputs);
      res.json(score);
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  /**
   * POST /governance/review
   * Constitutional review gate — check proposal before submission.
   * Front-end calls this to show providers what tier/threshold applies.
   */
  router.post('/governance/review', (req: Request, res: Response) => {
    try {
      const proposal = req.body;
      if (!proposal.type || !proposal.targetAmendmentTier) {
        res.status(400).json({ error: 'type and targetAmendmentTier required' });
        return;
      }
      const review = pipeline.reviewGovernanceProposal(proposal);
      res.json(review);
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  /**
   * POST /oracle/register
   * Register an oracle with a stake deposit.
   * In production this submits an on-chain tx via the oracle keeper.
   */
  router.post('/oracle/register', (req: Request, res: Response) => {
    try {
      const { oracleAddress, oracleType, stakedAmountSAN } = req.body;
      if (!oracleAddress || !oracleType || !stakedAmountSAN) {
        res.status(400).json({ error: 'oracleAddress, oracleType, stakedAmountSAN required' });
        return;
      }
      pipeline.registerOracleStake({
        oracleAddress,
        oracleType,
        stakedAmountSAN,
        reputation: 0.8, // new oracles start with benefit of doubt
        slashHistory: [],
      });
      res.status(201).json({ registered: true, oracleAddress, stakedAmountSAN });
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  /**
   * POST /oracle/:address/slash
   * Slash an oracle for false attestation. Requires admin auth in production.
   */
  router.post('/oracle/:address/slash', async (req: Request, res: Response) => {
    try {
      const { reason, fraudSeverity } = req.body;
      if (!reason || fraudSeverity == null) {
        res.status(400).json({ error: 'reason and fraudSeverity (0-1) required' });
        return;
      }
      const result = await pipeline.slashOracle(req.params.address, reason, Number(fraudSeverity));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  /**
   * GET /oracle/stakes
   * List all registered oracle stakes and reputations.
   */
  router.get('/oracle/stakes', (_req: Request, res: Response) => {
    res.json(pipeline.getAllOracleStakes());
  });

  /**
   * GET /trust/reputation/:providerId
   * Get a provider's current reputation score.
   */
  router.get('/trust/reputation/:providerId', (req: Request, res: Response) => {
    const score = pipeline.getProviderReputationScore(req.params.providerId);
    res.json({ providerId: req.params.providerId, reputationScore: score });
  });

  /**
   * GET /health/pipeline
   * Pipeline health check — queue depths, event bus status.
   */
  router.get('/health/pipeline', (_req: Request, res: Response) => {
    res.json({
      status: 'operational',
      oracleCount: pipeline.getAllOracleStakes().length,
      deadLetterCount: eventBus.getDeadLetterQueue().length,
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}

// ─── Bootstrap function ───────────────────────────────────────────────────────

/**
 * Call this once at app startup, passing in the shared service instances.
 *
 * Example:
 *   const { pipeline, router } = wireIntegrationLayer(app, {
 *     eventBus: buildEventBus(),
 *     orchestrator: new AgentOrchestrator(aiConnector, eventBus),
 *     blockchain: new BlockchainConnector(config),
 *   });
 *   app.use('/api/v2', router);
 */
export function wireIntegrationLayer(
  services: {
    eventBus: EventBus;
    orchestrator: AgentOrchestrator;
    blockchain: BlockchainConnector;
  },
): { pipeline: TrustPipeline; router: Router } {
  const { eventBus, orchestrator, blockchain } = services;

  const pipeline = getTrustPipeline(eventBus, orchestrator, blockchain);

  // Wire event handlers — this closes the feedback loops
  wireEventHandlers(eventBus, pipeline, orchestrator);

  // Build REST router
  const router = buildIntegrationRouter(pipeline, eventBus);

  return { pipeline, router };
}
