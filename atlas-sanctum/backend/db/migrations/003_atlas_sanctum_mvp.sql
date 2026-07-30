-- Atlas Sanctum MVP Database Schema
-- Postgres + PostGIS required

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- 8.1 Identity and org tables
-- ============================================================

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin','analyst','decision_maker','field_verifier','external_partner')),
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8.2 Geography
-- ============================================================

CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES regions(id),
  country_code TEXT NOT NULL,
  level TEXT NOT NULL,
  code TEXT,
  name TEXT NOT NULL,
  centroid GEOGRAPHY(POINT, 4326),
  boundary GEOMETRY(MULTIPOLYGON, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS regions_parent_idx ON regions(parent_id);
CREATE INDEX IF NOT EXISTS regions_boundary_gix ON regions USING GIST(boundary);

-- ============================================================
-- 8.3 Data ingestion
-- ============================================================

CREATE TABLE IF NOT EXISTS data_sources (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file_upload','api','manual','external_feed')),
  category TEXT NOT NULL,
  description TEXT,
  config_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'active',
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id TEXT PRIMARY KEY,
  data_source_id TEXT NOT NULL REFERENCES data_sources(id),
  status TEXT NOT NULL CHECK (status IN ('queued','running','completed','failed')),
  file_name TEXT,
  rows_received INTEGER DEFAULT 0,
  rows_valid INTEGER DEFAULT 0,
  rows_rejected INTEGER DEFAULT 0,
  quality_score NUMERIC(5,4),
  error_log JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8.4 Indicators and observations
-- ============================================================

CREATE TABLE IF NOT EXISTS indicators (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('economic','ecological','institutional','human','custom')),
  unit TEXT NOT NULL,
  aggregation_method TEXT NOT NULL,
  directionality TEXT NOT NULL CHECK (directionality IN ('higher_is_better','lower_is_better','neutral')),
  description TEXT,
  metadata_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observations (
  id BIGSERIAL PRIMARY KEY,
  indicator_id TEXT NOT NULL REFERENCES indicators(id),
  region_id TEXT NOT NULL REFERENCES regions(id),
  source_id TEXT REFERENCES data_sources(id),
  ingestion_job_id TEXT REFERENCES ingestion_jobs(id),
  observed_at DATE NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  confidence NUMERIC(5,4),
  metadata_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS observations_region_indicator_date_idx ON observations(region_id, indicator_id, observed_at DESC);

-- ============================================================
-- 8.5 Fragility engine
-- ============================================================

CREATE TABLE IF NOT EXISTS model_versions (
  id TEXT PRIMARY KEY,
  model_name TEXT NOT NULL,
  version TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('fragility','forecast','simulation','anomaly','custom')),
  status TEXT NOT NULL CHECK (status IN ('draft','approved','archived')),
  config_json JSONB NOT NULL,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fragility_runs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  model_version_id TEXT NOT NULL REFERENCES model_versions(id),
  status TEXT NOT NULL CHECK (status IN ('queued','running','completed','failed')),
  scope_json JSONB NOT NULL,
  started_by TEXT REFERENCES users(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fragility_scores (
  id BIGSERIAL PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES fragility_runs(id),
  region_id TEXT NOT NULL REFERENCES regions(id),
  score NUMERIC(5,4) NOT NULL,
  economic_score NUMERIC(5,4),
  ecological_score NUMERIC(5,4),
  institutional_score NUMERIC(5,4),
  human_score NUMERIC(5,4),
  risk_band TEXT NOT NULL CHECK (risk_band IN ('low','moderate','high','critical')),
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS fragility_scores_region_computed_idx ON fragility_scores(region_id, computed_at DESC);

CREATE TABLE IF NOT EXISTS fragility_drivers (
  id BIGSERIAL PRIMARY KEY,
  fragility_score_id BIGINT NOT NULL REFERENCES fragility_scores(id) ON DELETE CASCADE,
  indicator_id TEXT REFERENCES indicators(id),
  driver_label TEXT,
  impact NUMERIC(8,4) NOT NULL,
  direction TEXT CHECK (direction IN ('positive','negative','neutral'))
);

-- ============================================================
-- 8.6 Alerts
-- ============================================================

CREATE TABLE IF NOT EXISTS alert_rules (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  metric TEXT NOT NULL,
  operator TEXT NOT NULL,
  threshold NUMERIC NOT NULL,
  scope_json JSONB NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  alert_rule_id TEXT REFERENCES alert_rules(id),
  region_id TEXT REFERENCES regions(id),
  metric TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open','acknowledged','resolved')),
  message TEXT NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================================
-- 8.7 Scenario engine
-- ============================================================

CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  region_id TEXT NOT NULL REFERENCES regions(id),
  name TEXT NOT NULL,
  intervention_type TEXT NOT NULL,
  baseline_date DATE NOT NULL,
  budget_amount NUMERIC(18,2),
  currency TEXT,
  duration_months INTEGER,
  assumptions_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL CHECK (status IN ('draft','running','completed','approved','archived')),
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenario_runs (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  model_version_id TEXT REFERENCES model_versions(id),
  status TEXT NOT NULL CHECK (status IN ('queued','running','completed','failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenario_results (
  id BIGSERIAL PRIMARY KEY,
  scenario_run_id TEXT NOT NULL REFERENCES scenario_runs(id) ON DELETE CASCADE,
  metric_code TEXT NOT NULL,
  baseline_value NUMERIC,
  projected_value NUMERIC,
  delta_value NUMERIC,
  confidence NUMERIC(5,4),
  notes TEXT
);

-- ============================================================
-- 8.8 MRV projects
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  owner_org_id TEXT REFERENCES organizations(id),
  region_id TEXT REFERENCES regions(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft','active','under_review','verified','rejected','completed')),
  start_date DATE,
  end_date DATE,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_sites (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  geometry GEOMETRY(MULTIPOLYGON, 4326),
  centroid GEOGRAPHY(POINT, 4326),
  area_hectares NUMERIC(18,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_sites_geometry_gix ON project_sites USING GIST(geometry);

CREATE TABLE IF NOT EXISTS project_target_metrics (
  id BIGSERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  metric_code TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  unit TEXT
);

CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES project_sites(id) ON DELETE SET NULL,
  submitted_by TEXT REFERENCES users(id),
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('field_observation','photo','document','sensor_reading','satellite_analysis','audit_note')),
  captured_at TIMESTAMPTZ,
  notes TEXT,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending','reviewed','accepted','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_metrics (
  id BIGSERIAL PRIMARY KEY,
  evidence_id TEXT NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  metric_code TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT
);

CREATE TABLE IF NOT EXISTS evidence_files (
  id TEXT PRIMARY KEY,
  evidence_id TEXT NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_verifications (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reviewed_by TEXT REFERENCES users(id),
  verification_status TEXT NOT NULL CHECK (verification_status IN ('verified','rejected','partial')),
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8.9 Actions and audit
-- ============================================================

CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  region_id TEXT REFERENCES regions(id),
  related_scenario_id TEXT REFERENCES scenarios(id),
  related_project_id TEXT REFERENCES projects(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner_user_id TEXT REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('open','in_progress','completed','cancelled')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(id),
  actor_user_id TEXT REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  before_json JSONB,
  after_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs(entity_type, entity_id, created_at DESC);

-- ============================================================
-- 9. Derived views
-- ============================================================

-- Latest observation per region and indicator
CREATE OR REPLACE VIEW latest_region_indicator_values AS
SELECT DISTINCT ON (region_id, indicator_id)
  id,
  indicator_id,
  region_id,
  source_id,
  observed_at,
  value,
  unit,
  confidence,
  metadata_json,
  created_at
FROM observations
ORDER BY region_id, indicator_id, observed_at DESC;

-- Latest fragility score per region
CREATE OR REPLACE VIEW latest_fragility_scores AS
SELECT DISTINCT ON (region_id)
  id,
  run_id,
  region_id,
  score,
  economic_score,
  ecological_score,
  institutional_score,
  human_score,
  risk_band,
  computed_at
FROM fragility_scores
ORDER BY region_id, computed_at DESC;

-- Project progress summary
CREATE OR REPLACE VIEW project_progress_summary AS
SELECT
  p.id AS project_id,
  p.name AS project_name,
  p.status AS project_status,
  p.start_date,
  p.end_date,
  COUNT(DISTINCT e.id) AS evidence_count,
  COUNT(DISTINCT CASE WHEN e.verification_status = 'accepted' THEN e.id END) AS accepted_evidence_count,
  COUNT(DISTINCT pv.id) AS verification_count,
  MAX(pv.created_at) AS last_verification_at
FROM projects p
LEFT JOIN evidence e ON e.project_id = p.id
LEFT JOIN project_verifications pv ON pv.project_id = p.id
GROUP BY p.id, p.name, p.status, p.start_date, p.end_date;

-- Dashboard hotspots
CREATE OR REPLACE VIEW dashboard_hotspots AS
SELECT
  r.id AS region_id,
  r.name AS region_name,
  r.level AS region_level,
  r.country_code,
  lfs.score AS fragility_score,
  lfs.risk_band,
  lfs.economic_score,
  lfs.ecological_score,
  lfs.institutional_score,
  lfs.human_score,
  lfs.computed_at,
  (
    SELECT fd.driver_label
    FROM fragility_drivers fd
    JOIN fragility_scores fs ON fs.id = fd.fragility_score_id
    WHERE fs.region_id = r.id
    ORDER BY ABS(fd.impact) DESC
    LIMIT 1
  ) AS top_driver
FROM regions r
LEFT JOIN latest_fragility_scores lfs ON lfs.region_id = r.id
WHERE lfs.score IS NOT NULL
ORDER BY lfs.score DESC;

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS users_organization_idx ON users(organization_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS data_sources_organization_idx ON data_sources(organization_id);
CREATE INDEX IF NOT EXISTS ingestion_jobs_data_source_idx ON ingestion_jobs(data_source_id);
CREATE INDEX IF NOT EXISTS ingestion_jobs_status_idx ON ingestion_jobs(status);
CREATE INDEX IF NOT EXISTS fragility_runs_organization_idx ON fragility_runs(organization_id);
CREATE INDEX IF NOT EXISTS fragility_runs_status_idx ON fragility_runs(status);
CREATE INDEX IF NOT EXISTS scenarios_organization_idx ON scenarios(organization_id);
CREATE INDEX IF NOT EXISTS scenarios_region_idx ON scenarios(region_id);
CREATE INDEX IF NOT EXISTS scenarios_status_idx ON scenarios(status);
CREATE INDEX IF NOT EXISTS projects_organization_idx ON projects(organization_id);
CREATE INDEX IF NOT EXISTS projects_region_idx ON projects(region_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS evidence_project_idx ON evidence(project_id);
CREATE INDEX IF NOT EXISTS evidence_verification_status_idx ON evidence(verification_status);
CREATE INDEX IF NOT EXISTS actions_organization_idx ON actions(organization_id);
CREATE INDEX IF NOT EXISTS actions_status_idx ON actions(status);
CREATE INDEX IF NOT EXISTS alerts_organization_idx ON alerts(organization_id);
CREATE INDEX IF NOT EXISTS alerts_status_idx ON alerts(status);
