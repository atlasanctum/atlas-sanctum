-- Migration: agent_runs and observations tables
-- Closes STRIDE threat: Repudiation (agent_runs)
-- Enables: ClimateAgent anomaly detection, carbon flux queries
-- Date: 2026-07-03

-- ─── Agent Runs ───────────────────────────────────────────────────────────────
-- Append-only audit table for all AI agent executions.
-- No UPDATE or DELETE is permitted on this table (enforced by RLS policy below).

CREATE TABLE IF NOT EXISTS agent_runs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        TEXT        NOT NULL,
  agent_type      TEXT        NOT NULL,
  task_type       TEXT        NOT NULL,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  correlation_id  TEXT        NOT NULL,
  input           JSONB       NOT NULL DEFAULT '{}',
  output          JSONB,
  tool_calls      JSONB       NOT NULL DEFAULT '[]',
  tokens_used     INTEGER,
  latency_ms      INTEGER,
  status          TEXT        NOT NULL DEFAULT 'running'
                              CHECK (status IN ('running', 'completed', 'failed', 'awaiting_approval')),
  error           TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_agent_runs_user_id      ON agent_runs (user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_type   ON agent_runs (agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status       ON agent_runs (status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at   ON agent_runs (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_correlation  ON agent_runs (correlation_id);

-- RLS: users can read their own runs; service role can insert; nobody can update or delete
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_runs_select_own" ON agent_runs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "agent_runs_insert_service" ON agent_runs
  FOR INSERT WITH CHECK (true); -- service role bypasses RLS

-- Explicitly deny UPDATE and DELETE for all roles (append-only)
CREATE POLICY "agent_runs_no_update" ON agent_runs
  FOR UPDATE USING (false);

CREATE POLICY "agent_runs_no_delete" ON agent_runs
  FOR DELETE USING (false);

-- ─── Observations ─────────────────────────────────────────────────────────────
-- Climate and environmental observations ingested from external sources.
-- Requires PostGIS and (optionally) TimescaleDB extensions.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS observations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id   UUID        NOT NULL,
  indicator   TEXT        NOT NULL,
  value       NUMERIC     NOT NULL,
  unit        TEXT        NOT NULL,
  location    GEOGRAPHY(POINT, 4326),
  observed_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata    JSONB       NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_observations_indicator   ON observations (indicator);
CREATE INDEX IF NOT EXISTS idx_observations_observed_at ON observations (observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_observations_location    ON observations USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_observations_source      ON observations (source_id);
-- Composite index for the ClimateAgent's spatial+temporal queries
CREATE INDEX IF NOT EXISTS idx_observations_spatial_temporal
  ON observations USING GIST (location)
  WHERE observed_at > NOW() - INTERVAL '90 days';

-- RLS: observations are public read, service-role write
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "observations_select_public" ON observations
  FOR SELECT USING (true);

CREATE POLICY "observations_insert_service" ON observations
  FOR INSERT WITH CHECK (true);

-- ─── Climate Alerts ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS climate_alerts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type       TEXT        NOT NULL
                               CHECK (alert_type IN ('wildfire_risk','flood_risk','drought','deforestation','pollution','biodiversity_loss')),
  severity         TEXT        NOT NULL
                               CHECK (severity IN ('low','medium','high','critical')),
  description      TEXT        NOT NULL,
  location         GEOGRAPHY(POINT, 4326),
  affected_area_km2 NUMERIC,
  status           TEXT        NOT NULL DEFAULT 'active'
                               CHECK (status IN ('active','resolved','false_positive')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_climate_alerts_status   ON climate_alerts (status);
CREATE INDEX IF NOT EXISTS idx_climate_alerts_severity ON climate_alerts (severity);
CREATE INDEX IF NOT EXISTS idx_climate_alerts_location ON climate_alerts USING GIST (location);

ALTER TABLE climate_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "climate_alerts_select_public" ON climate_alerts
  FOR SELECT USING (true);

CREATE POLICY "climate_alerts_insert_service" ON climate_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "climate_alerts_update_service" ON climate_alerts
  FOR UPDATE USING (true);
