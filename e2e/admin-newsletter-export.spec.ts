import { test, expect } from "@playwright/test";

/**
 * Verifies the admin CSV export with time window filtering. We stub the
 * Supabase REST call so the dashboard renders deterministic rows, then
 * trigger the export button and inspect the downloaded CSV content.
 */

const ADMIN_PATH = "/admin/newsletter";

const SAMPLE_ROWS = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "alice@example.com",
    ip_address: "10.0.0.1",
    succeeded: true,
    reason: null,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "bot@example.com",
    ip_address: "10.0.0.2",
    succeeded: false,
    reason: "captcha_failed",
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

test.describe("Admin newsletter — CSV export", () => {
  test.beforeEach(async ({ context, page }) => {
    // Authenticate + grant admin role via stubbed RPC.
    await context.addInitScript(() => {
      try {
        const fakeSession = {
          currentSession: {
            access_token: "fake",
            refresh_token: "fake",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: "bearer",
            user: { id: "00000000-0000-0000-0000-000000000099", email: "admin@example.com" },
          },
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        };
        for (const k of Object.keys(localStorage)) {
          if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
            localStorage.setItem(k, JSON.stringify(fakeSession));
          }
        }
      } catch {
        /* noop */
      }
    });
    await page.route("**/rest/v1/rpc/has_role**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "true" }),
    );
    await page.route("**/rest/v1/newsletter_subscription_attempts**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(SAMPLE_ROWS),
      }),
    );
  });

  test("export downloads CSV with hashed identifiers and outcome columns", async ({ page }) => {
    await page.goto(ADMIN_PATH);
    await expect(page.getByRole("heading", { name: /Newsletter Signup Activity/i })).toBeVisible();

    // Change time window to exercise the filter control.
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /Last 24 hours/i }).click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("newsletter-export-csv").click(),
    ]);

    const path = await download.path();
    expect(path).toBeTruthy();
    const fs = await import("node:fs/promises");
    const text = await fs.readFile(path!, "utf-8");
    const [header, ...rows] = text.trim().split(/\r?\n/);

    // Header columns must match the documented hashed export schema.
    expect(header).toBe("created_at,email_hash,ip_hash,succeeded,reason");
    expect(rows.length).toBe(SAMPLE_ROWS.length);

    // No raw PII should appear in the CSV.
    expect(text).not.toContain("alice@example.com");
    expect(text).not.toContain("10.0.0.1");

    // Outcome columns are present and meaningful.
    expect(text).toMatch(/"true"/);
    expect(text).toMatch(/"captcha_failed"/);

    // Filename reflects the chosen window.
    expect(download.suggestedFilename()).toMatch(/newsletter-attempts-24h-/);
  });
});
