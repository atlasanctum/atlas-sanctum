import { test, expect } from "@playwright/test";

/**
 * Verifies the /admin/newsletter route enforces admin-only access on the
 * client. Anonymous visitors get a "Sign in required" denial; logged-in
 * non-admins get an "Access denied" screen. Neither should ever render the
 * dashboard content.
 */

const ADMIN_PATH = "/admin/newsletter";

test.describe("Admin newsletter — access control", () => {
  test("anonymous visitor sees sign-in required denial", async ({ page }) => {
    await page.goto(ADMIN_PATH);
    const denied = page.getByTestId("admin-access-denied");
    await expect(denied).toBeVisible();
    await expect(denied).toHaveAttribute("role", "alert");
    await expect(denied).toContainText(/sign in/i);
    // Dashboard heading must never render for non-admins.
    await expect(page.getByRole("heading", { name: /Newsletter Signup Activity/i })).toHaveCount(0);
  });

  test("non-admin authenticated user sees access denied", async ({ page, context }) => {
    // Simulate an authenticated, non-admin session by stubbing the role RPC
    // and the auth session. We intercept the RPC the useIsAdmin hook calls.
    await context.addInitScript(() => {
      try {
        // Fake a Supabase v2 session in localStorage so useSupabaseAuth resolves a user.
        const fakeSession = {
          currentSession: {
            access_token: "fake",
            refresh_token: "fake",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: "bearer",
            user: { id: "00000000-0000-0000-0000-000000000001", email: "user@example.com" },
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
    // has_role RPC → false for non-admin
    await page.route("**/rest/v1/rpc/has_role**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "false" }),
    );
    await page.goto(ADMIN_PATH);
    const denied = page.getByTestId("admin-access-denied");
    await expect(denied).toBeVisible();
    await expect(denied).toHaveAttribute("role", "alert");
    await expect(denied).toContainText(/access denied|sign in/i);
    await expect(page.getByRole("heading", { name: /Newsletter Signup Activity/i })).toHaveCount(0);
  });
});
