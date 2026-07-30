/**
 * PLAAS Layer 8 — THE CONSTELLATION
 * Planetary Coordination Layer
 *
 * Not centralized. A constellation of sovereign communities,
 * intelligent nodes, and regenerative economies.
 * Planetary coordination without empire.
 * Inspired by: Haudenosaunee Confederacy, African Union principles,
 * Zapatista autonomous municipalities, Polynesian wayfinding networks.
 *
 * Responsibilities:
 *  - Sovereign node registry (no central authority)
 *  - Cross-bioregional coordination protocols
 *  - Planetary digital twin (aggregate sensing)
 *  - Regenerative economic coordination
 *  - Inter-community resource flows
 *  - Collective intelligence without domination
 */

import type { ConstellationNode, NodeRole, PlanetarySignal, RegenerativeAsset } from '../packages/types';

// ─── Planetary Digital Twin ───────────────────────────────────────────────────

export interface PlanetaryTwin {
  timestamp: Date;
  activeNodes: number;
  bioregionsCovered: string[];
  aggregateSignals: AggregateSignal[];
  globalResilienceScore: number;    // 0–100
  carbonSequesteredTons: number;
  biodiversityIndex: number;
  humanWellbeingIndex: number;
}

export interface AggregateSignal {
  metric: string;
  globalValue: number;
  unit: string;
  bioregionalBreakdown: Record<string, number>;
  trend: 'improving' | 'stable' | 'declining';
  updatedAt: Date;
}

// ─── Sovereign Node Registry ──────────────────────────────────────────────────

export interface SovereignNode extends ConstellationNode {
  autonomyLevel: 'full' | 'federated' | 'observer';
  governanceModel: string;          // e.g. "ubuntu-council", "dao", "elder-council"
  joinedConstellationAt: Date;
  contributedSignals: number;
  receivedResources: number;
  sharedResources: number;
}

// ─── Cross-Bioregional Coordination ──────────────────────────────────────────

export interface CoordinationAgreement {
  id: string;
  title: string;
  participatingBioregions: string[];
  purpose: string;
  resourceFlows: ResourceFlow[];
  governedBy: string[];             // council IDs
  status: 'proposed' | 'active' | 'completed' | 'dissolved';
  createdAt: Date;
  reviewDate: Date;
}

export interface ResourceFlow {
  fromBioregion: string;
  toBioregion: string;
  resourceType: string;
  quantity: number;
  unit: string;
  frequency: 'one-time' | 'monthly' | 'seasonal' | 'annual';
  linkedAsset?: RegenerativeAsset;
}

// ─── Collective Intelligence ──────────────────────────────────────────────────

export interface ConstellationInsight {
  id: string;
  pattern: string;
  affectedBioregions: string[];
  confidence: number;
  sourceSignals: string[];          // signal IDs
  recommendedActions: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  generatedAt: Date;
}

// ─── Constellation Layer Interface ────────────────────────────────────────────

export interface ConstellationLayer {
  registerNode(node: Omit<SovereignNode, 'joinedConstellationAt' | 'contributedSignals' | 'receivedResources' | 'sharedResources'>): Promise<SovereignNode>;
  getPlanetaryTwin(): Promise<PlanetaryTwin>;
  contributeSignal(signal: PlanetarySignal): Promise<void>;
  proposeAgreement(agreement: Omit<CoordinationAgreement, 'id' | 'createdAt'>): Promise<CoordinationAgreement>;
  getInsights(bioregion?: string): Promise<ConstellationInsight[]>;
  getActiveNodes(role?: NodeRole): Promise<SovereignNode[]>;
}
