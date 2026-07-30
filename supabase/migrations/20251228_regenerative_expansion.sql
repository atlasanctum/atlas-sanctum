-- Enable PostGIS extension for geographic intelligence
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- ============================================
-- 1B: MEASUREMENT DATA TABLE (Satellite/Sensor Readings)
-- ============================================
CREATE TABLE public.measurement_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  measurement_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  satellite_source TEXT NOT NULL CHECK (satellite_source IN ('Sentinel-2', 'Landsat-8', 'Earth-Engine', 'IoT-Sensor', 'Manual')),
  
  -- Core environmental measurements
  co2_level DECIMAL(10, 2), -- ppm or metric tons equivalent
  soil_carbon_ppm DECIMAL(8, 2), -- parts per million
  ndvi_index DECIMAL(5, 3), -- Normalized Difference Vegetation Index (-1 to 1)
  biodiversity_score DECIMAL(5, 2), -- 0-100 scale
  temperature_celsius DECIMAL(5, 2),
  precipitation_mm DECIMAL(8, 2),
  
  -- Data quality & integrity
  confidence_level DECIMAL(3, 2), -- 0-1 scale
  anomaly_flag BOOLEAN DEFAULT false,
  anomaly_reason TEXT,
  
  -- Metadata
  location GEOMETRY(Point, 4326), -- lat/lng point
  source_url TEXT,
  raw_data JSONB, -- store original API response
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_measurement_project_date ON public.measurement_data(project_id, measurement_date DESC);
CREATE INDEX idx_measurement_location ON public.measurement_data USING GIST(location);
CREATE INDEX idx_measurement_anomaly ON public.measurement_data(anomaly_flag) WHERE anomaly_flag = true;

-- Enable RLS
ALTER TABLE public.measurement_data ENABLE ROW LEVEL SECURITY;

-- Measurement data policies
CREATE POLICY "Anyone can view measurement data for active projects"
ON public.measurement_data FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.carbon_projects cp
    WHERE cp.id = measurement_data.project_id AND cp.status = 'active'
  )
);

CREATE POLICY "Service role can insert measurements"
ON public.measurement_data FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- 1C: BIOREGIONAL ZONES TABLE (Geographic Intelligence)
-- ============================================
CREATE TYPE public.climate_classification AS ENUM (
  'tropical_rainforest',
  'tropical_savanna',
  'arid_desert',
  'temperate_grassland',
  'boreal_forest',
  'temperate_deciduous',
  'mediterranean',
  'tundra',
  'ocean_coastal',
  'mountain'
);

CREATE TABLE public.bioregional_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL,
  geometry GEOMETRY(Polygon, 4326) NOT NULL,
  
  -- Geographic & ecological metadata
  climate_classification climate_classification NOT NULL,
  historical_land_use TEXT,
  indigenous_land BOOLEAN DEFAULT false,
  indigenous_community_name TEXT,
  
  -- Credit pricing modifiers
  base_credit_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.0, -- 0.5 to 2.5 scale
  climate_risk_score DECIMAL(5, 2) DEFAULT 0.0, -- 0-100, higher = more at-risk
  biodiversity_value_factor DECIMAL(3, 2) DEFAULT 1.0,
  
  -- Metadata
  region_country TEXT,
  region_area_km2 DECIMAL(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bioregional_geometry ON public.bioregional_zones USING GIST(geometry);
CREATE INDEX idx_bioregional_climate ON public.bioregional_zones(climate_classification);
CREATE INDEX idx_bioregional_indigenous ON public.bioregional_zones(indigenous_land);

-- Enable RLS
ALTER TABLE public.bioregional_zones ENABLE ROW LEVEL SECURITY;

-- Bioregional zones policies (public read)
CREATE POLICY "Anyone can view bioregional zones"
ON public.bioregional_zones FOR SELECT
USING (true);

CREATE POLICY "Admins can manage bioregional zones"
ON public.bioregional_zones FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 1D: REGENERATIVE METRICS TABLE (Agriculture & Ecosystem Recovery)
-- ============================================
CREATE TABLE public.regenerative_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  measurement_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Soil health (0-100 scale)
  soil_microbiome_health DECIMAL(5, 2) CHECK (soil_microbiome_health >= 0 AND soil_microbiome_health <= 100),
  
  -- Biodiversity metrics
  biodiversity_index DECIMAL(5, 2) CHECK (biodiversity_index >= 0 AND biodiversity_index <= 100),
  pollinator_count INTEGER,
  native_species_count INTEGER,
  
  -- Agriculture
  crop_diversity_index DECIMAL(5, 2) CHECK (crop_diversity_index >= 0 AND crop_diversity_index <= 100),
  crop_types_count INTEGER,
  
  -- Restoration (if applicable)
  mangrove_health_score DECIMAL(5, 2),
  kelp_forest_coverage_percent DECIMAL(5, 2),
  
  -- Confidence & data quality
  data_source TEXT NOT NULL DEFAULT 'eDNA-Sample', -- eDNA-Sample, Bioacoustic, Satellite, Manual
  confidence_level DECIMAL(3, 2) DEFAULT 0.85,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_regen_metrics_project_date ON public.regenerative_metrics(project_id, measurement_date DESC);
CREATE INDEX idx_regen_metrics_microbiome ON public.regenerative_metrics(soil_microbiome_health);

-- Enable RLS
ALTER TABLE public.regenerative_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view regenerative metrics for active projects"
ON public.regenerative_metrics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.carbon_projects cp
    WHERE cp.id = regenerative_metrics.project_id AND cp.status = 'active'
  )
);

CREATE POLICY "Service role can insert metrics"
ON public.regenerative_metrics FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- 1E: VALUATION MODEL TABLE (Mathematical Trust & Credit Valuation)
-- ============================================
CREATE TABLE public.valuation_model (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  
  -- Impact scoring variables (weights sum to 1.0)
  impact_co2_weight DECIMAL(3, 2) NOT NULL DEFAULT 0.40,
  impact_biodiversity_weight DECIMAL(3, 2) NOT NULL DEFAULT 0.30,
  impact_health_weight DECIMAL(3, 2) NOT NULL DEFAULT 0.30,
  
  -- Composite scores
  weighted_impact_score DECIMAL(5, 2), -- 0-100
  confidence_score DECIMAL(3, 2), -- 0-1 (how certain are we?)
  confidence_upper_bound DECIMAL(3, 2), -- upper 95% CI
  confidence_lower_bound DECIMAL(3, 2), -- lower 95% CI
  
  -- Risk modeling
  reversal_risk_percent DECIMAL(5, 2) NOT NULL DEFAULT 5.0, -- probability of reversal
  reversal_risk_decay_rate DECIMAL(3, 2) NOT NULL DEFAULT 0.95, -- annual decay (95% = 5% annual decay)
  permanence_bond_percent DECIMAL(5, 2) DEFAULT 10.0, -- % of credits held in escrow
  
  -- Valuation
  base_credit_price DECIMAL(8, 2),
  dynamic_price_multiplier DECIMAL(5, 2) DEFAULT 1.0, -- applied to base price
  final_credit_price DECIMAL(8, 2),
  
  -- Last update
  last_recomputed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_valuation_project ON public.valuation_model(project_id);
CREATE INDEX idx_valuation_impact_score ON public.valuation_model(weighted_impact_score DESC);

-- Enable RLS
ALTER TABLE public.valuation_model ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view valuation models for active projects"
ON public.valuation_model FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.carbon_projects cp
    WHERE cp.id = valuation_model.project_id AND cp.status = 'active'
  )
);

CREATE POLICY "Service role can insert/update valuations"
ON public.valuation_model FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- 1F: EXTEND CARBON_PROJECTS TABLE
-- ============================================
-- Add new columns to carbon_projects for linking to new tables
ALTER TABLE public.carbon_projects
ADD COLUMN IF NOT EXISTS measurement_data_id UUID REFERENCES public.measurement_data(id),
ADD COLUMN IF NOT EXISTS bioregional_zone_id UUID REFERENCES public.bioregional_zones(id),
ADD COLUMN IF NOT EXISTS regenerative_metrics_id UUID REFERENCES public.regenerative_metrics(id),
ADD COLUMN IF NOT EXISTS valuation_model_id UUID REFERENCES public.valuation_model(id),
ADD COLUMN IF NOT EXISTS geometry GEOMETRY(Point, 4326),
ADD COLUMN IF NOT EXISTS verified_by_system_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_measurement_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS impact_score DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS confidence_level DECIMAL(3, 2);

-- Create indexes for extended columns
CREATE INDEX IF NOT EXISTS idx_carbon_projects_geometry ON public.carbon_projects USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_carbon_projects_impact_score ON public.carbon_projects(impact_score DESC);
CREATE INDEX IF NOT EXISTS idx_carbon_projects_bioregion ON public.carbon_projects(bioregional_zone_id);
CREATE INDEX IF NOT EXISTS idx_carbon_projects_last_measurement ON public.carbon_projects(last_measurement_at DESC);

-- ============================================
-- SAMPLE DATA: Bioregional Zones
-- ============================================
-- Insert example bioregional zones with realistic GIS polygons
-- Note: These are simplified polygons; real implementation would use precise boundaries

INSERT INTO public.bioregional_zones (zone_name, geometry, climate_classification, historical_land_use, indigenous_land, indigenous_community_name, base_credit_multiplier, climate_risk_score, region_country)
VALUES
  (
    'Amazon Rainforest Basin',
    ST_GeomFromText('POLYGON((-75 5, -50 5, -50 -15, -75 -15, -75 5))', 4326),
    'tropical_rainforest',
    'Slash-and-burn agriculture, rubber tapping, subsistence hunting',
    true,
    'Yanomami, Kayapó, Munduruku',
    2.5,
    85.0,
    'Brazil'
  ),
  (
    'East African Savanna',
    ST_GeomFromText('POLYGON((30 5, 45 5, 45 -15, 30 -15, 30 5))', 4326),
    'tropical_savanna',
    'Pastoral herding, wildlife conservation, agricultural encroachment',
    true,
    'Maasai, Samburu, Turkana',
    1.8,
    72.0,
    'Kenya'
  ),
  (
    'Indonesian Peatlands',
    ST_GeomFromText('POLYGON((105 0, 120 0, 120 -10, 105 -10, 105 0))', 4326),
    'tropical_rainforest',
    'Peatland drainage, palm oil cultivation, restoration attempts',
    false,
    NULL,
    2.2,
    90.0,
    'Indonesia'
  ),
  (
    'California Coastal Marine',
    ST_GeomFromText('POLYGON((-125 40, -120 40, -120 33, -125 33, -125 40))', 4326),
    'mediterranean',
    'Kelp forest harvesting, marine conservation',
    true,
    'Yurok, Karuk, local fishing communities',
    2.1,
    65.0,
    'USA'
  ),
  (
    'Boreal Forests (Scandinavia)',
    ST_GeomFromText('POLYGON((10 55, 30 55, 30 70, 10 70, 10 55))', 4326),
    'boreal_forest',
    'Timber logging, hydroelectric dams, conservation areas',
    true,
    'Sámi indigenous peoples',
    1.5,
    55.0,
    'Norway'
  );

-- Update existing carbon_projects with geometry and bioregional zone references
UPDATE public.carbon_projects
SET 
  geometry = ST_SetSRID(ST_MakePoint(-60.0, -3.0), 4326),
  bioregional_zone_id = (SELECT id FROM public.bioregional_zones WHERE zone_name = 'Amazon Rainforest Basin'),
  impact_score = 78.5,
  confidence_level = 0.92
WHERE title = 'Amazon Rainforest Protection';

UPDATE public.carbon_projects
SET 
  geometry = ST_SetSRID(ST_MakePoint(35.9, 1.2), 4326),
  bioregional_zone_id = (SELECT id FROM public.bioregional_zones WHERE zone_name = 'East African Savanna'),
  impact_score = 72.0,
  confidence_level = 0.88
WHERE title = 'Kenyan Wind Farm';

UPDATE public.carbon_projects
SET 
  geometry = ST_SetSRID(ST_MakePoint(113.0, -2.0), 4326),
  bioregional_zone_id = (SELECT id FROM public.bioregional_zones WHERE zone_name = 'Indonesian Peatlands'),
  impact_score = 85.0,
  confidence_level = 0.95
WHERE title = 'Indonesian Peatland Restoration';

UPDATE public.carbon_projects
SET 
  geometry = ST_SetSRID(ST_MakePoint(-121.9, 36.6), 4326),
  bioregional_zone_id = (SELECT id FROM public.bioregional_zones WHERE zone_name = 'California Coastal Marine'),
  impact_score = 80.0,
  confidence_level = 0.90
WHERE title = 'Pacific Kelp Forest Initiative';

-- Insert sample measurement data for existing projects
INSERT INTO public.measurement_data (project_id, measurement_date, satellite_source, co2_level, soil_carbon_ppm, ndvi_index, biodiversity_score, temperature_celsius, precipitation_mm, confidence_level, anomaly_flag, location)
SELECT
  cp.id,
  now() - INTERVAL '1 day' * (row_number() OVER (PARTITION BY cp.id ORDER BY cp.id) - 1),
  'Sentinel-2',
  ROUND(CAST(150 + random() * 50 AS numeric), 2),
  ROUND(CAST(45 + random() * 20 AS numeric), 2),
  ROUND(CAST(0.6 + random() * 0.3 AS numeric), 3),
  ROUND(CAST(60 + random() * 30 AS numeric), 2),
  ROUND(CAST(25 + random() * 10 AS numeric), 2),
  ROUND(CAST(50 + random() * 100 AS numeric), 2),
  ROUND(CAST(0.85 + random() * 0.1 AS numeric), 2),
  false,
  cp.geometry
FROM public.carbon_projects cp
CROSS JOIN generate_series(1, 5) -- Generate 5 measurements per project
WHERE cp.geometry IS NOT NULL;

-- Insert sample regenerative metrics
INSERT INTO public.regenerative_metrics (project_id, measurement_date, soil_microbiome_health, biodiversity_index, pollinator_count, crop_diversity_index, data_source, confidence_level)
SELECT
  cp.id,
  now() - INTERVAL '7 days' * (row_number() OVER (PARTITION BY cp.id ORDER BY cp.id) - 1),
  ROUND(CAST(65 + random() * 30 AS numeric), 2),
  ROUND(CAST(70 + random() * 25 AS numeric), 2),
  (RANDOM() * 5000)::INTEGER,
  ROUND(CAST(50 + random() * 40 AS numeric), 2),
  CASE WHEN random() > 0.5 THEN 'eDNA-Sample' ELSE 'Bioacoustic' END,
  ROUND(CAST(0.80 + random() * 0.15 AS numeric), 2)
FROM public.carbon_projects cp
CROSS JOIN generate_series(1, 4); -- 4 measurements per project

-- Insert valuation models for all projects
INSERT INTO public.valuation_model (
  project_id,
  impact_co2_weight,
  impact_biodiversity_weight,
  impact_health_weight,
  weighted_impact_score,
  confidence_score,
  confidence_upper_bound,
  confidence_lower_bound,
  reversal_risk_percent,
  permanence_bond_percent,
  base_credit_price,
  dynamic_price_multiplier
)
SELECT
  cp.id,
  0.40,
  0.30,
  0.30,
  ROUND(CAST(60 + random() * 35 AS numeric), 2),
  ROUND(CAST(0.85 + random() * 0.10 AS numeric), 2),
  ROUND(CAST(0.90 + random() * 0.08 AS numeric), 2),
  ROUND(CAST(0.75 + random() * 0.10 AS numeric), 2),
  ROUND(CAST(3 + random() * 10 AS numeric), 2),
  10.0,
  cp.price_per_credit,
  ROUND(CAST(0.9 + random() * 0.2 AS numeric), 2)
FROM public.carbon_projects cp;

-- Update valuation final prices
UPDATE public.valuation_model
SET final_credit_price = ROUND(CAST(base_credit_price * dynamic_price_multiplier AS numeric), 2),
    last_recomputed_at = now();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.measurement_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bioregional_zones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.regenerative_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_model;

-- Grant permissions
GRANT SELECT ON public.measurement_data TO anon, authenticated;
GRANT SELECT ON public.bioregional_zones TO anon, authenticated;
GRANT SELECT ON public.regenerative_metrics TO anon, authenticated;
GRANT SELECT ON public.valuation_model TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
