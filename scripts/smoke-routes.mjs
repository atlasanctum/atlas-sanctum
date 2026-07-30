#!/usr/bin/env node
/**
 * Route smoke test: visits every app route headlessly and fails if any
 * console.error / pageerror is observed. Run against `vite preview`.
 *
 * Usage:
 *   npm run build
 *   npm run preview &
 *   node scripts/smoke-routes.mjs http://localhost:4173
 */
import puppeteer from "puppeteer";
import { ROUTES } from "./routes.mjs";

const BASE = process.argv[2] || process.env.SMOKE_BASE_URL || "http://localhost:4173";

const IGNORE_PATTERNS = [
  /React Router Future Flag/i,
  /Download the React DevTools/i,
  /\[vite\]/i,
];

function shouldIgnore(text) {
  return IGNORE_PATTERNS.some((re) => re.test(text));
}

const failures = [];

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

for (const route of ROUTES) {
  const page = await browser.newPage();
  const errors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error" && !shouldIgnore(msg.text())) errors.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    if (!shouldIgnore(err.message)) errors.push(`pageerror: ${err.message}`);
  });

  const url = `${BASE}${route}`;
  try {
    const resp = await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
    if (!resp || !resp.ok()) errors.push(`HTTP ${resp ? resp.status() : "no-response"}`);
    await new Promise((r) => setTimeout(r, 500));
  } catch (e) {
    errors.push(`navigation: ${e.message}`);
  }

  if (errors.length) {
    failures.push({ route, errors });
    console.error(`FAIL ${route}\n  - ${errors.join("\n  - ")}`);
  } else {
    console.log(`PASS ${route}`);
  }

  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} route(s) failed smoke test.`);
  process.exit(1);
}
console.log(`\nAll ${ROUTES.length} routes passed.`);