# Architecture

**Analysis Date:** 2026-08-01

## Pattern Overview

**Overall:** Buildless multi-page static site — a "living portfolio" app page plus a self-contained marketing showcase, both deployed from one repo root.

**Key Characteristics:**
- Zero build step: no bundler, no transpiler, no framework, no package manager
- Two distinct site surfaces: the functional portfolio app (`index.html`) and the marketing showcase (`showcase/`)
- Progressive enhancement: modern CSS features (`content-visibility`, `animation-timeline`) are gated behind `@supports` and `prefers-reduced-motion`
- Data-driven rendering: the portfolio's 53-project catalog lives in a JS array and drives the DOM, badges, counts, and JSON-LD

## Layers

**Portfolio App (`index.html`):**
- Purpose: Interactive tracker — search/filter a 53-project catalog, each card linking to GitHub/demo
- Location: `index.html`
- Contains: Data array (`projects`), render/filter logic, Tailwind utility markup, SEO meta + JSON-LD
- Depends on: Tailwind CDN, Google Fonts
- Used by: Visitors to `https://jellydn.github.io/personal-ai/`

**Showcase Marketing Site (`showcase/`):**
- Purpose: Teach people what the tracker does via screenshots, feature deep-dives, and a workflow walkthrough
- Location: `showcase/`
- Contains: 3 pages (`index.html`, `features.html`, `how-it-works.html`), shared `styles.css`, captured screenshots + animated GIF
- Depends on: Its own vendored CSS + favicons (self-contained, no CDN)
- Used by: Visitors to `/showcase/`

**Documentation Layer:**
- Purpose: Project memory for humans and agents
- Location: `README.md`, `doc/adr/`, `.planning/codebase/`
- Contains: Catalog README, 4 architecture decision records, this codebase map

## Data Flow

**Portfolio filtering:**
1. `projects` array (53 entries with category/demo) is loaded inline in `index.html`
2. User types in `#search` or clicks a `.filter-pill` → `filter()` runs
3. `filter()` re-renders `#project-grid` via `renderCard()` templates; `#empty-state` toggles on no match
4. Counts (`#project-count`, `[data-cat]`) are derived from the array so they never drift

**SEO / structured data:**
1. Static JSON-LD blocks (Person, WebSite, CollectionPage) in `<head>`
2. An ItemList JSON-LD block is injected at load from the live `projects` array so it stays in sync

**State Management:**
- Portfolio: in-memory JS variables (`activeCategory`, query) — no URL sync
- Showcase: theme persisted to `localStorage` (`showcase-theme`), applied pre-paint to avoid flash
- No server state anywhere

## Key Abstractions

**Category style maps (`index.html`):**
- Purpose: Map category → visual tokens (color/border/badge/label)
- Examples: `getCategoryColor`, `getCategoryBorder`, `getCategoryBadge`, `getCategoryLabel`
- Pattern: Four small lookup functions over the same keys (candidates for consolidation into one config object — see CONCERNS.md)

**CSS design tokens (`showcase/styles.css`):**
- Purpose: Single source of truth for the brand palette and theme surfaces
- Examples: `:root` custom properties (`--ember-500`, `--bg`, `--text`), `[data-theme="dark"]` overrides
- Pattern: CSS custom properties + attribute-driven theming

## Entry Points

**Portfolio:** `index.html` — renders on load via `filter()`; search + filter pills are the interactions
**Showcase home:** `showcase/index.html` — hero, stats, feature highlights, links into features/how-it-works
**Deployment:** `.github/workflows/deploy.yml` — pushes repo root to GitHub Pages on `main`

## Error Handling

**Strategy:** Graceful degradation (progressive enhancement) rather than try/catch:

**Patterns:**
- `@supports (animation-timeline: view())` gates scroll-driven animations; non-supporting browsers keep the load-time entrance
- `prefers-reduced-motion` disables all animation/transitions
- Theme pre-paint script wraps `localStorage` access in try/catch
- Empty search results show a dedicated `#empty-state` instead of a broken grid

## Cross-Cutting Concerns

**Logging:** None (static site)

**Validation:** None needed — no user input leaves the browser except the search box

**Authentication:** None

---

*Architecture analysis: 2026-08-01*
