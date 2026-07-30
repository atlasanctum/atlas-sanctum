/**
 * api-client.ts
 *
 * Typed REST client for the Express v2 backend.
 * Replaces the hand-rolled class in src/lib/api/client.ts.
 * Uses sanctumFetch so token management is automatic.
 */

import { sanctumFetch } from './http';
import { SANCTUM_CONFIG } from './config';

const V2 = SANCTUM_CONFIG.api.v2;

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; size: number; total: number; totalPages?: number };
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  tenantId?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLogin?: string;
  segment?: string;
  onboardingCompleted?: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (email: string, password: string, displayName?: string, role?: string) =>
    sanctumFetch<APIResponse<{ user: AuthUser; message: string }>>(`${V2}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName, role }),
    }),

  login: (email: string, password: string) =>
    sanctumFetch<APIResponse<{ user: AuthUser; tokens: TokenPair }>>(`${V2}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => sanctumFetch<APIResponse<AuthUser>>(`${V2}/auth/me`),

  refresh: (refreshToken: string) =>
    sanctumFetch<APIResponse<{ tokens: TokenPair }>>(`${V2}/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  updateProfile: (updates: Partial<AuthUser>) =>
    sanctumFetch<APIResponse<AuthUser>>(`${V2}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  forgotPassword: (email: string) =>
    sanctumFetch<APIResponse<{ message: string }>>(`${V2}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    sanctumFetch<APIResponse<{ message: string }>>(`${V2}/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// ─── Marketplace ──────────────────────────────────────────────────────────────

export const marketplaceApi = {
  getMarket:    () => sanctumFetch<APIResponse<unknown>>(`${V2}/marketplace/riums/market`),
  getListings:  (page = 1, size = 20, sortBy = 'price') =>
    sanctumFetch<Paginated<unknown>>(`${V2}/marketplace/riums/listings?page=${page}&size=${size}&sortBy=${sortBy}`),
  createListing: (data: unknown) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/marketplace/riums`, { method: 'POST', body: JSON.stringify(data) }),
  purchaseRIU:  (riuId: string, buyerId: string, quantity: number) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/marketplace/riums/${riuId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ buyerId, quantity }),
    }),
  getBonds:     () => sanctumFetch<APIResponse<unknown>>(`${V2}/marketplace/bonds`),
  purchaseBond: (bondId: string, buyerId: string, amount: number) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/marketplace/bonds/${bondId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ buyerId, amount }),
    }),
  getTradingVolume:    () => sanctumFetch<APIResponse<unknown>>(`${V2}/marketplace/trading-volume`),
  getTransactions:     (userId?: string, page = 1) =>
    sanctumFetch<Paginated<unknown>>(`${V2}/marketplace/transactions?userId=${userId ?? ''}&page=${page}`),
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  list:    (page = 1, size = 20, status?: string) =>
    sanctumFetch<Paginated<unknown>>(
      `${V2}/projects?page=${page}&size=${size}${status ? `&status=${status}` : ''}`,
    ),
  get:     (id: string) => sanctumFetch<APIResponse<unknown>>(`${V2}/projects/${id}`),
  create:  (data: unknown) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/projects`, { method: 'POST', body: JSON.stringify(data) }),
  update:  (id: string, data: unknown) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  stats:   (id: string) => sanctumFetch<APIResponse<unknown>>(`${V2}/projects/${id}/stats`),
  approve: (id: string, notes?: string) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/projects/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approverNotes: notes }),
    }),
  reject:  (id: string, reason: string) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/projects/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejectionReason: reason }),
    }),
};

// ─── Measurements ─────────────────────────────────────────────────────────────

export const measurementsApi = {
  byProject:  (projectId: string, page = 1) =>
    sanctumFetch<Paginated<unknown>>(`${V2}/measurements/project/${projectId}?page=${page}`),
  record:     (data: unknown) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/measurements`, { method: 'POST', body: JSON.stringify(data) }),
  get:        (id: string) => sanctumFetch<APIResponse<unknown>>(`${V2}/measurements/${id}`),
  anomalies:  (projectId?: string, page = 1) =>
    sanctumFetch<Paginated<unknown>>(
      `${V2}/measurements/anomalies?projectId=${projectId ?? ''}&page=${page}`,
    ),
  trends:     (projectId: string, days = 365) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/measurements/${projectId}/trends?days=${days}`),
  bioregion:  (bioregionId: string) =>
    sanctumFetch<APIResponse<unknown>>(`${V2}/measurements/bioregion/${bioregionId}`),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsApi = {
  initialize: (data: {
    listingId: string; quantity: number; buyerId: string;
    email: string; amount: number; paymentMethod?: string; currency?: string;
  }) =>
    sanctumFetch<APIResponse<unknown>>(`${SANCTUM_CONFIG.api.base}/payments/initialize`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verify: (reference: string, paymentMethod?: string) =>
    sanctumFetch<APIResponse<unknown>>(
      `${SANCTUM_CONFIG.api.base}/payments/verify/${reference}${paymentMethod ? `?paymentMethod=${paymentMethod}` : ''}`,
    ),
  status: (orderId: string) =>
    sanctumFetch<APIResponse<unknown>>(`${SANCTUM_CONFIG.api.base}/payments/status/${orderId}`),
};
