import { test, expect } from '@playwright/test';

/**
 * Unauthenticated users hitting protected donor routes must be redirected
 * to /auth with a ?next= param that preserves where they were going.
 */
const PROTECTED = [
  { path: '/dashboard/donor', label: 'donor dashboard' },
  { path: '/project/demo-project-123', label: 'project detail' },
];

for (const { path, label } of PROTECTED) {
  test(`redirects to /auth with next when visiting ${label} logged out`, async ({ page, context }) => {
    // Ensure no auth state carries over.
    await context.clearCookies();
    await page.addInitScript(() => {
      try { window.localStorage.clear(); window.sessionStorage.clear(); } catch { /* noop */ }
    });

    await page.goto(path, { waitUntil: 'networkidle' });
    // Router replace may take a tick.
    await page.waitForURL(/\/auth\?next=/i, { timeout: 5_000 });

    const url = new URL(page.url());
    expect(url.pathname).toBe('/auth');
    const next = url.searchParams.get('next');
    expect(next, 'next param should be set').not.toBeNull();
    // Decoded next should equal the originally requested path.
    expect(decodeURIComponent(next!)).toBe(path);
  });
}