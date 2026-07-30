import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const ENV = import.meta.env.MODE;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const BACKEND_ERROR_ENDPOINT =
  (import.meta.env.VITE_ERROR_REPORT_ENDPOINT as string | undefined) ||
  (SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/client-errors` : "/api/client-errors");

let initialized = false;

export function initErrorReporting() {
  if (initialized) return;
  initialized = true;

  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: ENV,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
      integrations: [Sentry.browserTracingIntegration()],
    });
  }

  // Fallback: window.onerror + unhandledrejection -> backend
  window.addEventListener("error", (event) => {
    reportToBackend({
      type: "error",
      message: event.message,
      stack: event.error?.stack,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason: any = event.reason;
    reportToBackend({
      type: "unhandledrejection",
      message: typeof reason === "string" ? reason : reason?.message ?? "Unknown rejection",
      stack: reason?.stack,
    });
  });
}

export function setErrorUser(user: { id?: string; email?: string } | null) {
  if (SENTRY_DSN) Sentry.setUser(user);
  currentUser = user;
}

let currentUser: { id?: string; email?: string } | null = null;
let currentAuthState: Record<string, unknown> | null = null;

export function setErrorAuthState(state: Record<string, unknown> | null) {
  currentAuthState = state;
  if (SENTRY_DSN) Sentry.setContext("auth", state);
  // Drop a breadcrumb on every auth state transition so subsequent errors
  // carry the history of how we got here (loading → authenticated → role change).
  Sentry.addBreadcrumb({
    category: "auth",
    type: "info",
    level: "info",
    message: "auth state changed",
    data: state ?? undefined,
    timestamp: Date.now() / 1000,
  });
}

export function addAuthBreadcrumb(message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    category: "auth",
    type: "info",
    level: "info",
    message,
    data,
    timestamp: Date.now() / 1000,
  });
}

async function reportToBackend(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify({
      ...payload,
      route: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      timestamp: new Date().toISOString(),
      user: currentUser,
      authState: currentAuthState,
      env: ENV,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(BACKEND_ERROR_ENDPOINT, new Blob([body], { type: "application/json" }));
    } else {
      await fetch(BACKEND_ERROR_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* swallow — never throw from error reporter */
  }
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;