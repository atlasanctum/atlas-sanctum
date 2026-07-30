-- Atlas Sanctum — Integration Layer Schema
-- Migration 004: Connector registry, event log, agent tasks, human overrides

-- ============================================================
-- Connector Registry
-- ============================================================

CREATE TABLE IF NOT EXISTS connector_registry (
  id TEXT PRIMARY KEY,                          -- e.g. "ai-connector"
  domain TEXT NOT NULL,                         -- "ai" | "blockchain" | "fintech" | "iot" | "observability"
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline'
    CHECK (status IN ('healthy', 'degraded', 'offline')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  failover_connector_id TEXT REFERENCES connector_registry(id),
  last_health_check_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connector_audit_log (
  id BIGSERIAL PRIMARY KEY,
  connector_id TEXT NOT NULL REFERENCES connector_registry(id) ON DELETE CASCADE,
  operation TEXT NOT NULL,
  actor_id TEXT,
  trace_id TEXT,
  duration_ms INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  error_code TEXT,
  cost_units NUMERIC(12, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS connector_audit_connector_created_idx
  ON connector_audit_log(connector_id, created_at DESC);

CREATE INDEX IF NOT EXISTS connector_audit_trace_idx
  ON connector_audit_log(trace_id) WHERE trace_id IS NOT NULL;

-- ============================================================
-- Domain Event Log (event sourcing)
-- ============================================================

CREATE TABLE IF NOT EXISTS domain_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS domain_events_type_idx ON domain_events(type, created_at DESC);
CREATE INDEX IF NOT EXISTS domain_events_aggregate_idx ON domain_events(aggregate_type, aggregate_id, created_at DESC);

CREATE TABLE IF NOT EXISTS dead_letter_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  error_message TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_retry_at TIMESTAMPTZ
);

-- ============================================================
-- Agent Task Log
-- ============================================================

CREATE TABLE IF NOT EXISTS agent_tasks (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  instruction TEXT NOT NULL,
  context_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  priority SMALLINT NOT NULL DEFAULT 2 CHECK (priority IN (1, 2, 3)),
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'running', 'completed', 'failed', 'awaiting-human')),
  output_json JSONB,
  reasoning TEXT,
  requires_human_approval BOOLEAN NOT NULL DEFAULT FALSE,
  human_review_required BOOLEAN,
  human_review_reason TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS agent_tasks_status_idx ON agent_tasks(status, created_at DESC);
CREATE INDEX IF NOT EXISTS agent_tasks_role_idx ON agent_tasks(role, created_at DESC);

-- ============================================================
-- Human Override Queue
-- ============================================================

CREATE TABLE IF NOT EXISTS human_override_requests (
  id BIGSERIAL PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES agent_tasks(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  reason TEXT NOT NULL,
  proposed_action TEXT NOT NULL,
  context_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  decision TEXT CHECK (decision IN ('approve', 'reject')),
  decided_by TEXT REFERENCES users(id),
  decision_notes TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  decided_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS human_override_task_idx ON human_override_requests(task_id);
CREATE INDEX IF NOT EXISTS human_override_pending_idx
  ON human_override_requests(decision, expires_at)
  WHERE decision IS NULL;

-- ============================================================
-- Integration Cost Tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS integration_cost_log (
  id BIGSERIAL PRIMARY KEY,
  connector_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  provider TEXT,
  cost_usd NUMERIC(12, 6) NOT NULL,
  units_consumed NUMERIC(12, 4),
  unit_type TEXT,  -- "tokens" | "api_calls" | "bytes" | "transactions"
  organization_id TEXT REFERENCES organizations(id),
  trace_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cost_log_connector_created_idx ON integration_cost_log(connector_id, created_at DESC);
CREATE INDEX IF NOT EXISTS cost_log_org_created_idx ON integration_cost_log(organization_id, created_at DESC);
