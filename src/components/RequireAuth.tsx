import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

/**
 * Lightweight auth guard. Redirects unauthenticated users to /auth,
 * preserving the intended destination in `?next=`.
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?next=${next}`, { replace: true });
    }
  }, [user, loading, navigate, location.pathname, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
};

export default RequireAuth;