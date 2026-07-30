import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AdminUser, Alert, Notification, DashboardOverview } from '../services/adminConnector';
import adminConnector from '../services/adminConnector';

interface AdminState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AdminContextType extends AdminState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  dashboard: DashboardOverview | null;
  alerts: Alert[];
  notifications: Notification[];
  unreadAlerts: number;
  unreadNotifications: number;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  
  const [dashboard, setDashboard] = useState<DashboardOverview | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');

  // Initialize auth state from stored token
  useEffect(() => {
    const initAuth = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      const token = adminConnector.getToken();
      if (token) {
        try {
          const user = await adminConnector.auth.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          // Fetch additional data in background
          fetchDashboard().catch(() => {});
          fetchAlerts().catch(() => {});
          fetchNotifications().catch(() => {});
          setConnectionStatus('connected');
        } catch {
          adminConnector.setToken(null);
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          setConnectionStatus('disconnected');
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await adminConnector.dashboard.getOverview();
      setDashboard(data);
    } catch (error) {
      // Silent fail for dashboard
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await adminConnector.alerts.list({ limit: 10 });
      setAlerts(data);
    } catch (error) {
      // Silent fail for alerts
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await adminConnector.notifications.list({ limit: 10 });
      setNotifications(data);
    } catch (error) {
      // Silent fail for notifications
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await adminConnector.auth.login({ email, password });
      localStorage.setItem('admin_refresh_token', response.refreshToken);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      await fetchDashboard();
      await fetchAlerts();
      await fetchNotifications();
      setConnectionStatus('connected');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminConnector.auth.logout();
    } catch {
      // Silent fail for logout
    } finally {
      localStorage.removeItem('admin_refresh_token');
      adminConnector.setToken(null);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      setDashboard(null);
      setAlerts([]);
      setNotifications([]);
      setConnectionStatus('disconnected');
    }
  };

  const refreshUser = async () => {
    try {
      const user = await adminConnector.auth.getCurrentUser();
      setState(prev => ({ ...prev, user }));
    } catch (error) {
      // Silent fail
    }
  };

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const value: AdminContextType = {
    ...state,
    login,
    logout,
    refreshUser,
    dashboard,
    alerts,
    notifications,
    unreadAlerts,
    unreadNotifications,
    connectionStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    // Return default values instead of throwing error
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async () => {},
      logout: async () => {},
      refreshUser: async () => {},
      dashboard: null,
      alerts: [],
      notifications: [],
      unreadAlerts: 0,
      unreadNotifications: 0,
      connectionStatus: 'disconnected',
    };
  }
  return context;
};

export default AdminContext;
