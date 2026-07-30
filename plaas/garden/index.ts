/**
 * PLAAS Layer 6 — THE GARDEN
 * Regenerative Life Systems Layer
 *
 * Systems that cultivate flourishing rather than extraction.
 * Behaves like an ecosystem: cyclical, adaptive, symbiotic, resilient.
 * Inspired by: permaculture design, Amazonian terra preta,
 * Korean natural farming, Zulu agroforestry.
 *
 * Responsibilities:
 *  - Regenerative agriculture intelligence
 *  - Ecological restoration tracking
 *  - Soil & water stewardship
 *  - Circular economy flows
 *  - Food sovereignty systems
 *  - Human wellbeing integration
 */

// ─── Soil Intelligence ────────────────────────────────────────────────────────

export interface SoilProfile {
  id: string;
  bioregion: string;
  coordinates: { lat: number; lon: number };
  organicMatterPercent: number;
  microbialDiversityScore: number;   // 0–100
  carbonSequesteredTons: number;
  phLevel: number;
  moisturePercent: number;
  observedAt: Date;
  trend: 'regenerating' | 'stable' | 'degrading';
}

// ─── Ecosystem Restoration ────────────────────────────────────────────────────

export type EcosystemType =
  | 'forest'
  | 'wetland'
  | 'grassland'
  | 'mangrove'
  | 'coral-reef'
  | 'savanna'
  | 'agroforest'
  | 'urban-green';

export interface RestorationProject {
  id: string;
  name: string;
  ecosystemType: EcosystemType;
  bioregion: string;
  hectares: number;
  startDate: Date;
  targetDate: Date;
  currentNDVI: number;          // 0–1 vegetation index
  baselineNDVI: number;
  speciesReintroduced: string[];
  communityLed: boolean;
  linkedCovenantId?: string;
}

// ─── Circular Economy ─────────────────────────────────────────────────────────

export interface CircularFlow {
  id: string;
  bioregion: string;
  inputResource: string;
  outputResource: string;
  wasteReduced: number;
  unit: string;
  participants: string[];       // community IDs
  cycleFrequency: 'daily' | 'weekly' | 'seasonal' | 'annual';
}

// ─── Food Sovereignty ─────────────────────────────────────────────────────────

export interface FoodSystem {
  bioregion: string;
  localProductionPercent: number;
  seedSovereignty: boolean;       // community controls seed supply
  cropDiversityIndex: number;     // Shannon diversity index
  farmerIncomeUSD: number;
  foodSecurityScore: number;      // 0–100
  indigenousCropsPreserved: number;
}

// ─── Garden Layer Interface ───────────────────────────────────────────────────

export interface GardenLayer {
  getSoilProfile(bioregion: string): Promise<SoilProfile[]>;
  recordSoilReading(profile: Omit<SoilProfile, 'id'>): Promise<SoilProfile>;
  getRestorationProjects(bioregion: string): Promise<RestorationProject[]>;
  updateRestorationProgress(projectId: string, ndvi: number, species: string[]): Promise<RestorationProject>;
  getFoodSystem(bioregion: string): Promise<FoodSystem>;
  registerCircularFlow(flow: Omit<CircularFlow, 'id'>): Promise<CircularFlow>;
}
