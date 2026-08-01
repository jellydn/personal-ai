# 1. Buildless static architecture

Date: 2026-08-01

## Status

Accepted

## Context

The repo started as a single self-contained `index.html` portfolio page deployed to
GitHub Pages. This session added a three-page marketing showcase (`showcase/`) and an
SEO/perf package. The project has no package manager, no build tooling, and no
framework — and the maintainer wanted the site to stay forkable and instantly
deployable to any static host.

## Decision

Stay **buildless**: hand-written semantic HTML with Tailwind CSS via CDN (portfolio)
and hand-written CSS with design tokens (showcase), plus vanilla JS. No bundler, no
transpiler, no framework, no build step. All pages are fully static and self-contained,
linked to each other with relative URLs.

## Consequences

### 📋 Positive

- Zero dependencies, zero lockfile churn, instant deploys, easy to fork.
- Any static host (GitHub Pages, Cloudflare Pages, Netlify) can serve it with no setup.
- No framework churn — the site is simple enough that it never needs one.

### 📋 Negative

- No templating, so shared HTML chrome (header, nav, footer) is duplicated across the
  three showcase pages — a documented, accepted cost. Changes must be replicated
  manually in each page. Behavior JS (theme toggle, mobile nav, lightbox) is not
  duplicated: it lives once in `showcase/app.js` and is shared via `<script src>`.
- Head inline scripts (theme pre-paint) are intentionally duplicated per page — they
  must run before first paint, so they cannot be deferred to an external file.
- The portfolio depends on the Tailwind CDN at runtime; the showcase avoids this by
  vendoring its own CSS.
- Progressive features must be hand-gated (see ADR-0004) rather than handled by a
  framework.
