# External Integrations

**Analysis Date:** 2026-08-01

## APIs & External Services

**Content / Data Sources:**
- GitHub — every project card links to its repo (`https://github.com/jellydn/<repo>`); the 53-project catalog in `index.html` is hardcoded data
- Demo hosts — 12 project cards link to external demo URLs (`.itman.fyi`, `jellydn.github.io/<repo>`, etc.)

**Frontend CDNs:**
- Tailwind CSS — CDN script in `index.html` (utility classes)
- Google Fonts — Inter font via `@import` in `index.html`
- SDK/Client: none (direct `<script>`/`<link>` tags)

**Social / Support links (static outbound only):**
- GitHub, YouTube, Ko-fi, productsway.com — in footers; no API usage

## Data Storage

**Databases:**
- None — no backend, no database

**File Storage:**
- Local filesystem only — static assets (screenshots, GIFs, favicons) committed to the repo

**Caching:**
- None (browser/CDN caching only)

## Authentication & Identity

**Auth Provider:**
- None — no auth, no accounts, fully public static site

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- None — no server logs; only browser console

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (`https://jellydn.github.io/personal-ai/`) — repo root uploaded

**CI Pipeline:**
- GitHub Actions (`.github/workflows/deploy.yml`) — deploys on push to `main`; manual `workflow_dispatch` available

## Environment Configuration

**Required env vars:**
- None

**Secrets location:**
- None — no secrets in the repo

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — the site makes no API calls; all "integrations" are static outbound links

---

*Integration audit: 2026-08-01*
