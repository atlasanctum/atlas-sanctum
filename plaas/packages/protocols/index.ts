/**
 * PLAAS — Inter-Layer Protocols
 * Defines how constellation layers communicate without central control.
 */

import type { ConstellationNode, PlanetarySignal, NodeRole } from '../types';

// ─── Event Bus Protocol ───────────────────────────────────────────────────────

export type LayerEvent =
  | { type: 'SIGNAL_OBSERVED'; payload: PlanetarySignal }
  | { type: 'COVENANT_TRIGGERED'; payload: { covenantId: string; bioregion: string } }
  | { type: 'NODE_JOINED'; payload: ConstellationNode }
  | { type: 'NODE_OFFLINE'; payload: { nodeId: string } }
  | { type: 'WISDOM_PUBLISHED'; payload: { entryId: string; tradition: string } }
  | { type: 'ALERT_RAISED'; payload: { severity: 'low' | 'medium' | 'high' | 'critical'; message: string; bioregion: string } };

export interface LayerEventBus {
  publish(event: LayerEvent): Promise<void>;
  subscribe(role: NodeRole, handler: (event: LayerEvent) => void): () => void;
}

// ─── Health Check Protocol ────────────────────────────────────────────────────

export interface LayerHealth {
  role: NodeRole;
  status: 'healthy' | 'degraded' | 'offline';
  latencyMs?: number;
  lastCheck: Date;
  details?: Record<string, unknown>;
}

export interface HealthCheckProtocol {
  ping(role: NodeRole): Promise<LayerHealth>;
  pingAll(): Promise<LayerHealth[]>;
}

// ─── Data Sovereignty Protocol ────────────────────────────────────────────────

export interface DataSovereigntyPolicy {
  bioregion: string;
  allowedRoles: NodeRole[];
  requiresConsent: boolean;
  retentionDays: number;
  indigenousProtected: boolean;
}

// ─── Offline-First Sync Protocol ─────────────────────────────────────────────

export interface SyncPacket {
  id: string;
  sourceNodeId: string;
  targetRole: NodeRole;
  payload: unknown;
  createdAt: Date;
  synced: boolean;
}

export interface OfflineSyncProtocol {
  queue(packet: SyncPacket): void;
  flush(): Promise<SyncPacket[]>;
  pending(): SyncPacket[];
}

// ─── Request / Response Protocol ─────────────────────────────────────────────
// Typed RPC envelope for cross-layer calls that need a reply.

export interface LayerRequest<T = unknown> {
  id: string;
  fromRole: NodeRole;
  toRole: NodeRole;
  operation: string;
  payload: T;
  timeout?: number;   // ms; default 5000
  createdAt: Date;
}

export interface LayerResponse<T = unknown> {
  requestId: string;
  success: boolean;
  payload?: T;
  error?: string;
  latencyMs: number;
  respondedAt: Date;
}

// ─── Telemetry Protocol ───────────────────────────────────────────────────────
// Lightweight span emitted by any layer for observability.

export interface TelemetrySpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  layer: NodeRole;
  operation: string;
  startedAt: Date;
  durationMs: number;
  status: 'ok' | 'error';
  attributes?: Record<string, string | number | boolean>;
}

export interface TelemetryCollector {
  emit(span: TelemetrySpan): void;
  flush(): TelemetrySpan[];
}
