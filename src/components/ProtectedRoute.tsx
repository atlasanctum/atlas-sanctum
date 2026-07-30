/**
 * Protected Route Component
 * 
 * Route protection component that checks authentication and permissions
 */

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { getRedirectPathForRole } from '@/utils/authGuards';
import type { DashboardType, UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredDashboard?: DashboardType;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredDashboard,
  fallback,
}) => {
  const { user, loading, isDemoMode, canAccessDashboard, switchDashboard } = useEnhancedAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextParam = `?next=${encodeURIComponent(location.pathname + location.search)}`;

  useEffect(() => {
    if (loading) return;

    // Redirect to auth if not authenticated
    // Allow demo mode users to access protected routes
    if (!user && !isDemoMode) {
      navigate(`/auth${nextParam}`, { replace: true });
      return;
    }

    // Check role requirements
    if (requiredRole && user?.role !== requiredRole) {
      // Demo mode users should be allowed through
      if (!isDemoMode) {
        // If user is admin, they can access everything
        if (user?.role !== 'administrator' && user?.role !== 'super_admin') {
          navigate(`/auth${nextParam}`, { replace: true });
          return;
        }
      }
    }

    // Check dashboard access
    if (requiredDashboard) {
      const accessCheck = canAccessDashboard(requiredDashboard);
      if (!accessCheck.canAccess) {
        // Redirect to user's default dashboard
        if (user) {
          const defaultDashboard = getRedirectPathForRole(user.role);
          navigate(defaultDashboard);
        }
        return;
      }
    }
  }, [user, loading, isDemoMode, requiredRole, requiredDashboard, navigate, canAccessDashboard]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if provided and user doesn't have access
  if (requiredDashboard && user) {
    const accessCheck = canAccessDashboard(requiredDashboard);
    if (!accessCheck.canAccess && fallback) {
      return <>{fallback}</>;
    }
  }

  // Render children if authenticated and authorized
  if (user || isDemoMode) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
