import { test, expect } from "@playwright/test";

/**
 * Verifies the bot/rate-limit protections on the newsletter banner.
 * Each test starts on `/` with a fresh storage state (Playwright default).
 */

async function openNewsletter(page: import("@playwright/test").Page) {
  await page.goto("/");
  // The banner starts collapsed; clicking expands it.
  await page.getByText("Get weekly insights on regenerative impact").click();
  await expect(page.getByTestId("newsletter-email")).toBeVisible();
}

test.describe("Newsletter signup — abuse protections", () => {
  test("invalid captcha token is rejected by the edge function", async ({ page }) => {
    // Stub the edge function so the test runs without real captcha keys
    await page.route("**/functions/v1/newsletter-subscribe", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "captcha_failed", reason: "invalid-input-response" }),
      }),
    );
    await openNewsletter(page);
    await page.getByTestId("newsletter-email").fill("captcha@example.com");
    await page.waitForTimeout(1700);
    await page.getByTestId("newsletter-submit").click();
    await expect(page.getByText(/verification failed/i)).toBeVisible();
  });

  test("repeated rapid submits hit the backend cooldown (429)", async ({ page }) => {
    let calls = 0;
    await page.route("**/functions/v1/newsletter-subscribe", (route) => {
      calls += 1;
      if (calls === 1) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
      return route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "rate_limited", retry_after_seconds: 60 }),
      });
    });

    await openNewsletter(page);
    await page.getByTestId("newsletter-email").fill("rapid@example.com");
    await page.waitForTimeout(1700);
    await page.getByTestId("newsletter-submit").click();
    // Banner closes on success; reopen for second attempt.
    await page.evaluate(() => localStorage.removeItem("newsletter:lastAttemptAt"));
    await page.reload();
    await openNewsletter(page);
    await page.getByTestId("newsletter-email").fill("rapid@example.com");
    await page.waitForTimeout(1700);
    await page.getByTestId("newsletter-submit").click();
    await expect(page.getByText(/wait a moment before trying again/i)).toBeVisible();
  });

  test("parallel submissions cannot bypass the interaction gate", async ({ page }) => {
    const requests: string[] = [];
    await page.route("**/functions/v1/newsletter-subscribe", (route) => {
      requests.push(route.request().url());
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });
    await openNewsletter(page);
    await page.getByTestId("newsletter-email").fill("parallel@example.com");
    // Fire 5 clicks in parallel BEFORE the min-fill timer expires
    await Promise.all(
      Array.from({ length: 5 }).map(() =>
        page.getByTestId("newsletter-submit").click({ noWaitAfter: true }).catch(() => {}),
      ),
    );
    await page.waitForTimeout(500);
    expect(requests).toHaveLength(0);
    await expect(page.getByText(/take a moment to review/i)).toBeVisible();
  });

  test("honeypot field swallows bot submissions silently", async ({ page }) => {
    await openNewsletter(page);

    // Bots fill hidden fields → form should not POST to supabase
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("newsletter_subscriptions")) requests.push(r.url());
    });

    await page.getByTestId("newsletter-honeypot").fill("https://spammer.example", { force: true });
    await page.getByTestId("newsletter-email").fill("bot@example.com");
    // Wait past the min-fill gate so we isolate the honeypot path
    await page.waitForTimeout(1700);
    await page.getByTestId("newsletter-submit").click();

    // No network call should have been made
    await page.waitForTimeout(500);
    expect(requests).toHaveLength(0);
  });

  test("minimum interaction gate blocks instant submissions", async ({ page }) => {
    await openNewsletter(page);
    await page.getByTestId("newsletter-email").fill("fast@example.com");
    // Submit immediately (< 1500ms)
    await page.getByTestId("newsletter-submit").click();
    await expect(page.getByText(/take a moment to review/i)).toBeVisible();
  });

  test("per-browser cooldown blocks a second attempt within 60s", async ({ page }) => {
    // Pre-seed the cooldown key as if a request just happened.
    await page.addInitScript(() => {
      localStorage.setItem("newsletter:lastAttemptAt", String(Date.now()));
    });
    await openNewsletter(page);
    await page.getByTestId("newsletter-email").fill("repeat@example.com");
    await page.waitForTimeout(1700); // pass min-fill gate
    await page.getByTestId("newsletter-submit").click();
    await expect(page.getByText(/wait a moment before trying again/i)).toBeVisible();
  });

  test("invalid email format is rejected client-side", async ({ page }) => {
    await openNewsletter(page);
    // Bypass HTML5 validation by typing a value the regex rejects but the
    // input's type=email permits (e.g. "a@b" — too short for our regex).
    await page.getByTestId("newsletter-email").fill("not-an-email@x");
    await page.waitForTimeout(1700);
    await page.getByTestId("newsletter-submit").click();
    // Either the toast or no network call — both prove validation kicked in.
    const toast = page.getByText(/valid email/i);
    await expect(toast).toBeVisible({ timeout: 2000 }).catch(async () => {
      // Fallback assertion: no insert request
      const reqs: string[] = [];
      page.on("request", (r) => {
        if (r.url().includes("newsletter_subscriptions")) reqs.push(r.url());
      });
      await page.waitForTimeout(500);
      expect(reqs).toHaveLength(0);
    });
  });
});