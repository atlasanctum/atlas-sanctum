#!/usr/bin/env node
/**
 * ESLint warning baseline gate.
 *
 * Usage:
 *   node scripts/eslint-baseline.mjs           # compare current warnings vs .eslint-baseline.json
 *   node scripts/eslint-baseline.mjs --update  # regenerate baseline (after intentional reductions)
 *   node scripts/eslint-baseline.mjs --report  # write a grouped-by-rule report to eslint-report.md/json
 *
 * Exit codes:
 *   0 — total warnings <= baseline, and no rule exceeds its per-rule baseline
 *   1 — new warnings introduced (details printed)
 *   2 — eslint itself failed to run
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASELINE_PATH = resolve(".eslint-baseline.json");
const REPORT_JSON = resolve("eslint-report.json");
const REPORT_MD = resolve("eslint-report.md");

const args = new Set(process.argv.slice(2));
const shouldUpdate = args.has("--update");
const shouldReport = args.has("--report") || shouldUpdate;

function runEslint() {
  try {
    // eslint exits non-zero on errors OR when --max-warnings is exceeded.
    // We only care about the JSON output, so swallow the exit status.
    execSync("npx --no-install eslint . -f json -o /tmp/eslint-current.json", {
      stdio: ["ignore", "ignore", "inherit"],
    });
  } catch {
    // eslint returns 1 whenever there are lint problems; that's expected.
  }
  if (!existsSync("/tmp/eslint-current.json")) {
    console.error("eslint did not produce a report");
    process.exit(2);
  }
  return JSON.parse(readFileSync("/tmp/eslint-current.json", "utf8"));
}

function summarize(results) {
  const byRule = {};
  const byRuleFiles = {};
  let total = 0;
  let errors = 0;
  for (const file of results) {
    for (const msg of file.messages) {
      const rule = msg.ruleId || "(parse)";
      if (msg.severity === 2) {
        errors++;
        continue;
      }
      total++;
      byRule[rule] = (byRule[rule] || 0) + 1;
      byRuleFiles[rule] = byRuleFiles[rule] || new Set();
      byRuleFiles[rule].add(file.filePath);
    }
  }
  return { total, errors, byRule, byRuleFiles };
}

function writeReport(summary) {
  const { total, byRule, byRuleFiles } = summary;
  const sorted = Object.entries(byRule).sort((a, b) => b[1] - a[1]);
  writeFileSync(
    REPORT_JSON,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), total, byRule },
      null,
      2,
    ) + "\n",
  );
  const lines = [
    "# ESLint Warnings Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Total warnings: **${total}**`,
    "",
    "| Rule | Count | Files |",
    "| --- | ---: | ---: |",
    ...sorted.map(
      ([rule, count]) => `| \`${rule}\` | ${count} | ${byRuleFiles[rule].size} |`,
    ),
    "",
  ];
  writeFileSync(REPORT_MD, lines.join("\n"));
  console.log(`Report written: ${REPORT_MD} (${sorted.length} rules)`);
}

const results = runEslint();
const summary = summarize(results);

if (shouldReport) writeReport(summary);

if (shouldUpdate) {
  writeFileSync(
    BASELINE_PATH,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), total: summary.total, byRule: summary.byRule },
      null,
      2,
    ) + "\n",
  );
  console.log(`Baseline updated: total=${summary.total}`);
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  console.error(`No baseline at ${BASELINE_PATH}. Run with --update to create one.`);
  process.exit(2);
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
const regressions = [];
for (const [rule, count] of Object.entries(summary.byRule)) {
  const allowed = baseline.byRule[rule] ?? 0;
  if (count > allowed) {
    regressions.push({ rule, before: allowed, now: count, delta: count - allowed });
  }
}

console.log(`ESLint warnings — baseline: ${baseline.total}, current: ${summary.total}`);

if (regressions.length > 0 || summary.total > baseline.total) {
  console.error("\n❌ New ESLint warnings introduced vs baseline:");
  for (const r of regressions) {
    console.error(`  ${r.rule}: ${r.before} → ${r.now}  (+${r.delta})`);
  }
  if (summary.total > baseline.total) {
    console.error(`\n  total: ${baseline.total} → ${summary.total}  (+${summary.total - baseline.total})`);
  }
  console.error(
    "\nFix the new warnings, or if the change is intentional and warnings were reduced elsewhere,",
  );
  console.error("regenerate the baseline with: npm run lint:baseline:update");
  process.exit(1);
}

console.log("✅ No new ESLint warnings.");