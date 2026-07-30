/**
 * useAuth — thin shim that delegates to EnhancedAuthContext.
 *
 * All components that import useAuth/AuthProvider continue to work unchanged.
 * EnhancedAuthProvider (in App.tsx) is the single auth source of truth.
 */
import React, { createContext, useContext } from 'react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import type { User } from '@/types/auth';

interface LegacyAuthContextType {
  user: User | null;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number } | null;
  session: Record<string, unknown> | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string, role?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  demoSignIn: (role: 'user' | 'admin') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<{ error: Error | null }>;
  verifyEmail: (token: string) => Promise<{ error: Error | null }>;
  resendVerification: () => Promise<{ error: Error | null }>;
  forgotPassword: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
}

// Kept only so legacy `<AuthProvider>` JSX in tests/storybooks doesn't break.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const wrapError = (e: { code: string; message: string } | null): Error | null =>
  e ? new Error(e.message) : null;

export const useAuth = (): LegacyAuthContextType => {
  const auth = useEnhancedAuth();
  const notImplemented = async () => ({ error: new Error('Not available on this auth path') });

  return {
    user: auth.user,
    tokens: auth.tokens,
    session: null,
    loading: auth.loading,

    signUp: async (email, password, displayName, role) => {
      const { error } = await auth.signUp({ email, password, fullName: displayName ?? '', role: role as any });
      return { error: wrapError(error) };
    },

    signIn: async (email, password) => {
      const { error } = await auth.signIn({ email, password });
      return { error: wrapError(error) };
    },

    demoSignIn: async (role) => {
      const { error } = await auth.demoSignInByRole(role === 'admin' ? 'administrator' : 'donor');
      return { error: wrapError(error) };
    },

    signOut: auth.signOut,

    refreshToken: async () => {
      const { error } = await auth.refreshToken();
      return { error: wrapError(error) };
    },

    verifyEmail: notImplemented,
    resendVerification: notImplemented,
    forgotPassword: notImplemented,
    resetPassword: notImplemented,
    updateProfile: notImplemented,
  };
};
