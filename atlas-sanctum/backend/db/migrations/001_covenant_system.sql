-- Atlas Sanctum: Covenant Runtime System
-- Database Migration: Core Covenant Tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== Regions ====================
CREATE TABLE regions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    population_estimate BIGINT,
    vulnerability_index DECIMAL(5, 4) NOT NULL CHECK (vulnerability_index >= 0 AND vulnerability_index <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Risk Snapshots ====================
CREATE TABLE risk_snapshots (
    id VARCHAR(50) PRIMARY KEY,
    region_id VARCHAR(50) NOT NULL REFERENCES regions(id),
    rainfall_mm_24h DECIMAL(10, 2) NOT NULL,
    river_level_meters DECIMAL(10, 2),
    soil_saturation DECIMAL(5, 4),
    forecast_rain_mm_48h DECIMAL(10, 2),
    vulnerability_index DECIMAL(5, 4) NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    model_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_snapshots_region ON risk_snapshots(region_id);
CREATE INDEX idx_risk_snapshots_created ON risk_snapshots(created_at);

-- ==================== Reserve Accounts ====================
CREATE TABLE reserve_accounts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    asset_symbol VARCHAR(20) NOT NULL,
    current_balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
    committed_balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
    proof_status VARCHAR(20) NOT NULL DEFAULT 'unverified' CHECK (proof_status IN ('verified', 'stale', 'unverified')),
    last_checked_at TIMESTAMP WITH TIME ZONE,
    onchain_address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Covenants ====================
CREATE TABLE covenants (
    id VARCHAR(50) PRIMARY KEY,
    onchain_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    region_id VARCHAR(50) NOT NULL REFERENCES regions(id),
    trigger_type VARCHAR(50) NOT NULL DEFAULT 'flood_response',
    min_risk_score INTEGER NOT NULL CHECK (min_risk_score >= 0 AND min_risk_score <= 100),
    reserve_required_usd DECIMAL(20, 2) NOT NULL,
    payout_amount_usd DECIMAL(20, 2) NOT NULL,
    auto_execute BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'armed', 'triggered', 'executed', 'verified', 'failed')),
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_covenants_region ON covenants(region_id);
CREATE INDEX idx_covenants_status ON covenants(status);

-- ==================== Interventions ====================
CREATE TABLE interventions (
    id VARCHAR(50) PRIMARY KEY,
    covenant_id VARCHAR(50) NOT NULL REFERENCES covenants(id),
    region_id VARCHAR(50) NOT NULL REFERENCES regions(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('cash_release', 'supply_dispatch', 'hybrid')),
    amount_usd DECIMAL(20, 2) NOT NULL,
    tx_hash VARCHAR(255),
    execution_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (execution_status IN ('pending', 'submitted', 'confirmed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interventions_covenant ON interventions(covenant_id);
CREATE INDEX idx_interventions_region ON interventions(region_id);
CREATE INDEX idx_interventions_status ON interventions(execution_status);

-- ==================== Verification Evidence ====================
CREATE TABLE verification_evidence (
    id VARCHAR(50) PRIMARY KEY,
    intervention_id VARCHAR(50) NOT NULL REFERENCES interventions(id),
    verifier_wallet VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'json')),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evidence_intervention ON verification_evidence(intervention_id);
CREATE INDEX idx_evidence_verifier ON verification_evidence(verifier_wallet);

-- ==================== Impact Reports ====================
CREATE TABLE impact_reports (
    id VARCHAR(50) PRIMARY KEY,
    intervention_id VARCHAR(50) NOT NULL REFERENCES interventions(id),
    delivery_confirmed BOOLEAN NOT NULL DEFAULT false,
    households_reached INTEGER,
    supplies_delivered INTEGER,
    confidence_score DECIMAL(5, 4) NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    verified_at TIMESTAMP WITH TIME ZONE,
    onchain_verification_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_impact_intervention ON impact_reports(intervention_id);

-- ==================== Users (for wallet auth) ====================
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'steward' CHECK (role IN ('steward', 'funder', 'verifier')),
    nonce VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_wallet ON users(wallet_address);

-- ==================== Audit Log ====================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- ==================== Seed Data ====================

-- Insert demo region: Nairobi East Basin
INSERT INTO regions (id, name, country, lat, lng, population_estimate, vulnerability_index)
VALUES (
    'reg_nairobi_east',
    'Nairobi East Basin',
    'Kenya',
    -1.286,
    36.817,
    1250000,
    0.82
);

-- Insert demo reserve account
INSERT INTO reserve_accounts (id, name, asset_symbol, current_balance, committed_balance, proof_status, last_checked_at)
VALUES (
    'res_001',
    'Emergency Response Reserve',
    'USDC',
    25000.00,
    0.00,
    'verified',
    CURRENT_TIMESTAMP
);

-- Insert demo covenant
INSERT INTO covenants (id, title, description, region_id, trigger_type, min_risk_score, reserve_required_usd, payout_amount_usd, auto_execute, status)
VALUES (
    'cov_001',
    'Flood Response Covenant - Nairobi East',
    'Release emergency funds when flood risk exceeds threshold and reserves are verified.',
    'reg_nairobi_east',
    'flood_response',
    70,
    10000.00,
    5000.00,
    true,
    'armed'
);

-- Insert initial risk snapshot
INSERT INTO risk_snapshots (id, region_id, rainfall_mm_24h, river_level_meters, soil_saturation, forecast_rain_mm_48h, vulnerability_index, risk_score, severity, model_version)
VALUES (
    'risk_001',
    'reg_nairobi_east',
    88.00,
    4.2,
    0.75,
    120.00,
    0.82,
    78,
    'critical',
    '1.0.0'
);
