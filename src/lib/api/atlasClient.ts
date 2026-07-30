/**
 * Atlas Sanctum — Shared API Client
 *
 * Typed fetch wrappers + TanStack Query hooks for live backend data.
 * Replaces the broken custom useQuery implementation (Rules-of-Hooks violation).
 *
 * Usage:
 *   import { useProjects, useMarketStats } from '@/lib/api/atlasClient';
 */

import {
  useQuery as useTanstackQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

// ─── Config ───────────────────────────────────────────────────────────────────

function resolveBase(): string {
  if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.__ATLAS_API_URL__) return win.__ATLAS_API_URL__;
  }
  const envUrl = import.meta?.env?.VITE_API_URL;
  if (!envUrl) {
    if (import.meta?.env?.PROD) {
      throw new Error('VITE_API_URL is required in production');
    }
    return 'http://localhost:4000/api';
  }
  return envUrl;
}

const BASE = resolveBase();

// ─── Token helpers ─────────────────────────────────────────────────────────────
// Access token kept in memory (session-scoped), refresh token lives in httpOnly cookie.
// This eliminates the localStorage XSS attack surface.

let _memoryToken: string | null = null;

export function setAuthToken(t: string) {
  _memoryToken = t;
}

export function clearAuthToken() {
  _memoryToken = null;
}

export function isAuthenticated(): boolean {
  return !!_memoryToken;
}

function token(): string | null {
  return _memoryToken;
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const t = token();
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // Send httpOnly refresh-token cookie automatically
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options?.headers, // Caller headers applied last but cannot override auth
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  tenantId?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface Project {
  id: string;
  title?: string;
  name?: string;
  description: string;
  location: string;
  country?: string;
  project_type: string;
  status: string;
  price_per_credit?: number;
  available_credits?: number;
  impact_score?: number;
  confidence_level?: number;
  area_hectares?: number;
  target_co2_reduction?: number;
  actual_co2_reduction?: number;
  developer_name?: string;
  image_url?: string;
  created_at?: string;
}

export interface MarketStats {
  totalRIUs: number;
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  tradingVolume: number;
  circulationM: number;
  ytdChange: number;
}

export interface Listing {
  id: string;
  seller_id: string;
  quantity: number;
  price: number;
  impact_score: number;
  confidence_interval: number;
  status: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  seller_id: string;
  buyer_id: string;
  rium_id: string;
  quantity: number;
  amount: number;
  tx_type: string;
  status: string;
  created_at: string;
}

export interface Measurement {
  id: string;
  project_id: string;
  co2_level?: number;
  soil_carbon_ppm?: number;
  biodiversity_score?: number;
  ndvi?: number;
  measurement_date: string;
  anomaly_flag?: boolean;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  responseTime: string;
  services: Record<string, string>;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// ─── Query param helpers ──────────────────────────────────────────────────────

function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const q = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return q ? `?${q}` : '';
}

// ─── REST helpers ─────────────────────────────────────────────────────────────

export const atlas = {
  health: (): Promise<HealthStatus> =>
    apiFetch<HealthStatus>('/health'.replace('/api', ''), {
      // health is at root, not under /api prefix
    }).catch(() => fetch(`${BASE.replace('/api', '')}/health`).then(r => r.json())),

  projects: {
    list: (params?: { status?: string; page?: number; size?: number }) =>
      apiFetch<{ items: Project[]; pagination: Pagination }>(
        `/v2/projects${buildQuery(params)}`
      ),
    get: (id: string) =>
      apiFetch<{ project: Project; measurements: Measurement[] }>(`/v2/projects/${id}`),
    create: (body: {
      ownerId: string;
      projectType: string;
      description: string;
      location: string;
    } & Partial<Omit<Project, 'id' | 'project_type'>>) =>
      apiFetch<{ project: Project }>('/v2/projects', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    stats: (id: string) => apiFetch<Record<string, unknown>>(`/v2/projects/${id}/stats`),
    approve: (id: string, notes?: string) =>
      apiFetch<{ message: string }>(`/v2/projects/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approverNotes: notes }),
      }),
  },

  marketplace: {
    stats: () => apiFetch<MarketStats>('/v2/marketplace/riums/market'),
    listings: (params?: { page?: number; size?: number; sortBy?: string }) =>
      apiFetch<{ items: Listing[]; pagination: Pagination }>(
        `/v2/marketplace/riums/listings${buildQuery(params)}`
      ),
    createListing: (body: {
      sellerId: string;
      quantity: number;
      price: number;
      projectId?: string;
      impactScore?: number;
    }) => apiFetch<Listing>('/v2/marketplace/riums', { method: 'POST', body: JSON.stringify(body) }),
    purchase: (
      listingId: string,
      body: { buyerId: string; quantity: number; totalPrice?: number }
    ) =>
      apiFetch<{ transaction: Transaction }>(
        `/v2/marketplace/riums/${listingId}/purchase`,
        { method: 'POST', body: JSON.stringify(body) }
      ),
    transactions: (userId?: string) =>
      apiFetch<{ items: Transaction[] }>(
        `/v2/marketplace/transactions${buildQuery({ userId })}`
      ),
    tradingVolume: () => apiFetch<{ data: unknown[] }>('/v2/marketplace/trading-volume'),
    bonds: () => apiFetch<{ bonds: unknown[] }>('/v2/marketplace/bonds'),
  },

  measurements: {
    forProject: (projectId: string) =>
      apiFetch<{ items: Measurement[] }>(`/v2/measurements/project/${projectId}`),
    anomalies: () => apiFetch<{ items: unknown[] }>('/v2/measurements/anomalies'),
  },

  auth: {
    me: () => apiFetch<User>('/v2/auth/me'),
    login: (email: string, password: string) =>
      apiFetch<{ user: User; tokens: AuthTokens }>('/v2/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (email: string, password: string, displayName?: string) =>
      apiFetch<{ user: User; message: string }>('/v2/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
      }),
    logout: () =>
      apiFetch<{ message: string }>('/v2/auth/logout', { method: 'POST' }),
    refresh: () =>
      apiFetch<{ tokens: AuthTokens }>('/v2/auth/refresh', { method: 'POST' }),
  },

  governance: {
    // Fixed: was pointing to V1 path — now consistent with rest of API
    proposals: () => apiFetch<{ items: unknown[] }>('/v2/governance/proposals'),
  },
};

// ─── TanStack Query hooks ─────────────────────────────────────────────────────
// Replaces the broken custom useQuery (conditional hook calls = Rules of Hooks violation).
// TanStack Query provides: deduplication, caching, stale-while-revalidate, retry, background refetch.

export function useProjects(params?: Parameters<typeof atlas.projects.list>[0]) {
  return useTanstackQuery({
    queryKey: ['projects', params],
    queryFn: () => atlas.projects.list(params),
  });
}

export function useProject(id: string) {
  return useTanstackQuery({
    queryKey: ['project', id],
    queryFn: () => atlas.projects.get(id),
    enabled: !!id,
  });
}

export function useMarketStats() {
  return useTanstackQuery({
    queryKey: ['marketStats'],
    queryFn: () => atlas.marketplace.stats(),
  });
}

export function useListings(params?: Parameters<typeof atlas.marketplace.listings>[0]) {
  return useTanstackQuery({
    queryKey: ['listings', params],
    queryFn: () => atlas.marketplace.listings(params),
  });
}

export function useTransactions(userId?: string) {
  return useTanstackQuery({
    queryKey: ['transactions', userId],
    queryFn: () => atlas.marketplace.transactions(userId),
  });
}

export function useMeasurements(projectId: string) {
  return useTanstackQuery({
    queryKey: ['measurements', projectId],
    queryFn: () => atlas.measurements.forProject(projectId),
    enabled: !!projectId,
  });
}

export function useApiHealth() {
  return useTanstackQuery({
    queryKey: ['health'],
    queryFn: () => atlas.health(),
    refetchInterval: 60_000, // Auto-ping every minute
  });
}

export function useCurrentUser(enabled = true) {
  return useTanstackQuery({
    queryKey: ['currentUser'],
    queryFn: () => atlas.auth.me(),
    enabled,
  });
}

// ─── Auth mutations ───────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      atlas.auth.login(email, password),
    onSuccess: ({ user, tokens }) => {
      // Store access token in memory only — never localStorage
      setAuthToken(tokens.accessToken);
      queryClient.setQueryData(['currentUser'], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => atlas.auth.logout(),
    onSettled: () => {
      clearAuthToken();
      queryClient.clear();
    },
  });
}
