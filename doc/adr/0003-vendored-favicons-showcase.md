# 3. Self-contained showcase with vendored favicons

Date: 2026-08-01

## Status

Accepted

## Context

The showcase's three pages originally referenced favicons via `../favicon.svg` etc.
(relative to the repo root, where the favicon files live). Code review flagged that
this couples the showcase to the repo-root layout: dragging the `showcase/` folder to
Cloudflare Pages or Netlify as a standalone site (the intended deployment option) would
break every favicon link with a 404.

## Decision

**Vendor** the favicon set (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`)
into the `showcase/` directory and point the showcase pages at the local copies. The
root keeps its own copies for the portfolio page. Both sets are identical bytes.

## Consequences

### 📋 Positive

- The showcase is fully self-contained — it deploys standalone to any static host
  with working favicons and no broken links.
- The portfolio and showcase each resolve their own assets without depending on the
  other's directory layout.

### 📋 Negative

- Favicon assets are **duplicated** (root + showcase). Any future redesign must
  update both copies or the two sites will drift — a documented, accepted tradeoff.
- The duplication is invisible at deploy time; only a visual check or a diff catches
  drift. A small `cmp` check in CI could guard it if drift becomes a problem.
