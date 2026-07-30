/**
 * Admin Connector Service
 * Provides API connectors for the admin dashboard at /admin
 */

const API_BASE = '/api/admin';

// Token management
let adminToken: string | null = null;

export const setAdminToken = (token: string | null) => {
  adminToken = token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
};

export const getAdminToken = (): string | null => {
  if (!adminToken) {
    adminToken = localStorage.getItem('admin_token');
  }
  return adminToken;
};

// Generic fetch wrapper with auth
const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Don't throw for auth errors during init
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized');
      }
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Convert network errors to a form we can handle
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error - backend may be offline');
    }
    throw error;
  }
};

// ==================== Authentication ====================

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: AdminUser;
  expiresIn: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  avatar?: string;
  permissions: string[];
  lastLogin: string;
  createdAt: string;
}

export const adminAuth = {
  login: async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setAdminToken(result.token);
    return result;
  },

  register: async (data: AdminLoginRequest & { name: string }): Promise<AdminLoginResponse> => {
    const response = await fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setAdminToken(result.token);
    return result;
  },

  logout: async (): Promise<void> => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore logout errors
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    const result = await response.json();
    setAdminToken(result.token);
    return result;
  },

  getCurrentUser: async (): Promise<AdminUser> => {
    return fetchWithAuth<AdminUser>('/auth/me');
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await fetchWithAuth('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await fetchWithAuth('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// ==================== Dashboard ====================

export interface DashboardOverview {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  revenueChange: number;
  totalTransactions: number;
  transactionChange: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  uptime: number;
  activeAlerts: number;
  recentActivity: ActivityItem[];
  revenueByCategory: { category: string; value: number }[];
  usersTrend: { date: string; count: number }[];
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  user?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export const dashboard = {
  getOverview: async (): Promise<DashboardOverview> => {
    return fetchWithAuth<DashboardOverview>('/dashboard/overview');
  },

  getStats: async (): Promise<Record<string, number>> => {
    return fetchWithAuth<Record<string, number>>('/dashboard/stats');
  },

  getActivity: async (limit?: number): Promise<ActivityItem[]> => {
    return fetchWithAuth<ActivityItem[]>(`/dashboard/activity${limit ? `?limit=${limit}` : ''}`);
  },
};

// ==================== Users ====================

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  metadata?: Record<string, unknown>;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export const users = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<UsersResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.search) query.set('search', params.search);
    return fetchWithAuth<UsersResponse>(`/users?${query.toString()}`);
  },

  getById: async (id: string): Promise<User> => {
    return fetchWithAuth<User>(`/users/${id}`);
  },

  create: async (data: Partial<User>): Promise<User> => {
    return fetchWithAuth<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    return fetchWithAuth<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchWithAuth(`/users/${id}`, { method: 'DELETE' });
  },

  suspend: async (id: string): Promise<void> => {
    await fetchWithAuth(`/users/${id}/suspend`, { method: 'POST' });
  },

  activate: async (id: string): Promise<void> => {
    await fetchWithAuth(`/users/${id}/activate`, { method: 'POST' });
  },
};

// ==================== Analytics ====================

export interface AnalyticsData {
  period: string;
  metrics: Record<string, number>;
  trends: { date: string; values: Record<string, number> }[];
}

export const analytics = {
  getOverview: async (period?: string): Promise<AnalyticsData> => {
    return fetchWithAuth<AnalyticsData>(`/analytics/overview${period ? `?period=${period}` : ''}`);
  },

  getUserMetrics: async (): Promise<Record<string, unknown>> => {
    return fetchWithAuth<Record<string, unknown>>('/analytics/users');
  },

  getRevenueMetrics: async (): Promise<Record<string, unknown>> => {
    return fetchWithAuth<Record<string, unknown>>('/analytics/revenue');
  },

  getEngagementMetrics: async (): Promise<Record<string, unknown>> => {
    return fetchWithAuth<Record<string, unknown>>('/analytics/engagement');
  },

  exportReport: async (type: string, format: string): Promise<Blob> => {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE}/analytics/export?type=${type}&format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.blob();
  },
};

// ==================== System Health ====================

export interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  services: {
    name: string;
    status: 'up' | 'down' | 'degraded';
    latency?: number;
    message?: string;
  }[];
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: {
      in: number;
      out: number;
    };
  };
}

export const health = {
  getStatus: async (): Promise<HealthStatus> => {
    return fetchWithAuth<HealthStatus>('/health');
  },

  getDetailed: async (): Promise<Record<string, unknown>> => {
    return fetchWithAuth<Record<string, unknown>>('/health/detailed');
  },

  getMetrics: async (): Promise<Record<string, unknown>> => {
    return fetchWithAuth<Record<string, unknown>>('/health/metrics');
  },
};

// ==================== Alerts ====================

export interface Alert {
  id: string;
  type: 'system' | 'security' | 'user' | 'transaction' | 'custom';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  metadata?: Record<string, unknown>;
}

export const alerts = {
  list: async (params?: { acknowledged?: boolean; severity?: string; limit?: number }): Promise<Alert[]> => {
    const query = new URLSearchParams();
    if (params?.acknowledged !== undefined) query.set('acknowledged', params.acknowledged.toString());
    if (params?.severity) query.set('severity', params.severity);
    if (params?.limit) query.set('limit', params.limit.toString());
    return fetchWithAuth<Alert[]>(`/alerts?${query.toString()}`);
  },

  getById: async (id: string): Promise<Alert> => {
    return fetchWithAuth<Alert>(`/alerts/${id}`);
  },

  acknowledge: async (id: string): Promise<void> => {
    await fetchWithAuth(`/alerts/${id}/acknowledge`, { method: 'POST' });
  },

  create: async (data: Partial<Alert>): Promise<Alert> => {
    return fetchWithAuth<Alert>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchWithAuth(`/alerts/${id}`, { method: 'DELETE' });
  },
};

// ==================== Notifications ====================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const notifications = {
  list: async (params?: { unreadOnly?: boolean; limit?: number }): Promise<Notification[]> => {
    const query = new URLSearchParams();
    if (params?.unreadOnly) query.set('unread', 'true');
    if (params?.limit) query.set('limit', params.limit.toString());
    return fetchWithAuth<Notification[]>(`/notifications?${query.toString()}`);
  },

  markAsRead: async (id: string): Promise<void> => {
    await fetchWithAuth(`/notifications/${id}/read`, { method: 'POST' });
  },

  markAllAsRead: async (): Promise<void> => {
    await fetchWithAuth('/notifications/read-all', { method: 'POST' });
  },

  delete: async (id: string): Promise<void> => {
    await fetchWithAuth(`/notifications/${id}`, { method: 'DELETE' });
  },
};

// ==================== Audit Logs ====================

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  userEmail?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  status: 'success' | 'failure';
}

export const auditLogs = {
  list: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    entity?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ logs: AuditLog[]; total: number }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.action) query.set('action', params.action);
    if (params?.entity) query.set('entity', params.entity);
    if (params?.userId) query.set('userId', params.userId);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    return fetchWithAuth<{ logs: AuditLog[]; total: number }>(`/audit?${query.toString()}`);
  },

  getById: async (id: string): Promise<AuditLog> => {
    return fetchWithAuth<AuditLog>(`/audit/${id}`);
  },

  export: async (params?: Record<string, string>): Promise<Blob> => {
    const token = getAdminToken();
    const query = new URLSearchParams(params);
    const response = await fetch(`${API_BASE}/audit/export?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.blob();
  },
};

// ==================== Settings ====================

export interface AdminSettings {
  general: {
    siteName: string;
    siteUrl: string;
    maintenanceMode: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  security: {
    mfaRequired: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    passwordRequireSpecial: boolean;
    jwtExpiry: number;
  };
  notifications: {
    emailAlerts: boolean;
    slackWebhook?: string;
    alertEmail?: string;
  };
}

export const settings = {
  get: async (): Promise<AdminSettings> => {
    return fetchWithAuth<AdminSettings>('/settings');
  },

  update: async (data: Partial<AdminSettings>): Promise<AdminSettings> => {
    return fetchWithAuth<AdminSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ==================== API Keys ====================

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  active: boolean;
}

export const apiKeys = {
  list: async (): Promise<ApiKey[]> => {
    return fetchWithAuth<ApiKey[]>('/api-keys');
  },

  create: async (data: { name: string; permissions: string[]; expiresAt?: string }): Promise<ApiKey> => {
    return fetchWithAuth<ApiKey>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  revoke: async (id: string): Promise<void> => {
    await fetchWithAuth(`/api-keys/${id}/revoke`, { method: 'POST' });
  },

  regenerate: async (id: string): Promise<ApiKey> => {
    return fetchWithAuth<ApiKey>(`/api-keys/${id}/regenerate`, { method: 'POST' });
  },
};

// ==================== Backups ====================

export interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  size: number;
  createdAt: string;
  createdBy: string;
  status: 'completed' | 'in_progress' | 'failed';
  downloadUrl?: string;
}

export const backups = {
  list: async (): Promise<Backup[]> => {
    return fetchWithAuth<Backup[]>('/backups');
  },

  create: async (type: 'full' | 'incremental'): Promise<Backup> => {
    return fetchWithAuth<Backup>('/backups', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  },

  download: async (id: string): Promise<Blob> => {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE}/backups/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.blob();
  },

  restore: async (id: string): Promise<void> => {
    await fetchWithAuth(`/backups/${id}/restore`, { method: 'POST' });
  },

  delete: async (id: string): Promise<void> => {
    await fetchWithAuth(`/backups/${id}`, { method: 'DELETE' });
  },
};

// ==================== Security ====================

export interface SecurityStats {
  totalAttempts: number;
  failedAttempts: number;
  blockedIPs: number;
  activeSessions: number;
  suspiciousActivities: number;
}

export interface BlockedIP {
  id: string;
  ip: string;
  reason: string;
  blockedAt: string;
  expiresAt?: string;
  blockedBy: string;
}

export const security = {
  getStats: async (): Promise<SecurityStats> => {
    return fetchWithAuth<SecurityStats>('/security/stats');
  },

  getBlockedIPs: async (): Promise<BlockedIP[]> => {
    return fetchWithAuth<BlockedIP[]>('/security/blocked-ips');
  },

  blockIP: async (data: { ip: string; reason: string; expiresAt?: string }): Promise<void> => {
    await fetchWithAuth('/security/block-ip', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  unblockIP: async (ip: string): Promise<void> => {
    await fetchWithAuth(`/security/unblock-ip/${encodeURIComponent(ip)}`, { method: 'POST' });
  },

  getActiveSessions: async (): Promise<unknown[]> => {
    return fetchWithAuth<unknown[]>('/security/sessions');
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    await fetchWithAuth(`/security/sessions/${sessionId}/revoke`, { method: 'POST' });
  },

  revokeAllSessions: async (): Promise<void> => {
    await fetchWithAuth('/security/sessions/revoke-all', { method: 'POST' });
  },
};

// ==================== Support ====================

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  userEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isAdmin: boolean;
  }[];
}

export const support = {
  listTickets: async (params?: { status?: string; priority?: string }): Promise<SupportTicket[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.priority) query.set('priority', params.priority);
    return fetchWithAuth<SupportTicket[]>(`/support/tickets?${query.toString()}`);
  },

  getTicket: async (id: string): Promise<SupportTicket> => {
    return fetchWithAuth<SupportTicket>(`/support/tickets/${id}`);
  },

  assignTicket: async (id: string, assigneeId: string): Promise<void> => {
    await fetchWithAuth(`/support/tickets/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assigneeId }),
    });
  },

  updateTicketStatus: async (id: string, status: string): Promise<void> => {
    await fetchWithAuth(`/support/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  replyToTicket: async (id: string, message: string): Promise<void> => {
    await fetchWithAuth(`/support/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// Export all services as a single object
const adminConnector = {
  auth: adminAuth,
  dashboard,
  users,
  analytics,
  health,
  alerts,
  notifications,
  auditLogs,
  settings,
  apiKeys,
  backups,
  security,
  support,
  setToken: setAdminToken,
  getToken: getAdminToken,
};

export default adminConnector;
