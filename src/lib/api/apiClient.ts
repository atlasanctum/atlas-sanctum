/**
 * Centralized API Client
 * Reads auth tokens from storage (JWT + Supabase) and injects them into
 * every outbound request so all CRUD operations are properly authenticated.
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '/api';
const API_V2 = `${API_BASE}/v2`;

// ─── Token resolution ────────────────────────────────────────────────────────

/** Retrieve the best available Bearer token from memory / storage. */
function resolveToken(): string | null {
  // 1. In-memory token set by the JWT auth provider (highest priority)
  if (typeof window !== 'undefined') {
    const inMemory = (window as any).__atlasAccessToken as string | undefined;
    if (inMemory) return inMemory;
  }

  // 2. Supabase session persisted in localStorage
  try {
    const sbKey = Object.keys(localStorage).find((k) =>
      k.startsWith('sb-') && k.endsWith('-auth-token')
    );
    if (sbKey) {
      const raw = localStorage.getItem(sbKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const token =
          parsed?.access_token ||
          parsed?.currentSession?.access_token;
        if (token) return token;
      }
    }
  } catch {
    // ignore parse errors
  }

  return null;
}

/** Store a JWT access token so resolveToken() picks it up immediately. */
export function setGlobalAccessToken(token: string | null) {
  if (typeof window !== 'undefined') {
    (window as any).__atlasAccessToken = token || undefined;
  }
}

// ─── Core request helper ─────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

async function request<T>(
  url: string,
  options: RequestOptions = {},
  retries = 2
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Append query params
  let fullUrl = url;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (qs) fullUrl = `${url}?${qs}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  const token = resolveToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
        credentials: 'include',
        signal: AbortSignal.timeout(30_000),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          msg = body.message || body.error || msg;
        } catch {
          msg = res.statusText || msg;
        }
        // 4xx – don't retry
        if (res.status >= 400 && res.status < 500) throw new Error(msg);
        if (attempt < retries) {
          await delay(1_000 * (attempt + 1));
          continue;
        }
        throw new Error(msg);
      }

      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const text = await res.text();
        return text ? JSON.parse(text) : ({} as T);
      }
      return res.json();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (
        err instanceof Error &&
        (err.name === 'AbortError' || /^HTTP 4/.test(err.message))
      ) {
        throw lastError;
      }
      if (attempt < retries) {
        await delay(1_000 * (attempt + 1));
        continue;
      }
    }
  }

  throw lastError ?? new Error('Request failed');
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Typed response wrappers ─────────────────────────────────────────────────

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; size: number; total: number; totalPages?: number };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (email: string, password: string, displayName?: string, role?: string) =>
    request<any>(`${API_V2}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName, role }),
    }),

  login: (email: string, password: string) =>
    request<any>(`${API_V2}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<any>(`${API_V2}/auth/me`),

  /** Full profile update (PUT replaces all editable fields). */
  updateProfile: (data: Record<string, unknown>) =>
    request<any>(`${API_V2}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** Partial profile update (PATCH). */
  patchProfile: (data: Record<string, unknown>) =>
    request<any>(`${API_V2}/auth/profile`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<any>(`${API_V2}/auth/change-password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getEmailPreferences: () => request<any>(`${API_V2}/auth/email-preferences`),

  updateEmailPreferences: (prefs: {
    marketing: boolean;
    transactional: boolean;
    notifications: boolean;
  }) =>
    request<any>(`${API_V2}/auth/email-preferences`, {
      method: 'PUT',
      body: JSON.stringify(prefs),
    }),

  forgotPassword: (email: string) =>
    request<any>(`${API_V2}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    request<any>(`${API_V2}/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  refreshToken: (refreshToken: string) =>
    request<any>(`${API_V2}/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  deleteAccount: () =>
    request<any>(`${API_V2}/auth/account`, { method: 'DELETE' }),
};

// ─── Marketplace ─────────────────────────────────────────────────────────────

export const marketplaceApi = {
  getMarket: () => request<any>(`${API_V2}/marketplace/riums/market`),

  getListings: (page = 1, size = 20, sortBy = 'price') =>
    request<Paginated<any>>(`${API_V2}/marketplace/riums/listings`, {
      params: { page, size, sortBy },
    }),

  createListing: (data: Record<string, unknown>) =>
    request<any>(`${API_V2}/marketplace/riums`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateListing: (id: string, data: Record<string, unknown>) =>
    request<any>(`${API_V2}/marketplace/riums/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteListing: (id: string) =>
    request<any>(`${API_V2}/marketplace/riums/${id}`, { method: 'DELETE' }),

  purchase: (riuId: string, quantity: number) =>
    request<any>(`${API_V2}/marketplace/riums/${riuId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    }),

  getBonds: () => request<any>(`${API_V2}/marketplace/bonds`),

  purchaseBond: (bondId: string, amount: number) =>
    request<any>(`${API_V2}/marketplace/bonds/${bondId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  getTradingVolume: () => request<any>(`${API_V2}/marketplace/trading-volume`),

  getTransactions: (page = 1, size = 20) =>
    request<Paginated<any>>(`${API_V2}/marketplace/transactions`, {
      params: { page, size },
    }),

  getUserHoldings: (page = 1, size = 50) =>
    request<Paginated<any>>(`${API_V2}/marketplace/holdings`, {
      params: { page, size },
    }),
};

// ─── Projects ────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: (page = 1, size = 20, status?: string, ownedByMe?: boolean) =>
    request<Paginated<any>>(`${API_V2}/projects`, {
      params: { page, size, ...(status ? { status } : {}), ...(ownedByMe ? { ownedByMe: true } : {}) },
    }),

  get: (id: string) => request<any>(`${API_V2}/projects/${id}`),

  create: (data: Record<string, unknown>) =>
    request<any>(`${API_V2}/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    request<any>(`${API_V2}/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: (id: string, data: Record<string, unknown>) =>
    request<any>(`${API_V2}/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<any>(`${API_V2}/projects/${id}`, { method: 'DELETE' }),

  stats: (id: string) => request<any>(`${API_V2}/projects/${id}/stats`),

  approve: (id: string, notes?: string) =>
    request<any>(`${API_V2}/projects/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approverNotes: notes }),
    }),

  reject: (id: string, reason: string) =>
    request<any>(`${API_V2}/projects/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejectionReason: reason }),
    }),

  uploadMedia: async (projectId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const token = resolveToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_V2}/projects/${projectId}/media`, {
      method: 'POST',
      body: form,
      headers,
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Media upload failed');
    return res.json();
  },

  deleteMedia: (projectId: string, mediaId: string) =>
    request<any>(`${API_V2}/projects/${projectId}/media/${mediaId}`, {
      method: 'DELETE',
    }),
};

// ─── Measurements ────────────────────────────────────────────────────────────

export const measurementsApi = {
  forProject: (projectId: string, page = 1) =>
    request<Paginated<any>>(`${API_V2}/measurements/project/${projectId}`, {
      params: { page },
    }),

  get: (id: string) => request<any>(`${API_V2}/measurements/${id}`),

  create: (data: Record<string, unknown>) =>
    request<any>(`${API_V2}/measurements`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    request<any>(`${API_V2}/measurements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<any>(`${API_V2}/measurements/${id}`, { method: 'DELETE' }),

  anomalies: (projectId?: string, page = 1) =>
    request<Paginated<any>>(`${API_V2}/measurements/anomalies`, {
      params: { ...(projectId ? { projectId } : {}), page },
    }),

  trends: (projectId: string, days = 365) =>
    request<any>(`${API_V2}/measurements/${projectId}/trends`, {
      params: { days },
    }),

  forBioregion: (bioregionId: string) =>
    request<any>(`${API_V2}/measurements/bioregion/${bioregionId}`),
};

// ─── Governance ──────────────────────────────────────────────────────────────

export const governanceApi = {
  listProposals: (page = 1, size = 20, status?: string) =>
    request<Paginated<any>>(`${API_V2}/governance/proposals`, {
      params: { page, size, ...(status ? { status } : {}) },
    }),

  getProposal: (id: string) => request<any>(`${API_V2}/governance/proposals/${id}`),

  createProposal: (data: Record<string, unknown>) =>
    request<any>(`${API_V2}/governance/proposals`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  vote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') =>
    request<any>(`${API_V2}/governance/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    }),

  deleteProposal: (id: string) =>
    request<any>(`${API_V2}/governance/proposals/${id}`, { method: 'DELETE' }),
};

// ─── Payments ────────────────────────────────────────────────────────────────

export const paymentsApi = {
  initialize: (data: {
    listingId: string;
    quantity: number;
    email: string;
    amount: number;
    paymentMethod?: string;
    currency?: string;
  }) =>
    request<any>(`${API_BASE}/payments/initialize`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verify: (reference: string, paymentMethod?: string) =>
    request<any>(`${API_BASE}/payments/verify/${reference}`, {
      params: paymentMethod ? { paymentMethod } : undefined,
    }),

  status: (orderId: string) =>
    request<any>(`${API_BASE}/payments/status/${orderId}`),
};

// ─── Bioregions ──────────────────────────────────────────────────────────────

export const bioregionsApi = {
  list: (page = 1, size = 50) =>
    request<Paginated<any>>(`${API_V2}/bioregions`, { params: { page, size } }),

  get: (id: string) => request<any>(`${API_V2}/bioregions/${id}`),
};

export default {
  auth: authApi,
  marketplace: marketplaceApi,
  projects: projectsApi,
  measurements: measurementsApi,
  governance: governanceApi,
  payments: paymentsApi,
  bioregions: bioregionsApi,
};
