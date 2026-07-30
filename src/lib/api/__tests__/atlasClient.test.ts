/**
 * Atlas Sanctum — atlasClient unit tests
 *
 * Covers the critical fixes from the security review:
 *  1. Token lives in memory only — never touches localStorage
 *  2. apiFetch merges headers correctly
 *  3. Query params with undefined values never produce "undefined" in URLs
 *  4. Hooks are backed by TanStack Query (no Rules-of-Hooks violation)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import {
  setAuthToken,
  clearAuthToken,
  isAuthenticated,
  apiFetch,
  useMarketStats,
  useProjects,
  atlas,
} from '../atlasClient';

// ─── Token memory storage ─────────────────────────────────────────────────────

describe('Token memory storage', () => {
  beforeEach(() => clearAuthToken());

  it('isAuthenticated returns false before token is set', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('isAuthenticated returns true after setAuthToken', () => {
    setAuthToken('test-token-xyz');
    expect(isAuthenticated()).toBe(true);
  });

  it('isAuthenticated returns false after clearAuthToken', () => {
    setAuthToken('test-token-xyz');
    clearAuthToken();
    expect(isAuthenticated()).toBe(false);
  });

  it('does NOT write to localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem');
    setAuthToken('should-not-touch-localstorage');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does NOT read from localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem');
    isAuthenticated();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ─── apiFetch header merging ──────────────────────────────────────────────────

describe('apiFetch header merging', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearAuthToken();
  });

  it('sends Authorization header when token is set', async () => {
    setAuthToken('my-access-token');
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiFetch('/v2/test');

    const [, init] = mockFetch.mock.calls[0];
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer my-access-token');
  });

  it('does not send Authorization header when no token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiFetch('/v2/test');

    const [, init] = mockFetch.mock.calls[0];
    expect((init.headers as Record<string, string>)['Authorization']).toBeUndefined();
  });

  it('merges caller headers without dropping Content-Type', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiFetch('/v2/test', { headers: { 'X-Custom': 'value' } });

    const [, init] = mockFetch.mock.calls[0];
    const h = init.headers as Record<string, string>;
    expect(h['Content-Type']).toBe('application/json');
    expect(h['X-Custom']).toBe('value');
  });

  it('throws with server error message on non-OK response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Resource not found' }),
    }));

    await expect(apiFetch('/v2/missing')).rejects.toThrow('Resource not found');
  });

  it('falls back to statusText when error body is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => { throw new Error('not json'); },
    }));

    await expect(apiFetch('/v2/broken')).rejects.toThrow('Internal Server Error');
  });
});

// ─── Query param building ─────────────────────────────────────────────────────

describe('Query params — no "undefined" strings', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not include undefined values in the request URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], pagination: {} }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await atlas.projects.list({ page: 1, size: undefined }).catch(() => {});

    const [url] = mockFetch.mock.calls[0] ?? [];
    expect(String(url)).not.toContain('undefined');
  });

  it('omits the query string entirely when all params are empty', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], pagination: {} }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await atlas.marketplace.listings({}).catch(() => {});

    const [url] = mockFetch.mock.calls[0] ?? [];
    expect(String(url)).not.toContain('?');
  });
});

// ─── TanStack Query hooks ─────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useMarketStats hook', () => {
  afterEach(() => vi.restoreAllMocks());

  it('transitions to success state with mocked data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        totalRIUs: 1000,
        currentPrice: 45.5,
        highPrice: 50,
        lowPrice: 40,
        tradingVolume: 500000,
        circulationM: 24.5,
        ytdChange: 12.3,
      }),
    }));

    const { result } = renderHook(() => useMarketStats(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.currentPrice).toBe(45.5);
  });

  it('transitions to error state on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: async () => ({ message: 'Service Unavailable' }),
    }));

    const { result } = renderHook(() => useMarketStats(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe('useProjects hook', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not re-fetch when re-rendered with same params', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], pagination: { page: 1, total: 0 } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const params = { status: 'active', page: 1 };
    const { result, rerender } = renderHook(() => useProjects(params), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const callsBefore = mockFetch.mock.calls.length;
    rerender();
    // TanStack Query deduplicates — no new network call for same query key
    expect(mockFetch.mock.calls.length).toBe(callsBefore);
  });
});
