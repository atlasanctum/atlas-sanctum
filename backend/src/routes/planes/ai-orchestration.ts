/**
 * Atlas Sanctum — AI Orchestration Route
 * Exposes the full 13-layer AI system via REST.
 *
 * Mounts under: /api/v3/sanctum/ai
 *
 * Endpoints:
 *   GET  /status              — Full system status across all layers
 *   POST /process             — Primary civilizational intelligence request
 *   POST /sentinel/observe    — Ingest observation(s) into Sentinel
 *   GET  /sentinel/report     — Situational awareness report
 *   POST /sentinel/escalate/:alertId — Escalate alert to humans
 *   POST /learn               — Submit outcome for continuous learning
 *   GET  /learn/health        — Learning system health
 *   POST /explain             — Generate explanation for a recommendation
 *   POST /approve/:gateId     — Human approves/rejects a gate
 *   GET  /approvals/pending   — List pending approval gates
 *   GET  /audit/report        — System audit report
 *   POST /audit/compliance    — Generate compliance report
 *   GET  /audit/integrity     — Verify audit chain integrity
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth';
import { logger } from '../../utils/logger';
import { getSanctumCOS } from '../../sanctum/orchestrator';
import { promptInjectionFilter } from '../../middleware/promptInjection';
import { agentServiceClient } from '../../services/agentServiceClient';

// Lazy-loaded AI layer singletons (frontend TypeScript modules compiled to JS)
// In production these run as separate microservices; here they share process memory.
import { SentinelAgent } from '../../../src/sanctum-ai/agents/SentinelAgent';
import { ContinuousLearningLayer } from '../../../src/sanctum-ai/layers/Layer11_ContinuousLearning';
import { HumanCollaborationLayer } from '../../../src/sanctum-ai/layers/Layer12_HumanCollaboration';
import { GovernanceAuditLayer } from '../../../src/sanctum-ai/layers/Layer13_GovernanceAudit';

// ─── Singletons ───────────────────────────────────────────────────────────────

const sentinel = new SentinelAgent();
const learning = new ContinuousLearningLayer();
const humanCollab = new HumanCollaborationLayer();
const auditLayer = new GovernanceAuditLayer();

// Wire Sentinel alerts → Audit ledger
sentinel.alerts.onAlert(alert => {
  auditLayer.record({
    eventType: 'sentinel_alert',
    domain: alert.source,
    action: `anomaly_detected:${alert.metric}`,
    payload: { alertId: alert.alertId, severity: alert.severity, deviationSigma: alert.deviationSigma },
    outcome: alert.severity === 'emergency' ? 'pending' : 'success',
    confidence: alert.confidence,
    timestamp: alert.timestamp,
    tags: [alert.severity, alert.source, alert.metric],
  });
});

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();
router.use(authenticate);
// Scan all AI endpoint inputs for prompt injection before they reach any LLM
router.use(promptInjectionFilter);

const handle = (fn: (req: Request, res: Response) => Promise<unknown>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res);
      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('[AI Route]', { error, path: req.path });
      next(error);
    }
  };

// ─── System Status ────────────────────────────────────────────────────────────

router.get('/status', handle(async (req) => {
  const cos = await getSanctumCOS();
  const sentinelReport = sentinel.situationalReport();
  const learningHealth = learning.healthReport();
  const operatorDashboard = humanCollab.operatorDashboard();
  const auditReport = auditLayer.systemAuditReport(1); // last 1 hour

  return {
    timestamp: Date.now(),
    layers: {
      1: { name: 'Foundational Reasoning', status: 'operational' },
      2: { name: 'Predictive Intelligence', status: 'operational' },
      3: { name: 'Optimization', status: 'operational' },
      4: { name: 'Learning', status: 'operational' },
      5: { name: 'Neural Perception', status: 'operational' },
      6: { name: 'Language & Cultural', status: 'operational' },
      7: { name: 'Multi-Agent Civilization', status: 'operational', agentsOnline: 12 },
      8: { name: 'Memory & Knowledge Fabric', status: 'operational' },
      9: { name: 'Trust & Verification', status: 'operational' },
      10: { name: 'Planetary Interface', status: 'operational' },
      11: { name: 'Continuous Learning', status: 'operational', ...learningHealth },
      12: { name: 'Human Collaboration', status: 'operational', ...operatorDashboard },
      13: { name: 'Governance & Audit', status: 'operational', ledgerSize: auditLayer.ledger.size() },
    },
    sentinel: {
      systemHealthScore: sentinelReport.systemHealthScore,
      activeAlerts: sentinelReport.activeAlerts,
      emergencies: sentinelReport.emergencies.length,
      observationsProcessed: sentinelReport.observationsProcessed,
    },
    audit: {
      chainIntegrity: auditReport.chainIntegrity.integrityValid,
      ethicsBlockRate: auditReport.ethicsBlockRate,
      complianceStatus: auditReport.complianceStatus,
    },
    humanCollaboration: operatorDashboard,
  };
}));

// ─── Primary AI Processing ────────────────────────────────────────────────────

router.post('/process', handle(async (req) => {
  const user = (req as any).user;
  const { type, location, context, involvedRoles, language } = req.body;

  if (!type) throw new Error('type is required');

  // Record to audit ledger
  const auditEntry = auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: type,
    action: `civilizational_request:${type}`,
    payload: { type, location, involvedRoles, language },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: [type, ...(involvedRoles ?? [])],
  });

  // Route to COS intelligence plane for LLM-backed reasoning
  const cos = await getSanctumCOS();
  const reasoning = await cos.intelligence.reason({
    question: `Analyze and respond to a ${type} request`,
    context: JSON.stringify(context),
    reasoningDepth: 'deep',
  });

  // Ethics evaluation
  const ethics = await cos.intelligence.evaluateEthics(
    JSON.stringify({ type, context }),
    { plane: 'intelligence', action: type, userId: user.id, stakes: 'high' }
  );

  // Update audit entry outcome
  auditLayer.record({
    eventType: 'ethics_evaluation',
    userId: user.id,
    domain: type,
    action: 'ethics_check',
    payload: { passed: ethics.passed, score: ethics.score, violations: ethics.violations },
    outcome: ethics.passed ? 'success' : 'blocked',
    ethicsScore: ethics.score,
    timestamp: Date.now() as any,
    tags: ['ethics', type],
  });

  if (!ethics.passed && process.env.ETHICS_HARD_BLOCK_ON_VIOLATION === 'true') {
    return {
      blocked: true,
      reason: 'Ethics evaluation failed',
      violations: ethics.violations,
      auditEntryId: auditEntry.entryId,
    };
  }

  return {
    requestId: auditEntry.entryId,
    type,
    reasoning,
    ethics,
    timestamp: Date.now(),
  };
}));

// ─── Sentinel ─────────────────────────────────────────────────────────────────

router.post('/sentinel/observe', handle(async (req) => {
  const observations = Array.isArray(req.body) ? req.body : [req.body];
  const alerts = sentinel.observeBatch(observations.map((o: any) => ({
    ...o,
    observationId: o.observationId ?? `obs-${Date.now()}`,
    timestamp: o.timestamp ?? Date.now(),
    confidence: o.confidence ?? 0.8,
  })));

  return {
    observationsIngested: observations.length,
    alertsGenerated: alerts.length,
    alerts,
  };
}));

router.get('/sentinel/report', handle(async (_req) => {
  return sentinel.situationalReport();
}));

router.post('/sentinel/escalate/:alertId', handle(async (req) => {
  const result = sentinel.escalate(req.params['alertId'] as string);
  if (!result.ok) throw new Error(result.error.message);

  auditLayer.record({
    eventType: 'sentinel_alert',
    userId: (req as any).user.id,
    domain: 'sentinel',
    action: `escalate:${req.params['alertId']}`,
    payload: { escalated: true, channel: result.value.channel },
    outcome: 'success',
    timestamp: Date.now() as any,
    tags: ['escalation', 'human_review'],
  });

  return result.value;
}));

// ─── Continuous Learning ──────────────────────────────────────────────────────

router.post('/learn', handle(async (req) => {
  const { domain, agentId, outcome, feedbackSignal } = req.body;

  if (outcome) {
    learning.outcomes.record({
      outcomeId: `outcome-${Date.now()}`,
      recommendationId: outcome.recommendationId,
      agentId: agentId ?? 'unknown',
      domain,
      predictedValue: outcome.predictedValue,
      actualValue: outcome.actualValue,
      metric: outcome.metric,
      unit: outcome.unit ?? '',
      measuredAt: Date.now() as any,
      lagDays: outcome.lagDays ?? 0,
      context: outcome.context ?? {},
    });
  }

  if (feedbackSignal) {
    learning.feedback.ingest({
      signalId: `signal-${Date.now()}`,
      source: feedbackSignal.source ?? 'user_rating',
      agentId: agentId ?? 'unknown',
      domain,
      score: feedbackSignal.score,
      weight: feedbackSignal.weight ?? 1,
      rationale: feedbackSignal.rationale ?? '',
      timestamp: Date.now() as any,
      humanProvided: feedbackSignal.humanProvided ?? true,
    });
  }

  auditLayer.record({
    eventType: 'learning_update',
    userId: (req as any).user.id,
    domain,
    action: 'feedback_ingested',
    payload: { hasOutcome: !!outcome, hasFeedback: !!feedbackSignal },
    outcome: 'success',
    timestamp: Date.now() as any,
    tags: ['learning', domain],
  });

  return learning.learn(domain, agentId ?? 'unknown');
}));

router.get('/learn/health', handle(async (_req) => {
  return learning.healthReport();
}));

// ─── Human Collaboration ──────────────────────────────────────────────────────

router.post('/explain', handle(async (req) => {
  const { recommendationId, agentId, domain, action, stakes, summary, reasoning, evidence, confidence, alternatives } = req.body;

  const result = humanCollab.prepareForHuman({
    recommendationId: recommendationId ?? `rec-${Date.now()}`,
    agentId: agentId ?? 'unknown',
    domain: domain ?? 'general',
    action: action ?? 'recommendation',
    stakes: stakes ?? 'medium',
    summary,
    reasoning: reasoning ?? [],
    evidence: evidence ?? [],
    confidence: confidence ?? 0.7,
    alternatives,
    requiredApprovers: req.body.requiredApprovers ?? [],
  });

  if (result.gate) {
    auditLayer.record({
      eventType: 'approval_gate',
      userId: (req as any).user.id,
      domain,
      action: `gate_created:${result.gate.gateId}`,
      payload: { gateId: result.gate.gateId, stakes, confidence },
      outcome: 'pending',
      confidence,
      timestamp: Date.now() as any,
      tags: ['approval', stakes, domain],
    });
  }

  return result;
}));

router.post('/approve/:gateId', handle(async (req) => {
  const user = (req as any).user;
  const { decision, rationale } = req.body;

  if (!decision || !['approve', 'reject'].includes(decision)) {
    throw new Error('decision must be "approve" or "reject"');
  }

  const result = humanCollab.approvalGates.decide(
    req.params['gateId'] as string,
    user.id,
    decision,
    rationale ?? '',
  );

  if (!result.ok) throw new Error(result.error.message);

  auditLayer.record({
    eventType: 'human_override',
    userId: user.id,
    domain: result.value.domain,
    action: `approval_${decision}:${req.params['gateId']}`,
    payload: { decision, rationale, gateId: req.params['gateId'] },
    outcome: decision === 'approve' ? 'success' : 'blocked',
    timestamp: Date.now() as any,
    tags: ['human_decision', decision, result.value.stakes],
  });

  return result.value;
}));

router.get('/approvals/pending', handle(async (_req) => {
  return {
    gates: humanCollab.approvalGates.getPending(),
    dashboard: humanCollab.operatorDashboard(),
  };
}));

// ─── Governance & Audit ───────────────────────────────────────────────────────

router.get('/audit/report', handle(async (req) => {
  const windowHours = req.query.hours ? parseInt(req.query.hours as string) : 24;
  return auditLayer.systemAuditReport(windowHours);
}));

router.post('/audit/compliance', handle(async (req) => {
  const { standard, fromMs, toMs } = req.body;
  const validStandards = ['GDPR', 'indigenous_sovereignty', 'ecological_standards', 'AI_governance'];
  if (!validStandards.includes(standard)) throw new Error(`standard must be one of: ${validStandards.join(', ')}`);

  return auditLayer.compliance.generate(
    standard,
    fromMs ?? Date.now() - 30 * 86_400_000,
    toMs ?? Date.now(),
  );
}));

router.get('/audit/integrity', handle(async (_req) => {
  return auditLayer.ledger.verifyIntegrity();
}));

router.get('/audit/entries', handle(async (req) => {
  const filter = {
    eventType: req.query.eventType as any,
    domain: req.query.domain as string,
    outcome: req.query.outcome as any,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
  };
  return auditLayer.ledger.query(filter);
}));

// ─── LangGraph Agent ──────────────────────────────────────────────────────────
// POST /api/v3/sanctum/ai/agent
// Proxies to the Python LangGraph microservice (services/ai/langgraph/server.py)

router.get('/agent/task-types', handle(async (_req) => {
  return agentServiceClient.taskTypes();
}));

router.post('/agent/run', handle(async (req) => {
  const user = (req as any).user;
  const { task_type, payload, covenant_id } = req.body;

  if (!task_type) throw new Error('task_type is required');
  if (!payload || typeof payload !== 'object') throw new Error('payload must be an object');

  const auditEntry = auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: task_type,
    action: `langgraph_run:${task_type}`,
    payload: { task_type, covenant_id },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: ['langgraph', task_type],
  });

  const result = await agentServiceClient.run({
    task_type,
    payload,
    covenant_id: covenant_id ?? null,
    requested_by: user.id,
  });

  auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: task_type,
    action: `langgraph_complete:${task_type}`,
    payload: { permitted: result.data?.permitted, ethics_score: result.data?.ethics_score },
    outcome: result.data?.permitted ? 'success' : 'blocked',
    ethicsScore: result.data?.ethics_score as number,
    timestamp: Date.now() as any,
    tags: ['langgraph', task_type],
  });

  return { ...result.data, audit_entry_id: auditEntry.entryId };
}));

export default router;
export { sentinel, learning, humanCollab, auditLayer };
