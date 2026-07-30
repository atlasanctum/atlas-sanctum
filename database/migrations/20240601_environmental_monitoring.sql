-- ============================================
-- Planetary Measurement & Verification System
-- Database Schema Migration
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Carbon Flux Data
-- ============================================

CREATE TABLE IF NOT EXISTS carbon_flux_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    satellite_imagery_id VARCHAR(100) NOT NULL,
    region_id VARCHAR(100) NOT NULL,
    gross_primary_productivity DECIMAL(10, 4), -- kg C/m²/year
    ecosystem_respiration DECIMAL(10, 4),
    net_ecosystem_exchange DECIMAL(10, 4),
    carbon_sequestration_rate DECIMAL(10, 4), -- tonnes CO2e/ha/year
    uncertainty_range JSONB DEFAULT '{"min": 0, "max": 0}',
    measurement_method VARCHAR(50) DEFAULT 'satellite_derived',
    verification_level VARCHAR(20) DEFAULT 'tier_1',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT cf_region_timestamp_idx UNIQUE (region_id, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_carbon_flux_region ON carbon_flux_data(region_id);
CREATE INDEX IF NOT EXISTS idx_carbon_flux_timestamp ON carbon_flux_data(timestamp DESC);

-- ============================================
-- Land Use Classification
-- ============================================

CREATE TABLE IF NOT EXISTS land_use_classification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    satellite_imagery_id VARCHAR(100) NOT NULL,
    region_id VARCHAR(100) NOT NULL,
    classification_type VARCHAR(50) NOT NULL, -- forest, agriculture, urban, wetland, water, grassland, barren
    coverage_percentage DECIMAL(5, 2) NOT NULL,
    change_detected BOOLEAN DEFAULT FALSE,
    change_type VARCHAR(50),
    change_date DATE,
    confidence_score DECIMAL(4, 3) DEFAULT 0.95,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_land_use_region ON land_use_classification(region_id);
CREATE INDEX IF NOT EXISTS idx_land_use_change ON land_use_classification(change_detected, change_type);

-- ============================================
-- Deforestation Alerts
-- ============================================

CREATE TABLE IF NOT EXISTS deforestation_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id VARCHAR(100) NOT NULL,
    alert_type VARCHAR(50) NOT NULL, -- clear_cut, selective_logging, fire, disease
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low
    detection_date TIMESTAMPTZ DEFAULT NOW(),
    estimated_area_hectares DECIMAL(12, 2) NOT NULL,
    location TEXT NOT NULL,
    satellite_source VARCHAR(50) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending',
    confirmed BOOLEAN DEFAULT FALSE,
    response_actions TEXT[],
    acknowledged_by VARCHAR(100),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deforestation_region ON deforestation_alerts(region_id);
CREATE INDEX IF NOT EXISTS idx_deforestation_status ON deforestation_alerts(verification_status, severity);
CREATE INDEX IF NOT EXISTS idx_deforestation_date ON deforestation_alerts(detection_date DESC);

-- ============================================
-- Soil Stations
-- ============================================

CREATE TABLE IF NOT EXISTS soil_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    location TEXT NOT NULL,
    coordinates GEOMETRY(POINT, 4326),
    installation_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    last_calibration TIMESTAMPTZ,
    sensors TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Soil Sensor Readings
-- ============================================

CREATE TABLE IF NOT EXISTS soil_sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id VARCHAR(100) NOT NULL,
    station_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Moisture data
    moisture_content DECIMAL(5, 2), -- percentage
    moisture_depth_cm DECIMAL(6, 2) DEFAULT 15,
    
    -- Nutrient levels
    nitrogen_ppm DECIMAL(8, 2),
    phosphorus_ppm DECIMAL(8, 2),
    potassium_ppm DECIMAL(8, 2),
    ph_level DECIMAL(4, 2),
    organic_matter_percentage DECIMAL(5, 2),
    
    -- Microbial activity
    microbial_biomass_c DECIMAL(10, 2), -- µg C/g soil
    respiration_rate DECIMAL(8, 2), -- mg CO2/kg soil/day
    enzyme_activity DECIMAL(8, 2), -- relative units
    
    -- Environmental conditions
    soil_temperature DECIMAL(5, 2), -- celsius
    bulk_density DECIMAL(6, 3), -- g/cm³
    cation_exchange_capacity DECIMAL(8, 2), -- cmolc/kg
    
    quality_score DECIMAL(5, 2) DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_soil_station ON soil_sensor_readings(station_id);
CREATE INDEX IF NOT EXISTS idx_soil_timestamp ON soil_sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_soil_quality ON soil_sensor_readings(quality_score);

-- ============================================
-- Biodiversity Records
-- ============================================

CREATE TABLE IF NOT EXISTS biodiversity_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    monitoring_type VARCHAR(50) NOT NULL, -- acoustic, camera_trap, visual_census, eDNA
    station_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    species_detected JSONB NOT NULL DEFAULT '[]',
    species_count INTEGER NOT NULL DEFAULT 0,
    diversity_index DECIMAL(5, 3), -- Shannon index
    richness_estimate INTEGER,
    community_composition JSONB DEFAULT '{}',
    biomass_estimate DECIMAL(10, 2), -- kg/ha
    identification_confidence DECIMAL(4, 3) DEFAULT 0.85,
    audio_file_url TEXT,
    image_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bio_station ON biodiversity_records(station_id);
CREATE INDEX IF NOT EXISTS idx_bio_timestamp ON biodiversity_records(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_bio_type ON biodiversity_records(monitoring_type);

-- ============================================
-- Acoustic Monitoring
-- ============================================

CREATE TABLE IF NOT EXISTS acoustic_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id VARCHAR(100) NOT NULL,
    recording_start TIMESTAMPTZ NOT NULL,
    recording_end TIMESTAMPTZ NOT NULL,
    duration_seconds INTEGER,
    sampling_rate INTEGER DEFAULT 44100,
    acoustic_biodiversity_index DECIMAL(5, 3),
    species_detected_count INTEGER DEFAULT 0,
    vocal_activity_index DECIMAL(5, 3),
    noise_level_db DECIMAL(6, 2),
    analysis_results JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acoustic_station ON acoustic_monitoring(station_id);

-- ============================================
-- Camera Trap Data
-- ============================================

CREATE TABLE IF NOT EXISTS camera_trap_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) NOT NULL,
    deployment_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT NOT NULL,
    video_url TEXT,
    species_detections JSONB NOT NULL DEFAULT '[]',
    animal_count INTEGER DEFAULT 0,
    activity_pattern VARCHAR(20), -- diurnal, nocturnal, crepuscular, cathemeral
    behavior_observed TEXT,
    environmental_conditions TEXT,
    trigger_type VARCHAR(20) DEFAULT 'motion', -- motion, timer, PIR
    battery_level DECIMAL(5, 2) DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_camera_device ON camera_trap_data(device_id);
CREATE INDEX IF NOT EXISTS idx_camera_deployment ON camera_trap_data(deployment_id);
CREATE INDEX IF NOT EXISTS idx_camera_timestamp ON camera_trap_data(timestamp DESC);

-- ============================================
-- Ecosystem Health Index
-- ============================================

CREATE TABLE IF NOT EXISTS ecosystem_health_index (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    overall_score DECIMAL(5, 2) NOT NULL, -- 0-100
    carbon_health_score DECIMAL(5, 2),
    biodiversity_score DECIMAL(5, 2),
    soil_health_score DECIMAL(5, 2),
    water_quality_score DECIMAL(5, 2),
    resilience_score DECIMAL(5, 2),
    connectivity_score DECIMAL(5, 2),
    stressors JSONB DEFAULT '[]',
    recommendations TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eco_health_region ON ecosystem_health_index(region_id);
CREATE INDEX IF NOT EXISTS idx_eco_health_timestamp ON ecosystem_health_index(timestamp DESC);

-- ============================================
-- Environmental Alerts
-- ============================================

CREATE TABLE IF NOT EXISTS environmental_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL, -- carbon, biodiversity, soil, deforestation, fire, weather
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    region_id VARCHAR(100),
    affected_metrics TEXT[],
    threshold_exceeded DECIMAL(10, 4),
    current_value DECIMAL(10, 4),
    threshold_value DECIMAL(10, 4),
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(100),
    acknowledged_at TIMESTAMPTZ,
    resolution_status VARCHAR(20) DEFAULT 'open', -- open, in_review, resolved
    resolved_notes TEXT,
    resolved_by VARCHAR(100),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_category ON environmental_alerts(category, severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON environmental_alerts(resolution_status);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered ON environmental_alerts(triggered_at DESC);

-- ============================================
-- Data Validation Records
-- ============================================

CREATE TABLE IF NOT EXISTS data_validation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_source_id VARCHAR(100) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    validation_method VARCHAR(50) NOT NULL,
    validation_result VARCHAR(20) NOT NULL, -- passed, failed, warning, pending
    validation_score DECIMAL(4, 3),
    discrepancies JSONB DEFAULT '{}',
    cross_reference_sources TEXT[],
    human_review_required BOOLEAN DEFAULT FALSE,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_validation_source ON data_validation_records(data_source_id, data_type);
CREATE INDEX IF NOT EXISTS idx_validation_result ON data_validation_records(validation_result);

-- ============================================
-- Predictive Model Outputs
-- ============================================

CREATE TABLE IF NOT EXISTS predictive_model_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_type VARCHAR(50) NOT NULL, -- carbon_trajectory, biodiversity_trend, deforestation_risk, soil_degradation
    region_id VARCHAR(100) NOT NULL,
    prediction_period_start TIMESTAMPTZ NOT NULL,
    prediction_period_end TIMESTAMPTZ NOT NULL,
    prediction_value DECIMAL(12, 4) NOT NULL,
    confidence_interval JSONB NOT NULL,
    probability_distribution JSONB DEFAULT '{}',
    contributing_factors JSONB DEFAULT '[]',
    model_version VARCHAR(20) DEFAULT '1.0.0',
    trained_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prediction_model ON predictive_model_outputs(model_type, region_id);
CREATE INDEX IF NOT EXISTS idx_prediction_period ON predictive_model_outputs(prediction_period_start, prediction_period_end);

-- ============================================
-- Compliance Reports
-- ============================================

CREATE TABLE IF NOT EXISTS compliance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(100) UNIQUE NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- verification, regulatory, scientific
    region_id VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    report_data JSONB NOT NULL,
    generated_by VARCHAR(100),
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_region ON compliance_reports(region_id);
CREATE INDEX IF NOT EXISTS idx_compliance_type ON compliance_reports(report_type);

-- ============================================
-- Data Exports
-- ============================================

CREATE TABLE IF NOT EXISTS data_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    export_id VARCHAR(100) UNIQUE NOT NULL,
    region_id VARCHAR(100) NOT NULL,
    data_types TEXT[] NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    format VARCHAR(20) NOT NULL,
    sharing_agreement VARCHAR(100),
    exported_by VARCHAR(100),
    exported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exports_region ON data_exports(region_id);

-- ============================================
-- Data Sharing Agreements
-- ============================================

CREATE TABLE IF NOT EXISTS data_sharing_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id VARCHAR(100) UNIQUE NOT NULL,
    recipient_organization VARCHAR(200) NOT NULL,
    recipient_contact VARCHAR(200),
    data_types_included TEXT[] NOT NULL,
    regions_included TEXT[],
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_terms TEXT NOT NULL,
    data_format VARCHAR(20) DEFAULT 'csv',
    access_level VARCHAR(20) DEFAULT 'read_only',
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, expired, revoked
    approved_by VARCHAR(100),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agreements_status ON data_sharing_agreements(status);

-- ============================================
-- Trigger Functions
-- ============================================

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Views for Common Queries
-- ============================================

-- View: Carbon Flux Summary by Region
CREATE OR REPLACE VIEW v_carbon_flux_summary AS
SELECT 
    region_id,
    COUNT(*) as measurement_count,
    AVG(net_ecosystem_exchange) as avg_nee,
    AVG(carbon_sequestration_rate) as avg_sequestration,
    SUM(CASE WHEN net_ecosystem_exchange < 0 THEN 1 ELSE 0 END) as carbon_sink_count,
    SUM(CASE WHEN net_ecosystem_exchange > 0 THEN 1 ELSE 0 END) as carbon_source_count,
    MIN(timestamp) as first_measurement,
    MAX(timestamp) as last_measurement
FROM carbon_flux_data
WHERE timestamp >= NOW() - INTERVAL '1 year'
GROUP BY region_id;

-- View: Species Detection Summary
CREATE OR REPLACE VIEW v_species_summary AS
SELECT 
    (species_detected->>'scientific_name') as scientific_name,
    (species_detected->>'common_name') as common_name,
    (species_detected->>'conservation_status') as conservation_status,
    COUNT(*) as detection_count,
    AVG((species_detected->>'confidence')::decimal) as avg_confidence
FROM biodiversity_records
CROSS JOIN jsonb_array_elements(species_detected) as species
GROUP BY 
    (species_detected->>'scientific_name'),
    (species_detected->>'common_name'),
    (species_detected->>'conservation_status');

-- View: Active Alerts Summary
CREATE OR REPLACE VIEW v_active_alerts_summary AS
SELECT 
    category,
    severity,
    COUNT(*) as alert_count
FROM environmental_alerts
WHERE resolution_status != 'resolved'
GROUP BY category, severity;

-- ============================================
-- Grant Permissions (adjust as needed)
-- ============================================

-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO admin_role;

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE carbon_flux_data IS 'Stores carbon flux measurements from satellite imagery analysis';
COMMENT ON TABLE land_use_classification IS 'Land use classification data from satellite imagery';
COMMENT ON TABLE deforestation_alerts IS 'Automated deforestation detection alerts';
COMMENT ON TABLE soil_sensor_readings IS 'Ground-based soil sensor data including moisture, nutrients, and microbial activity';
COMMENT ON TABLE biodiversity_records IS 'Biodiversity monitoring data from various detection methods';
COMMENT ON TABLE acoustic_monitoring IS 'Acoustic sensor data for species detection';
COMMENT ON TABLE camera_trap_data IS 'Camera trap images and detected species';
COMMENT ON TABLE ecosystem_health_index IS 'Composite ecosystem health scores and metrics';
COMMENT ON TABLE environmental_alerts IS 'Environmental alerts and threshold violations';
COMMENT ON TABLE data_validation_records IS 'Multi-source data validation results';
COMMENT ON TABLE predictive_model_outputs IS 'ML model predictions for environmental trajectories';
COMMENT ON TABLE compliance_reports IS 'Generated compliance and verification reports';
COMMENT ON TABLE data_exports IS 'Data export logs for research sharing';
COMMENT ON TABLE data_sharing_agreements IS 'Agreements for data sharing with external organizations';
