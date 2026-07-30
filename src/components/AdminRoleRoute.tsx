import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useIsAdmin } from "@/hooks/useAdmin";

/**
 * Route guard that allows only authenticated users whose `user_roles` row
 * resolves `has_role(uid, 'admin')` on the server. Anyone else gets a clear
 * Access Denied screen instead of a blank page or silent redirect.
 *
 * The server-side authorization is enforced separately by RLS on
 * `newsletter_subscription_attempts` (admins-only SELECT). This component is
 * the matching client-side check so non-admins never even render the page.
 */
const AdminRoleRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const loading = authLoading || (!!user && roleLoading);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <DeniedScreen
        title="Sign in required"
        message="You need to sign in with an admin account to view this page."
        primaryHref="/auth"
        primaryLabel="Go to sign in"
      />
    );
  }

  if (!isAdmin) {
    return (
      <DeniedScreen
        title="Access denied"
        message="Your account does not have admin privileges required to view newsletter activity."
        primaryHref="/dashboard"
        primaryLabel="Back to dashboard"
      />
    );
  }

  return <>{children}</>;
};

const DeniedScreen = ({
  title,
  message,
  primaryHref,
  primaryLabel,
}: {
  title: string;
  message: string;
  primaryHref: string;
  primaryLabel: string;
}) => (
  <div
    role="alert"
    data-testid="admin-access-denied"
    className="min-h-screen bg-background flex items-center justify-center p-6"
  >
    <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-border bg-card shadow-sm">
      <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <ShieldAlert className="w-7 h-7 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">{message}</p>
      <Link
        to={primaryHref}
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {primaryLabel}
      </Link>
    </div>
  </div>
);

export default AdminRoleRoute;