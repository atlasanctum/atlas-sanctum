-- Migration: Add Audit Logging Tables
-- Description: Create tables for comprehensive audit logging and compliance tracking
-- Version: 1.0.0
-- Date: 2026-01-31

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table for enterprise customers
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  sso_provider VARCHAR(50),
  sso_config JSONB,
  settings JSONB DEFAULT '{}',
  subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for organizations
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_subscription_tier ON organizations(subscription_tier);

-- Audit logs table for comprehensive tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  request_id VARCHAR(100),
  session_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failure', 'warning')),
  error_message TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for audit queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);

-- Composite index for common queries
CREATE INDEX idx_audit_logs_org_timestamp ON audit_logs(organization_id, timestamp DESC);
CREATE INDEX idx_audit_logs_user_timestamp ON audit_logs(user_id, timestamp DESC);

-- Security events table for tracking security incidents
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_security_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for security events
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_org_id ON security_events(organization_id);
CREATE INDEX idx_security_events_resolved ON security_events(resolved);
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);

-- Data encryption keys table
CREATE TABLE IF NOT EXISTS encryption_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name VARCHAR(255) UNIQUE NOT NULL,
  key_value TEXT NOT NULL,
  algorithm VARCHAR(50) DEFAULT 'aes-256-gcm',
  key_version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  rotated_at TIMESTAMP
);

-- Create indexes for encryption keys
CREATE INDEX idx_encryption_keys_name ON encryption_keys(key_name);
CREATE INDEX idx_encryption_keys_active ON encryption_keys(is_active);

-- Compliance reports table
CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('soc2', 'gdpr', 'iso27001', 'hipaa')),
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  controls JSONB NOT NULL,
  overall_compliance_score DECIMAL(5,2),
  findings JSONB DEFAULT '[]',
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_compliance_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_compliance_generator FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for compliance reports
CREATE INDEX idx_compliance_org_id ON compliance_reports(organization_id);
CREATE INDEX idx_compliance_type ON compliance_reports(report_type);
CREATE INDEX idx_compliance_period ON compliance_reports(period_start, period_end);
CREATE INDEX idx_compliance_generated_at ON compliance_reports(generated_at DESC);

-- Data retention policies table
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  data_type VARCHAR(100) NOT NULL,
  retention_period_days INTEGER NOT NULL,
  retention_action VARCHAR(50) DEFAULT 'delete' CHECK (retention_action IN ('delete', 'archive', 'anonymize')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_retention_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_retention_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(organization_id, data_type)
);

-- Create indexes for retention policies
CREATE INDEX idx_retention_org_id ON data_retention_policies(organization_id);
CREATE INDEX idx_retention_data_type ON data_retention_policies(data_type);

-- Access control logs table
CREATE TABLE IF NOT EXISTS access_control_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'admin')),
  granted BOOLEAN NOT NULL,
  reason TEXT,
  ip_address INET,
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_access_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for access control logs
CREATE INDEX idx_access_user_id ON access_control_logs(user_id);
CREATE INDEX idx_access_org_id ON access_control_logs(organization_id);
CREATE INDEX idx_access_resource ON access_control_logs(resource_type, resource_id);
CREATE INDEX idx_access_timestamp ON access_control_logs(timestamp DESC);

-- Add comments for documentation
COMMENT ON TABLE audit_logs IS 'Comprehensive audit log for all system actions';
COMMENT ON TABLE security_events IS 'Security incidents and events tracking';
COMMENT ON TABLE encryption_keys IS 'Encryption keys for data at rest';
COMMENT ON TABLE compliance_reports IS 'Compliance reports (SOC 2, GDPR, ISO 27001, HIPAA)';
COMMENT ON TABLE data_retention_policies IS 'Data retention policies for compliance';
COMMENT ON TABLE access_control_logs IS 'Access control and authorization logs';

COMMENT ON COLUMN audit_logs.action IS 'The action performed (e.g., user.login, riu.create, project.update)';
COMMENT ON COLUMN audit_logs.resource IS 'The resource type (e.g., user, riu, project)';
COMMENT ON COLUMN audit_logs.details IS 'Additional context and metadata about the action';
COMMENT ON COLUMN audit_logs.status IS 'Whether the action succeeded, failed, or had warnings';

COMMENT ON COLUMN security_events.severity IS 'Severity level: low, medium, high, critical';
COMMENT ON COLUMN security_events.resolved IS 'Whether the security event has been resolved';

COMMENT ON COLUMN compliance_reports.overall_compliance_score IS 'Overall compliance percentage (0-100)';
COMMENT ON COLUMN compliance_reports.findings IS 'Array of compliance findings and recommendations';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_retention_policies_updated_at BEFORE UPDATE ON data_retention_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for audit log cleanup (data retention)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    -- Delete audit logs older than retention period (default 1 year)
    DELETE FROM audit_logs
    WHERE timestamp < NOW() - INTERVAL '1 year';
    
    -- Log the cleanup
    INSERT INTO audit_logs (action, resource, details, status)
    VALUES ('audit.cleanup', 'audit_logs', '{"deleted_rows": row_count}', 'success');
END;
$$ LANGUAGE plpgsql;

-- Create function for security event escalation
CREATE OR REPLACE FUNCTION escalate_critical_security_events()
RETURNS void AS $$
BEGIN
    -- Find unresolved critical events older than 1 hour
    FOR event IN 
        SELECT id FROM security_events
        WHERE severity = 'critical'
        AND resolved = false
        AND created_at < NOW() - INTERVAL '1 hour'
    LOOP
        -- Create notification or send alert
        -- This would integrate with your notification system
        INSERT INTO audit_logs (action, resource, resource_id, details, status)
        VALUES ('security.escalation', 'security_events', event.id, 
                '{"reason": "critical_event_unresolved"}', 'warning');
    END LOOP;
END;
$$ LANGUAGE plpgsql;
