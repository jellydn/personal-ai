# 2. GitHub Pages repo-root deployment layout

Date: 2026-08-01

## Status

Accepted

## Context

The repo deploys to GitHub Pages via a workflow that uploads the **repo root**
(`path: .`) to the `github-pages` environment. That means the deployed site lives at
`https://jellydn.github.io/personal-ai/` — a **project subpath**, not an apex domain.
The showcase must therefore live at `https://jellydn.github.io/personal-ai/showcase/`,
and every internal link, canonical URL, OG/Twitter URL, and sitemap entry must be
consistent with that subpath layout.

## Decision

Keep the repo-root upload layout and treat `https://jellydn.github.io/personal-ai/`
as the canonical site root:

- Portfolio at `/`, showcase at `/showcase/` (with `features.html` and
  `how-it-works.html` as siblings).
- All internal navigation uses **relative** links (`index.html`, `features.html`, …)
  so the site works under any subpath or host without rewriting.
- All canonical, OG, Twitter, and JSON-LD URLs use the absolute `https://jellydn.github.io/personal-ai/...` form.
- `sitemap.xml` lists exactly the four canonical URLs (root + three showcase pages);
  `robots.txt` points at the sitemap.
- Brand links use `index.html` (never `href="/"`, which would escape to the apex).

## Consequences

### 📋 Positive

- One workflow, one artifact, one deploy — portfolio and showcase ship together.
- Relative links keep the site portable to any static host or subpath.
- SEO signals (canonical/OG/sitemap) all agree on the same layout, avoiding mixed-signal indexing.

### 📋 Negative

- URLs are `jellydn.github.io/personal-ai/...` — no apex or custom domain (a future
  decision could add one, requiring a sweep of all absolute URLs).
- The GitHub Pages base path must be remembered: absolute-root paths (`/`) break
  under the subpath, which was an actual bug fixed in this session.
- If the Pages workflow ever changes to upload a subfolder (e.g. `docs/`), every
  absolute URL and the sitemap must be re-derived.
