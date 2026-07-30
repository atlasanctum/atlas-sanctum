# Enhanced Authentication Module

## Overview

The Enhanced Authentication Module provides comprehensive authentication functionality with demo login access to all dashboards. This module is designed to be production-ready while offering seamless demo capabilities for testing and demonstration purposes.

## Features

### Core Authentication
- **User Authentication**: Sign in, sign up, and sign out functionality
- **Token Management**: Automatic token refresh and session management
- **Email Verification**: Email verification flow with resend capability
- **Password Reset**: Forgot password and reset password functionality
- **MFA Support**: Multi-factor authentication setup and verification

### Demo Mode
- **8 Demo Users**: Pre-configured demo users for all dashboard types
- **Instant Access**: One-click demo login without credentials
- **Mock Data**: Pre-populated mock data for each demo user
- **Role-Based Access**: Demo users have appropriate role-based permissions
- **Easy Switching**: Switch between different demo users seamlessly

### Dashboard Access
- **8 Dashboards**: Access to all platform dashboards
- **Role-Based Routing**: Automatic routing to appropriate dashboard based on user role
- **Access Control**: Permission-based access control for dashboards
- **Dashboard Switcher**: Easy switching between available dashboards

### Security Features
- **RBAC**: Role-based access control
- **Permission System**: Granular permission checks
- **Session Management**: Active session tracking and revocation
- **Audit Logging**: Authentication event logging
- **Route Protection**: Protected routes with automatic redirects

## Architecture

### Type Definitions

Located in [`src/types/auth.ts`](src/types/auth.ts:1)

```typescript
// User Roles
type UserRole = 'donor' | 'field_agent' | 'administrator' | 'community' | 'enterprise' | 'government' | 'defi' | 'ngo' | 'super_admin';

// Dashboard Types
type DashboardType = 'donor' | 'field-agent' | 'administrator' | 'community' | 'enterprise' | 'government' | 'defi' | 'ngo' | 'main';

// Permission Levels
type PermissionLevel = 'read' | 'write' | 'admin' | 'owner';
```

### Authentication Context

Located in [`src/contexts/EnhancedAuthContext.tsx`](src/contexts/EnhancedAuthContext.tsx:1)

The [`EnhancedAuthProvider`](src/contexts/EnhancedAuthContext.tsx:28) provides all authentication functionality:

```typescript
const {
  // User State
  user,
  tokens,
  session,
  status,
  loading,
  error,

  // Demo Mode
  isDemoMode,
  demoUsers,
  currentDemoUser,

  // Dashboard Access
  availableDashboards,
  currentDashboard,

  // Authentication Methods
  signIn,
  signUp,
  signOut,
  refreshToken,

  // Demo Authentication
  demoSignIn,
  demoSignInByRole,
  switchDemoUser,
  exitDemoMode,

  // Dashboard Access
  canAccessDashboard,
  switchDashboard,
  getAvailableDashboards,

  // Permission Checks
  hasPermission,
  hasRole,
  hasAnyRole,
} = useEnhancedAuth();
```

### Authentication Hook

Located in [`src/hooks/useEnhancedAuth.tsx`](src/hooks/useEnhancedAuth.tsx:1)

Convenience hook for accessing the enhanced authentication context:

```typescript
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

const { user, signIn, demoSignIn } = useEnhancedAuth();
```

### Authentication Guards

Located in [`src/utils/authGuards.ts`](src/utils/authGuards.ts:1)

Utility functions for protecting routes and checking access:

```typescript
import {
  canRoleAccessDashboard,
  getDefaultDashboardForRole,
  getAccessibleDashboardsForRole,
  isProtectedRoute,
  canAccessRoute,
  getRedirectPathForRole,
  validateDashboardAccess,
  isAdminRole,
  isEnterpriseRole,
  getRoleDisplayName,
  getRoleDescription,
} from '@/utils/authGuards';
```

## Demo Users

### Available Demo Users

| ID | Email | Password | Role | Dashboards |
|-----|--------|-----------|-------|------------|
| demo-donor | donor@demo.com | demo123 | donor | Donor, Main |
| demo-field-agent | field-agent@demo.com | demo123 | field_agent | Field Agent, Main |
| demo-administrator | admin@demo.com | demo123 | administrator | All Dashboards |
| demo-community | community@demo.com | demo123 | community | Community, Main |
| demo-enterprise | enterprise@demo.com | demo123 | enterprise | Enterprise, Main |
| demo-government | government@demo.com | demo123 | government | Government, Main |
| demo-defi | defi@demo.com | demo123 | defi | DeFi, Main |
| demo-ngo | ngo@demo.com | demo123 | ngo | NGO, Main |

### Demo User Features

Each demo user comes with pre-configured mock data:

- **Donor**: Donation history, impact metrics, portfolio data
- **Field Agent**: Project monitoring, data collection, field reports
- **Administrator**: User management, system settings, analytics
- **Community**: Community events, engagement metrics, collaboration tools
- **Enterprise**: Billing data, API usage, team management
- **Government**: Compliance reports, partnership data, regulatory tools
- **DeFi**: Token holdings, yield data, staking information
- **NGO**: Grant tracking, impact scores, donor relations

## Dashboards

### Dashboard Configurations

| Dashboard | Route | Required Role | Features |
|-----------|--------|----------------|-----------|
| Donor | `/dashboard/donor` | donor | Donation Tracking, Impact Metrics, Portfolio Management, Reports |
| Field Agent | `/dashboard/field-agent` | field_agent | Data Collection, Project Monitoring, Field Reports, GPS Tracking |
| Administrator | `/dashboard/administrator` | administrator | User Management, System Settings, Analytics, Audit Logs |
| Community | `/dashboard/community` | community | Community Events, Collaboration Tools, Forums, Resource Sharing |
| Enterprise | `/dashboard/enterprise` | enterprise | Billing Management, API Access, Advanced Analytics, Team Management |
| Government | `/dashboard/government` | government | Compliance Reports, Partnership Management, Government Analytics, Regulatory Tools |
| DeFi | `/dashboard/defi` | defi | Token Management, DeFi Protocols, Yield Farming, Staking |
| NGO | `/dashboard/ngo` | ngo | Grant Management, Impact Reporting, Donor Relations, Project Tracking |

## Usage Examples

### Setting Up the Provider

Wrap your application with the [`EnhancedAuthProvider`](src/contexts/EnhancedAuthContext.tsx:28):

```tsx
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';

function App() {
  return (
    <EnhancedAuthProvider>
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </EnhancedAuthProvider>
  );
}
```

### Using Demo Login

```tsx
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

function DemoLoginButton() {
  const { demoSignIn } = useEnhancedAuth();

  const handleDemoLogin = async () => {
    const result = await demoSignIn('demo-administrator');
    if (!result.error) {
      // User is now logged in as demo administrator
    }
  };

  return <button onClick={handleDemoLogin}>Demo Admin Login</button>;
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="administrator">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
```

### Checking Dashboard Access

```tsx
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

function DashboardAccess() {
  const { canAccessDashboard, switchDashboard } = useEnhancedAuth();

  const handleSwitch = (dashboardId: DashboardType) => {
    const accessCheck = canAccessDashboard(dashboardId);
    if (accessCheck.canAccess) {
      switchDashboard(dashboardId);
    } else {
      console.error(accessCheck.reason);
    }
  };

  return <button onClick={() => handleSwitch('enterprise')}>Switch to Enterprise</button>;
}
```

### Using Dashboard Switcher

```tsx
import { DashboardSwitcher } from '@/components/DashboardSwitcher';

function DashboardHeader() {
  return (
    <header>
      <DashboardSwitcher />
    </header>
  );
}
```

## Components

### EnhancedAuth Page

Located in [`src/pages/EnhancedAuth.tsx`](src/pages/EnhancedAuth.tsx:1)

Comprehensive authentication page with:
- Demo login cards for all 8 user types
- Regular sign-in form
- Registration form
- Demo mode banner
- Responsive design
- Animated transitions

### ProtectedRoute Component

Located in [`src/components/ProtectedRoute.tsx`](src/components/ProtectedRoute.tsx:1)

Route protection component that:
- Checks authentication status
- Validates role requirements
- Validates dashboard access
- Redirects unauthorized users
- Shows loading state

### DashboardSwitcher Component

Located in [`src/components/DashboardSwitcher.tsx`](src/components/DashboardSwitcher.tsx:1)

Dropdown component for:
- Switching between available dashboards
- Displaying current dashboard
- Showing user role
- Indicating demo mode

## Integration Guide

### Step 1: Add Provider

Wrap your application with the [`EnhancedAuthProvider`](src/contexts/EnhancedAuthContext.tsx:28):

```tsx
// src/main.tsx or src/App.tsx
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnhancedAuthProvider>
      <App />
    </EnhancedAuthProvider>
  </React.StrictMode>
);
```

### Step 2: Update Routes

Replace existing auth routes with the enhanced auth page:

```tsx
// src/App.tsx
import EnhancedAuth from '@/pages/EnhancedAuth';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<EnhancedAuth />} />
      {/* Other routes */}
    </Routes>
  );
}
```

### Step 3: Protect Dashboard Routes

Use the [`ProtectedRoute`](src/components/ProtectedRoute.tsx:1) component to protect dashboard routes:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Routes>
  <Route
    path="/dashboard/donor"
    element={
      <ProtectedRoute requiredDashboard="donor">
        <DonorDashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/dashboard/administrator"
    element={
      <ProtectedRoute requiredRole="administrator">
        <AdministratorDashboard />
      </ProtectedRoute>
    }
  />
  {/* Other dashboard routes */}
</Routes>
```

### Step 4: Add Dashboard Switcher

Add the [`DashboardSwitcher`](src/components/DashboardSwitcher.tsx:1) to your dashboard headers:

```tsx
import { DashboardSwitcher } from '@/components/DashboardSwitcher';

function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <DashboardSwitcher />
      <UserMenu />
    </header>
  );
}
```

## Security Considerations

### Demo Mode Security

- Demo mode is clearly indicated in the UI
- Demo users have limited permissions in production
- Demo tokens are clearly marked and easily identifiable
- Demo mode can be exited at any time

### Production Deployment

Before deploying to production:

1. **Disable Demo Mode**: Remove or disable demo login functionality
2. **Secure API Endpoints**: Ensure all authentication endpoints are properly secured
3. **Implement Rate Limiting**: Add rate limiting to authentication endpoints
4. **Enable MFA**: Require MFA for sensitive operations
5. **Audit Logging**: Enable comprehensive audit logging
6. **Session Management**: Implement proper session timeout and cleanup

### Best Practices

1. **Always Check Permissions**: Use [`hasPermission()`](src/contexts/EnhancedAuthContext.tsx:1) before performing sensitive operations
2. **Validate on Backend**: Never trust client-side permission checks alone
3. **Use HTTPS**: Always use HTTPS for authentication
4. **Implement CSRF Protection**: Add CSRF tokens to forms
5. **Secure Storage**: Use secure, httpOnly cookies for tokens in production
6. **Log Security Events**: Log all authentication and authorization events

## Testing

### Testing Demo Login

```typescript
// Test demo login
const { demoSignIn } = useEnhancedAuth();
const result = await demoSignIn('demo-administrator');
expect(result.error).toBeNull();
```

### Testing Dashboard Access

```typescript
// Test dashboard access
const { canAccessDashboard } = useEnhancedAuth();
const accessCheck = canAccessDashboard('enterprise');
expect(accessCheck.canAccess).toBe(true);
```

### Testing Role Checks

```typescript
// Test role checks
const { hasRole, hasAnyRole } = useEnhancedAuth();
expect(hasRole('administrator')).toBe(true);
expect(hasAnyRole(['administrator', 'super_admin'])).toBe(true);
```

## Troubleshooting

### Demo Login Not Working

1. Check that the [`EnhancedAuthProvider`](src/contexts/EnhancedAuthContext.tsx:28) is wrapping your app
2. Verify that the demo user ID is correct
3. Check browser console for errors
4. Clear localStorage and try again

### Dashboard Access Denied

1. Verify user role matches dashboard requirements
2. Check that [`dashboardAccess`](src/types/auth.ts:1) includes the dashboard
3. Ensure the user is authenticated
4. Check for permission errors in console

### Token Refresh Failing

1. Verify refresh token is valid
2. Check API endpoint is accessible
3. Ensure token storage is working correctly
4. Check network connectivity

## Future Enhancements

### Planned Features

1. **Social Login**: Google, GitHub, and other OAuth providers
2. **SSO Integration**: Enterprise single sign-on support
3. **Biometric Auth**: Fingerprint and face recognition
4. **Advanced MFA**: Hardware token and authenticator app support
5. **Session Analytics**: Detailed session analytics and insights
6. **Risk-Based Auth**: Adaptive authentication based on risk factors

### API Integration

The module is designed to integrate with the existing backend API:

```typescript
// Backend integration example
const response = await apiService.auth.login(email, password);
```

## Support

For issues or questions:

1. Check the documentation in [`ENHANCED_AUTHENTICATION_MODULE.md`](ENHANCED_AUTHENTICATION_MODULE.md:1)
2. Review type definitions in [`src/types/auth.ts`](src/types/auth.ts:1)
3. Examine the context implementation in [`src/contexts/EnhancedAuthContext.tsx`](src/contexts/EnhancedAuthContext.tsx:1)
4. Check utility functions in [`src/utils/authGuards.ts`](src/utils/authGuards.ts:1)

## License

This module is part of the Atlas Genesis platform and follows the same license terms.
