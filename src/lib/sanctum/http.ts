/**
 * http.ts
 *
 * Shared fetch wrapper used by every API client in the ecosystem.
 * - Automatic JWT injection (reads from in-memory token store)
 * - Exponential back-off retry (server errors only)
 * - Normalised SanctumError for consistent error handling
 * - Deterministic request IDs for tracing across services
 */

export class SanctumError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'SanctumError';
  }
}

// In-memory token store — set once on login, shared across all clients
let _accessToken: string | null = null;

export const tokenStore = {
  set: (token: string) => { _accessToken = token; },
  get: () => _accessToken,
  clear: () => { _accessToken = null; },
};

export async function sanctumFetch<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 2,
): Promise<T> {
  const requestId = crypto.randomUUID();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId,
    ...(options.headers as Record<string, string>),
  };

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  let lastError: SanctumError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(30_000),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as Record<string, unknown>;
        const message = (body['message'] as string | undefined)
          ?? (body['error'] as string | undefined)
          ?? `HTTP ${res.status}`;
        const code = (body['code'] as string | undefined) ?? String(res.status);

        // Never retry 4xx — those are caller errors
        if (res.status >= 400 && res.status < 500) {
          throw new SanctumError(message, res.status, code, requestId);
        }

        lastError = new SanctumError(message, res.status, code, requestId);

        if (attempt < maxRetries) {
          await delay(Math.min(1000 * 2 ** attempt, 8000));
          continue;
        }
        throw lastError;
      }

      const text = await res.text();
      return text ? (JSON.parse(text) as T) : ({} as T);
    } catch (err) {
      if (err instanceof SanctumError) throw err;

      lastError = new SanctumError(
        err instanceof Error ? err.message : String(err),
        0,
        'NETWORK_ERROR',
        requestId,
      );

      if (attempt < maxRetries) {
        await delay(Math.min(1000 * 2 ** attempt, 8000));
        continue;
      }
    }
  }

  throw lastError ?? new SanctumError('Request failed', 0, 'UNKNOWN', requestId);
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
