/**
 * PLAAS Layer 3 — THE MYCELIUM NETWORK
 * Decentralized Intelligence Layer
 *
 * Hidden distributed systems inspired by fungal networks and
 * indigenous resilience. No single point of failure.
 * Inspired by: Physarum polycephalum, Zapatista autonomous networks,
 * Māori whakapapa knowledge webs.
 *
 * Responsibilities:
 *  - Peer-to-peer intelligence routing
 *  - Local-first, offline-first data storage
 *  - Federated learning across nodes
 *  - Swarm coordination protocols
 *  - Self-healing network topology
 *  - Cooperative resource sharing
 */

import type { MeshPeer, ConstellationNode } from '../packages/types';
import type { SyncPacket } from '../packages/protocols';

// ─── Network Topology ─────────────────────────────────────────────────────────

export interface MyceliumTopology {
  nodes: ConstellationNode[];
  edges: MyceliumEdge[];
  partitions: NetworkPartition[];   // isolated segments during disruption
  healingRoutes: HealingRoute[];
}

export interface MyceliumEdge {
  fromNodeId: string;
  toNodeId: string;
  protocol: MeshPeer['protocol'];
  latencyMs: number;
  bandwidth: 'low' | 'medium' | 'high';
  reliable: boolean;
}

export interface NetworkPartition {
  id: string;
  nodeIds: string[];
  isolatedSince: Date;
  offlineQueueDepth: number;
  estimatedReconnect?: Date;
}

export interface HealingRoute {
  partitionId: string;
  bridgeNodeId: string;
  alternateProtocol: MeshPeer['protocol'];
  discoveredAt: Date;
}

// ─── Federated Learning ───────────────────────────────────────────────────────

export interface FederatedModelUpdate {
  modelId: string;
  nodeId: string;
  gradients: number[];      // compressed gradient vector
  sampleCount: number;
  round: number;
  submittedAt: Date;
}

export interface FederatedAggregation {
  modelId: string;
  round: number;
  participatingNodes: string[];
  aggregatedAt: Date;
  accuracy?: number;
}

// ─── Cooperative Resources ────────────────────────────────────────────────────

export interface SharedResource {
  id: string;
  type: 'compute' | 'storage' | 'bandwidth' | 'energy';
  ownerNodeId: string;
  availableUnits: number;
  unit: string;
  sharedWithBioregion: string;
  expiresAt?: Date;
}

// ─── Mycelium Layer Interface ─────────────────────────────────────────────────

export interface MyceliumLayer {
  getTopology(): MyceliumTopology;
  routePacket(packet: SyncPacket): Promise<{ delivered: boolean; hops: number }>;
  submitFederatedUpdate(update: FederatedModelUpdate): Promise<void>;
  shareResource(resource: SharedResource): Promise<void>;
  healPartition(partitionId: string): Promise<HealingRoute | null>;
  offlineQueue(): SyncPacket[];
}
