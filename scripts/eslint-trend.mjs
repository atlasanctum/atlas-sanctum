#!/usr/bin/env node
/**
 * Append the current ESLint warning counts to a time-series trend log and
 * regenerate a Markdown table + CSV artifact.
 *
 * Inputs:  eslint-report.json (from `npm run lint:report`)
 * Outputs: eslint-trend.csv         — appended per invocation
 *          eslint-trend.md          — regenerated summary table
 *
 * Env: TREND_COMMIT, TREND_REF (optional metadata columns).
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";

const REPORT = resolve("eslint-report.json");
const CSV = resolve("eslint-trend.csv");
const MD = resolve("eslint-trend.md");

if (!existsSync(REPORT)) {
  console.error("Missing eslint-report.json — run `npm run lint:report` first.");
  process.exit(1);
}

const report = JSON.parse(readFileSync(REPORT, "utf8"));
const timestamp = report.generatedAt || new Date().toISOString();
const commit = process.env.TREND_COMMIT || process.env.GITHUB_SHA || "local";
const ref = process.env.TREND_REF || process.env.GITHUB_REF_NAME || "local";

// Load prior rows so we can rebuild the trend markdown.
let rows = [];
if (existsSync(CSV)) {
  const [, ...lines] = readFileSync(CSV, "utf8").trim().split("\n");
  rows = lines.filter(Boolean).map((l) => {
    const [ts, sha, r, rule, count] = l.split(",");
    return { ts, sha, ref: r, rule, count: Number(count) };
  });
} else {
  writeFileSync(CSV, "timestamp,commit,ref,rule,count\n");
}

// Append current snapshot: one row per rule + a __TOTAL__ row.
const snapshot = [
  ...Object.entries(report.byRule).map(([rule, count]) => ({
    ts: timestamp, sha: commit, ref, rule, count,
  })),
  { ts: timestamp, sha: commit, ref, rule: "__TOTAL__", count: report.total },
];
for (const s of snapshot) {
  appendFileSync(CSV, `${s.ts},${s.sha},${s.ref},${s.rule},${s.count}\n`);
}
rows.push(...snapshot);

// Build markdown table: columns = last N snapshots (unique timestamp+commit),
// rows = rules sorted by latest count desc.
const snapshots = [...new Map(rows.map((r) => [`${r.ts}|${r.sha}`, r])).keys()];
const lastN = snapshots.slice(-10); // keep the report readable
const ruleSet = new Set(rows.map((r) => r.rule));
const rulesSorted = [...ruleSet].sort((a, b) => {
  if (a === "__TOTAL__") return -1;
  if (b === "__TOTAL__") return 1;
  const latest = (rule) => rows.filter((r) => r.rule === rule).at(-1)?.count ?? 0;
  return latest(b) - latest(a);
});

const cell = (rule, key) => {
  const [ts, sha] = key.split("|");
  const r = rows.find((x) => x.rule === rule && x.ts === ts && x.sha === sha);
  return r ? String(r.count) : "—";
};

const header = ["Rule", ...lastN.map((k) => {
  const [ts, sha] = k.split("|");
  return `${ts.slice(5, 10)} ${sha.slice(0, 7)}`;
})];

const md = [
  "# ESLint Warnings Trend",
  "",
  `Generated: ${new Date().toISOString()}  ·  Snapshots tracked: ${snapshots.length}  ·  Showing last ${lastN.length}.`,
  "",
  `| ${header.join(" | ")} |`,
  `| ${header.map(() => "---").join(" | ")} |`,
  ...rulesSorted.map((rule) => {
    const label = rule === "__TOTAL__" ? "**Total**" : `\`${rule}\``;
    return `| ${label} | ${lastN.map((k) => cell(rule, k)).join(" | ")} |`;
  }),
  "",
];
writeFileSync(MD, md.join("\n"));
console.log(`Appended snapshot to ${CSV} (${snapshot.length} rows). Regenerated ${MD}.`);
