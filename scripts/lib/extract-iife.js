// Shared balanced-brace IIFE scanner for the headless guard scripts.
//
// Extracts a balanced `(function () { ... })();` block starting after a marker
// comment. The IIFEs in showcase/app.js are self-contained (they only touch
// globals like document / localStorage / matchMedia), so each can be evaluated
// against a minimal mock in a fresh scope — no DOM library needed.
//
// Usage:
//   const { extractIIFE } = require("./lib/extract-iife");
//   const iife = extractIIFE(src, "// Mobile nav", "mobile nav", file);
//
// `file` is optional and only used to prefix error messages with a path
// relative to the cwd, matching each guard's existing reporting style.
"use strict";

const path = require("path");

// Extract a balanced `(function () { ... })();` block starting after a marker
// comment. Tolerates strings, template literals, and // and /* */ comments
// inside the block. Throws with a descriptive message if the marker or the
// IIFE terminator cannot be found.
function extractIIFE(src, marker, label, file) {
  const where = file ? `${path.relative(process.cwd(), file)}: ` : "";
  const start = src.indexOf(marker);
  if (start === -1) {
    throw new Error(`${where}missing ${JSON.stringify(marker)} marker`);
  }
  let i = src.indexOf("(function () {", start);
  if (i === -1) {
    throw new Error(`${where}cannot extract ${label} IIFE`);
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
    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        // Skip past `})();` — the IIFE call and terminator
        const end = src.indexOf("})();", j);
        if (end === -1) {
          throw new Error(`${where}cannot find ${label} IIFE terminator`);
        }
        j = end + "})();".length;
        break;
      }
    }
  }
  return src.slice(i, j);
}

module.exports = { extractIIFE };
