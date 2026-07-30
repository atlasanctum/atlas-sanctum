// @ts-nocheck
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook to check if the current user has admin privileges
 * Uses the existing useAuth hook to get user information
 */
export const useAdminAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    // Check if user has admin role
    if (user) {
      // Admin users have role 'admin' or email contains 'admin'
      const hasAdminRole = user.role === 'admin' || 
                          user.email?.includes('admin') ||
                          user.email?.includes('atlas') && user.role === 'admin';
      
      setIsAdmin(hasAdminRole);
    } else {
      setIsAdmin(false);
    }

    setLoading(false);
  }, [user, authLoading]);

  return {
    isAdmin,
    loading,
    user
  };
};

/**
 * Higher-order component to protect admin routes
 * Redirects non-admin users to the dashboard
 */
export const withAdminAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function AdminProtectedComponent(props: P) {
    const { isAdmin, loading, user } = useAdminAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted || loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!user) {
      // Redirect to auth page if not logged in
      window.location.href = '/auth';
      return null;
    }

    if (!isAdmin) {
      // Redirect to dashboard if not admin
      window.location.href = '/dashboard';
      return null;
    }

    return <Component {...props} />;
  };
};
