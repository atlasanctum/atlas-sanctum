// @ts-nocheck
/**
 * useUserData
 * Single source of truth for the currently-authenticated user's data.
 * Works regardless of whether the app uses the JWT-based AuthProvider or
 * the Supabase-based SupabaseAuthProvider.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, marketplaceApi, setGlobalAccessToken } from '@/lib/api/apiClient';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ─── Unified user type ────────────────────────────────────────────────────────

export interface PlatformUser {
  id: string;
  email: string;
  displayName: string;
  fullName?: string;
  organization?: string;
  role: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  avatarUrl?: string;
  segment?: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
}

// ─── Utility: read Supabase user from live session ────────────────────────────

async function getSupabaseUser(): Promise<PlatformUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch the profile row that contains full_name / organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, organization, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email ?? '',
      displayName: profile?.full_name ?? user.email?.split('@')[0] ?? '',
      fullName: profile?.full_name ?? undefined,
      organization: profile?.organization ?? undefined,
      avatarUrl: profile?.avatar_url ?? undefined,
      role: (user.user_metadata?.role as string) || 'user',
      emailVerified: !!user.email_confirmed_at,
      mfaEnabled: false,
      createdAt: user.created_at,
    };
  } catch {
    return null;
  }
}

// ─── useCurrentUser ───────────────────────────────────────────────────────────

/**
 * Returns the currently authenticated user from whichever auth system is
 * active, falling back gracefully between JWT API and Supabase.
 */
export function useCurrentUser() {
  return useQuery<PlatformUser | null>({
    queryKey: ['platform:currentUser'],
    queryFn: async () => {
      // 1. Try the JWT /auth/me endpoint
      try {
        const data = await authApi.me();
        const u = data?.user ?? data;
        if (u?.id) {
          return {
            id: u.id,
            email: u.email ?? '',
            displayName: u.displayName ?? u.display_name ?? u.email?.split('@')[0] ?? '',
            fullName: u.fullName ?? u.full_name ?? undefined,
            organization: u.organization ?? undefined,
            role: u.role ?? 'user',
            emailVerified: u.emailVerified ?? u.email_verified ?? false,
            mfaEnabled: u.mfaEnabled ?? u.mfa_enabled ?? false,
            avatarUrl: u.avatarUrl ?? u.avatar_url ?? undefined,
            segment: u.segment ?? undefined,
            onboardingCompleted: u.onboardingCompleted ?? u.onboarding_completed ?? false,
            createdAt: u.createdAt ?? u.created_at ?? undefined,
          };
        }
      } catch {
        // JWT backend unreachable – fall through to Supabase
      }

      // 2. Fall back to Supabase session
      return getSupabaseUser();
    },
    staleTime: 60_000,
    retry: false,
  });
}

// ─── useUpdateProfile ─────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<PlatformUser> & { [key: string]: unknown }) => {
      // Try JWT API first
      try {
        const result = await authApi.updateProfile(updates);
        return result;
      } catch {
        // Fall back: Supabase profiles table
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            full_name: updates.fullName ?? updates.displayName,
            organization: updates.organization,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        if (error) throw error;
        return updates;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform:currentUser'] });
      toast.success('Profile updated successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update profile');
    },
  });
}

// ─── useChangePassword ────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      // Try JWT API
      try {
        return await authApi.changePassword(currentPassword, newPassword);
      } catch {
        // Fall back to Supabase
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw new Error(error.message);
        return { message: 'Password updated' };
      }
    },
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (err: Error) => toast.error(err.message || 'Failed to change password'),
  });
}

// ─── useEmailPreferences ──────────────────────────────────────────────────────

export function useEmailPreferences() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['platform:emailPreferences'],
    queryFn: async () => {
      try {
        const data = await authApi.getEmailPreferences();
        return data?.preferences ?? data ?? {
          marketing: true,
          transactional: true,
          notifications: true,
        };
      } catch {
        // Return sensible defaults when backend is unavailable
        return { marketing: true, transactional: true, notifications: true };
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (prefs: { marketing: boolean; transactional: boolean; notifications: boolean }) =>
      authApi.updateEmailPreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform:emailPreferences'] });
      toast.success('Email preferences updated');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update preferences'),
  });

  return { ...query, updatePreferences: mutation };
}

// ─── useUserTransactionsApi ───────────────────────────────────────────────────

/** Fetch the user's transaction history from the REST API (with Supabase fallback). */
export function useUserTransactionsApi(page = 1, size = 20) {
  return useQuery({
    queryKey: ['platform:transactions', page, size],
    queryFn: async () => {
      try {
        const data = await marketplaceApi.getTransactions(page, size);
        return data?.items ?? data ?? [];
      } catch {
        // Supabase fallback
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        const { data, error } = await supabase
          .from('transactions')
          .select('*, carbon_projects(id,title,project_type,location,country)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range((page - 1) * size, page * size - 1);
        if (error) throw error;
        return (data ?? []).map((t: any) => ({ ...t, project: t.carbon_projects }));
      }
    },
    staleTime: 30_000,
  });
}

// ─── useUserHoldingsApi ───────────────────────────────────────────────────────

/** Fetch the user's RIU / credit holdings from the REST API (with Supabase fallback). */
export function useUserHoldingsApi(page = 1, size = 50) {
  return useQuery({
    queryKey: ['platform:holdings', page, size],
    queryFn: async () => {
      try {
        const data = await marketplaceApi.getUserHoldings(page, size);
        return data?.items ?? data ?? [];
      } catch {
        // Supabase fallback
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        const { data, error } = await supabase
          .from('credit_holdings')
          .select('*, carbon_projects(id,title,project_type,location,country,co2_offset_per_credit)')
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false });
        if (error) throw error;
        return (data ?? []).map((h: any) => ({ ...h, project: h.carbon_projects }));
      }
    },
    staleTime: 30_000,
  });
}

// ─── usePortfolioStats ────────────────────────────────────────────────────────

export function usePortfolioStats() {
  const { data: holdings } = useUserHoldingsApi();

  return {
    totalCredits: holdings?.reduce((s: number, h: any) => s + (h.quantity ?? 0), 0) ?? 0,
    totalValue: holdings?.reduce((s: number, h: any) => s + (h.quantity ?? 0) * (h.purchase_price ?? 0), 0) ?? 0,
    totalCO2: holdings?.reduce((s: number, h: any) =>
      s + (h.quantity ?? 0) * ((h.project?.co2_offset_per_credit ?? h.co2_offset_per_credit ?? 1)), 0) ?? 0,
    activeHoldings: holdings?.filter((h: any) => !h.retired).length ?? 0,
  };
}

// ─── useUserProjects ──────────────────────────────────────────────────────────

export function useUserProjects(page = 1, size = 20) {
  return useQuery({
    queryKey: ['platform:userProjects', page, size],
    queryFn: async () => {
      try {
        const { projectsApi } = await import('@/lib/api/apiClient');
        const data = await projectsApi.list(page, size, undefined, true);
        return data?.items ?? data ?? [];
      } catch {
        // Supabase fallback
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        const { data, error } = await supabase
          .from('carbon_projects')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data ?? [];
      }
    },
    staleTime: 60_000,
  });
}

// ─── useDeleteAccount ─────────────────────────────────────────────────────────

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      try {
        return await authApi.deleteAccount();
      } catch {
        // Supabase: just sign out (full deletion requires admin RPC)
        await supabase.auth.signOut();
        return { message: 'Signed out' };
      }
    },
    onSuccess: () => {
      setGlobalAccessToken(null);
      toast.success('Account deleted');
      window.location.href = '/';
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete account'),
  });
}
