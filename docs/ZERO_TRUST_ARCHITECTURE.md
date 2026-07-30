# Zero-Trust Architecture Framework

## Executive Summary

This document describes the comprehensive Zero-Trust Architecture implemented for the Atlas Humanitarian platform. Zero-Trust is a security framework based on the principle "never trust, always verify," which assumes that no user, device, or network is inherently trustworthy—even if they are inside the perimeter.

## Core Principles

### 1. Never Trust, Always Verify
Every request is authenticated, authorized, and validated continuously, regardless of whether it originates from inside or outside the network perimeter.

### 2. Assume Breach
The architecture minimizes blast radius and prevents lateral movement by verifying explicit permissions for every resource access.

### 3. Explicit Verification
Access decisions are based on all available data points, including user identity, device posture, location, and behavioral patterns.

### 4. Least Privilege Access
Users and devices are granted only the minimum access levels required, with just-in-time and just-enough access (JIT/JEA) principles.

### 5. Device Trust
Endpoint devices are validated for security posture before being granted access to resources.

## Architecture Components

### 1. Zero-Trust Engine (`backend/src/services/zeroTrust/zeroTrustEngine.ts`)

The core engine that evaluates every access request against configurable policies.

#### Key Features:
- **Trust Score Calculation**: Computes a composite trust score (0-100) based on:
  - Identity Score (30%): MFA status, email verification, session freshness
  - Device Score (20%): Device trust level, security posture
  - Behavior Score (25%): Anomaly detection, request patterns
  - Context Score (15%): Resource sensitivity, action type
  - Network Score (10%): IP reputation, network type

- **Policy Evaluation**: Matches requests against configured policies based on resource type and sensitivity level

- **Risk Level Classification**:
  - `none` (90-100): Full access
  - `low` (75-89): Standard access
  - `medium` (60-74): Additional verification may be required
  - `high` (40-59): Step-up authentication required
  - `critical` (0-39): Access denied, reauthentication required

#### Default Policies:

| Policy ID | Resource Type | Min Trust Score | Description |
|-----------|---------------|-----------------|-------------|
| `ztp-api-access` | api_endpoint | 70 | Standard API access |
| `ztp-user-data` | user_data | 80 | User data access |
| `ztp-admin-panel` | admin_panel | 95 | Admin operations |
| `ztp-billing` | billing_system | 90 | Payment operations |

### 2. Device Trust Service (`backend/src/services/zeroTrust/deviceTrustService.ts`)

Manages device fingerprinting, enrollment, and ongoing trust assessment.

#### Features:
- **Device Fingerprinting**: Generates unique device identifiers based on:
  - Browser characteristics (user agent, plugins, canvas fingerprint)
  - Hardware information (CPU cores, memory, screen resolution)
  - System settings (timezone, language, color depth)

- **Trust Levels**:
  - `trusted`: Enterprise-managed or long-established devices
  - `known`: User-enrolled and verified devices
  - `unknown`: New or unverified devices
  - `compromised`: Revoked or flagged devices

- **Security Posture Assessment**:
  - Antivirus status
  - Firewall enabled
  - Disk encryption
  - OS update status
  - Screen lock configuration
  - Biometric availability
  - Rooting/jailbreak detection

#### Device Enrollment:
```typescript
await deviceTrustService.enrollDevice({
  deviceInfo: deviceFingerprint,
  userId: user.id,
  deviceName: 'My Laptop',
  deviceType: 'desktop',
  isManaged: false,
  enrollmentMethod: 'manual'
});
```

### 3. Zero-Trust Middleware (`backend/src/middleware/zeroTrustAuth.ts`)

Express middleware for enforcing zero-trust policies on routes.

#### Usage Example:
```typescript
import { zeroTrustAuth, resourceSegmentation } from '../middleware/zeroTrustAuth';

// Apply to sensitive routes
app.use('/api/admin/*', zeroTrustAuth({
  resourceType: 'admin_panel',
  sensitivityLevel: 'restricted',
  minimumTrustScore: 95
}));

// Micro-segmentation for specific resources
app.post('/api/billing/payment', 
  resourceSegmentation('billing_system', 'create_payment'),
  requireStepUpAuth()
);
```

#### Available Middleware:

| Middleware | Purpose |
|------------|---------|
| `zeroTrustAuth(config)` | Main zero-trust enforcement |
| `requireStepUpAuth()` | MFA requirement for sensitive operations |
| `requireTrustedDevice()` | Requires trusted device status |
| `continuousValidation()` | Re-validates session on each request |
| `resourceSegmentation(type, action)` | Enforces least-privilege access |

## Database Schema

### Key Tables:

1. **device_trust**: Device enrollment and trust state
2. **endpoint_security_checks**: Security posture check results
3. **zero_trust_policies**: Policy definitions
4. **zero_trust_policy_decisions**: Audit log of all decisions
5. **zero_trust_exceptions**: Risk exceptions
6. **risk_indicators**: Detected security risks
7. **behavioral_anomalies**: User behavior analysis
8. **ip_blacklist**: Blocked IP addresses

### Migration:
Run `backend/db/migrations/018_zero_trust.sql` to create the required tables.

## Trust Score Calculation

### Identity Score (30%)
- Base score: 50
- Email verified: +15
- MFA enabled: +20
- Recent login (<24h): +10
- Active MFA session (<4h): +5

### Device Score (20%)
- Base score: 50
- Trusted device: +30
- Known device: +15
- Managed device: +10
- Security posture checks: up to +33
- Compromised device: -100

### Behavior Score (25%)
- Base score: 70
- Excessive requests (>1000/hr): -20
- Unusual request patterns: -10
- IP address change: -10
- Off-hours access: -5

### Context Score (15%)
- Base score: 70
- Resource sensitivity adjustment
- Action type adjustment (destructive operations: -10)
- Resource type adjustment (admin: -25)

### Network Score (10%)
- Base score: 60
- Corporate network: +25
- VPN: +20
- Trusted range: +15
- Risky country: -30
- Malicious IP: -100 (score = 0)

## Integration Guide

### 1. Apply to New Routes

```typescript
// In your route files
import { zeroTrustAuth } from '../middleware/zeroTrustAuth';

// Protect sensitive routes
router.get('/sensitive-data', 
  authenticate, // Existing auth middleware
  zeroTrustAuth({
    resourceType: 'user_data',
    sensitivityLevel: 'confidential',
    minimumTrustScore: 80
  }),
  sensitiveDataController
);
```

### 2. Require Step-Up Authentication

```typescript
router.post('/admin/action',
  zeroTrustAuth({ resourceType: 'admin_panel', sensitivityLevel: 'restricted' }),
  requireStepUpAuth(),
  adminController
);
```

### 3. Require Trusted Device

```typescript
router.delete('/account',
  zeroTrustAuth({ resourceType: 'user_data', sensitivityLevel: 'confidential' }),
  requireTrustedDevice(),
  requireStepUpAuth(),
  accountDeletionController
);
```

### 4. Check Trust Score in Controllers

```typescript
function myController(req: AuthenticatedRequest, res: Response) {
  const trustScore = req.trustScore;
  
  if (trustScore.riskLevel === 'high') {
    // Log additional audit trail
    logSecurityEvent('high_risk_access', req.user.id, {
      action: 'sensitive_operation',
      trustScore: trustScore.overall
    }, 'medium');
  }
  
  // Continue with operation
}
```

## Response Headers

Zero-Trust middleware adds the following headers:

| Header | Description |
|--------|-------------|
| `X-Trust-Score` | Current trust score (0-100) |
| `X-Risk-Level` | Risk classification |
| `X-ZeroTrust-Obligations` | Required security obligations |

## Monitoring and Alerting

### Security Events Logged:
- `zero_trust_decision`: Every policy evaluation
- `zero_trust_access_denied`: Failed access attempts
- `behavioral_anomaly`: Detected anomalies
- `device_enrolled`: New device registration
- `device_revoked`: Revoked devices

### Metrics to Monitor:
- Average trust score by resource type
- Access denial rate by risk level
- Device enrollment trends
- Anomaly detection frequency

## Configuration

### Environment Variables:
```
CORPORATE_IP_RANGES=10.0.0.0/8,172.16.0.0/12
VPN_IP_RANGES=10.50.0.0/16
TRUSTED_IP_RANGES=10.100.0.0/16
```

### Policy Customization:
Policies are stored in the `zero_trust_policies` table and can be modified without code changes.

## Security Considerations

### Fail-Safe Design:
- Default deny: Access is denied unless explicitly allowed
- Fail closed: Errors result in denied access
- Audit everything: All decisions are logged

### Privacy:
- Device fingerprints are hashed
- No personal data stored in device records
- Anonymized behavioral analytics

### Performance:
- Trust scores are cached for 5 minutes
- Policy lookups are cached
- Async anomaly detection

## Compliance Mapping

| Requirement | Zero-Trust Control |
|-------------|-------------------|
| NIST 800-207 | Full implementation of zero-trust principles |
| PCI DSS | Strong authentication for payment data |
| GDPR | Data access controls and audit trails |
| SOC 2 | Continuous verification and monitoring |

## Future Enhancements

1. **Integration with MDM solutions** for automatic device posture
2. **Behavioral biometrics** for continuous authentication
3. **UEBA (User and Entity Behavior Analytics)**
4. **Integration with SIEM platforms**
5. **Automated incident response**
6. **Self-service device enrollment portal**

## Troubleshooting

### Common Issues:

1. **Trust Score Too Low**
   - Check if MFA is enabled
   - Verify device enrollment
   - Check for anomalies in behavior

2. **Access Denied for Trusted Device**
   - Verify device fingerprint matches
   - Check if device was revoked
   - Confirm IP is in allowed network

3. **High False Positives**
   - Adjust sensitivity thresholds in policies
   - Add risk exceptions for known patterns
   - Review anomaly detection rules

### Debug Mode:
Enable detailed logging:
```typescript
const decision = await zeroTrustEngine.evaluateAccess(context);
console.log('Trust Score:', decision.trustScore);
console.log('Decision:', decision);
```
