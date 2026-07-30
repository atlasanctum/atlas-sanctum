/**
 * Atlas Sanctum — Multi-Agent Orchestrator
 * Coordinates autonomous agents for: fragility analysis, impact verification,
 * payment routing, IoT anomaly response, DAO governance, scenario simulation.
 * Enforces: AEGIS ethical gate, human-in-the-loop escalation, self-healing,
 *           task planning, tool routing, memory federation.
 */

import { EventBus, EVENTS } from '../services/eventBus';
import { AIConnector } from '../connectors/AIConnector';
import { ObservabilityConnector } from '../connectors/ObservabilityConnector';

export type AgentRole =
  | 'fragility-analyst'
  | 'impact-verifier'
  | 'payment-router'
  | 'iot-monitor'
  | 'governance-advisor'
  | 'scenario-planner'
  | 'security-sentinel';

export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'awaiting-human';

export interface AgentTask {
  id: string;
  role: AgentRole;
  instruction: string;
  context: Record<string, unknown>;
  priority: 1 | 2 | 3;  // 1 = highest
  requiresHumanApproval?: boolean;
  timeoutMs?: number;
  createdAt: string;
}

export interface AgentTaskResult {
  taskId: string;
  role: AgentRole;
  status: TaskStatus;
  output?: Record<string, unknown>;
  reasoning?: string;
  humanReviewRequired?: boolean;
  humanReviewReason?: string;
  completedAt?: string;
  durationMs?: number;
}

export interface HumanOverrideRequest {
  taskId: string;
  role: AgentRole;
  reason: string;
  proposedAction: string;
  context: Record<string, unknown>;
  requestedAt: string;
  expiresAt: string;  // auto-escalate if no response
}

// ── Agent definitions ────────────────────────────────────────────────────────

const AGENT_SYSTEM_PROMPTS: Record<AgentRole, string> = {
  'fragility-analyst': `You are the Atlas Sanctum Fragility Analyst. Analyze regional fragility scores, 
    identify top drivers, and recommend targeted interventions. Always cite data sources. 
    Flag any analysis with confidence < 0.6 for human review.`,

  'impact-verifier': `You are the Atlas Sanctum Impact Verifier. Validate evidence submissions for 
    restoration projects. Cross-reference satellite data, field reports, and sensor readings. 
    Reject any evidence with inconsistencies and explain why.`,

  'payment-router': `You are the Atlas Sanctum Payment Router. Select the optimal payment provider 
    based on recipient location, currency, fees, and reliability. Prefer M-Pesa for Kenya, 
    Flutterwave for West Africa, Stripe for global. Always verify fraud signals first.`,

  'iot-monitor': `You are the Atlas Sanctum IoT Monitor. Analyze sensor telemetry for anomalies. 
    Trigger alerts for environmental threshold breaches. Recommend device maintenance when 
    battery < 15% or signal < -90dBm.`,

  'governance-advisor': `You are the Atlas Sanctum Governance Advisor. Evaluate DAO proposals against 
    the Atlas Covenant principles. Flag proposals that may harm indigenous communities or 
    violate ecological boundaries. Always require supermajority for irreversible actions.`,

  'scenario-planner': `You are the Atlas Sanctum Scenario Planner. Model intervention outcomes using 
    fragility indicators. Provide 3 scenarios: conservative, moderate, ambitious. 
    Include confidence intervals and risk factors.`,

  'security-sentinel': `You are the Atlas Sanctum Security Sentinel. Monitor for anomalous API patterns, 
    authentication failures, and data exfiltration signals. Escalate to human immediately 
    for any critical security event. Never auto-remediate without human approval.`,
};

// ── Orchestrator ─────────────────────────────────────────────────────────────

export class AgentOrchestrator {
  private taskQueue: AgentTask[] = [];
  private runningTasks = new Map<string, AgentTask>();
  private humanOverrideQueue: HumanOverrideRequest[] = [];
  private eventBus: EventBus;
  private aiConnector: AIConnector;
  private obs?: ObservabilityConnector;

  constructor(aiConnector: AIConnector, eventBus: EventBus, obs?: ObservabilityConnector) {
    this.aiConnector = aiConnector;
    this.eventBus = eventBus;
    this.obs = obs;
    this.startProcessingLoop();
  }

  /** Submit a task to the agent queue */
  async submit(task: Omit<AgentTask, 'id' | 'createdAt'>): Promise<string> {
    const fullTask: AgentTask = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.taskQueue.push(fullTask);
    this.taskQueue.sort((a, b) => a.priority - b.priority);

    await this.eventBus.publish(
      EVENTS.AGENT_TASK_ASSIGNED,
      fullTask.id,
      'agent-task',
      { taskId: fullTask.id, role: fullTask.role }
    );

    this.obs?.recordMetric({ name: 'agent.queue.depth', value: this.taskQueue.length });
    return fullTask.id;
  }

  /** Human operator approves or rejects a pending override request */
  async resolveHumanOverride(
    taskId: string,
    decision: 'approve' | 'reject',
    actorId: string,
    notes?: string
  ): Promise<void> {
    const idx = this.humanOverrideQueue.findIndex(r => r.taskId === taskId);
    if (idx === -1) throw new Error(`No pending override for task: ${taskId}`);

    const request = this.humanOverrideQueue.splice(idx, 1)[0];

    await this.eventBus.publish(
      decision === 'approve' ? EVENTS.AGENT_TASK_COMPLETED : EVENTS.HUMAN_REVIEW_REQUIRED,
      taskId,
      'agent-task',
      { taskId, decision, actorId, notes, role: request.role }
    );

    this.obs?.sendLog({
      level: 'info',
      message: `Human override ${decision} for task ${taskId} by ${actorId}`,
      service: 'agent-orchestrator',
      tags: { role: request.role, decision },
    });
  }

  get pendingHumanOverrides(): HumanOverrideRequest[] {
    return [...this.humanOverrideQueue];
  }

  get queueDepth(): number { return this.taskQueue.length; }
  get runningCount(): number { return this.runningTasks.size; }

  // ── Processing loop ────────────────────────────────────────────────────────

  private startProcessingLoop(): void {
    const MAX_CONCURRENT = parseInt(process.env.AGENT_MAX_CONCURRENT ?? '3');

    setInterval(async () => {
      while (this.taskQueue.length > 0 && this.runningTasks.size < MAX_CONCURRENT) {
        const task = this.taskQueue.shift()!;
        this.runningTasks.set(task.id, task);
        this.executeTask(task).finally(() => this.runningTasks.delete(task.id));
      }
    }, 500);
  }

  private async executeTask(task: AgentTask): Promise<AgentTaskResult> {
    const start = Date.now();

    try {
      // Human approval gate — pause before execution
      if (task.requiresHumanApproval) {
        return await this.requestHumanApproval(task);
      }

      const response = await this.aiConnector.complete({
        messages: [
          { role: 'system', content: AGENT_SYSTEM_PROMPTS[task.role] },
          { role: 'user', content: `${task.instruction}\n\nContext: ${JSON.stringify(task.context, null, 2)}` },
        ],
        maxTokens: 1024,
        temperature: 0.3,
      }, {
        actorId: `agent:${task.role}`,
        traceId: task.id,
        timeoutMs: task.timeoutMs ?? 30_000,
      });

      const result: AgentTaskResult = {
        taskId: task.id,
        role: task.role,
        status: response.requiresHumanReview ? 'awaiting-human' : 'completed',
        output: { response: response.content },
        reasoning: response.content,
        humanReviewRequired: response.requiresHumanReview,
        humanReviewReason: response.requiresHumanReview ? 'AEGIS ethical threshold exceeded' : undefined,
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - start,
      };

      if (response.requiresHumanReview) {
        await this.requestHumanApproval(task, response.content);
      }

      await this.eventBus.publish(EVENTS.AGENT_TASK_COMPLETED, task.id, 'agent-task', result);
      this.obs?.recordMetric({ name: 'agent.task.duration_ms', value: result.durationMs!, tags: { role: task.role } });

      return result;
    } catch (err) {
      const result: AgentTaskResult = {
        taskId: task.id,
        role: task.role,
        status: 'failed',
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - start,
      };

      this.obs?.sendLog({
        level: 'error',
        message: `Agent task failed: ${task.id} (${task.role}): ${String(err)}`,
        service: 'agent-orchestrator',
        tags: { role: task.role },
      });

      return result;
    }
  }

  private async requestHumanApproval(task: AgentTask, proposedAction?: string): Promise<AgentTaskResult> {
    const override: HumanOverrideRequest = {
      taskId: task.id,
      role: task.role,
      reason: 'Task requires human approval before execution',
      proposedAction: proposedAction ?? task.instruction,
      context: task.context,
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    this.humanOverrideQueue.push(override);

    await this.eventBus.publish(EVENTS.HUMAN_REVIEW_REQUIRED, task.id, 'agent-task', override);

    return {
      taskId: task.id,
      role: task.role,
      status: 'awaiting-human',
      humanReviewRequired: true,
      humanReviewReason: override.reason,
    };
  }
}
