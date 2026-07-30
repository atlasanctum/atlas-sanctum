/**
 * PLAAS Layer 5 — THE LIVING CITY
 * Interoperable Civilization Infrastructure Layer
 *
 * A modular civilization ecosystem where each district functions
 * independently while connected to the whole.
 * Inspired by: Medina city design, Inca road networks,
 * African ubuntu city planning, permaculture zones.
 *
 * Districts: Agriculture, Water, Energy, Education, Governance,
 * Manufacturing, Trade, Healthcare, Spiritual/Cultural,
 * Ecological Restoration, Mobility & Logistics
 */

import type { RegenerativeAsset } from '../packages/types';

// ─── Districts ────────────────────────────────────────────────────────────────

export type DistrictType =
  | 'agriculture'
  | 'water'
  | 'energy'
  | 'education'
  | 'governance'
  | 'manufacturing'
  | 'trade'
  | 'healthcare'
  | 'spiritual-cultural'
  | 'ecological-restoration'
  | 'mobility-logistics';

export interface CityDistrict {
  id: string;
  type: DistrictType;
  bioregion: string;
  name: string;
  status: 'thriving' | 'stable' | 'stressed' | 'critical';
  metrics: DistrictMetric[];
  connectedDistricts: string[];   // district IDs
  apiEndpoint?: string;           // interoperability endpoint
}

export interface DistrictMetric {
  key: string;
  value: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  updatedAt: Date;
}

// ─── Community Operating System ───────────────────────────────────────────────

export interface CommunityOS {
  bioregion: string;
  population: number;
  districts: CityDistrict[];
  localCurrency?: LocalCurrency;
  activeCovenants: string[];      // covenant IDs
  resilienceScore: number;        // 0–100
  lastAssessedAt: Date;
}

export interface LocalCurrency {
  symbol: string;
  name: string;
  backingAssets: RegenerativeAsset[];
  circulatingSupply: number;
  exchangeRates: Record<string, number>;  // symbol → rate
}

// ─── AI Service Orchestration ─────────────────────────────────────────────────

export interface CityAIService {
  id: string;
  name: string;
  district: DistrictType;
  purpose: string;
  model: string;
  onDevice: boolean;
  ethicsApproved: boolean;
  approvedBy: string[];           // temple council IDs
}

// ─── Living City Layer Interface ──────────────────────────────────────────────

export interface LivingCityLayer {
  getDistrict(id: string): Promise<CityDistrict>;
  updateDistrictMetric(districtId: string, metric: DistrictMetric): Promise<void>;
  getCommunityOS(bioregion: string): Promise<CommunityOS>;
  registerAIService(service: Omit<CityAIService, 'id'>): Promise<CityAIService>;
  coordinateDistricts(districtIds: string[], action: string): Promise<{ success: boolean; log: string[] }>;
}
