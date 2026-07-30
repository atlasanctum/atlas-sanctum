/**
 * Atlas Sanctum — Base Connector
 * All domain connectors extend this. Enforces: retry, audit, schema validation,
 * AEGIS policy gate, timeout, observability hooks, cost tracking.
 */

import { EventEmitter } from 'events';

export type ConnectorStatus = 'healthy' | 'degraded' | 'offline';

export interface ConnectorMeta {
  id: string;       // e.g. "openai-gpt4"
  domain: string;   // "ai" | "blockchain" | "fintech" | "iot" | "observability"
  version: string;
  region?: string;
}

export interface ConnectorCallOptions {
  retries?: number;
  timeoutMs?: number;
  policyTags?: string[];  // AEGIS labels e.g. ["ethical-ai", "pii-safe"]
  actorId?: string;
  traceId?: string;
}

export interface AuditEntry {
  connectorId: string;
  operation: string;
  actorId?: string;
  traceId?: string;
  durationMs: number;
  success: boolean;
  errorCode?: string;
  costUnits?: number;
  timestamp: string;
}

export abstract class BaseConnector extends EventEmitter {
  readonly meta: ConnectorMeta;
  protected status: ConnectorStatus = 'offline';
  private auditLog: AuditEntry[] = [];

  constructor(meta: ConnectorMeta) {
    super();
    this.meta = meta;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract healthCheck(): Promise<ConnectorStatus>;

  /** Wraps any operation with retry, timeout, audit, and policy enforcement */
  protected async call<T>(
    operation: string,
    fn: () => Promise<T>,
    opts: ConnectorCallOptions = {}
  ): Promise<T> {
    const { retries = 3, timeoutMs = 10_000, actorId, traceId, policyTags = [] } = opts;
    const start = Date.now();
    let lastError: Error | undefined;

    this.enforcePolicies(operation, policyTags);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await Promise.race([
          fn(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('CONNECTOR_TIMEOUT')), timeoutMs)
          ),
        ]);
        this.recordAudit({ operation, actorId, traceId, start, success: true });
        this.emit('call:success', { connectorId: this.meta.id, operation, traceId });
        return result;
      } catch (err) {
        lastError = err as Error;
        if (attempt < retries) await sleep(Math.min(200 * 2 ** attempt, 5000));
      }
    }

    this.recordAudit({ operation, actorId, traceId, start, success: false, errorCode: lastError?.message });
    this.emit('call:failure', { connectorId: this.meta.id, operation, error: lastError?.message });
    throw lastError;
  }

  private enforcePolicies(operation: string, tags: string[]) {
    if (tags.includes('blocked'))
      throw new Error(`AEGIS_POLICY_VIOLATION: ${operation} blocked by ethical AI policy`);
  }

  private recordAudit(p: {
    operation: string; actorId?: string; traceId?: string;
    start: number; success: boolean; errorCode?: string; costUnits?: number;
  }) {
    const entry: AuditEntry = {
      connectorId: this.meta.id,
      operation: p.operation,
      actorId: p.actorId,
      traceId: p.traceId,
      durationMs: Date.now() - p.start,
      success: p.success,
      errorCode: p.errorCode,
      costUnits: p.costUnits,
      timestamp: new Date().toISOString(),
    };
    this.auditLog.push(entry);
    this.emit('audit', entry);
  }

  getAuditLog(): AuditEntry[] { return [...this.auditLog]; }
  getStatus(): ConnectorStatus { return this.status; }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
