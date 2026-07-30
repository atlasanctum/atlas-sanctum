# Enterprise Authentication & Authorization Features

## Overview

Atlas Genesis now includes enterprise-grade authentication and authorization capabilities, enabling organizations to manage users, roles, and security policies at scale.

## Features

### Single Sign-On (SSO)

**Supported Providers:**
- SAML 2.0 (generic SSO)
- Microsoft Entra ID (Azure AD)
- Okta

**Capabilities:**
- SP-initiated and IdP-initiated login flows
- Automatic user provisioning on first login
- Organization SSO linking
- SAML metadata endpoint for IdP configuration
- Audit logging for all SSO events

**API Endpoints:**
```
GET    /api/sso/providers                    - List available SSO providers
GET    /api/sso/config/:provider              - Get provider configuration
GET    /api/sso/login/saml                  - Initiate SAML login
POST   /api/sso/callback/saml               - SAML callback
GET    /api/sso/metadata/saml               - SAML metadata
GET    /api/sso/login/azure                 - Initiate Azure AD login
GET    /api/sso/callback/azure              - Azure AD callback
GET    /api/sso/login/okta                  - Initiate Okta login
GET    /api/sso/callback/okta               - Okta callback
POST   /api/sso/link                         - Link SSO account
POST   /api/sso/unlink                       - Unlink SSO account
GET    /api/sso/users/:organizationId         - Get SSO users
GET    /api/sso/statistics/:organizationId     - Get SSO statistics
```

### Role-Based Access Control (RBAC)

**Predefined Permissions (40+):**

| Resource | Permissions |
|----------|-------------|
| User | `user.create`, `user.read`, `user.update`, `user.delete`, `user.admin` |
| Organization | `organization.create`, `organization.read`, `organization.update`, `organization.delete`, `organization.admin` |
| Role | `role.create`, `role.read`, `role.update`, `role.delete`, `role.assign`, `role.revoke` |
| RIU | `riu.create`, `riu.read`, `riu.update`, `riu.delete`, `riu.transfer`, `riu.retire` |
| Project | `project.create`, `project.read`, `project.update`, `project.delete`, `project.approve`, `project.reject` |
| Audit | `audit.read`, `audit.export` |
| Compliance | `compliance.read`, `compliance.generate` |
| Security | `security.read`, `security.manage` |
| API Key | `api_key.create`, `api_key.read`, `api_key.update`, `api_key.delete`, `api_key.revoke` |
| Billing | `billing.read`, `billing.manage` |
| System | `system.config`, `system.feature_flags` |

**System Roles:**
- **Super Admin**: Full system access including all administrative functions
- **Admin**: Administrative access to manage users, roles, and organizations
- **User**: Standard user access
- **Viewer**: Read-only access to view data

**Custom Roles:**
- Create organization-specific roles
- Assign custom permission sets
- Role expiration support for temporary access

**Middleware Functions:**
```typescript
requirePermission(permissionId)           // Require specific permission
requireAnyPermission(permissionIds[])       // Require any of multiple permissions
requireRole(roleName)                  // Require specific role
requireAnyRole(roleNames[])              // Require any of multiple roles
requireSuperAdmin()                      // Require super admin role
requireAdmin()                           // Require admin or super admin role
requireOrganizationMember()                // Require organization membership
hasPermission(permissionId)              // Non-blocking permission check
hasRole(roleName)                      // Non-blocking role check
```

### Multi-Factor Authentication (MFA)

**Features:**
- TOTP (Time-based One-Time Password) generation
- QR code generation for authenticator apps
- 10 backup codes for recovery
- Clock drift tolerance (±2 time steps)
- 30-second code refresh cycle
- Organization-level MFA enforcement

**API Endpoints:**
```
POST   /api/mfa/generate                    - Generate TOTP secret
POST   /api/mfa/enable                      - Verify and enable MFA
POST   /api/mfa/disable                     - Disable MFA
GET    /api/mfa/status                       - Get MFA status
POST   /api/mfa/verify                       - Verify TOTP code
POST   /api/mfa/backup-codes/regenerate     - Regenerate backup codes
```

**Supported Authenticator Apps:**
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- LastPass
- Any TOTP-compatible app

## Database Schema

### Organizations Table
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  sso_provider VARCHAR(50),
  sso_config JSONB,
  settings JSONB,
  subscription_tier VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  organization_id UUID REFERENCES organizations(id),
  permissions TEXT[] NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### User Roles Table
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  organization_id UUID REFERENCES organizations(id),
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

### MFA Secrets Table
```sql
CREATE TABLE mfa_secrets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  secret VARCHAR(255) NOT NULL,
  backup_codes TEXT[] NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  last_used_at TIMESTAMP
);
```

## Security Features

### SOC 2 Compliance

Phase 1 authentication features support SOC 2 compliance:

- **CC6.1**: Logical access controls through RBAC
- **CC6.2**: System operation controls through audit logging
- **CC6.6**: Logical access to system components
- **CC7.1**: System access control through MFA
- **CC7.2**: System event logging through audit trails
- **CC8.1**: System communication protection through secure protocols

### Audit Logging

All authentication and authorization events are logged:
- SSO login attempts (success/failure)
- Role assignments and revocations
- Permission changes
- MFA enable/disable events
- Organization membership changes

### Data Protection

- SSO secrets encrypted at rest
- TOTP secrets stored securely
- Backup codes hashed
- Sensitive data redacted from logs

## Configuration

### Environment Variables

```bash
# SAML 2.0
SAML_ENTRY_POINT=https://idp.example.com/sso
SAML_ISSUER=https://idp.example.com
SAML_CERT=-----BEGIN CERTIFICATE-----
SAML_CALLBACK_URL=https://yourapp.com/api/sso/callback/saml

# Azure AD
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_REDIRECT_URL=https://yourapp.com/api/sso/callback/azure

# Okta
OKTA_CLIENT_ID=your-client-id
OKTA_CLIENT_SECRET=your-client-secret
OKTA_ISSUER=https://your-org.okta.com
OKTA_CALLBACK_URL=https://yourapp.com/api/sso/callback/okta
```

### Organization Settings

Organizations can configure:
- `allowedDomains`: List of allowed email domains
- `requireMFA`: Require MFA for all users
- `sessionTimeout`: Session timeout in seconds
- `ipWhitelist`: Allowed IP addresses
- `auditLogRetention`: Audit log retention period in days

## Frontend Components

### SSO Login Page
- Provider selection with configuration status
- Animated transitions
- Error handling
- Loading states

### MFA Setup Page
- QR code display
- Manual entry key
- 6-digit code input
- Backup codes display
- Time remaining countdown
- Enable/disable functionality

## Integration Guide

### Backend Integration

1. **Install Dependencies:**
```bash
npm install passport passport-saml passport-azure-ad passport-okta-oauth otplib
```

2. **Run Database Migration:**
```bash
psql -U postgres -d atlas_genesis -f database/migrations/add_rbac_mfa_tables.sql
```

3. **Configure Passport Strategies:**
```typescript
import passport from 'passport';
import { SamlStrategy } from 'passport-saml';
import { AzureADStrategy } from 'passport-azure-ad';
import { OktaStrategy } from 'passport-okta-oauth';

passport.use(new SamlStrategy({ ... }));
passport.use(new AzureADStrategy({ ... }));
passport.use(new OktaStrategy({ ... }));
```

4. **Add Routes to Express App:**
```typescript
import ssoRoutes from './routes/sso';
app.use('/api/sso', ssoRoutes);
```

5. **Apply RBAC Middleware:**
```typescript
import { requirePermission, requireAdmin } from './middleware/rbac';

app.get('/api/admin/users', requireAdmin, getUsers);
app.post('/api/projects', requirePermission('project.create'), createProject);
```

### Frontend Integration

1. **Add Routes:**
```typescript
import SSOLoginPage from './pages/enterprise/SSOLogin';
import MFASetupPage from './pages/enterprise/MFASetup';

<Route path="/sso/login" element={<SSOLoginPage />} />
<Route path="/mfa/setup" element={<MFASetupPage />} />
```

2. **Add Navigation Links:**
```typescript
<Link to="/sso/login">Enterprise SSO Login</Link>
<Link to="/mfa/setup">MFA Settings</Link>
```

## Testing

### Unit Tests

```bash
npm test -- backend/src/services/sso.test.ts
npm test -- backend/src/services/rbac.test.ts
npm test -- backend/src/services/mfa.test.ts
```

### Integration Tests

1. Test SSO login flow with each provider
2. Test role creation and assignment
3. Test permission checking middleware
4. Test MFA setup and verification
5. Test backup code usage
6. Test audit logging for all events

## Monitoring

### Key Metrics

Track these metrics for enterprise auth:
- SSO login success/failure rate
- MFA adoption rate
- Role assignment frequency
- Permission denial rate
- Average session duration
- Failed authentication attempts

### Alerts

Set up alerts for:
- High rate of failed SSO logins
- Unusual permission denials
- MFA bypass attempts
- Role escalation attempts
- Organization configuration changes

## Troubleshooting

### Common Issues

**SSO Login Fails:**
- Verify SAML metadata is correct
- Check certificate validity
- Verify callback URL matches IdP configuration
- Check network connectivity to IdP

**MFA Code Invalid:**
- Verify device time is synchronized
- Check authenticator app is using correct secret
- Ensure code hasn't expired (30-second window)
- Try backup codes if available

**Permission Denied:**
- Verify user has required role
- Check role has required permission
- Verify role hasn't expired
- Check organization membership

## Next Steps

1. **Frontend RBAC Components** - Create role and permission management UI
2. **API Documentation** - Document all auth endpoints
3. **Monitoring Dashboard** - Add auth metrics to monitoring
4. **Testing** - Comprehensive end-to-end testing
5. **Production Deployment** - Configure production SSO providers

## Support

For enterprise authentication support:
- Review [`PHASE_1_AUTH_IMPLEMENTATION.md`](PHASE_1_AUTH_IMPLEMENTATION.md) for detailed implementation
- Check [`ENTERPRISE_DEVELOPMENT_ROADMAP.md`](ENTERPRISE_DEVELOPMENT_ROADMAP.md) for roadmap
- Refer to API documentation for endpoint details
