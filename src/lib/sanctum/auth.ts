/**
 * auth.ts
 *
 * Unified auth layer — bridges REST JWT auth with Supabase sessions.
 *
 * On login:
 *   1. Calls REST backend → gets JWT access/refresh tokens
 *   2. Writes accessToken to tokenStore (shared by all API clients)
 *   3. Persists tokens to localStorage under versioned keys
 *   4. Sets up auto-refresh 2 minutes before expiry
 *
 * On logout:
 *   1. Clears tokenStore
 *   2. Clears localStorage
 *   3. Signs out of Supabase session if active
 */

import { tokenStore } from './http';
import { authApi, type AuthUser, type TokenPair } from './api-client';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_USER   = 'sanctum:auth:user:v2';
const STORAGE_TOKENS = 'sanctum:auth:tokens:v2';

// Cleanup legacy keys from old implementation
['auth_user', 'auth_tokens'].forEach(k => localStorage.removeItem(k));

// ─── Token auto-refresh ────────────────────────────────────────────────────────

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleRefresh(tokens: TokenPair, onRefresh: (t: TokenPair) => void): void {
  if (refreshTimer) clearTimeout(refreshTimer);
  // Refresh 2 minutes before expiry
  const msUntilRefresh = Math.max((tokens.expiresIn - 120) * 1000, 5000);
  refreshTimer = setTimeout(async () => {
    try {
      const res = await authApi.refresh(tokens.refreshToken);
      if (res.data) {
        persistTokens(res.data.tokens);
        tokenStore.set(res.data.tokens.accessToken);
        onRefresh(res.data.tokens);
        scheduleRefresh(res.data.tokens, onRefresh);
      }
    } catch {
      // Token is expired — caller should handle signOut
    }
  }, msUntilRefresh);
}

// ─── Persistence helpers ──────────────────────────────────────────────────────

function persistTokens(tokens: TokenPair): void {
  localStorage.setItem(STORAGE_TOKENS, JSON.stringify(tokens));
}

function persistUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

function clearStorage(): void {
  localStorage.removeItem(STORAGE_TOKENS);
  localStorage.removeItem(STORAGE_USER);
}

// ─── Public auth service ──────────────────────────────────────────────────────

export interface AuthSession {
  user: AuthUser;
  tokens: TokenPair;
}

export const sanctumAuth = {
  /** Restore session from localStorage on app boot. */
  restore(): AuthSession | null {
    try {
      const rawUser   = localStorage.getItem(STORAGE_USER);
      const rawTokens = localStorage.getItem(STORAGE_TOKENS);
      if (!rawUser || !rawTokens) return null;

      const user   = JSON.parse(rawUser) as AuthUser;
      const tokens = JSON.parse(rawTokens) as TokenPair;
      tokenStore.set(tokens.accessToken);
      return { user, tokens };
    } catch {
      clearStorage();
      return null;
    }
  },

  async login(
    email: string,
    password: string,
    onTokenRefresh?: (t: TokenPair) => void,
  ): Promise<{ session: AuthSession | null; error: Error | null }> {
    try {
      const res = await authApi.login(email, password);
      if (res.error || !res.data) return { session: null, error: new Error(res.error ?? 'Login failed') };

      const { user, tokens } = res.data;
      tokenStore.set(tokens.accessToken);
      persistUser(user);
      persistTokens(tokens);

      if (onTokenRefresh) scheduleRefresh(tokens, onTokenRefresh);

      return { session: { user, tokens }, error: null };
    } catch (e) {
      return { session: null, error: e instanceof Error ? e : new Error('Login failed') };
    }
  },

  async signup(
    email: string,
    password: string,
    displayName?: string,
    role?: string,
  ): Promise<{ error: Error | null }> {
    try {
      const res = await authApi.signup(email, password, displayName, role);
      return { error: res.error ? new Error(res.error) : null };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Signup failed') };
    }
  },

  async logout(): Promise<void> {
    if (refreshTimer) clearTimeout(refreshTimer);
    tokenStore.clear();
    clearStorage();
    await supabase.auth.signOut().catch(() => undefined);
  },

  async updateProfile(data: Partial<AuthUser>): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const res = await authApi.updateProfile(data);
      if (res.error || !res.data) return { user: null, error: new Error(res.error ?? 'Update failed') };
      persistUser(res.data);
      return { user: res.data, error: null };
    } catch (e) {
      return { user: null, error: e instanceof Error ? e : new Error('Update failed') };
    }
  },
};
