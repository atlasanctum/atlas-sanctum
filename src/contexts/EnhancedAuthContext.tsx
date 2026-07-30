/**
 * Enhanced Authentication Context
 * 
 * Provides comprehensive authentication functionality with demo login access
 * to all dashboards.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api/client';
import { setErrorAuthState, setErrorUser } from '@/lib/errorReporting';
import type {
  User,
  Tokens,
  Session,
  AuthStatus,
  AuthError,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  MFASetupData,
  DemoUserConfig,
  DashboardConfig,
  DashboardType,
  UserRole,
  AccessCheckResult,
  AuthEvent,
  EnhancedAuthContextType,
} from '@/types/auth';
import {
  DASHBOARD_CONFIGS,
  DEMO_USERS,
  DASHBOARD_ROUTES,
  ROLE_TO_DASHBOARD,
} from '@/types/auth';

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  
  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentDemoUser, setCurrentDemoUser] = useState<DemoUserConfig | undefined>(undefined);
  
  // Dashboard State
  const [currentDashboard, setCurrentDashboard] = useState<DashboardType | undefined>(undefined);
  const [availableDashboards, setAvailableDashboards] = useState<DashboardConfig[]>([]);
  
  // Auth Events
  const [authEvents, setAuthEvents] = useState<AuthEvent[]>([]);

  // Sync auth state into error reporter for diagnostic payloads
  useEffect(() => {
    setErrorUser(user ? { id: user.id, email: user.email } : null);
    setErrorAuthState({
      status,
      loading,
      isDemoMode,
      hasUser: !!user,
      currentDashboard,
      role: user?.role ?? null,
    });
  }, [user, status, loading, isDemoMode, currentDashboard]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        const savedTokens = localStorage.getItem('auth_tokens');
        const savedDemoMode = localStorage.getItem('auth_demo_mode');
        const savedDemoUser = localStorage.getItem('auth_demo_user');
        const savedDashboard = localStorage.getItem('auth_current_dashboard');

        if (savedUser && savedTokens) {
          const parsedUser = JSON.parse(savedUser);
          const parsedTokens = JSON.parse(savedTokens);
          const isDemo = savedDemoMode === 'true';

          setUser(parsedUser);
          setTokens(parsedTokens);
          // Only restore real tokens into the API client — never demo tokens
          if (!isDemo) {
            apiService.setToken(parsedTokens.accessToken);
          }
          setStatus('authenticated');
          
          // Set available dashboards based on user role
          const dashboards = getDashboardsForRole(parsedUser.role);
          setAvailableDashboards(dashboards);
          
          if (savedDashboard) {
            setCurrentDashboard(savedDashboard as DashboardType);
          } else {
            const defaultDashboard = ROLE_TO_DASHBOARD[parsedUser.role as UserRole];
            setCurrentDashboard(defaultDashboard);
          }
        }

        if (savedDemoMode === 'true' && savedDemoUser) {
          setIsDemoMode(true);
          setCurrentDemoUser(JSON.parse(savedDemoUser));
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Helper function to get dashboards for a role
  const getDashboardsForRole = useCallback((role: UserRole): DashboardConfig[] => {
    if (role === 'administrator' || role === 'super_admin') {
      // Admins have access to all dashboards
      return DASHBOARD_CONFIGS;
    }
    
    // Other roles have access to their specific dashboard and main dashboard
    const roleDashboard = DASHBOARD_CONFIGS.find(d => d.requiredRole === role);
    const mainDashboard = DASHBOARD_CONFIGS.find(d => d.id === 'main');
    
    return [roleDashboard, mainDashboard].filter(Boolean) as DashboardConfig[];
  }, []);

  // Helper function to create demo user
  const createDemoUser = useCallback((demoConfig: DemoUserConfig): User => {
    return {
      id: demoConfig.id,
      email: demoConfig.email,
      displayName: demoConfig.displayName,
      role: demoConfig.role,
      tenantId: 'demo-tenant',
      emailVerified: true,
      mfaEnabled: false,
      lastLogin: new Date().toISOString(),
      onboardingCompleted: true,
      dashboardAccess: demoConfig.dashboardAccess,
    };
  }, []);

  // Helper function to create demo tokens
  const createDemoTokens = useCallback((): Tokens => {
    return {
      accessToken: `demo-access-token-${Date.now()}`,
      refreshToken: `demo-refresh-token-${Date.now()}`,
      expiresIn: 3600, // 1 hour
      tokenType: 'Bearer',
    };
  }, []);

  // Helper function to create demo session
  const createDemoSession = useCallback((userId: string): Session => {
    return {
      id: `session-${Date.now()}`,
      userId,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        browser: 'Demo Browser',
        deviceType: 'desktop',
      },
      ipAddress: '127.0.0.1',
    };
  }, []);

  // Sign In
  const signIn = useCallback(async (credentials: LoginCredentials): Promise<{ error: AuthError | null }> => {
    setStatus('loading');
    setError(null);

    try {
      // Check if this is a demo login
      const demoUser = DEMO_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (demoUser) {
        return demoSignIn(demoUser.id);
      }

      // Regular login
      const response = await apiService.auth.login(credentials.email, credentials.password);
      
      if (response.error) {
        const authError: AuthError = {
          code: 'LOGIN_FAILED',
          message: response.error,
        };
        setError(authError);
        setStatus('error');
        return { error: authError };
      }

      if (response.data) {
        setUser(response.data.user);
        setTokens(response.data.tokens);
        setSession(createDemoSession(response.data.user.id));
        setStatus('authenticated');
        
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        localStorage.setItem('auth_tokens', JSON.stringify(response.data.tokens));
        apiService.setToken(response.data.tokens.accessToken);

        // Set available dashboards
        const dashboards = getDashboardsForRole(response.data.user.role);
        setAvailableDashboards(dashboards);

        // Add auth event
        addAuthEvent({
          type: 'login',
          userId: response.data.user.id,
          timestamp: new Date().toISOString(),
        });

        return { error: null };
      }

      return { error: null };
    } catch (err) {
      const authError: AuthError = {
        code: 'LOGIN_ERROR',
        message: err instanceof Error ? err.message : 'An error occurred during login',
      };
      setError(authError);
      setStatus('error');
      return { error: authError };
    }
  }, [getDashboardsForRole, createDemoSession]);

  // Sign Up
  const signUp = useCallback(async (credentials: RegisterCredentials): Promise<{ error: AuthError | null }> => {
    setStatus('loading');
    setError(null);

    try {
      const response = await apiService.auth.signup(
        credentials.email,
        credentials.password,
        credentials.fullName
      );

      if (response.error) {
        const authError: AuthError = {
          code: 'SIGNUP_FAILED',
          message: response.error,
        };
        setError(authError);
        setStatus('error');
        return { error: authError };
      }

      return { error: null };
    } catch (err) {
      const authError: AuthError = {
        code: 'SIGNUP_ERROR',
        message: err instanceof Error ? err.message : 'An error occurred during signup',
      };
      setError(authError);
      setStatus('error');
      return { error: authError };
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      // Add auth event
      if (user) {
        addAuthEvent({
          type: 'logout',
          userId: user.id,
          timestamp: new Date().toISOString(),
        });
      }

      clearAuthData();
      setStatus('unauthenticated');
//       navigate('/auth');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, [user]);

  // Refresh Token
  const refreshToken = useCallback(async (): Promise<{ error: AuthError | null }> => {
    if (!tokens?.refreshToken) {
      return { error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token available' } };
    }

    try {
      const response = await apiService.auth.refreshToken(tokens.refreshToken);

      if (response.error) {
        if (response.error.includes('Invalid') || response.error.includes('expired')) {
          await signOut();
        }
        return { error: { code: 'REFRESH_FAILED', message: response.error } };
      }

      if (response.data) {
        setTokens(response.data.tokens);
        localStorage.setItem('auth_tokens', JSON.stringify(response.data.tokens));
        apiService.setToken(response.data.tokens.accessToken);

        // Add auth event
        addAuthEvent({
          type: 'token_refresh',
          userId: user?.id || '',
          timestamp: new Date().toISOString(),
        });

        return { error: null };
      }

      return { error: null };
    } catch (err) {
      await signOut();
      return { error: { code: 'REFRESH_ERROR', message: 'Token refresh failed' } };
    }
  }, [tokens, user, signOut]);

  // Demo Sign In
  const demoSignIn = useCallback(async (demoUserId: string): Promise<{ error: AuthError | null }> => {
    setStatus('loading');
    setError(null);

    try {
      const demoUser = DEMO_USERS.find(u => u.id === demoUserId);
      
      if (!demoUser) {
        const authError: AuthError = {
          code: 'DEMO_USER_NOT_FOUND',
          message: 'Demo user not found',
        };
        setError(authError);
        setStatus('error');
        return { error: authError };
      }

      const user = createDemoUser(demoUser);
      const tokens = createDemoTokens();
      const session = createDemoSession(demoUser.id);

      setUser(user);
      setTokens(tokens);
      setSession(session);
      setIsDemoMode(true);
      setCurrentDemoUser(demoUser);
      setStatus('authenticated');

      // Set available dashboards
      const dashboards = getDashboardsForRole(demoUser.role);
      setAvailableDashboards(dashboards);

      // Set default dashboard
      const defaultDashboard = ROLE_TO_DASHBOARD[demoUser.role];
      setCurrentDashboard(defaultDashboard);

      // Save to localStorage — intentionally do NOT call apiService.setToken
      // with a demo token; real API calls must not carry fake credentials.
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_demo_mode', 'true');
      localStorage.setItem('auth_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('auth_current_dashboard', defaultDashboard);
      // Clear any previously stored real token so demo mode is fully isolated
      apiService.setToken('');

      // Add auth event
      addAuthEvent({
        type: 'login',
        userId: user.id,
        timestamp: new Date().toISOString(),
        metadata: { demoMode: true, demoUserId },
      });

      return { error: null };
    } catch (err) {
      const authError: AuthError = {
        code: 'DEMO_LOGIN_ERROR',
        message: err instanceof Error ? err.message : 'Demo login failed',
      };
      setError(authError);
      setStatus('error');
      return { error: authError };
    }
  }, [createDemoUser, createDemoTokens, createDemoSession, getDashboardsForRole]);

  // Demo Sign In By Role
  const demoSignInByRole = useCallback(async (role: UserRole): Promise<{ error: AuthError | null }> => {
    const demoUser = DEMO_USERS.find(u => u.role === role);
    
    if (!demoUser) {
      return { error: { code: 'DEMO_USER_NOT_FOUND', message: `No demo user found for role: ${role}` } };
    }

    return demoSignIn(demoUser.id);
  }, [demoSignIn]);

  // Switch Demo User
  const switchDemoUser = useCallback(async (demoUserId: string): Promise<{ error: AuthError | null }> => {
    return demoSignIn(demoUserId);
  }, [demoSignIn]);

  // Exit Demo Mode
  const exitDemoMode = useCallback(async (): Promise<void> => {
    clearAuthData();
    setIsDemoMode(false);
    setCurrentDemoUser(undefined);
    setStatus('unauthenticated');
    // Navigation handled by component
  }, []);

  // Verify Email
  const verifyEmail = useCallback(async (token: string): Promise<{ error: AuthError | null }> => {
    try {
      const response = await apiService.auth.verifyEmail(token);

      if (response.error) {
        return { error: { code: 'VERIFICATION_FAILED', message: response.error } };
      }

      return { error: null };
    } catch (err) {
      return { error: { code: 'VERIFICATION_ERROR', message: 'Email verification failed' } };
    }
  }, []);

  // Resend Verification
  const resendVerification = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      const response = await apiService.auth.resendVerification();

      if (response.error) {
        return { error: { code: 'RESEND_FAILED', message: response.error } };
      }

      return { error: null };
    } catch (err) {
      return { error: { code: 'RESEND_ERROR', message: 'Failed to resend verification email' } };
    }
  }, []);

  // Forgot Password
  const forgotPassword = useCallback(async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const response = await apiService.auth.forgotPassword(email);

      if (response.error) {
        return { error: { code: 'FORGOT_PASSWORD_FAILED', message: response.error } };
      }

      return { error: null };
    } catch (err) {
      return { error: { code: 'FORGOT_PASSWORD_ERROR', message: 'Failed to send password reset email' } };
    }
  }, []);

  // Reset Password
  const resetPassword = useCallback(async (credentials: ResetPasswordCredentials): Promise<{ error: AuthError | null }> => {
    try {
      const response = await apiService.auth.resetPassword(credentials.token, credentials.newPassword);

      if (response.error) {
        return { error: { code: 'RESET_PASSWORD_FAILED', message: response.error } };
      }

      return { error: null };
    } catch (err) {
      return { error: { code: 'RESET_PASSWORD_ERROR', message: 'Password reset failed' } };
    }
  }, []);

  // Setup MFA — not yet implemented server-side
  const setupMFA = useCallback(async (): Promise<{ error: AuthError | null; data?: MFASetupData }> => {
    return { error: { code: 'NOT_IMPLEMENTED', message: 'MFA setup is not yet available.' } };
  }, []);

  // Verify MFA — not yet implemented server-side
  const verifyMFA = useCallback(async (_code: string): Promise<{ error: AuthError | null }> => {
    return { error: { code: 'NOT_IMPLEMENTED', message: 'MFA verification is not yet available.' } };
  }, []);

  // Disable MFA — not yet implemented server-side
  const disableMFA = useCallback(async (): Promise<{ error: AuthError | null }> => {
    return { error: { code: 'NOT_IMPLEMENTED', message: 'MFA disable is not yet available.' } };
  }, []);

  // Update Profile
  const updateProfile = useCallback(async (data: Partial<User>): Promise<{ error: AuthError | null }> => {
    if (!user) {
      return { error: { code: 'NOT_AUTHENTICATED', message: 'User not authenticated' } };
    }

    try {
      const response = await apiService.auth.updateProfile(data);

      if (response.error) {
        return { error: { code: 'UPDATE_FAILED', message: response.error } };
      }

      // Update local user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

      return { error: null };
    } catch (err) {
      return { error: { code: 'UPDATE_ERROR', message: 'Profile update failed' } };
    }
  }, [user]);

  // Change Password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ error: AuthError | null }> => {
    try {
      await apiService.user.changePassword(currentPassword, newPassword);
      return { error: null };
    } catch (err) {
      return { error: { code: 'CHANGE_PASSWORD_ERROR', message: err instanceof Error ? err.message : 'Password change failed' } };
    }
  }, []);

  // Can Access Dashboard
  const canAccessDashboard = useCallback((dashboardId: DashboardType): AccessCheckResult => {
    if (!user) {
      return {
        canAccess: false,
        reason: 'User not authenticated',
      };
    }

    // Admins can access all dashboards
    if (user.role === 'administrator' || user.role === 'super_admin') {
      return { canAccess: true };
    }

    // Check if user has access to this dashboard
    const hasAccess = user.dashboardAccess?.includes(dashboardId);
    
    if (!hasAccess) {
      const dashboardConfig = DASHBOARD_CONFIGS.find(d => d.id === dashboardId);
      return {
        canAccess: false,
        reason: `User does not have access to ${dashboardConfig?.name || 'this dashboard'}`,
        requiredRole: dashboardConfig?.requiredRole,
      };
    }

    return { canAccess: true };
  }, [user]);

  // Switch Dashboard
  const switchDashboard = useCallback((dashboardId: DashboardType): void => {
    const accessCheck = canAccessDashboard(dashboardId);
    
    if (!accessCheck.canAccess) {
      console.error(accessCheck.reason);
      return;
    }

    setCurrentDashboard(dashboardId);
    localStorage.setItem('auth_current_dashboard', dashboardId);
    
    const route = DASHBOARD_ROUTES[dashboardId];
    if (route) {
//       navigate(route);
    }
  }, [canAccessDashboard]);

  // Get Available Dashboards
  const getAvailableDashboards = useCallback((): DashboardConfig[] => {
    return availableDashboards;
  }, [availableDashboards]);

  // Has Permission
  const hasPermission = useCallback((permissionId: string): boolean => {
    if (!user) return false;
    if (user.role === 'administrator' || user.role === 'super_admin') return true;
    return user.permissions?.some(p => p.id === permissionId) ?? false;
  }, [user]);

  // Has Role
  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  // Has Any Role
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  // Get Active Sessions
  const getActiveSessions = useCallback((): Session[] => {
    return session ? [session] : [];
  }, [session]);

  // Revoke Session — not yet implemented server-side
  const revokeSession = useCallback(async (_sessionId: string): Promise<{ error: AuthError | null }> => {
    return { error: { code: 'NOT_IMPLEMENTED', message: 'Session revocation is not yet available.' } };
  }, []);

  // Revoke All Sessions — signs out locally as best-effort
  const revokeAllSessions = useCallback(async (): Promise<{ error: AuthError | null }> => {
    await signOut();
    return { error: null };
  }, [signOut]);

  // Get Auth Events
  const getAuthEvents = useCallback((): AuthEvent[] => {
    return authEvents;
  }, [authEvents]);

  // Helper function to add auth event — capped at 100 to prevent unbounded growth
  const addAuthEvent = useCallback((event: AuthEvent) => {
    setAuthEvents(prev => (prev.length >= 100 ? [...prev.slice(1), event] : [...prev, event]));
  }, []);

  // Helper function to clear auth data
  const clearAuthData = useCallback(() => {
    setUser(null);
    setTokens(null);
    setSession(null);
    setIsDemoMode(false);
    setCurrentDemoUser(undefined);
    setCurrentDashboard(undefined);
    setAvailableDashboards([]);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_demo_mode');
    localStorage.removeItem('auth_demo_user');
    localStorage.removeItem('auth_current_dashboard');
    apiService.setToken('');
  }, []);

  // Context value
  const value: EnhancedAuthContextType = {
    user,
    tokens,
    session,
    status,
    loading,
    error,
    isDemoMode,
    demoUsers: DEMO_USERS,
    currentDemoUser,
    availableDashboards,
    currentDashboard,
    signIn,
    signUp,
    signOut,
    refreshToken,
    demoSignIn,
    demoSignInByRole,
    switchDemoUser,
    exitDemoMode,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    setupMFA,
    verifyMFA,
    disableMFA,
    updateProfile,
    changePassword,
    canAccessDashboard,
    switchDashboard,
    getAvailableDashboards,
    hasPermission,
    hasRole,
    hasAnyRole,
    getActiveSessions,
    revokeSession,
    revokeAllSessions,
    getAuthEvents,
  };

  return <EnhancedAuthContext.Provider value={value}>{children}</EnhancedAuthContext.Provider>;
};

export const useEnhancedAuth = (): EnhancedAuthContextType => {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};
