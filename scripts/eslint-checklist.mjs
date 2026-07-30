#!/usr/bin/env node
/**
 * Generate a prioritized checklist of file:line locations causing
 * `no-unsafe-*` (and related type-checked) ESLint warnings.
 *
 * Ranking: files with the most warnings first, then by line number.
 * A file's "impact score" = total no-unsafe-* warnings in that file.
 *
 * Output: eslint-unsafe-checklist.md
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TARGET_RULES = new Set([
  "@typescript-eslint/no-unsafe-argument",
  "@typescript-eslint/no-unsafe-assignment",
  "@typescript-eslint/no-unsafe-call",
  "@typescript-eslint/no-unsafe-member-access",
  "@typescript-eslint/no-unsafe-return",
  "@typescript-eslint/no-unsafe-enum-comparison",
  "@typescript-eslint/no-unsafe-function-type",
]);

const OUT = resolve("eslint-unsafe-checklist.md");
const CACHE = "/tmp/eslint-current.json";

if (!existsSync(CACHE)) {
  try {
    execSync(`npx --no-install eslint . -f json -o ${CACHE}`, { stdio: ["ignore", "ignore", "inherit"] });
  } catch { /* eslint exits non-zero on warnings */ }
}
if (!existsSync(CACHE)) {
  console.error("Could not produce eslint JSON output.");
  process.exit(1);
}

const results = JSON.parse(readFileSync(CACHE, "utf8"));
const cwd = process.cwd();
const byFile = new Map();

for (const file of results) {
  const rel = file.filePath.startsWith(cwd) ? file.filePath.slice(cwd.length + 1) : file.filePath;
  const items = file.messages
    .filter((m) => m.ruleId && TARGET_RULES.has(m.ruleId))
    .map((m) => ({ line: m.line, column: m.column, rule: m.ruleId, message: m.message }));
  if (items.length) byFile.set(rel, items);
}

const ranked = [...byFile.entries()]
  .map(([file, items]) => {
    const byRule = {};
    for (const i of items) byRule[i.rule] = (byRule[i.rule] || 0) + 1;
    return { file, items: items.sort((a, b) => a.line - b.line || a.column - b.column), score: items.length, byRule };
  })
  .sort((a, b) => b.score - a.score);

const total = ranked.reduce((n, r) => n + r.score, 0);
const out = [
  "# no-unsafe-* Prioritized Checklist",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Total \`no-unsafe-*\` warnings: **${total}** across **${ranked.length}** files.`,
  "",
  "Tackle files top-to-bottom; each file's fixes drop the total by the listed score.",
  "",
  "## Top 30 files by impact",
  "",
  "| # | File | Score | Breakdown |",
  "| ---: | --- | ---: | --- |",
  ...ranked.slice(0, 30).map((r, i) => {
    const breakdown = Object.entries(r.byRule)
      .sort((a, b) => b[1] - a[1])
      .map(([rule, n]) => `${rule.replace("@typescript-eslint/", "")}:${n}`)
      .join(", ");
    return `| ${i + 1} | \`${r.file}\` | ${r.score} | ${breakdown} |`;
  }),
  "",
  "## Full checklist",
  "",
];

for (const r of ranked) {
  out.push(`### \`${r.file}\` — ${r.score} warning(s)`);
  out.push("");
  for (const it of r.items) {
    out.push(`- [ ] L${it.line}:${it.column} \`${it.rule.replace("@typescript-eslint/", "")}\` — ${it.message.replace(/\|/g, "\\|")}`);
  }
  out.push("");
}

writeFileSync(OUT, out.join("\n"));
console.log(`Wrote ${OUT} (${ranked.length} files, ${total} warnings).`);
