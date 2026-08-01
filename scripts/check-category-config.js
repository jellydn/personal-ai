#!/usr/bin/env node
// Config-completeness guard: every category used in the portfolio's projects
// array must have a styling row in CATEGORY_STYLE. Wired into CI so future
// catalog additions can't silently fall back to an unstyled card.
//
// Usage: node scripts/check-category-config.js [path-to-index.html]
// Defaults to ./index.html. Exits non-zero with a message on any mismatch.
"use strict";

const fs = require("fs");
const path = require("path");

const file = path.resolve(process.argv[2] || "index.html");
const html = fs.readFileSync(file, "utf8");

// Extract a balanced JS literal after `const NAME =`, tolerating strings,
// comments, and nested brackets. Returns the evaluated value.
function extractLiteral(src, name) {
  const start = src.indexOf(`const ${name} =`);
  if (start === -1) {
    throw new Error(`${path.relative(process.cwd(), file)}: missing "const ${name} ="`);
  }
  let i = src.indexOf("=", start) + 1;
  while (i < src.length && /\s/.test(src[i])) i++;

  const open = src[i];
  const close = open === "[" ? "]" : open === "{" ? "}" : null;
  if (!close) {
    throw new Error(`${path.relative(process.cwd(), file)}: cannot extract ${name} (expected array or object literal)`);
  }

  let depth = 0;
  let quote = null; // null | '"' | "'" | "`"
  let comment = null; // null | "//" | "/*"
  let j = i;
  for (; j < src.length; j++) {
    const ch = src[j];
    const next = src[j + 1];

    if (comment === "//") {
      if (ch === "\n") comment = null;
      continue;
    }
    if (comment === "/*") {
      if (ch === "*" && next === "/") {
        comment = null;
        j++;
      }
      continue;
    }
    if (quote) {
      if (ch === "\\") {
        j++;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === "/" && next === "/") {
      comment = "//";
      j++;
      continue;
    }
    if (ch === "/" && next === "*") {
      comment = "/*";
      j++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === open) {
      depth++;
    } else if (ch === close) {
      depth--;
      if (depth === 0) break;
    }
  }

  const literal = src.slice(i, j + 1);
  // Data-only literal (no DOM, no calls) — safe to evaluate in a fresh scope.
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal})`)();
}

const projects = extractLiteral(html, "projects");
const categoryStyle = extractLiteral(html, "CATEGORY_STYLE");

const used = [...new Set(projects.map((p) => p && p.category).filter(Boolean))].sort();
const defined = Object.keys(categoryStyle).sort();
const missing = used.filter((c) => !defined.includes(c));

if (missing.length > 0) {
  console.error(
    `config guard FAILED: ${projects.length} projects use categories with no CATEGORY_STYLE row: ${missing.join(", ")}`
  );
  console.error(`  used:    ${used.join(", ")}`);
  console.error(`  defined: ${defined.join(", ")}`);
  console.error(`  fix:     add the missing row(s) to CATEGORY_STYLE in ${path.relative(process.cwd(), file)}`);
  process.exit(1);
}

console.log(`config guard OK: ${projects.length} projects, all categories (${used.join(", ")}) have style rows.`);
