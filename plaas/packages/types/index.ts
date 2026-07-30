/**
 * PLAAS — Shared Constellation Types
 * Shared across all 8 living layers + Atlas Sanctum Core
 */

// ─── Node Identity ────────────────────────────────────────────────────────────

export type NodeRole =
  | 'nervous-system'
  | 'temple'
  | 'mycelium'
  | 'ark'
  | 'living-city'
  | 'garden'
  | 'living-library'
  | 'constellation';

export interface ConstellationNode {
  id: string;
  role: NodeRole;
  bioregion: string;
  coordinates?: { lat: number; lon: number };
  status: 'active' | 'dormant' | 'healing' | 'offline';
  lastHeartbeat: Date;
  capabilities: string[];
}

// ─── Signals ──────────────────────────────────────────────────────────────────

export type SignalCategory =
  | 'ecological'
  | 'social'
  | 'economic'
  | 'governance'
  | 'health'
  | 'cultural'
  | 'spiritual';

export interface PlanetarySignal {
  id: string;
  sourceNodeId: string;
  category: SignalCategory;
  metric: string;
  value: number;
  unit: string;
  confidence: number; // 0–1
  observedAt: Date;
  bioregion: string;
  tags: string[];
}

// ─── Wisdom ───────────────────────────────────────────────────────────────────

export interface WisdomEntry {
  id: string;
  title: string;
  body: string;
  tradition: string;       // e.g. "Kikuyu", "Ubuntu", "Andean"
  language: string;        // ISO 639-1
  category: SignalCategory;
  verifiedBy: string[];    // council member IDs
  createdAt: Date;
}

// ─── Covenant ─────────────────────────────────────────────────────────────────

export type CovenantStatus = 'draft' | 'armed' | 'triggered' | 'executed' | 'verified';

export interface Covenant {
  id: string;
  title: string;
  description: string;
  bioregion: string;
  status: CovenantStatus;
  conditions: CovenantCondition[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CovenantCondition {
  metric: string;
  operator: '>=' | '<=' | '==' | '!=' | '>' | '<';
  threshold: number;
  weight: number;
}

// ─── Governance ───────────────────────────────────────────────────────────────

export interface WisdomCouncil {
  id: string;
  name: string;
  bioregion: string;
  members: CouncilMember[];
  quorum: number;           // minimum votes for decision
  indigenousQuota: number;  // minimum % indigenous representation
}

export interface CouncilMember {
  id: string;
  name: string;
  role: 'elder' | 'steward' | 'scientist' | 'youth' | 'observer';
  tradition?: string;
  isIndigenous: boolean;
}

// ─── Mesh Network ─────────────────────────────────────────────────────────────

export interface MeshPeer {
  peerId: string;
  nodeId: string;
  protocol: 'libp2p' | 'meshtastic' | 'lorawan' | 'wifi-direct';
  lastSeen: Date;
  offlineCapable: boolean;
}

// ─── Regenerative Economics ───────────────────────────────────────────────────

export interface RegenerativeAsset {
  id: string;
  type: 'RIU' | 'bond' | 'covenant-credit' | 'stewardship-token';
  bioregion: string;
  projectId: string;
  value: number;
  currency: string;
  verifiedAt?: Date;
  expiresAt?: Date;
}
