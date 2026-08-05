#!/usr/bin/env node
// Heuristic scanner for leftover English UI text during the pt-BR localization pass
// (see plans/pt-br-localization.md). Flags likely-English JSX text nodes and common
// user-facing attributes (placeholder/title/aria-label/alt/label) so a human can review
// them — it is a review aid, not a correctness gate: false positives (code-ish tokens,
// brand names) and false negatives (short strings, awkward phrasing) are both expected.
//
// Usage:
//   node scripts/check-pt-br-strings.mjs <path> [<path> ...]
//   node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/LoginPage.tsx
//   node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/components/AppShell
//
// Exit code is always 0 — this is advisory, run it and read the output.

import { readFileSync, statSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const ENGLISH_MARKERS = [
  "\\bthe\\b", "\\band\\b", "\\byou\\b", "\\byour\\b", "\\bplease\\b", "\\bclick\\b",
  "\\bsave\\b", "\\bcancel\\b", "\\bsign in\\b", "\\bsign up\\b", "\\blog in\\b",
  "\\bloading\\b", "\\berror\\b", "\\bdelete\\b", "\\badd\\b", "\\bremove\\b",
  "\\bcreate\\b", "\\bedit\\b", "\\bsettings\\b", "\\bconnect\\b", "\\bconnected\\b",
  "\\bnot connected\\b", "\\bconfirm\\b", "\\bcontinue\\b", "\\bback\\b", "\\bnext\\b",
  "\\bclose\\b", "\\bopen\\b", "\\bnew\\b", "\\bname\\b", "\\bemail\\b", "\\bpassword\\b",
  "\\bwelcome\\b", "\\bgetting started\\b", "\\btry again\\b", "\\bsomething went wrong\\b",
  "\\bare you sure\\b", "\\bthis will\\b", "\\byou can\\b", "\\byou don't\\b", "\\bunable to\\b",
  "\\bfailed to\\b", "\\bsuccessfully\\b", "\\bupdate\\b", "\\bupdated\\b", "\\bshare\\b",
  "\\bsearch\\b", "\\bselect\\b", "\\bchoose\\b", "\\brequired\\b", "\\boptional\\b",
];
const ENGLISH_RE = new RegExp(ENGLISH_MARKERS.join("|"), "i");

// Portuguese-only diacritics/digraphs — if present, treat as already translated even if it
// also happens to contain an English marker word (e.g. "conectado" won't match, but this
// guards short mixed strings).
const PT_HINT_RE = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]|\bção\b|\bvocê\b|\bnão\b/i;

const JSX_TEXT_RE = />([^<>{}\n][^<>{}\n]{2,120})</g;
const ATTR_RE = /\b(placeholder|title|aria-label|alt|label)=["']([^"']{2,120})["']/g;

function shouldSkip(text) {
  const trimmed = text.trim();
  if (trimmed.length < 3) return true;
  if (/^[{}\s]*$/.test(trimmed)) return true;
  if (/^[A-Z_][A-Z0-9_]*$/.test(trimmed)) return true; // CONST_CASE identifiers
  if (/^[a-zA-Z0-9_.\-/]+$/.test(trimmed) && !/[a-z] [a-z]/i.test(trimmed)) return true; // single tokens, paths, className-ish
  return false;
}

function scanFile(path) {
  const src = readFileSync(path, "utf8");
  const hits = [];
  for (const [re, kind] of [[JSX_TEXT_RE, "text"], [ATTR_RE, "attr"]]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const text = kind === "text" ? m[1] : m[2];
      if (shouldSkip(text)) continue;
      if (!ENGLISH_RE.test(text)) continue;
      if (PT_HINT_RE.test(text)) continue;
      const line = src.slice(0, m.index).split("\n").length;
      hits.push({ line, kind, text: text.trim() });
    }
  }
  return hits;
}

function walk(path, out = []) {
  const st = statSync(path);
  if (st.isDirectory()) {
    if (/node_modules|\.wrangler|dist/.test(path)) return out;
    for (const entry of readdirSync(path)) walk(join(path, entry), out);
  } else if ([".tsx", ".ts"].includes(extname(path)) && !path.endsWith(".test.tsx") && !path.endsWith(".test.ts")) {
    out.push(path);
  }
  return out;
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("Usage: node scripts/check-pt-br-strings.mjs <path> [<path> ...]");
  process.exit(1);
}

let totalHits = 0;
for (const target of targets) {
  const files = walk(target);
  for (const file of files) {
    const hits = scanFile(file);
    for (const hit of hits) {
      console.log(`${file}:${hit.line} [${hit.kind}] ${hit.text}`);
      totalHits++;
    }
  }
}
console.log(`\n${totalHits} possible untranslated string(s) flagged. Review each — this is a heuristic, not a gate.`);
