# Phase 4 Integration Guide

This guide explains how to integrate the Phase 4: Enterprise Security & Compliance features into your Atlas Genesis platform.

---

## Backend Integration

### Step 1: Run Database Migration

Execute the SQL migration to create the audit tables:

```bash
# Using psql
psql -U your_username -d your_database -f database/migrations/add_audit_tables.sql

# Or using the migration script
cd backend
npm run migrate
```

### Step 2: Add Audit Middleware to Express App

In `backend/src/index.ts`, add the audit middleware import and apply it:

```typescript
// Add this import after line 33
import { auditMiddleware } from './middleware/audit';

// Add this after line 246 (after securityLogger middleware)
app.use(auditMiddleware({
  logSuccess: true,
  logFailure: true,
  logBody: false,
  logResponse: false,
  excludePaths: ['/health', '/metrics'],
}));
```

### Step 3: Verify Audit Routes

The audit routes are already imported at line 46:
```typescript
import auditRouter from './routes/audit';
```

And registered at line 374:
```typescript
app.use('/api/audit', auditRouter);
```

### Step 4: Test the Integration

Start the backend server and test the audit endpoints:

```bash
cd backend
npm run dev
```

Test the following endpoints:
- `GET http://localhost:3001/api/audit/logs` - Query audit logs
- `GET http://localhost:3001/api/audit/statistics` - Get statistics
- `GET http://localhost:3001/api/audit/export/csv` - Export to CSV
- `GET http://localhost:3001/api/audit/export/json` - Export to JSON

---

## Frontend Integration

### Step 1: Add Security Page

Create a new security page at `src/pages/Security.tsx`:

```typescript
import { SecurityDashboard } from '@/components/enterprise/SecurityDashboard';

export default function Security() {
  return <SecurityDashboard />;
}
```

### Step 2: Add Route

Add the security route to your router configuration (typically in `src/App.tsx` or `src/main.tsx`):

```typescript
{
  path: '/security',
  element: <Security />,
}
```

### Step 3: Add Navigation Link

Update the Navigation component to include a link to the Security page:

```typescript
{
  label: 'Security',
  href: '/security',
  icon: Shield,
}
```

### Step 4: Test the Frontend

Start the frontend development server:

```bash
npm run dev
```

Navigate to `http://localhost:5173/security` to see the security dashboard.

---

## Testing the Implementation

### Backend Tests

Create test files for the security services:

```bash
# Create test directory
mkdir -p backend/src/services/__tests__

# Create test files
touch backend/src/services/audit.test.ts
touch backend/src/services/encryption.test.ts
touch backend/src/services/compliance.test.ts
```

Example test for audit service:

```typescript
import { auditService, AuditActions, AuditResources } from '../audit';

describe('AuditService', () => {
  describe('log', () => {
    it('should log an audit event', async () => {
      const log = await auditService.log({
        userId: 'user-123',
        organizationId: 'org-456',
        action: AuditActions.USER_LOGIN,
        resource: AuditResources.USER,
        status: 'success',
      });

      expect(log).toBeDefined();
      expect(log.action).toBe('user.login');
      expect(log.userId).toBe('user-123');
    });
  });

  describe('query', () => {
    it('should query audit logs with filters', async () => {
      const logs = await auditService.query({
        organizationId: 'org-456',
        action: AuditActions.USER_LOGIN,
      });

      expect(Array.isArray(logs)).toBe(true);
    });
  });
});
```

### Frontend Tests

Create test files for the React components:

```bash
# Create test directory
mkdir -p src/components/enterprise/__tests__

# Create test files
touch src/components/enterprise/AuditLogViewer.test.tsx
touch src/components/enterprise/SecurityDashboard.test.tsx
```

---

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Encryption
ENCRYPTION_KEY=your-256-bit-hex-key-here

# Audit retention
AUDIT_RETENTION_DAYS=365

# Compliance
COMPLIANCE_REPORT_SCHEDULE=daily
```

Generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## API Documentation

Update your API documentation to include the new audit endpoints:

### GET /api/audit/logs

Query audit logs with optional filters.

**Query Parameters:**
- `userId` (string, optional) - Filter by user ID
- `organizationId` (string, optional) - Filter by organization ID
- `action` (string, optional) - Filter by action type
- `resource` (string, optional) - Filter by resource type
- `resourceId` (string, optional) - Filter by resource ID
- `status` (string, optional) - Filter by status (success/failure/warning)
- `from` (ISO 8601 date, optional) - Start date
- `to` (ISO 8601 date, optional) - End date
- `limit` (number, optional) - Maximum number of results (default: 100)
- `offset` (number, optional) - Number of results to skip

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "organizationId": "uuid",
      "action": "user.login",
      "resource": "user",
      "resourceId": "uuid",
      "details": {},
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "requestId": "uuid",
      "sessionId": "uuid",
      "status": "success",
      "errorMessage": null,
      "timestamp": "2024-01-31T18:00:00.000Z"
    }
  ],
  "count": 1
}
```

### GET /api/audit/statistics

Get audit statistics for an organization.

**Query Parameters:**
- `organizationId` (string, required) - Organization ID
- `from` (ISO 8601 date, optional) - Start date (default: 30 days ago)
- `to` (ISO 8601 date, optional) - End date (default: now)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_events": 1234,
    "successful_events": 1200,
    "failed_events": 30,
    "warning_events": 4,
    "unique_users": 45,
    "unique_actions": 12,
    "unique_resources": 8
  }
}
```

### GET /api/audit/export/csv

Export audit logs to CSV format.

**Query Parameters:** Same as `/api/audit/logs`

**Response:** CSV file with download headers

### GET /api/audit/export/json

Export audit logs to JSON format.

**Query Parameters:** Same as `/api/audit/logs`

**Response:** JSON file with download headers

---

## Security Considerations

### Encryption Key Management

1. **Generate a secure encryption key:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Store the key securely:**
   - Use environment variables
   - Use a secrets manager (AWS Secrets Manager, Azure Key Vault)
   - Never commit keys to version control

3. **Rotate keys regularly:**
   ```typescript
   await encryptionService.rotateKey('default');
   ```

4. **Backup keys:**
   - Keep a backup of old keys
   - Store in a secure location

### Audit Log Retention

1. **Set appropriate retention periods:**
   - Production: 1-3 years
   - Development: 30-90 days
   - Compliance requirements may require longer retention

2. **Implement automated cleanup:**
   ```typescript
   await auditService.cleanupOldLogs(365);
   ```

3. **Archive old logs before deletion:**
   - Export to cold storage
   - Compress to save space
   - Maintain searchability

### Access Control

1. **Implement role-based access:**
   - Only admins can view all audit logs
   - Users can only view their own logs
   - Use RBAC middleware for fine-grained control

2. **Audit the audit system:**
   - Log who accesses audit logs
   - Monitor for suspicious activity
   - Alert on unusual access patterns

---

## Monitoring and Alerts

### Key Metrics to Monitor

1. **Audit Log Volume:**
   - Total logs per day
   - Storage usage
   - Query performance

2. **Security Events:**
   - Number of events by severity
   - Resolution time
   - Recurring patterns

3. **Compliance Scores:**
   - Overall compliance percentage
   - Control effectiveness
   - Trend over time

### Alert Thresholds

Set up alerts for:

- **High volume of failed logins** (> 10 in 1 hour)
- **Critical security events** (severity: critical)
- **Compliance score drop** (> 10% decrease)
- **Audit log query performance** (> 1 second)

---

## Troubleshooting

### Common Issues

1. **Audit logs not appearing:**
   - Check middleware is applied
   - Verify routes are registered
   - Check exclude paths configuration

2. **Encryption errors:**
   - Verify ENCRYPTION_KEY is set
   - Check key format (64 hex characters)
   - Verify key is not expired

3. **Compliance report generation fails:**
   - Check audit logs exist for the period
   - Verify organization ID is correct
   - Check user has permission to generate reports

4. **Export fails:**
   - Check user has export permission
   - Verify data size limits
   - Check browser download settings

---

## Next Steps

After completing Phase 4 integration:

1. **Phase 1: Enterprise Authentication & Authorization**
   - Implement SSO/SAML
   - Implement RBAC
   - Implement MFA

2. **Phase 2: Enterprise API Management**
   - Implement API key system
   - Implement rate limiting
   - Implement usage analytics

3. **Phase 3: Enterprise Analytics & Reporting**
   - Implement advanced analytics dashboard
   - Implement report generation
   - Implement data export

4. **Phase 5: Enterprise Integration & Connectivity**
   - Implement webhooks
   - Implement third-party integrations
   - Implement data synchronization

5. **Phase 6: Enterprise Billing & Subscriptions**
   - Implement Stripe integration
   - Implement subscription management
   - Implement invoicing

6. **Phase 7: Enterprise Support & Operations**
   - Implement ticketing system
   - Implement knowledge base
   - Implement support analytics

7. **Phase 8: Enterprise Infrastructure & DevOps**
   - Implement multi-region deployment
   - Implement database sharding
   - Implement auto-scaling

---

## Support

For questions or issues:
- Review the implementation summary: `PHASE_4_SECURITY_COMPLIANCE_IMPLEMENTATION.md`
- Check the Enterprise Development Roadmap: `ENTERPRISE_DEVELOPMENT_ROADMAP.md`
- Review the audit service: `backend/src/services/audit.ts`
- Review the encryption service: `backend/src/services/encryption.ts`
- Review the compliance service: `backend/src/services/compliance.ts`
