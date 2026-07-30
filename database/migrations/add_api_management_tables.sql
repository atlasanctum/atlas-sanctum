-- API Management Tables Migration
-- This migration adds tables for API key management, usage tracking, and rate limiting

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(10) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  scopes JSONB NOT NULL DEFAULT '["read"]'::jsonb,
  rate_limit INTEGER NOT NULL DEFAULT 1000,
  rate_limit_window INTEGER NOT NULL DEFAULT 60,
  allowed_ips JSONB NOT NULL DEFAULT '[]'::jsonb,
  allowed_origins JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for API Keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- API Key Usage Table
CREATE TABLE IF NOT EXISTS api_key_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for API Key Usage
CREATE INDEX IF NOT EXISTS idx_api_key_usage_api_key_id ON api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_timestamp ON api_key_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_endpoint ON api_key_usage(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_status_code ON api_key_usage(status_code);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_api_key_timestamp ON api_key_usage(api_key_id, timestamp);

-- API Requests Table (for detailed analytics)
CREATE TABLE IF NOT EXISTS api_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for API Requests
CREATE INDEX IF NOT EXISTS idx_api_requests_api_key_id ON api_requests(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_requests_timestamp ON api_requests(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_requests_endpoint ON api_requests(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_requests_status_code ON api_requests(status_code);
CREATE INDEX IF NOT EXISTS idx_api_requests_api_key_timestamp ON api_requests(api_key_id, timestamp);

-- Rate Limit Hits Table
CREATE TABLE IF NOT EXISTS rate_limit_hits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  blocked BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for Rate Limit Hits
CREATE INDEX IF NOT EXISTS idx_rate_limit_hits_identifier ON rate_limit_hits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limit_hits_timestamp ON rate_limit_hits(timestamp);
CREATE INDEX IF NOT EXISTS idx_rate_limit_hits_blocked ON rate_limit_hits(blocked);
CREATE INDEX IF NOT EXISTS idx_rate_limit_hits_identifier_timestamp ON rate_limit_hits(identifier, timestamp);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE api_keys IS 'Stores API keys for programmatic access to the platform';
COMMENT ON TABLE api_key_usage IS 'Tracks usage statistics for API keys';
COMMENT ON TABLE api_requests IS 'Detailed request logs for API analytics';
COMMENT ON TABLE rate_limit_hits IS 'Records rate limit violations for monitoring';

COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the API key for secure storage';
COMMENT ON COLUMN api_keys.scopes IS 'JSON array of permission scopes (e.g., ["read", "write"])';
COMMENT ON COLUMN api_keys.rate_limit IS 'Maximum requests allowed per rate_limit_window';
COMMENT ON COLUMN api_keys.allowed_ips IS 'JSON array of allowed IP addresses/CIDR ranges';
COMMENT ON COLUMN api_keys.allowed_origins IS 'JSON array of allowed CORS origins';
