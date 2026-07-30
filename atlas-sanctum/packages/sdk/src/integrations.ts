/**
 * Atlas Sanctum SDK — Integration Layer
 * Typed client for: AI agents, blockchain, fintech, IoT, observability,
 * connector registry, event bus, human override queue.
 */

const API_BASE = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined)
  ?? 'http://localhost:3000';

async function api<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Connector Registry ───────────────────────────────────────────────────────

export interface ConnectorHealthReport {
  total: number;
  healthy: number;
  degraded: number;
  offline: number;
  connectors: { id: string; domain: string; status: 'healthy' | 'degraded' | 'offline' }[];
}

export async function getConnectorHealth(token: string): Promise<ConnectorHealthReport> {
  return api('/v1/integration/connectors', undefined, token);
}

// ── Agent Orchestration ──────────────────────────────────────────────────────

export type AgentRole =
  | 'fragility-analyst'
  | 'impact-verifier'
  | 'payment-router'
  | 'iot-monitor'
  | 'governance-advisor'
  | 'scenario-planner'
  | 'security-sentinel';

export interface AgentTaskRequest {
  role: AgentRole;
  instruction: string;
  context: Record<string, unknown>;
  priority?: 1 | 2 | 3;
  requiresHumanApproval?: boolean;
  timeoutMs?: number;
}

export interface HumanOverrideRequest {
  taskId: string;
  role: AgentRole;
  reason: string;
  proposedAction: string;
  context: Record<string, unknown>;
  requestedAt: string;
  expiresAt: string;
}

export async function submitAgentTask(req: AgentTaskRequest, token: string): Promise<{ taskId: string }> {
  return api('/v1/integration/agents/tasks', { method: 'POST', body: JSON.stringify(req) }, token);
}

export async function getPendingHumanOverrides(token: string): Promise<{ items: HumanOverrideRequest[] }> {
  return api('/v1/integration/agents/overrides', undefined, token);
}

export async function resolveHumanOverride(
  taskId: string,
  decision: 'approve' | 'reject',
  actorId: string,
  token: string,
  notes?: string
): Promise<{ resolved: boolean }> {
  return api(
    `/v1/integration/agents/overrides/${taskId}/resolve`,
    { method: 'POST', body: JSON.stringify({ decision, actorId, notes }) },
    token
  );
}

// ── Event Bus ────────────────────────────────────────────────────────────────

export interface DeadLetterEvent {
  event: { id: string; type: string; aggregateId: string; payload: unknown };
  error: string;
}

export async function getDeadLetterQueue(token: string): Promise<{ items: DeadLetterEvent[] }> {
  return api('/v1/integration/events/dead-letter', undefined, token);
}

// ── Health ───────────────────────────────────────────────────────────────────

export interface SystemHealth {
  status: string;
  timestamp: string;
  service: string;
  connectors: ConnectorHealthReport;
  agents: {
    queueDepth: number;
    running: number;
    pendingHumanOverrides: number;
  } | null;
}

export async function getSystemHealth(): Promise<SystemHealth> {
  return api('/health');
}
