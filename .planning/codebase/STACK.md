# Technology Stack

**Analysis Date:** 2026-08-01

## Languages

**Primary:**
- HTML5 — All user-facing pages (`index.html`, `showcase/*.html`)
- CSS3 — Styling: hand-written design-token CSS in `showcase/styles.css`, Tailwind utility classes in `index.html`
- Vanilla JavaScript (ES2020+) — Interactivity: filtering/search, theme toggle, mobile nav, JSON-LD injection

**Secondary:**
- None — no server-side languages, no TypeScript, no build output

## Runtime

**Environment:**
- Static files only — no server runtime required

**Package Manager:**
- None — no package manifests, no lockfile, no `node_modules`

## Frameworks

**Core:**
- Tailwind CSS (CDN) — Utility styling for the portfolio page (`index.html`), loaded from `https://cdn.tailwindcss.com`
- None — no JS framework; all script is inline vanilla JS

**Testing:**
- None

**Build/Dev:**
- None — no build step, no bundler, no transpiler

## Key Dependencies

**Critical:**
- Tailwind CSS (CDN) — all utility classes in `index.html`; the page breaks without it
- Google Fonts (Inter) — loaded via `@import` in `index.html`'s inline `<style>`

**Infrastructure:**
- GitHub Pages (via `actions/deploy-pages`) — hosts the whole repo root

## Configuration

**Environment:**
- No env vars, no secrets, no runtime config
- Theme preference persisted in `localStorage` (`showcase-theme`) by the showcase pages

**Build:**
- `.github/workflows/deploy.yml` — GitHub Actions: checkout → configure-pages → upload artifact (repo root) → deploy-pages

## Platform Requirements

**Development:**
- Any static-file server (`python3 -m http.server`, `npx serve`, tmux-hosted server)
- Modern browser for full feature set (scroll-driven animations are `@supports`-gated)

**Production:**
- GitHub Pages (deployed at `https://jellydn.github.io/personal-ai/`)
- Also deployable standalone to Cloudflare Pages / Netlify (showcase folder is self-contained)

---

*Stack analysis: 2026-08-01*
