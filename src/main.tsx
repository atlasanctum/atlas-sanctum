// @ts-nocheck
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { AdminProvider } from './contexts/AdminContext.tsx';
import App from './App.tsx';
import './index.css';
import './App.css';
import featureFlags from './lib/featureFlags';
import { initErrorReporting } from './lib/errorReporting';
import { sanctumAuth, tokenStore } from './lib/sanctum';

initErrorReporting();

// Restore JWT token — synchronous localStorage read, safe at module level
try {
  const saved = sanctumAuth.restore();
  if (saved) tokenStore.set(saved.tokens.accessToken);
} catch { /* renders unauthenticated */ }

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

async function bootstrap() {
  try {
    const res = await fetch('/api/flags', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const flags = await res.json() as Record<string, unknown>;
      featureFlags.initFeatureFlags(flags);
    }
  } catch {
    // ignore — app uses defaults
  }

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AdminProvider>
              <App />
              <Toaster
                position="bottom-right"
                expand={false}
                richColors
                closeButton
                theme="system"
              />
            </AdminProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}

bootstrap().catch(console.error);
