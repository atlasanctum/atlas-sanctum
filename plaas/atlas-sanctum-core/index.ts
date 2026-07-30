/**
 * ATLAS SANCTUM CORE
 * The Heart, Mind, Soul & Bridge of PLAAS
 *
 * Heart    — Compassion, stewardship, protection
 * Mind     — Planetary intelligence, foresight, simulation, coordination
 * Soul     — Ethics, wisdom, truth integrity, purpose alignment
 * Bridge   — Connection between communities, infrastructures,
 *             intelligence systems, ecological systems, future generations
 *
 * This module orchestrates all 8 constellation layers as one coherent
 * planetary organism. It does NOT control them — it listens, synthesizes,
 * and coordinates with consent.
 */

import type { ConstellationNode, PlanetarySignal, Covenant, WisdomEntry } from '../packages/types';
import type { LayerEvent, LayerHealth } from '../packages/protocols';

import type { NervousSystemLayer } from '../nervous-system';
import type { TempleLayer } from '../temple';
import type { MyceliumLayer } from '../mycelium';
import type { ArkLayer } from '../ark';
import type { LivingCityLayer } from '../living-city';
import type { GardenLayer } from '../garden';
import type { LivingLibraryLayer } from '../living-library';
import type { ConstellationLayer, PlanetaryTwin, ConstellationInsight } from '../constellation';

// ─── Sanctum State ────────────────────────────────────────────────────────────

export interface SanctumState {
  identity: ConstellationNode;
  planetaryTwin: PlanetaryTwin;
  activeCovenants: Covenant[];
  recentInsights: ConstellationInsight[];
  layerHealth: LayerHealth[];
  wisdomQueue: WisdomEntry[];       // pending council review
  alertQueue: LayerEvent[];
  lastHeartbeat: Date;
}

// ─── Sanctum Configuration ────────────────────────────────────────────────────

export interface SanctumConfig {
  bioregion: string;
  nodeId: string;
  offlineMode: boolean;
  ethicsStrictMode: boolean;        // reject any unaudited AI service
  indigenousDataSovereignty: boolean;
  layers: {
    nervousSystem: NervousSystemLayer;
    temple: TempleLayer;
    mycelium: MyceliumLayer;
    ark: ArkLayer;
    livingCity: LivingCityLayer;
    garden: GardenLayer;
    livingLibrary: LivingLibraryLayer;
    constellation: ConstellationLayer;
  };
}

// ─── Sanctum Orchestrator ─────────────────────────────────────────────────────

export interface AtlasSanctumCore {
  // Heart — stewardship & protection
  protectSacredSite(siteId: string, requesterId: string): Promise<{ protected: boolean; reason: string }>;
  stewardCovenant(covenant: Covenant): Promise<{ valid: boolean; concerns: string[] }>;

  // Mind — intelligence & foresight
  getPlanetaryTwin(): Promise<PlanetaryTwin>;
  runForesightSimulation(scenario: ForesightScenario): Promise<ForesightResult>;
  synthesizeInsights(bioregion?: string): Promise<ConstellationInsight[]>;

  // Soul — ethics & purpose alignment
  auditForPurposeAlignment(targetId: string, targetType: string): Promise<PurposeAudit>;
  publishWisdom(entry: Omit<WisdomEntry, 'id' | 'createdAt'>): Promise<WisdomEntry>;

  // Bridge — coordination & connection
  routeSignal(signal: PlanetarySignal): Promise<void>;
  broadcastEvent(event: LayerEvent): Promise<void>;
  getLayerHealth(): Promise<LayerHealth[]>;
  getState(): SanctumState;
}

// ─── Foresight Simulation ─────────────────────────────────────────────────────

export interface ForesightScenario {
  id: string;
  name: string;
  bioregion: string;
  horizon: 5 | 10 | 25 | 50;       // years
  variables: Record<string, number>;
  assumptions: string[];
}

export interface ForesightResult {
  scenarioId: string;
  projections: Record<string, number[]>;  // metric → values per year
  risks: string[];
  opportunities: string[];
  recommendedCovenants: Partial<Covenant>[];
  confidence: number;
  generatedAt: Date;
}

// ─── Purpose Audit ────────────────────────────────────────────────────────────

export interface PurposeAudit {
  targetId: string;
  alignedWith: string[];    // PLAAS principles it upholds
  misalignedWith: string[]; // principles it violates
  overallScore: number;     // 0–100
  recommendation: 'approve' | 'revise' | 'reject';
  reviewedBy: string[];
  auditedAt: Date;
}
