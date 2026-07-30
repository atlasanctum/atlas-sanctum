/**
 * Atlas Sanctum — COS Planes API Router
 * Mounts all five plane endpoints under /api/v3/sanctum/
 *
 * Routes:
 *   POST /intelligence/chat
 *   POST /intelligence/embed
 *   POST /intelligence/search
 *   POST /intelligence/reason
 *   POST /intelligence/plan
 *   POST /intelligence/agent/:agentId/run
 *
 *   POST /trust/did
 *   GET  /trust/did/:did
 *   POST /trust/credentials
 *   POST /trust/credentials/verify
 *   POST /trust/anchor
 *   POST /trust/zero-trust/check
 *
 *   POST /coordination/proposals
 *   POST /coordination/proposals/:id/vote
 *   GET  /coordination/proposals/:id/tally
 *   POST /coordination/proposals/:id/execute
 *   POST /coordination/workflows
 *   GET  /coordination/workflows/:instanceId
 *   POST /coordination/notifications
 *   POST /coordination/approvals
 *
 *   POST /planetary/measurements
 *   GET  /planetary/measurements
 *   POST /planetary/ndvi
 *   POST /planetary/carbon-flux
 *   POST /planetary/anomaly
 *   POST /planetary/climate/simulate
 *   GET  /planetary/twin/:entityId
 */

import { Router, Request, Response, NextFunction } from 'express';
import { getSanctumCOS } from '../../sanctum/orchestrator';
import { authenticate } from '../../middleware/auth';
import { logger } from '../../utils/logger';

const router = Router();

// All COS routes require auth
router.use(authenticate);

// ─── Helper ───────────────────────────────────────────────────────────────────

const handle = (fn: (req: Request, res: Response) => Promise<unknown>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res);
      res.json({ success: true, data: result });
    } catch (err) {
      logger.error('[COS Router]', { err, path: req.path });
      next(err);
    }
  };

// ═══════════════════════════════════════════════════════════
// INTELLIGENCE PLANE
// ═══════════════════════════════════════════════════════════

router.post('/intelligence/chat', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.intelligence.chat({ ...req.body, userId: (req as any).user?.id });
}));

router.post('/intelligence/embed', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { texts } = req.body;
  if (!Array.isArray(texts) || texts.length === 0) throw new Error('texts must be a non-empty array');
  return cos.intelligence.embed(texts);
}));

router.post('/intelligence/search', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { query, options } = req.body;
  if (!query) throw new Error('query is required');
  return cos.intelligence.semanticSearch(query, options);
}));

router.post('/intelligence/reason', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.intelligence.reason(req.body);
}));

router.post('/intelligence/plan', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { goal, context } = req.body;
  if (!goal) throw new Error('goal is required');
  return cos.intelligence.plan(goal, context ?? { availableTools: [], constraints: [] });
}));

router.post('/intelligence/memory', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  await cos.intelligence.remember({ ...req.body, userId: user.id });
  return { stored: true };
}));

router.post('/intelligence/agent/:agentId/run', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { randomUUID } = await import('crypto');
  const task = { id: randomUUID(), ...req.body };
  return cos.intelligence.runAgent(req.params['agentId'] as string, task);
}));

router.post('/intelligence/ethics/evaluate', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { content, context } = req.body;
  return cos.intelligence.evaluateEthics(content, context);
}));

// ═══════════════════════════════════════════════════════════
// TRUST PLANE
// ═══════════════════════════════════════════════════════════

router.post('/trust/did', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.trust.createDID({ ...req.body, tenantId: user.tenantId ?? req.body.tenantId });
}));

router.get('/trust/did/:did', handle(async (req) => {
  const cos = await getSanctumCOS();
  const did = decodeURIComponent(req.params['did'] as string);
  return cos.trust.resolveDID(did as string);
}));

router.post('/trust/credentials', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.trust.issueCredential(req.body);
}));

router.post('/trust/credentials/verify', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.trust.verifyCredential(req.body);
}));

router.post('/trust/anchor', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.trust.anchorOnChain(req.body);
}));

router.get('/trust/anchor/:txHash/verify', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.trust.verifyOnChain(req.body);
}));

router.post('/trust/zero-trust/check', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.trust.checkZeroTrust({
    userId: user.id,
    ipAddress: req.ip || '',
    userAgent: req.get('User-Agent') || '',
    requestedResource: req.body.resource || req.path,
    authMethod: req.body.authMethod || 'jwt',
    mfaVerified: user.mfaVerified ?? false,
    ...req.body,
  });
}));

// ═══════════════════════════════════════════════════════════
// COORDINATION PLANE
// ═══════════════════════════════════════════════════════════

router.post('/coordination/proposals', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.coordination.createProposal({
    ...req.body,
    proposerId: user.id,
    tenantId: user.tenantId ?? req.body.tenantId,
  });
}));

router.post('/coordination/proposals/:id/vote', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.coordination.castVote({ ...req.body, proposalId: req.params['id'] as string, voterId: user.id });
}));

router.get('/coordination/proposals/:id/tally', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.coordination.tallyVotes(req.params['id'] as string);
}));

router.post('/coordination/proposals/:id/execute', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.coordination.executeProposal(req.params['id'] as string);
}));

router.post('/coordination/workflows', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.coordination.startWorkflow({ ...req.body, tenantId: user.tenantId });
}));

router.get('/coordination/workflows/:instanceId', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.coordination.getWorkflowStatus(req.params['instanceId'] as string);
}));

router.post('/coordination/notifications', handle(async (req) => {
  const cos = await getSanctumCOS();
  await cos.coordination.sendNotification(req.body);
  return { sent: true };
}));

router.post('/coordination/approvals', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.coordination.requestApproval({
    ...req.body,
    requestedBy: user.id,
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
  });
}));

// ═══════════════════════════════════════════════════════════
// PLANETARY PLANE
// ═══════════════════════════════════════════════════════════

router.post('/planetary/measurements', handle(async (req) => {
  const cos = await getSanctumCOS();
  await cos.planetary.ingestMeasurement(req.body);
  return { ingested: true };
}));

router.get('/planetary/measurements', handle(async (req) => {
  const cos = await getSanctumCOS();
  const filter = {
    projectId: req.query.projectId as string,
    type: req.query.type as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
  };
  return cos.planetary.queryMeasurements(filter);
}));

router.post('/planetary/ndvi', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { region, date } = req.body;
  return cos.planetary.computeNDVI(region, new Date(date));
}));

router.post('/planetary/carbon-flux', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { region, from, to } = req.body;
  return cos.planetary.getCarbonFlux(region, { from: new Date(from), to: new Date(to) });
}));

router.post('/planetary/biodiversity', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.planetary.getBiodiversityIndex(req.body.region);
}));

router.post('/planetary/anomaly', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.planetary.detectAnomaly(req.body);
}));

router.post('/planetary/climate/simulate', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.planetary.simulateClimate(req.body);
}));

router.get('/planetary/twin/:entityId', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.planetary.getDigitalTwinState(req.params['entityId'] as string);
}));

router.patch('/planetary/twin/:entityId', handle(async (req) => {
  const cos = await getSanctumCOS();
  await cos.planetary.updateDigitalTwin(req.params['entityId'] as string, req.body);
  return { updated: true };
}));

// ═══════════════════════════════════════════════════════════
// VALUE PLANE
// ═══════════════════════════════════════════════════════════

router.get('/value/market', handle(async (_req) => {
  const cos = await getSanctumCOS();
  return cos.value.getMarketStats();
}));

router.post('/value/listings', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.value.createListing({ ...req.body, sellerId: user.id, tenantId: user.tenantId });
}));

router.post('/value/trade', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.value.executeTrade({ ...req.body, buyerId: user.id });
}));

router.post('/value/credits/mint', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.value.mintCredits(req.body);
}));

router.post('/value/credits/retire', handle(async (req) => {
  const cos = await getSanctumCOS();
  const { creditIds } = req.body;
  if (!Array.isArray(creditIds) || creditIds.length === 0) throw new Error('creditIds must be a non-empty array');
  return cos.value.retireCredits(creditIds);
}));

router.get('/value/treasury/:tenantId', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.value.getTreasuryBalance(req.params['tenantId'] as string);
}));

router.post('/value/treasury/:tenantId/rebalance', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.value.rebalanceTreasury(req.params['tenantId'] as string);
}));

router.get('/value/bonds/:bondId/yield', handle(async (req) => {
  const cos = await getSanctumCOS();
  return cos.value.getBondYield(req.params['bondId'] as string);
}));

router.post('/value/payments', handle(async (req) => {
  const cos = await getSanctumCOS();
  const user = (req as any).user;
  return cos.value.processPayment({ ...req.body, userId: user.id });
}));

export default router;
