# Enhanced Authentication Integration Guide

## Quick Start Integration

This guide shows how to integrate the Enhanced Authentication Module into your existing Atlas Genesis application.

## Step 1: Update App.tsx

Replace your existing [`App.tsx`](src/App.tsx:1) with the enhanced authentication provider:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import EnhancedAuth from '@/pages/EnhancedAuth';
import Dashboard from '@/pages/Dashboard';
import DonorDashboard from '@/pages/DonorDashboard';
import AdministratorDashboard from '@/pages/AdministratorDashboard';
import CommunityDashboard from '@/pages/CommunityDashboard';
import EnterpriseDashboard from '@/pages/EnterpriseDashboard';
import GovernmentDashboard from '@/pages/GovernmentDashboard';
import DeFiDashboard from '@/pages/DeFiDashboard';
import NGODashboard from '@/pages/NGODashboard';
import Index from '@/pages/Index';

function App() {
  return (
    <EnhancedAuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<EnhancedAuth />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute requiredDashboard="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/field-agent"
            element={
              <ProtectedRoute requiredDashboard="field-agent">
                <FieldAgentDashboard />
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
          
          <Route
            path="/dashboard/community"
            element={
              <ProtectedRoute requiredDashboard="community">
                <CommunityDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/enterprise"
            element={
              <ProtectedRoute requiredDashboard="enterprise">
                <EnterpriseDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/government"
            element={
              <ProtectedRoute requiredDashboard="government">
                <GovernmentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/defi"
            element={
              <ProtectedRoute requiredDashboard="defi">
                <DeFiDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/ngo"
            element={
              <ProtectedRoute requiredDashboard="ngo">
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </EnhancedAuthProvider>
  );
}

export default App;
```

## Step 2: Update Dashboard Components

Add the [`DashboardSwitcher`](src/components/DashboardSwitcher.tsx:1) to your dashboard headers:

```tsx
// src/pages/Dashboard.tsx (and other dashboard pages)
import React from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { DashboardSwitcher } from '@/components/DashboardSwitcher';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, isDemoMode } = useEnhancedAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Dashboard Switcher */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <DashboardSwitcher />
          </div>
          
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <Badge variant="secondary">Demo Mode</Badge>
            )}
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Your dashboard content */}
      </main>
    </div>
  );
};

export default Dashboard;
```

## Step 3: Update Navigation Links

Update your navigation to use the enhanced auth:

```tsx
// src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const { user, isDemoMode } = useEnhancedAuth();

  return (
    <nav className="flex items-center gap-4">
      <Link to="/">
        <Button variant="ghost">Home</Button>
      </Link>
      
      {user || isDemoMode ? (
        <>
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline">Switch Account</Button>
          </Link>
        </>
      ) : (
        <Link to="/auth">
          <Button>Sign In</Button>
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
```

## Step 4: Add Demo Mode Indicator

Add a demo mode indicator to your layout:

```tsx
// src/components/Layout.tsx
import React from 'react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isDemoMode, currentDemoUser } = useEnhancedAuth();

  return (
    <div className="min-h-screen">
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4">
          <div className="container mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">
              Demo Mode: {currentDemoUser?.displayName}
            </span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default Layout;
```

## Step 5: Update Existing Auth Pages

Replace existing auth pages with the enhanced auth page:

```tsx
// Remove or redirect old auth pages
// src/pages/Auth.tsx - Can be removed or redirected
// src/pages/Authentication.tsx - Can be removed or redirected
// src/pages/DemoLogin.tsx - Can be removed or redirected

// Add redirect to enhanced auth
const OldAuth = () => {
  return <Navigate to="/auth" replace />;
};
```

## Testing the Integration

### Test Demo Login

1. Navigate to `/auth`
2. Click on any demo user card
3. Verify you're redirected to the appropriate dashboard
4. Check that the dashboard switcher shows available dashboards
5. Verify the demo mode banner is displayed

### Test Dashboard Switching

1. Log in as demo administrator (has access to all dashboards)
2. Use the dashboard switcher to switch between dashboards
3. Verify you can access all dashboards
4. Log in as demo donor (has limited access)
5. Verify you can only access donor and main dashboards

### Test Route Protection

1. Try to access `/dashboard/administrator` without logging in
2. Verify you're redirected to `/auth`
3. Log in as demo donor
4. Try to access `/dashboard/administrator`
5. Verify you're redirected to your default dashboard

### Test Sign Out

1. Log in as any demo user
2. Click the sign out button
3. Verify you're redirected to `/auth`
4. Verify demo mode is exited
5. Verify localStorage is cleared

## Migration Checklist

- [ ] Add [`EnhancedAuthProvider`](src/contexts/EnhancedAuthContext.tsx:28) to App.tsx
- [ ] Update routes to use [`EnhancedAuth`](src/pages/EnhancedAuth.tsx:1) page
- [ ] Add [`ProtectedRoute`](src/components/ProtectedRoute.tsx:1) to dashboard routes
- [ ] Add [`DashboardSwitcher`](src/components/DashboardSwitcher.tsx:1) to dashboard headers
- [ ] Update navigation to use [`useEnhancedAuth`](src/hooks/useEnhancedAuth.tsx:1) hook
- [ ] Add demo mode indicator to layout
- [ ] Remove or redirect old auth pages
- [ ] Test demo login for all user types
- [ ] Test dashboard switching
- [ ] Test route protection
- [ ] Test sign out functionality
- [ ] Verify localStorage cleanup
- [ ] Test with real authentication (if available)

## Common Issues and Solutions

### Issue: Demo login not working

**Solution**: Ensure the [`EnhancedAuthProvider`](src/contexts/EnhancedAuthContext.tsx:28) is wrapping your entire app:

```tsx
<EnhancedAuthProvider>
  <Router>
    {/* Your routes */}
  </Router>
</EnhancedAuthProvider>
```

### Issue: Dashboard switcher not showing

**Solution**: Make sure the user is authenticated and the component is within the provider:

```tsx
const { user } = useEnhancedAuth();
if (!user) return null;
return <DashboardSwitcher />;
```

### Issue: Protected routes not redirecting

**Solution**: Check that the [`ProtectedRoute`](src/components/ProtectedRoute.tsx:1) component is properly configured:

```tsx
<ProtectedRoute requiredRole="administrator">
  <AdminDashboard />
</ProtectedRoute>
```

### Issue: Demo mode not exiting

**Solution**: Ensure you're calling the [`exitDemoMode`](src/contexts/EnhancedAuthContext.tsx:1) function:

```tsx
const { exitDemoMode } = useEnhancedAuth();
await exitDemoMode();
```

## Next Steps

After completing the integration:

1. **Test Thoroughly**: Test all authentication flows
2. **Update Documentation**: Update your project documentation
3. **Train Team**: Train your team on the new authentication system
4. **Monitor**: Monitor authentication events and errors
5. **Iterate**: Gather feedback and make improvements

## Support

For additional help:

1. Review the [Enhanced Authentication Module Documentation](ENHANCED_AUTHENTICATION_MODULE.md)
2. Check the type definitions in [`src/types/auth.ts`](src/types/auth.ts:1)
3. Examine the context implementation in [`src/contexts/EnhancedAuthContext.tsx`](src/contexts/EnhancedAuthContext.tsx:1)
4. Review utility functions in [`src/utils/authGuards.ts`](src/utils/authGuards.ts:1)
