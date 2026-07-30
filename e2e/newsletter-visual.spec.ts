import { test, expect, devices } from "@playwright/test";

/**
 * Visual regression for the newsletter banner across viewports.
 * Fails if the banner disappears or the page renders blank.
 */

const ROUTES = ["/", "/about", "/marketplace"];

test.describe("Newsletter banner — visual regression", () => {
  for (const route of ROUTES) {
    test(`desktop: banner renders on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(route);
      // Page must not be blank: <main> or any visible content present
      await expect(page.locator("body")).not.toBeEmpty();
      const banner = page.getByText("Get weekly insights on regenerative impact");
      await expect(banner).toBeVisible({ timeout: 8000 });
      await expect(page).toHaveScreenshot(`newsletter-desktop${route.replace(/\//g, "-")}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.05,
      });
    });

    test(`mobile: banner renders on ${route}`, async ({ browser }) => {
      const ctx = await browser.newContext({ ...devices["Pixel 5"] });
      const page = await ctx.newPage();
      await page.goto(route);
      await expect(page.locator("body")).not.toBeEmpty();
      const banner = page.getByText("Get weekly insights on regenerative impact");
      await expect(banner).toBeVisible({ timeout: 8000 });
      await expect(page).toHaveScreenshot(`newsletter-mobile${route.replace(/\//g, "-")}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.05,
      });
      await ctx.close();
    });
  }
});