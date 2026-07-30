export type ProjectType = 'reforestation' | 'renewable_energy' | 'methane_capture' | 'ocean_restoration' | 'soil_carbon' | 'direct_air_capture';
export type ProjectStatus = 'active' | 'pending' | 'completed' | 'suspended';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ClimateClassification = 'tropical_rainforest' | 'tropical_savanna' | 'arid_desert' | 'temperate_grassland' | 'boreal_forest' | 'temperate_deciduous' | 'mediterranean' | 'tundra' | 'ocean_coastal' | 'mountain';
export type SatelliteSource = 'Sentinel-2' | 'Landsat-8' | 'Earth-Engine' | 'IoT-Sensor' | 'Manual';
export type DataSource = 'eDNA-Sample' | 'Bioacoustic' | 'Satellite' | 'Manual';

export interface CarbonProject {
  id: string;
  title: string;
  description: string;
  location: string;
  country: string;
  project_type: ProjectType;
  status: ProjectStatus;
  price_per_credit: number;
  total_credits: number;
  available_credits: number;
  vintage_year: number;
  certification: string;
  methodology: string | null;
  co2_offset_per_credit: number;
  image_url: string | null;
  developer_name: string;
  start_date: string | null;
  end_date: string | null;
  // New expansion fields
  measurement_data_id: string | null;
  bioregional_zone_id: string | null;
  regenerative_metrics_id: string | null;
  valuation_model_id: string | null;
  geometry: GeoPoint | null;
  verified_by_system_at: string | null;
  last_measurement_at: string | null;
  impact_score: number | null;
  confidence_level: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreditHolding {
  id: string;
  user_id: string;
  project_id: string;
  quantity: number;
  purchase_price: number;
  purchased_at: string;
  retired: boolean;
  retired_at: string | null;
  certificate_id: string | null;
  carbon_projects?: CarbonProject;
}

export interface Transaction {
  id: string;
  user_id: string;
  project_id: string;
  quantity: number;
  price_per_credit: number;
  total_amount: number;
  status: TransactionStatus;
  transaction_type: string;
  payment_method: string | null;
  created_at: string;
  completed_at: string | null;
  carbon_projects?: CarbonProject;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  reforestation: 'Reforestation',
  renewable_energy: 'Renewable Energy',
  methane_capture: 'Methane Capture',
  ocean_restoration: 'Ocean Restoration',
  soil_carbon: 'Soil Carbon',
  direct_air_capture: 'Direct Air Capture',
};

export const PROJECT_TYPE_ICONS: Record<ProjectType, string> = {
  reforestation: '🌲',
  renewable_energy: '⚡',
  methane_capture: '🏭',
  ocean_restoration: '🌊',
  soil_carbon: '🌱',
  direct_air_capture: '💨',
};

// ============================================
// GEOGRAPHIC INTELLIGENCE TYPES
// ============================================
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

export interface BioregionalZone {
  id: string;
  name: string;
  code: string;
  region: string;
  country: string;
  climate_type: string | null;
  description: string | null;
  coordinates: GeoPoint | GeoPolygon | null;
  biodiversity_index: number | null;
  carbon_sequestration_rate: number | null;
  active_projects: number | null;
  total_area_hectares: number | null;
  risk_level: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// MEASUREMENT & VERIFICATION TYPES
// ============================================
export interface MeasurementData {
  id: string;
  project_id: string;
  measurement_date: string;
  satellite_source: SatelliteSource;
  co2_level: number | null;
  soil_carbon_ppm: number | null;
  ndvi_index: number | null; // Normalized Difference Vegetation Index
  biodiversity_score: number | null; // 0-100
  temperature_celsius: number | null;
  precipitation_mm: number | null;
  confidence_level: number; // 0-1
  anomaly_flag: boolean;
  anomaly_reason: string | null;
  location: GeoPoint | null;
  source_url: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

export interface MeasurementSummary {
  latest: MeasurementData | null;
  average_co2_7d: number | null;
  average_ndvi_7d: number | null;
  anomalies_count: number;
  confidence_trend: 'improving' | 'stable' | 'declining';
  last_updated: string;
}

// ============================================
// REGENERATIVE AGRICULTURE & ECOSYSTEM TYPES
// ============================================
export interface RegenerativeMetrics {
  id: string;
  project_id: string | null;
  zone_id: string | null;
  metric_name: string;
  metric_category: string;
  current_value: number;
  baseline_value: number | null;
  target_value: number | null;
  improvement_percentage: number | null;
  unit: string;
  trend: string | null;
  last_measured_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegenerativeMetricsTrend {
  microbiome_trend_30d: number | null;
  biodiversity_trend_30d: number | null;
  crop_diversity_trend_30d: number | null;
  pollinator_trend_30d: number | null;
  latest_scores: RegenerativeMetrics | null;
  health_status: 'excellent' | 'good' | 'fair' | 'poor';
}

// ============================================
// MATHEMATICAL TRUST & VALUATION TYPES
// ============================================
export interface ValuationModel {
  id: string;
  project_id: string;
  impact_co2_weight: number;
  impact_biodiversity_weight: number;
  impact_health_weight: number;
  weighted_impact_score: number | null; // 0-100
  confidence_score: number | null; // 0-1
  confidence_upper_bound: number | null; // 95% CI upper
  confidence_lower_bound: number | null; // 95% CI lower
  reversal_risk_percent: number;
  reversal_risk_decay_rate: number; // annual (e.g., 0.95 = 5% annual decay)
  permanence_bond_percent: number;
  base_credit_price: number | null;
  dynamic_price_multiplier: number;
  final_credit_price: number | null;
  last_recomputed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ImpactBreakdown {
  co2_component: {
    value: number;
    weight: number;
    contribution: number;
  };
  biodiversity_component: {
    value: number;
    weight: number;
    contribution: number;
  };
  health_component: {
    value: number;
    weight: number;
    contribution: number;
  };
  final_score: number;
  confidence_interval: [number, number];
  reversal_risk_adjusted_price: number;
}

export const CLIMATE_LABELS: Record<ClimateClassification, string> = {
  tropical_rainforest: '🌴 Tropical Rainforest',
  tropical_savanna: '🦁 Tropical Savanna',
  arid_desert: '🏜️ Arid Desert',
  temperate_grassland: '🌾 Temperate Grassland',
  boreal_forest: '🌲 Boreal Forest',
  temperate_deciduous: '🍂 Temperate Deciduous',
  mediterranean: '🌞 Mediterranean',
  tundra: '❄️ Tundra',
  ocean_coastal: '🌊 Ocean Coastal',
  mountain: '⛰️ Mountain',
};
