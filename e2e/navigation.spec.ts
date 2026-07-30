import { test, expect } from "@playwright/test";

const KEY_PATHS = ["/", "/auth", "/dashboard", "/pricing", "/marketplace", "/portfolio", "/profile", "/governance"];
const AUTH_ERROR = /useAuth must be used within an AuthProvider/i;

for (const path of KEY_PATHS) {
  test(`navigates to ${path} without useAuth errors`, async ({ page }) => {
    const offenders: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && AUTH_ERROR.test(msg.text())) offenders.push(`console: ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      if (AUTH_ERROR.test(err.message)) offenders.push(`pageerror: ${err.message}`);
    });

    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
    expect(offenders, `useAuth errors on ${path}:\n${offenders.join("\n")}`).toEqual([]);
  });
}

test("clicking primary nav links does not trigger useAuth errors", async ({ page }) => {
  const offenders: string[] = [];
  page.on("pageerror", (err) => {
    if (AUTH_ERROR.test(err.message)) offenders.push(err.message);
  });

  await page.goto("/", { waitUntil: "networkidle" });

  for (const label of ["Dashboard", "Sign In"]) {
    const link = page.getByRole("link", { name: new RegExp(`^${label}$`, "i") }).first();
    if (await link.count()) {
      await link.click();
      await page.waitForLoadState("networkidle");
    }
  }

  expect(offenders).toEqual([]);
});