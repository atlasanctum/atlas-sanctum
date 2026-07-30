#!/usr/bin/env node
/**
 * Targeted safe auto-fixes that reduce `no-unsafe-*` surface area without
 * changing runtime behavior. Rules covered:
 *
 *   1. `catch (e)`               → `catch (e: unknown)`
 *      (kills implicit-any + downstream unsafe-* in catch blocks)
 *   2. `.catch((e) => …)`        → `.catch((e: unknown) => …)`
 *
 * Any other transformations that "look" safe (blind `as unknown` casts,
 * removing anys) are NOT applied — those need human review. This script
 * only touches syntactic patterns that TS itself now defaults to for new
 * projects (useUnknownInCatchVariables).
 *
 * Also runs `eslint --fix` on the passed files so unused-imports and
 * type-only import rewrites land at the same time.
 *
 * Usage:
 *   node scripts/eslint-safe-autofix.mjs [file ...]
 *   (no args = run over all staged .ts/.tsx via git)
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

function stagedFiles() {
  try {
    return execSync("git diff --cached --name-only --diff-filter=ACMR", { encoding: "utf8" })
      .split("\n")
      .filter((f) => /\.(ts|tsx)$/.test(f) && existsSync(f) && f.startsWith("src/"));
  } catch { return []; }
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : stagedFiles();
if (files.length === 0) {
  console.log("safe-autofix: nothing to do.");
  process.exit(0);
}

let touched = 0;
for (const f of files) {
  if (!existsSync(f)) continue;
  const src = readFileSync(f, "utf8");
  let out = src;
  // catch (e) / catch (err) / catch(_e) without an annotation → add : unknown
  out = out.replace(
    /catch\s*\(\s*([A-Za-z_$][\w$]*)\s*\)/g,
    (_m, id) => `catch (${id}: unknown)`,
  );
  // .catch((e) => …) arrow with a single unannotated identifier param
  out = out.replace(
    /\.catch\(\s*\(\s*([A-Za-z_$][\w$]*)\s*\)\s*=>/g,
    (_m, id) => `.catch((${id}: unknown) =>`,
  );
  if (out !== src) {
    writeFileSync(f, out);
    touched++;
  }
}
console.log(`safe-autofix: rewrote catch bindings in ${touched} file(s).`);

// Chain in eslint --fix for auto-fixable rules (unused-imports, etc.)
try {
  execSync(`npx --no-install eslint --fix ${files.map((f) => JSON.stringify(f)).join(" ")}`,
    { stdio: "inherit" });
} catch { /* non-zero exit is expected when warnings remain */ }
