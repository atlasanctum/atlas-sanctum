/**
 * useAuditLogs Hook
 * 
 * Custom hook for fetching and managing audit logs.
 * Provides caching, loading states, and error handling.
 */

import { useState, useEffect, useCallback } from 'react';

interface AuditLog {
  id: string;
  userId?: string;
  organizationId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  errorMessage?: string;
  timestamp: Date;
}

interface AuditFilters {
  userId?: string;
  organizationId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  status?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

interface UseAuditLogsResult {
  data: AuditLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAuditLogs(filters: AuditFilters = {}): UseAuditLogsResult {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.organizationId) params.append('organizationId', filters.organizationId);
      if (filters.action) params.append('action', filters.action);
      if (filters.resource) params.append('resource', filters.resource);
      if (filters.resourceId) params.append('resourceId', filters.resourceId);
      if (filters.status) params.append('status', filters.status);
      if (filters.from) params.append('from', filters.from.toISOString());
      if (filters.to) params.append('to', filters.to.toISOString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      // Fetch from API
      const response = await fetch(`/api/audit/logs?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch audit logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return {
    data,
    loading,
    error,
    refetch: fetchAuditLogs,
  };
}

/**
 * Hook for fetching audit statistics
 */
export function useAuditStatistics(organizationId: string, period?: { from: Date; to: Date }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('organizationId', organizationId);
      
      if (period?.from) params.append('from', period.from.toISOString());
      if (period?.to) params.append('to', period.to.toISOString());

      const response = await fetch(`/api/audit/statistics?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch statistics: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId, period]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { data, loading, error, refetch: fetchStatistics };
}

/**
 * Hook for fetching action breakdown
 */
export function useActionBreakdown(organizationId: string, period?: { from: Date; to: Date }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBreakdown = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('organizationId', organizationId);
      
      if (period?.from) params.append('from', period.from.toISOString());
      if (period?.to) params.append('to', period.to.toISOString());

      const response = await fetch(`/api/audit/actions?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch action breakdown: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch action breakdown');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch action breakdown:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId, period]);

  useEffect(() => {
    fetchBreakdown();
  }, [fetchBreakdown]);

  return { data, loading, error, refetch: fetchBreakdown };
}

/**
 * Hook for fetching resource breakdown
 */
export function useResourceBreakdown(organizationId: string, period?: { from: Date; to: Date }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBreakdown = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('organizationId', organizationId);
      
      if (period?.from) params.append('from', period.from.toISOString());
      if (period?.to) params.append('to', period.to.toISOString());

      const response = await fetch(`/api/audit/resources?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch resource breakdown: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch resource breakdown');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch resource breakdown:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId, period]);

  useEffect(() => {
    fetchBreakdown();
  }, [fetchBreakdown]);

  return { data, loading, error, refetch: fetchBreakdown };
}

/**
 * Hook for fetching user activity
 */
export function useUserActivity(organizationId: string, period?: { from: Date; to: Date }, limit: number = 20) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('organizationId', organizationId);
      params.append('limit', limit.toString());
      
      if (period?.from) params.append('from', period.from.toISOString());
      if (period?.to) params.append('to', period.to.toISOString());

      const response = await fetch(`/api/audit/users?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user activity: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch user activity');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch user activity:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId, period, limit]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return { data, loading, error, refetch: fetchActivity };
}

/**
 * Hook for exporting audit logs
 */
export function useAuditExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportLogs = useCallback(async (
    filters: AuditFilters,
    format: 'csv' | 'json' = 'csv'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.organizationId) params.append('organizationId', filters.organizationId);
      if (filters.action) params.append('action', filters.action);
      if (filters.resource) params.append('resource', filters.resource);
      if (filters.resourceId) params.append('resourceId', filters.resourceId);
      if (filters.status) params.append('status', filters.status);
      if (filters.from) params.append('from', filters.from.toISOString());
      if (filters.to) params.append('to', filters.to.toISOString());

      const response = await fetch(`/api/audit/export/${format}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to export audit logs: ${response.statusText}`);
      }

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to export audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, exportLogs };
}
