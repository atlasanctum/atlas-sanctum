-- Atlas Sanctum: Anti-Manipulation Engine
-- Database Migration: Core Detection and Investigation Tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== Entities ====================
-- Core actors in the system (vendors, persons, accounts, devices, etc.)
CREATE TABLE entities (
    id VARCHAR(50) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN (
        'vendor', 'person', 'beneficiary', 'employee', 'director',
        'company', 'shell_company', 'account', 'device', 'project',
        'contract', 'location', 'approval', 'wallet', 'report'
    )),
    external_id VARCHAR(255),
    name VARCHAR(500) NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}',
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    watch_status VARCHAR(20) DEFAULT 'normal' CHECK (watch_status IN ('normal', 'watchlisted', 'flagged', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_risk ON entities(risk_score DESC);
CREATE INDEX idx_entities_watch ON entities(watch_status);
CREATE INDEX idx_entities_external ON entities(external_id);

-- ==================== Entity Links ====================
-- Relationships between entities (graph edges)
CREATE TABLE entity_links (
    id SERIAL PRIMARY KEY,
    from_entity_id VARCHAR(50) NOT NULL REFERENCES entities(id),
    to_entity_id VARCHAR(50) NOT NULL REFERENCES entities(id),
    link_type VARCHAR(50) NOT NULL CHECK (link_type IN (
        'owns', 'approved', 'paid', 'shares_device', 'shares_address',
        'shares_phone', 'shares_email', 'shares_bank_account',
        'managed_by', 'submitted', 'verified_by', 'transferred_to',
        'co_appears_with', 'director_of', 'beneficiary_of'
    )),
    metadata JSONB DEFAULT '{}',
    confidence DECIMAL(5, 4) DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_entity_id, to_entity_id, link_type)
);

CREATE INDEX idx_entity_links_from ON entity_links(from_entity_id);
CREATE INDEX idx_entity_links_to ON entity_links(to_entity_id);
CREATE INDEX idx_entity_links_type ON entity_links(link_type);

-- ==================== Events ====================
-- Operational events from various systems
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    source_system VARCHAR(100) NOT NULL,
    entity_id VARCHAR(50) REFERENCES entities(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(20, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    metadata JSONB NOT NULL DEFAULT '{}',
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_entity ON events(entity_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_processed ON events(processed);

-- ==================== Detection Rules ====================
-- Configurable rules for known manipulation patterns
CREATE TABLE detection_rules (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN (
        'threshold', 'sequence', 'pattern', 'policy', 'frequency'
    )),
    manipulation_class VARCHAR(50) NOT NULL CHECK (manipulation_class IN (
        'transaction', 'identity', 'governance', 'information', 'ecosystem'
    )),
    condition JSONB NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    weight DECIMAL(5, 4) DEFAULT 0.25,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rules_type ON detection_rules(rule_type);
CREATE INDEX idx_rules_class ON detection_rules(manipulation_class);
CREATE INDEX idx_rules_enabled ON detection_rules(enabled);

-- ==================== Alerts ====================
-- Detection signals from various engines
CREATE TABLE alerts (
    id VARCHAR(50) PRIMARY KEY,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    entity_id VARCHAR(50) NOT NULL REFERENCES entities(id),
    signal_sources JSONB NOT NULL DEFAULT '[]',
    explanation JSONB NOT NULL DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_entity ON alerts(entity_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_created ON alerts(created_at);

-- ==================== Cases ====================
-- Investigation cases promoted from alerts
CREATE TABLE cases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    entity_ids JSONB NOT NULL DEFAULT '[]',
    alert_ids JSONB NOT NULL DEFAULT '[]',
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    confidence DECIMAL(5, 4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    risk_factors JSONB NOT NULL DEFAULT '[]',
    recommended_action VARCHAR(100),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'action_required', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    owner VARCHAR(255),
    evidence_bundle_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_priority ON cases(priority);
CREATE INDEX idx_cases_risk ON cases(risk_score DESC);
CREATE INDEX idx_cases_owner ON cases(owner);

-- ==================== Interventions ====================
-- Actions taken in response to cases
CREATE TABLE interventions (
    id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL REFERENCES cases(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'observe', 'soft_flag', 'require_verification', 'pause_disbursement',
        'lock_procurement', 'quarantine_report', 'restrict_access',
        'open_investigation', 'notify_compliance', 'generate_evidence',
        'smart_contract_deny', 'vendor_blocklist', 'wallet_freeze', 'decision_reversal'
    )),
    action_level INTEGER NOT NULL CHECK (action_level >= 0 AND action_level <= 5),
    reason TEXT NOT NULL,
    executed_by VARCHAR(255),
    executed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'overturned', 'failed')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interventions_case ON interventions(case_id);
CREATE INDEX idx_interventions_status ON interventions(status);
CREATE INDEX idx_interventions_level ON interventions(action_level);

-- ==================== Anomaly Scores ====================
-- Statistical anomaly detection results
CREATE TABLE anomaly_scores (
    id SERIAL PRIMARY KEY,
    entity_id VARCHAR(50) NOT NULL REFERENCES entities(id),
    anomaly_type VARCHAR(50) NOT NULL CHECK (anomaly_type IN (
        'peer_deviation', 'temporal_anomaly', 'behavioral_drift',
        'seasonal_outlier', 'change_point', 'frequency_anomaly'
    )),
    score DECIMAL(5, 4) NOT NULL CHECK (score >= 0 AND score <= 1),
    explanation TEXT,
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anomaly_entity ON anomaly_scores(entity_id);
CREATE INDEX idx_anomaly_type ON anomaly_scores(anomaly_type);
CREATE INDEX idx_anomaly_score ON anomaly_scores(score DESC);

-- ==================== Graph Risk Scores ====================
-- Graph-based collusion detection results
CREATE TABLE graph_risk_scores (
    id SERIAL PRIMARY KEY,
    entity_id VARCHAR(50) NOT NULL REFERENCES entities(id),
    risk_type VARCHAR(50) NOT NULL CHECK (risk_type IN (
        'collusion_cluster', 'circular_flow', 'hidden_hub',
        'nepotism_structure', 'procurement_ring', 'approval_loop'
    )),
    score DECIMAL(5, 4) NOT NULL CHECK (score >= 0 AND score <= 1),
    connected_entities JSONB DEFAULT '[]',
    path_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_graph_risk_entity ON graph_risk_scores(entity_id);
CREATE INDEX idx_graph_risk_type ON graph_risk_scores(risk_type);
CREATE INDEX idx_graph_risk_score ON graph_risk_scores(score DESC);

-- ==================== Narrative Analysis ====================
-- Narrative consistency analysis results
CREATE TABLE narrative_analysis (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(100) NOT NULL,
    entity_id VARCHAR(50) REFERENCES entities(id),
    consistency_score DECIMAL(5, 4) NOT NULL CHECK (consistency_score >= 0 AND consistency_score <= 1),
    contradictions JSONB DEFAULT '[]',
    omissions JSONB DEFAULT '[]',
    claim_evidence_mismatches JSONB DEFAULT '[]',
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_narrative_document ON narrative_analysis(document_id);
CREATE INDEX idx_narrative_entity ON narrative_analysis(entity_id);
CREATE INDEX idx_narrative_score ON narrative_analysis(consistency_score);

-- ==================== Audit Trail ====================
-- Immutable audit log for all system actions
CREATE TABLE manipulation_audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(255),
    details JSONB NOT NULL DEFAULT '{}',
    evidence_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON manipulation_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_action ON manipulation_audit_log(action);
CREATE INDEX idx_audit_created ON manipulation_audit_log(created_at);

-- ==================== Seed Detection Rules ====================

-- Transaction Manipulation Rules
INSERT INTO detection_rules (id, name, description, rule_type, manipulation_class, condition, severity, weight) VALUES
('rule_001', 'Invoice Splitting', 'Multiple invoices just below review threshold', 'threshold', 'transaction', 
 '{"field": "invoice_amount", "operator": "below_threshold", "threshold": 10000, "count": 3, "window_days": 7}', 'high', 0.28),
 
('rule_002', 'Circular Payments', 'Payments forming circular flow between entities', 'pattern', 'transaction',
 '{"pattern": "circular_payment", "min_cycle_length": 3, "min_amount": 5000}', 'critical', 0.35),
 
('rule_003', 'Ghost Vendor', 'Vendor with no verifiable business presence', 'policy', 'identity',
 '{"checks": ["business_registration", "physical_address", "tax_id", "bank_account"]}', 'high', 0.30);

-- Identity Manipulation Rules
INSERT INTO detection_rules (id, name, description, rule_type, manipulation_class, condition, severity, weight) VALUES
('rule_004', 'Shared Bank Account', 'One bank account linked to multiple beneficiaries', 'threshold', 'identity',
 '{"field": "bank_account", "linked_beneficiaries": 5, "window_days": 30}', 'high', 0.32),
 
('rule_005', 'Synthetic Identity', 'Identity with inconsistent data points', 'pattern', 'identity',
 '{"checks": ["id_format", "age_consistency", "address_validity", "phone_validity"]}', 'critical', 0.38);

-- Governance Manipulation Rules
INSERT INTO detection_rules (id, name, description, rule_type, manipulation_class, condition, severity, weight) VALUES
('rule_006', 'Approval Clustering', 'Same approver for high concentration of awards', 'threshold', 'governance',
 '{"field": "approver_id", "concentration_threshold": 0.8, "min_awards": 10}', 'high', 0.30),
 
('rule_007', 'Last-Minute Changes', 'Approval changed within 10 minutes of disbursement', 'sequence', 'governance',
 '{"sequence": ["approval_change", "disbursement"], "max_gap_minutes": 10}', 'critical', 0.35);

-- Information Manipulation Rules
INSERT INTO detection_rules (id, name, description, rule_type, manipulation_class, condition, severity, weight) VALUES
('rule_008', 'Metric Inflation', 'Impact metrics jump without operational evidence', 'threshold', 'information',
 '{"field": "impact_metric", "increase_threshold": 2.0, "evidence_gap_days": 30}', 'high', 0.25),
 
('rule_009', 'Sensor Contradiction', 'Sensor report contradicts field claims', 'pattern', 'information',
 '{"comparison": "sensor_vs_report", "deviation_threshold": 0.4}', 'critical', 0.32);

-- Ecosystem Manipulation Rules
INSERT INTO detection_rules (id, name, description, rule_type, manipulation_class, condition, severity, weight) VALUES
('rule_010', 'Vendor Collusion', 'Multiple vendors with shared ownership/addresses', 'pattern', 'ecosystem',
 '{"checks": ["shared_director", "shared_address", "shared_phone", "similar_pricing"]}', 'critical', 0.40);

-- ==================== Seed Demo Entities ====================

-- Demo vendor with suspicious patterns
INSERT INTO entities (id, entity_type, external_id, name, attributes, risk_score, watch_status) VALUES
('vendor_001', 'vendor', 'ERP-V-882', 'Alpha Supply Ltd', 
 '{"address": "Nairobi", "phone": "+254700123456", "bank_account_hash": "abc123", "registration_date": "2024-01-15"}',
 74, 'watchlisted');

-- Demo person (director)
INSERT INTO entities (id, entity_type, external_id, name, attributes, risk_score, watch_status) VALUES
('person_001', 'person', 'DIR-001', 'John Kamau',
 '{"role": "director", "phone": "+254700123456", "id_number": "12345678"}',
 45, 'normal');

-- Demo linked vendor
INSERT INTO entities (id, entity_type, external_id, name, attributes, risk_score, watch_status) VALUES
('vendor_002', 'vendor', 'ERP-V-883', 'Beta Services Ltd',
 '{"address": "Nairobi", "phone": "+254700654321", "bank_account_hash": "def456", "registration_date": "2024-02-20"}',
 68, 'watchlisted');

-- Demo bank account
INSERT INTO entities (id, entity_type, external_id, name, attributes, risk_score, watch_status) VALUES
('account_001', 'account', 'BANK-001', 'Business Account 1234',
 '{"bank": "Equity Bank", "account_type": "business", "opened_date": "2023-06-10"}',
 82, 'flagged');

-- Demo links
INSERT INTO entity_links (from_entity_id, to_entity_id, link_type, metadata, confidence) VALUES
('vendor_001', 'person_001', 'director_of', '{"role": "managing_director"}', 1.0),
('vendor_002', 'person_001', 'director_of', '{"role": "director"}', 1.0),
('vendor_001', 'account_001', 'paid_to', '{"primary_account": true}', 1.0),
('vendor_002', 'account_001', 'paid_to', '{"primary_account": true}', 1.0);

-- Demo events
INSERT INTO events (id, event_type, source_system, entity_id, timestamp, amount, currency, metadata) VALUES
('event_001', 'invoice_submitted', 'procurement_erp', 'vendor_001', '2026-03-20T10:30:00Z', 9800, 'USD', '{"invoice_number": "INV-8832", "submitted_by": "user_44"}'),
('event_002', 'invoice_submitted', 'procurement_erp', 'vendor_001', '2026-03-21T14:15:00Z', 9500, 'USD', '{"invoice_number": "INV-8833", "submitted_by": "user_44"}'),
('event_003', 'invoice_submitted', 'procurement_erp', 'vendor_001', '2026-03-22T09:45:00Z', 9900, 'USD', '{"invoice_number": "INV-8834", "submitted_by": "user_44"}'),
('event_004', 'payment_approved', 'finance_system', 'vendor_001', '2026-03-22T11:00:00Z', 9800, 'USD', '{"approver_id": "user_18", "district": "Nakuru"}'),
('event_005', 'payment_approved', 'finance_system', 'vendor_002', '2026-03-22T11:05:00Z', 9500, 'USD', '{"approver_id": "user_18", "district": "Nakuru"}');

-- Demo alert
INSERT INTO alerts (id, severity, entity_id, signal_sources, explanation, status) VALUES
('alert_001', 'high', 'vendor_001', 
 '["rule_engine", "graph_engine", "anomaly_engine"]',
 '["3 invoices split below approval threshold", "shared phone number with another vendor", "pricing 42% above peer median"]',
 'open');

-- Demo case
INSERT INTO cases (id, title, description, entity_ids, alert_ids, risk_score, confidence, risk_factors, recommended_action, status, priority) VALUES
('case_001', 'Suspicious Procurement Ring - Alpha Supply Ltd',
 'Multiple indicators suggest coordinated manipulation: invoice splitting, shared ownership with competitor, abnormal award concentration.',
 '["vendor_001", "vendor_002", "person_001", "account_001"]',
 '["alert_001"]',
 87, 0.91,
 '["pricing anomaly", "shared director with competitor", "abnormal award concentration", "linked approval cluster"]',
 'freeze_high_value_approvals_and_open_case',
 'investigating',
 'high');
