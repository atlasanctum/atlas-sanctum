#!/usr/bin/env node
/**
 * Pre-deploy verification:
 *  1) Run production build (vite build)
 *  2) Verify critical entry/import paths resolved into the bundle
 *  3) Verify lazy/route chunks for key pages exist
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");

function fail(msg) {
  console.error(`pre-deploy FAILED: ${msg}`);
  process.exit(1);
}

console.log("→ vite build");
try {
  execSync("npx vite build", { stdio: "inherit" });
} catch {
  fail("vite build returned non-zero");
}

if (!fs.existsSync(distDir)) fail("dist/ missing after build");

const indexHtml = path.join(distDir, "index.html");
if (!fs.existsSync(indexHtml)) fail("dist/index.html missing");
const html = fs.readFileSync(indexHtml, "utf8");
if (!/<div id="root">/.test(html)) fail("dist/index.html missing #root mount");
if (!/<script[^>]+type="module"/.test(html)) fail("dist/index.html missing module script");

// Walk the dist tree and search for required tokens across all bundled JS.
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith(".js")) out.push(p);
  }
  return out;
}

const jsFiles = walk(distDir);
const haystack = jsFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n");

const REQUIRED_TOKENS = [
  "BrowserRouter",
  "/pricing",
  "/marketplace",
  "/dashboard",
  "/checkout",
];

const missing = REQUIRED_TOKENS.filter((t) => !haystack.includes(t));
if (missing.length) fail(`missing tokens in bundle: ${missing.join(", ")}`);

console.log(`✓ build OK (${jsFiles.length} JS chunks, all required routes present)`);