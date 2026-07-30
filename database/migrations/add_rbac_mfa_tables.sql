-- RBAC and MFA Tables Migration
-- This migration adds tables for Role-Based Access Control (RBAC) and Multi-Factor Authentication (MFA)

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  sso_provider VARCHAR(50),
  sso_config JSONB,
  settings JSONB DEFAULT '{"allowedDomains": [], "requireMFA": false, "sessionTimeout": 3600, "ipWhitelist": [], "auditLogRetention": 90}'::jsonb,
  subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on domain for quick lookup
CREATE INDEX IF NOT EXISTS idx_organizations_domain ON organizations(domain);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, organization_id)
);

-- Create indexes for roles
CREATE INDEX IF NOT EXISTS idx_roles_organization_id ON roles(organization_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- User roles table (junction table)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, role_id, organization_id)
);

-- Create indexes for user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_organization_id ON user_roles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_expires_at ON user_roles(expires_at) WHERE expires_at IS NOT NULL;

-- MFA secrets table
CREATE TABLE IF NOT EXISTS mfa_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  secret VARCHAR(255) NOT NULL,
  backup_codes TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Create index for mfa_secrets
CREATE INDEX IF NOT EXISTS idx_mfa_secrets_user_id ON mfa_secrets(user_id);

-- Update users table to add organization_id and sso fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sso_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS sso_provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create index for users.organization_id
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);

-- Create trigger to update updated_at timestamp for organizations
CREATE OR REPLACE FUNCTION update_organizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_organizations_updated_at();

-- Create trigger to update updated_at timestamp for roles
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_roles_updated_at();

-- Insert default system roles
INSERT INTO roles (name, description, organization_id, permissions, is_system)
VALUES
  ('Super Admin', 'Full system access including all administrative functions', '00000000-0000-0000-0000-000000000000', ARRAY[
    'user.create', 'user.read', 'user.update', 'user.delete', 'user.admin',
    'organization.create', 'organization.read', 'organization.update', 'organization.delete', 'organization.admin',
    'role.create', 'role.read', 'role.update', 'role.delete', 'role.assign', 'role.revoke',
    'riu.create', 'riu.read', 'riu.update', 'riu.delete', 'riu.transfer', 'riu.retire',
    'project.create', 'project.read', 'project.update', 'project.delete', 'project.approve', 'project.reject',
    'audit.read', 'audit.export',
    'compliance.read', 'compliance.generate',
    'security.read', 'security.manage',
    'api_key.create', 'api_key.read', 'api_key.update', 'api_key.delete', 'api_key.revoke',
    'billing.read', 'billing.manage',
    'system.config', 'system.feature_flags'
  ], true),
  ('Admin', 'Administrative access to manage users, roles, and organizations', '00000000-0000-0000-0000-000000000000', ARRAY[
    'user.create', 'user.read', 'user.update', 'user.delete',
    'organization.create', 'organization.read', 'organization.update', 'organization.delete',
    'role.create', 'role.read', 'role.update', 'role.delete', 'role.assign', 'role.revoke',
    'audit.read', 'audit.export',
    'compliance.read', 'compliance.generate',
    'security.read', 'security.manage',
    'api_key.create', 'api_key.read', 'api_key.update', 'api_key.delete', 'api_key.revoke',
    'billing.read', 'billing.manage'
  ], true),
  ('User', 'Standard user access', '00000000-0000-0000-0000-000000000000', ARRAY[
    'riu.create', 'riu.read', 'riu.update', 'riu.delete',
    'project.create', 'project.read', 'project.update',
    'audit.read'
  ], true),
  ('Viewer', 'Read-only access to view data', '00000000-0000-0000-0000-000000000000', ARRAY[
    'riu.read',
    'project.read',
    'audit.read',
    'compliance.read'
  ], true)
ON CONFLICT (name, organization_id) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE organizations IS 'Organizations for enterprise customers';
COMMENT ON TABLE roles IS 'Roles for RBAC - defines permissions for users';
COMMENT ON TABLE user_roles IS 'Junction table linking users to roles within organizations';
COMMENT ON TABLE mfa_secrets IS 'MFA secrets for TOTP authentication';

COMMENT ON COLUMN organizations.sso_provider IS 'SSO provider: saml, azure-ad, okta';
COMMENT ON COLUMN organizations.sso_config IS 'SSO provider configuration';
COMMENT ON COLUMN organizations.settings IS 'Organization settings: allowedDomains, requireMFA, sessionTimeout, ipWhitelist, auditLogRetention';
COMMENT ON COLUMN organizations.subscription_tier IS 'Subscription tier: starter, professional, enterprise';

COMMENT ON COLUMN roles.permissions IS 'Array of permission IDs';
COMMENT ON COLUMN roles.is_system IS 'System roles cannot be deleted';

COMMENT ON COLUMN user_roles.expires_at IS 'Optional expiration date for temporary role assignments';

COMMENT ON COLUMN mfa_secrets.secret IS 'TOTP secret key';
COMMENT ON COLUMN mfa_secrets.backup_codes IS 'Array of backup codes for recovery';
COMMENT ON COLUMN mfa_secrets.verified IS 'Whether MFA has been verified by the user';
COMMENT ON COLUMN mfa_secrets.last_used_at IS 'Last time MFA was used for authentication';
