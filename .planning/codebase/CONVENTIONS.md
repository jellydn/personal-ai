# Coding Conventions

**Analysis Date:** 2026-08-01

## Naming Patterns

**Files:**
- Lowercase kebab-case for pages and assets (`features.html`, `search-local.png`)
- ADRs numbered + kebab (`0001-buildless-static-site.md`)

**Functions:**
- camelCase verbs: `renderCard`, `filter`, `getCategoryColor` (portfolio `index.html`)
- Event-handler style: `filterButtons.forEach(b => b.addEventListener(...))`

**Variables:**
- camelCase (`activeCategory`, `searchInput`, `ghUrl`)
- DOM refs prefixed by element type where obvious (`grid`, `empty`, `searchInput`)

**Types:**
- No TypeScript — data modeled as plain JS objects/arrays (`{ name, repo, desc, approach, demo, category }`)

## Code Style

**Formatting:**
- No formatter configured (no `.prettierrc`, no `.editorconfig`)
- Consistent hand-maintained style: 2-space indent, single quotes in JS, double quotes in HTML attributes

**Linting:**
- No linter configured

## Import Organization

**Order:**
- No imports — everything is inline: Tailwind CDN `<script>`, Google Fonts `@import`, and inline `<script>` blocks at the end of `<body>`

**Path Aliases:**
- None

## Error Handling

**Patterns:**
- Try/catch only around `localStorage` access (theme pre-paint script) — `try { ... } catch (e) {}`
- Everything else degrades via CSS: `@supports` gates, `prefers-reduced-motion`, explicit empty-state rendering
- Fallbacks are graceful-by-design rather than defensive branching

## Logging

**Framework:** None — no `console.log` in shipped code

**Patterns:**
- N/A

## Comments

**When to Comment:**
- Explain *why*, not *what* — e.g. "Set theme before first paint to avoid a light-flash", "Exclude the first feature-row (they hold the LCP image)"
- Section banners in CSS (`/* ============ Navigation ============ */`)

**JSDoc/TSDoc:**
- None — not used

## Function Design

**Size:** Small — the largest (`filter`, `renderCard`) are ~15-25 lines

**Parameters:** Minimal — `renderCard(p, i)`, `filter()` reads module-level state

**Return Values:** `renderCard` returns a template string; helpers return lookup values

## Module Design

**Exports:** None — no modules; all JS is inline in page `<script>` blocks

**Barrel Files:** N/A

---

*Convention analysis: 2026-08-01*
