/**
 * Atlas Sanctum — Engineering Copilot Route
 * RAG-backed Principal Systems Architect workflow.
 *
 * Mounts under: /api/v3/sanctum/copilot
 *
 * Endpoints:
 *   GET  /context      — Inspect what project artifacts are loaded into context
 *   POST /architect    — Full 10-step systems architect pipeline
 *   POST /review       — Review a module as a living system
 *   POST /pr           — PR systems impact + code review
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
      logger.error('[Copilot Route]', { error, path: req.path });
      next(error);
    }
  };

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /context
 * Returns a summary of which project artifacts are loaded into the copilot
 * context (ADRs, schema, API spec, SDK types, etc.).
 * Useful for debugging context coverage before running architect/review.
 */
router.get('/context', handle(async (_req) => {
  return agentServiceClient.copilotContext();
}));

/**
 * POST /architect
 * Full 10-step Principal Systems Architect pipeline.
 * Grounds the LLM in actual ADRs, coding standards, domain glossary,
 * API surface, database schema, and SDK types before generating anything.
 *
 * Body: { request: string }
 * Example: { "request": "Build a carbon credit verification dashboard" }
 */
router.post('/architect', handle(async (req) => {
  const user = (req as any).user;
  const { request } = req.body;
  if (!request || typeof request !== 'string') throw new Error('request is required');

  auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: 'copilot',
    action: 'copilot:architect',
    payload: { request: request.slice(0, 200) },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: ['copilot', 'architect'],
  });

  return agentServiceClient.copilotArchitect({ request });
}));

/**
 * POST /review
 * Review an existing module as a living system.
 * Evaluates against ADRs, bounded context rules, and regenerative alignment.
 * Produces architectural recommendations before code suggestions.
 *
 * Body: { module_path: string, code: string }
 */
router.post('/review', handle(async (req) => {
  const user = (req as any).user;
  const { module_path, code } = req.body;
  if (!module_path) throw new Error('module_path is required');
  if (!code) throw new Error('code is required');

  auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: 'copilot',
    action: 'copilot:review',
    payload: { module_path },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: ['copilot', 'review'],
  });

  return agentServiceClient.copilotReview({ module_path, code });
}));

/**
 * POST /pr
 * PR systems impact + code review.
 * Produces Systems Impact Report before Code Review Report.
 * Checks all quality gates from packages/config/index.ts.
 *
 * Body: { pr_title, pr_description?, changed_files?, diff_summary? }
 */
router.post('/pr', handle(async (req) => {
  const user = (req as any).user;
  const { pr_title, pr_description, changed_files, diff_summary } = req.body;
  if (!pr_title) throw new Error('pr_title is required');

  auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: 'copilot',
    action: 'copilot:pr_review',
    payload: { pr_title, changed_files },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: ['copilot', 'pr_review'],
  });

  return agentServiceClient.copilotPR({ pr_title, pr_description, changed_files, diff_summary });
}));

export default router;
