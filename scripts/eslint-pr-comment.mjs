#!/usr/bin/env node
/**
 * Generate a Markdown PR comment summarizing per-rule ESLint warning deltas
 * versus `.eslint-baseline.json`. Reads `eslint-report.json` (from
 * `npm run lint:report`) and writes `eslint-pr-comment.md`.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASELINE = resolve(".eslint-baseline.json");
const CURRENT = resolve("eslint-report.json");
const OUT = resolve("eslint-pr-comment.md");

if (!existsSync(BASELINE) || !existsSync(CURRENT)) {
  console.error("Missing baseline or current report — run `npm run lint:report`.");
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
const current = JSON.parse(readFileSync(CURRENT, "utf8"));

const rules = new Set([
  ...Object.keys(baseline.byRule ?? {}),
  ...Object.keys(current.byRule ?? {}),
]);

const rows = [...rules]
  .map((rule) => {
    const before = baseline.byRule?.[rule] ?? 0;
    const now = current.byRule?.[rule] ?? 0;
    return { rule, before, now, delta: now - before };
  })
  .sort((a, b) => b.delta - a.delta || b.now - a.now);

const regressions = rows.filter((r) => r.delta > 0);
const improvements = rows.filter((r) => r.delta < 0);
const totalDelta = current.total - baseline.total;
const emoji = totalDelta > 0 ? "🔴" : totalDelta < 0 ? "🟢" : "⚪";

const out = [];
out.push(`## ${emoji} ESLint Warning Deltas`);
out.push("");
out.push(`**Baseline:** ${baseline.total} · **This PR:** ${current.total} · **Δ:** ${totalDelta >= 0 ? "+" : ""}${totalDelta}`);
out.push("");

function table(title, list, open) {
  if (list.length === 0) return;
  out.push(`<details${open ? " open" : ""}><summary><b>${title}</b> (${list.length})</summary>`);
  out.push("");
  out.push("| Rule | Baseline | Current | Δ |");
  out.push("| --- | ---: | ---: | ---: |");
  for (const r of list) {
    out.push(`| \`${r.rule}\` | ${r.before} | ${r.now} | ${r.delta >= 0 ? "+" : ""}${r.delta} |`);
  }
  out.push("</details>");
  out.push("");
}

table("Regressions", regressions, true);
table("Improvements", improvements, false);
if (!regressions.length && !improvements.length) out.push("_No per-rule changes vs baseline._");

writeFileSync(OUT, out.join("\n") + "\n");
console.log(`Wrote ${OUT} (regressions: ${regressions.length}, improvements: ${improvements.length})`);
