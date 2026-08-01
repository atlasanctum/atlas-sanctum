/**
 * Atlas Sanctum — Development Lifecycle Route
 * Systems-thinking pipeline for every feature, PR, and refactor.
 *
 * Mounts under: /api/v3/sanctum/lifecycle
 *
 * Endpoints:
 *   GET  /task-types                  — Available lifecycle pipeline stages
 *   POST /discover                    — Run Discovery Agent (SSM + stakeholder analysis)
 *   POST /architect                   — Run Discovery → Architecture agents
 *   POST /implement                   — Run full Discovery → Architecture → Implementation pipeline
 *   POST /review                      — Run PR Systems Review agent
 *   POST /learn                       — Run Lifecycle Learning agent
 *   POST /run                         — Run any lifecycle task_type directly
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';
import { agentServiceClient } from '../services/agentServiceClient';
import { auditLayer } from './planes/ai-orchestration';

const router = Router();
router.use(authenticate);

const handle = (fn: (req: Request, res: Response) => Promise<unknown>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res);
      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('[Lifecycle Route]', { error, path: req.path });
      next(error);
    }
  };

// ─── Shared lifecycle runner ──────────────────────────────────────────────────

async function runLifecycle(
  taskType: string,
  payload: Record<string, unknown>,
  userId: string,
  covenantId?: string,
): Promise<unknown> {
  const auditEntry = auditLayer.record({
    eventType: 'agent_action',
    userId,
    domain: 'dev_lifecycle',
    action: `lifecycle:${taskType}`,
    payload: { task_type: taskType, feature: payload['feature'] ?? taskType },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: ['lifecycle', taskType],
  });

  const result = await agentServiceClient.runLifecycle({
    task_type: taskType,
    payload,
    covenant_id: covenantId ?? null,
    requested_by: userId,
  });

  auditLayer.record({
    eventType: 'agent_action',
    userId,
    domain: 'dev_lifecycle',
    action: `lifecycle_complete:${taskType}`,
    payload: {
      permitted:    result.data?.permitted,
      ethics_score: result.data?.ethics_score,
    },
    outcome: result.data?.permitted ? 'success' : 'blocked',
    ethicsScore: result.data?.ethics_score as number,
    timestamp: Date.now() as any,
    tags: ['lifecycle', taskType],
  });

  return { ...result.data, audit_entry_id: auditEntry.entryId };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get('/task-types', handle(async (_req) => {
  return agentServiceClient.lifecycleTaskTypes();
}));

/**
 * POST /discover
 * Runs the Discovery Agent: SSM analysis, stakeholder mapping,
 * rich picture, CATWOE, and system map.
 *
 * Body: { feature, context, explanation, restoration_path }
 */
router.post('/discover', handle(async (req) => {
  const user = (req as any).user;
  const { feature, context, explanation, restoration_path, covenant_id } = req.body;
  if (!feature) throw new Error('feature is required');

  return runLifecycle(
    'feature_discovery',
    { feature, context, explanation, restoration_path },
    user.id,
    covenant_id,
  );
}));

/**
 * POST /architect
 * Runs Discovery → Architecture agents.
 * Produces Atlas component mapping, domain model, event architecture, AI capabilities.
 *
 * Body: { feature, context, explanation, restoration_path }
 */
router.post('/architect', handle(async (req) => {
  const user = (req as any).user;
  const { feature, context, explanation, restoration_path, covenant_id } = req.body;
  if (!feature) throw new Error('feature is required');

  return runLifecycle(
    'architecture_design',
    { feature, context, explanation, restoration_path },
    user.id,
    covenant_id,
  );
}));

/**
 * POST /implement
 * Runs the full pipeline: Discovery → Architecture → Implementation.
 * Produces folder structure, API contracts, DB schema, domain events,
 * test cases, and observability hooks.
 *
 * Body: { feature, context, explanation, restoration_path }
 */
router.post('/implement', handle(async (req) => {
  const user = (req as any).user;
  const { feature, context, explanation, restoration_path, covenant_id } = req.body;
  if (!feature) throw new Error('feature is required');

  return runLifecycle(
    'implementation_guidance',
    { feature, context, explanation, restoration_path },
    user.id,
    covenant_id,
  );
}));

/**
 * POST /review
 * Runs the PR Systems Review agent.
 * Produces a Systems Impact Report before a Code Review Report.
 *
 * Body: { pr_title, pr_description, changed_files, diff_summary, explanation }
 */
router.post('/review', handle(async (req) => {
  const user = (req as any).user;
  const { pr_title, pr_description, changed_files, diff_summary, explanation, covenant_id } = req.body;
  if (!pr_title) throw new Error('pr_title is required');

  return runLifecycle(
    'pr_systems_review',
    { pr_title, pr_description, changed_files, diff_summary, explanation },
    user.id,
    covenant_id,
  );
}));

/**
 * POST /learn
 * Runs the Lifecycle Learning agent.
 * Closes the feedback loop: telemetry → stakeholder outcomes → pipeline improvements.
 *
 * Body: { features, telemetry, user_feedback, outcome_data }
 */
router.post('/learn', handle(async (req) => {
  const user = (req as any).user;
  const { features, telemetry, user_feedback, outcome_data, explanation, covenant_id } = req.body;

  return runLifecycle(
    'lifecycle_learning',
    { features, telemetry, user_feedback, outcome_data, explanation },
    user.id,
    covenant_id,
  );
}));

/**
 * POST /run
 * Generic lifecycle runner — use any task_type directly.
 *
 * Body: { task_type, payload, covenant_id }
 */
router.post('/run', handle(async (req) => {
  const user = (req as any).user;
  const { task_type, payload, covenant_id } = req.body;
  if (!task_type) throw new Error('task_type is required');
  if (!payload || typeof payload !== 'object') throw new Error('payload must be an object');

  return runLifecycle(task_type, payload, user.id, covenant_id);
}));

export default router;
