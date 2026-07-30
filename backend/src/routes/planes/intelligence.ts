/**
 * Atlas Sanctum — Five Intelligence Models API Router
 * Mounted at: /api/v3/intelligence
 *
 * Model I   — /flourishing
 * Model II  — /regenerative-economy
 * Model III — /innovation
 * Model IV  — /ethics
 * Model V   — /ecosystem
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { logger } from '../../utils/logger';
import humanFlourishingEngine from '../../services/humanFlourishingEngine';
import regenerativeEconomyEngine from '../../services/regenerativeEconomyEngine';
import innovationGenesisEngine from '../../services/innovationGenesisEngine';
import ethicalDecisionEngine from '../../services/ethicalDecisionEngine';
import ecosystemIntelligenceEngine from '../../services/ecosystemIntelligenceEngine';
import { query } from '../../db';

const router = Router();
router.use(authenticate);

// ── Shared handler wrapper ────────────────────────────────────────────────────
const handle = (fn: (req: Request, res: Response) => Promise<unknown>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res);
      res.json({ success: true, data: result });
    } catch (err) {
      logger.error('[Intelligence API]', { err, path: req.path });
      next(err);
    }
  };

// ═══════════════════════════════════════════════════════════
// MODEL I — HUMAN FLOURISHING ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * POST /flourishing/snapshots
 * Record a new flourishing measurement for an entity.
 * Body: FlourishingInput
 */
router.post('/flourishing/snapshots', handle(async (req) => {
  return humanFlourishingEngine.recordSnapshot(req.body);
}));

/**
 * GET /flourishing/snapshots/:entityId
 * Get the latest flourishing snapshot for an entity.
 */
router.get('/flourishing/snapshots/:entityId', handle(async (req) => {
  const snapshot = await humanFlourishingEngine.getLatest(req.params.entityId as string);
  if (!snapshot) return { found: false };
  return snapshot;
}));

/**
 * GET /flourishing/trends/:entityId?days=180
 * Get flourishing trend over time.
 */
router.get('/flourishing/trends/:entityId', handle(async (req) => {
  const days = parseInt(req.query.days as string) || 180;
  return humanFlourishingEngine.getTrend(req.params.entityId as string, days);
}));

/**
 * POST /flourishing/compare
 * Compare multiple entities side-by-side.
 * Body: { entityIds: string[] }
 */
router.post('/flourishing/compare', handle(async (req) => {
  const { entityIds } = req.body;
  if (!Array.isArray(entityIds) || entityIds.length < 2) throw new Error('entityIds must be an array of at least 2');
  return humanFlourishingEngine.compare(entityIds);
}));

/**
 * GET /flourishing/dashboard?entityType=community
 * Aggregate dashboard across all entities.
 */
router.get('/flourishing/dashboard', handle(async (req) => {
  return humanFlourishingEngine.getDashboard(req.query.entityType as string | undefined);
}));

// ═══════════════════════════════════════════════════════════
// MODEL II — REGENERATIVE ECONOMY ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * POST /regenerative-economy/valuate
 * Compute true value of a project including hidden costs and benefits.
 * Body: RegenerativeInput
 */
router.post('/regenerative-economy/valuate', handle(async (req) => {
  return regenerativeEconomyEngine.valuate(req.body);
}));

/**
 * GET /regenerative-economy/projects/:projectId
 * Get latest valuation for a project.
 */
router.get('/regenerative-economy/projects/:projectId', handle(async (req) => {
  const val = await regenerativeEconomyEngine.getLatestValuation(req.params.projectId as string);
  if (!val) return { found: false };
  return val;
}));

/**
 * GET /regenerative-economy/leaderboard?limit=20
 * Top regenerative projects ranked by true value score.
 */
router.get('/regenerative-economy/leaderboard', handle(async (req) => {
  const limit = parseInt(req.query.limit as string) || 20;
  return regenerativeEconomyEngine.getLeaderboard(limit);
}));

/**
 * POST /regenerative-economy/compare
 * Compare multiple projects' regenerative value.
 * Body: { projectIds: string[] }
 */
router.post('/regenerative-economy/compare', handle(async (req) => {
  const { projectIds } = req.body;
  if (!Array.isArray(projectIds)) throw new Error('projectIds must be an array');
  return regenerativeEconomyEngine.compareProjects(projectIds);
}));

// ═══════════════════════════════════════════════════════════
// MODEL III — INNOVATION GENESIS ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * POST /innovation/signals
 * Ingest a new innovation signal (paper, patent, startup, etc.)
 * Body: InnovationSignalInput
 */
router.post('/innovation/signals', handle(async (req) => {
  return innovationGenesisEngine.ingestSignal(req.body);
}));

/**
 * GET /innovation/signals?limit=20&type=startup
 * Get top-ranked innovation signals.
 */
router.get('/innovation/signals', handle(async (req) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const type = req.query.type as string | undefined;
  return innovationGenesisEngine.getTopSignals(limit, type);
}));

/**
 * GET /innovation/opportunities
 * Get detected innovation opportunities (clustered from signals).
 */
router.get('/innovation/opportunities', handle(async (req) => {
  return innovationGenesisEngine.detectOpportunities();
}));

/**
 * POST /innovation/opportunities
 * Create a validated innovation opportunity.
 * Body: opportunity data
 */
router.post('/innovation/opportunities', handle(async (req) => {
  return innovationGenesisEngine.createOpportunity(req.body);
}));

// ═══════════════════════════════════════════════════════════
// MODEL IV — ETHICAL DECISION ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * POST /ethics/evaluate
 * Evaluate a proposed action through all ethical lenses.
 * Body: EthicalEvaluationInput
 */
router.post('/ethics/evaluate', handle(async (req) => {
  return ethicalDecisionEngine.evaluate(req.body);
}));

/**
 * GET /ethics/history/:ref
 * Get all ethical evaluations for a given reference (project, policy, etc.)
 */
router.get('/ethics/history/:ref', handle(async (req) => {
  return ethicalDecisionEngine.getEvaluationHistory(req.params.ref as string);
}));

/**
 * GET /ethics/pending-reviews
 * Get all evaluations requiring human review (admin only in production).
 */
router.get('/ethics/pending-reviews', handle(async (req) => {
  return ethicalDecisionEngine.getPendingReviews();
}));

// ═══════════════════════════════════════════════════════════
// MODEL V — ECOSYSTEM INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * POST /ecosystem/assess
 * Record a new ecosystem assessment.
 * Body: EcosystemInput
 */
router.post('/ecosystem/assess', handle(async (req) => {
  return ecosystemIntelligenceEngine.assess(req.body);
}));

/**
 * GET /ecosystem/regions/:regionId
 * Get latest assessment for a region.
 */
router.get('/ecosystem/regions/:regionId', handle(async (req) => {
  const assessment = await ecosystemIntelligenceEngine.getLatest(req.params.regionId as string);
  if (!assessment) return { found: false };
  return assessment;
}));

/**
 * GET /ecosystem/regions/:regionId/history?days=365
 * Get historical health scores for a region.
 */
router.get('/ecosystem/regions/:regionId/history', handle(async (req) => {
  const days = parseInt(req.query.days as string) || 365;
  return ecosystemIntelligenceEngine.getHistory(req.params.regionId as string, days);
}));

/**
 * GET /ecosystem/dashboard
 * Global ecosystem health dashboard.
 */
router.get('/ecosystem/dashboard', handle(async (req) => {
  return ecosystemIntelligenceEngine.getGlobalDashboard();
}));

/**
 * GET /ecosystem/critical?limit=10
 * Get regions in critical or degrading state.
 */
router.get('/ecosystem/critical', handle(async (req) => {
  const limit = parseInt(req.query.limit as string) || 10;
  return ecosystemIntelligenceEngine.getCriticalRegions(limit);
}));

// ═══════════════════════════════════════════════════════════
// CROSS-MODEL: Decision Support Log
// ═══════════════════════════════════════════════════════════

/**
 * POST /decisions
 * Log that a model output influenced a real decision.
 * Body: { model, sourceId, decisionMade, decisionMaker }
 */
router.post('/decisions', handle(async (req) => {
  const { model, sourceId, decisionMade, decisionMaker } = req.body;
  const result = await query(
    `INSERT INTO decision_support_log (model, source_id, decision_made, decision_maker)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [model, sourceId, decisionMade, decisionMaker ?? null]
  );
  return result.rows[0];
}));

/**
 * PATCH /decisions/:id/outcome
 * Record the outcome of a decision for model feedback loop.
 * Body: { outcome, outcomeScore, feedback }
 */
router.patch('/decisions/:id/outcome', handle(async (req) => {
  const { outcome, outcomeScore, feedback } = req.body;
  const result = await query(
    `UPDATE decision_support_log
     SET outcome = $1, outcome_score = $2, feedback = $3, outcome_at = NOW()
     WHERE id = $4 RETURNING *`,
    [outcome, outcomeScore ?? null, feedback ?? null, req.params.id]
  );
  if (!result.rows[0]) throw new Error('Decision log entry not found');
  return result.rows[0];
}));

/**
 * GET /decisions?model=flourishing&limit=20
 * Get decision log entries, optionally filtered by model.
 */
router.get('/decisions', handle(async (req) => {
  const VALID_MODELS = new Set(['flourishing','regenerative_economy','innovation_genesis','ethical_decision','ecosystem_intelligence']);
  const model = req.query.model as string | undefined;
  const safeModel = model && VALID_MODELS.has(model) ? model : undefined;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await query(
    `SELECT * FROM decision_support_log WHERE ($1::TEXT IS NULL OR model = $1) ORDER BY decided_at DESC LIMIT $2`,
    [safeModel ?? null, limit]
  );
  return result.rows;
}));

export default router;
