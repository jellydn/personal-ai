#!/usr/bin/env node
// JSON-LD smoke test: every showcase page must carry at least one
// application/ld+json block that (a) parses as valid JSON, (b) declares an
// @context, and (c) agrees with the page's canonical URL — its `url` field
// must equal the canonical exactly, and its `@id` must be the canonical URL
// or the canonical plus a `#fragment` (e.g. `...#page`). Wired into CI so a
// malformed block or a drifted canonical can't ship silently.
//
// Usage: node scripts/check-json-ld.js [path-to-page-or-dir ...]
// Defaults to scanning ./showcase/*.html. Exits non-zero on any failure.
"use strict";

const fs = require("fs");
const path = require("path");

function rel(p) {
  return path.relative(process.cwd(), p);
}

// Collect .html files: explicit args (files or dirs), else the showcase dir.
function collectPages(args) {
  const targets = args.length ? args : ["showcase"];
  const pages = [];
  for (const t of targets) {
    const p = path.resolve(t);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      for (const f of fs.readdirSync(p).sort()) {
        if (f.endsWith(".html")) pages.push(path.join(p, f));
      }
    } else if (st.isFile() && p.endsWith(".html")) {
      pages.push(p);
    }
  }
  return pages;
}

// Extract the canonical URL from a page's <link rel="canonical"> tag.
function extractCanonical(html, file) {
  const m = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i.exec(html);
  if (!m) {
    throw new Error(`${rel(file)}: missing <link rel="canonical">`);
  }
  return m[1];
}

// Extract and parse every <script type="application/ld+json"> block.
// Returns an array of parsed data objects. Throws if a block is malformed.
function extractJsonLd(html, file) {
  const blocks = [];
  const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch (e) {
      throw new Error(`${rel(file)}: invalid JSON-LD block (${e.message})`);
    }
  }
  return blocks;
}

let checks = 0;
function assert(cond, label) {
  checks++;
  if (!cond) {
    console.error(`  ✗ ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ ${label}`);
  }
}

const pages = collectPages(process.argv.slice(2));
if (pages.length === 0) {
  console.error("json-ld guard: no .html pages found to check.");
  process.exit(1);
}

console.log(`json-ld guard: checking ${pages.length} page(s)`);

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  console.log(`  ${rel(file)}`);

  let canonical;
  try {
    canonical = extractCanonical(html, file);
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
    process.exitCode = 1;
    checks++;
    continue;
  }
  assert(true, `canonical present: ${canonical}`);

  let blocks;
  try {
    blocks = extractJsonLd(html, file);
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
    process.exitCode = 1;
    checks++;
    continue;
  }
  assert(blocks.length > 0, "at least one application/ld+json block");

  for (const data of blocks) {
    assert(data && typeof data === "object" && !Array.isArray(data), `parses to an object (${data["@type"] || "unknown type"})`);
    assert(typeof data["@context"] === "string" && data["@context"].startsWith("https://schema.org"), '@context points at schema.org');

    // url must equal the canonical exactly.
    assert(data.url === canonical, `url "${data.url}" matches canonical`);

    // @id must be the canonical, or canonical + #fragment.
    const idOk =
      data["@id"] === canonical ||
      (typeof data["@id"] === "string" && data["@id"].startsWith(canonical + "#"));
    assert(idOk, `@id "${data["@id"]}" agrees with canonical`);
  }
}

if (process.exitCode) {
  console.error(`json-ld guard FAILED (${checks} checks, at least one failed).`);
  process.exit(1);
}
console.log(`json-ld guard OK: ${checks} assertions passed.`);
