# Design System: personal-ai Product Showcase

## 1. Visual Theme & Atmosphere

Warm, editorial, and precise. Light mode reads like a premium developer blog: warm paper background, ink-dark text, ember-orange accents used sparingly for action and emphasis. Dark mode is a deep warm charcoal with the same palette re-mapped. Generous whitespace, strong type hierarchy, soft-but-visible surfaces. The feel is "real product documentation," not a flashy marketing page.

## 2. Colour Palette & Roles

| Role | Name | Light Value | Dark Value | Usage |
|------|------|-------------|------------|-------|
| Accent | Ember-400 | `#f19533` | `#f19533` | Hover/active accents, chips |
| Accent Strong | Ember-500/600 | `#ec7a10` / `#d96106` | same | Primary buttons, links, badges |
| Accent Soft | Ember-50/100 | `#fef7ee` / `#fdedd3` | same | Badge/active backgrounds |
| Support | Moss-500/600 | `#658a54` / `#4f6d40` | same | Demo badges, success, category "web" |
| Background | `--bg` | `#faf9f6` | `#171512` | Page background |
| Surface | `--surface` | `#ffffff` | `#211e1a` | Cards, containers |
| Surface-2 | `--surface-2` | `#f5f3ef` | `#2a2722` | Nested surfaces, theme switch |
| Text Primary | `--text` | `#2a2825` | `#f0eeea` | Headings, body |
| Text Soft | `--text-soft` | `#545048` | `#d8d4cb` | Secondary text |
| Text Muted | `--text-muted` | `#6b6559` | `#a9a294` | Captions, metadata |
| Border | `--border` | `#e2dfd8` | `#35312a` | Dividers, input borders |
| Border Strong | `--border-strong` | `#c9c4b8` | `#4a453b` | Emphasis borders |

Category color map (portfolio + showcase): `web → moss`, `ai → ember`, `dev → ink`, `learn → ember`.

## 3. Typography

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 | Inter | 800 | clamp(2.2rem, 5vw, 3.2rem) | 1.1 |
| H2 | Inter | 700 | ~1.6rem | 1.25 |
| H3 | Inter | 700 | ~1.1rem | 1.3 |
| Body | Inter | 400 | 1rem | 1.6 |
| Small/Caption | Inter | 400 | 0.88rem | 1.5 |
| Mono labels | ui-monospace / SFMono / Menlo | 500–600 | 0.72–0.85rem | — |

Fonts: `Inter` via Google Fonts `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');` inside `showcase/styles.css`.

## 4. Component Styles

- **Primary button (`.btn`, `.btn-white`)**: ember gradient background (`linear-gradient(135deg, var(--ember-600), var(--ember-500))`), white text, `border-radius: 12px`, padding ~14px 26px, hover lifts `translateY(-2px)` + shadow.
- **Secondary/outline (`.btn-outline`, `.btn-outline-white`)**: transparent bg, 1.5px border, same radius/padding, hover fills softly.
- **Ghost (`.btn-ghost`)**: subtle border + surface bg, used for tertiary actions.
- **Cards**: `--surface` bg, `1px solid var(--border)`, `border-radius: 14–16px`, `--shadow` on hover, generous padding (24–28px).
- **Badge (`.badge`)**: mono, uppercase, letter-spaced, ember-50 bg / ember-700 text, `border-radius: 999px`, padding 6px 12px.
- **Theme switch**: `.theme-switch` — surface-2 pill with 1px border, `border-radius: 10px`, 3 buttons (☀ ☾ ◐), active gets ember accent; prefers `aria-label` + `role="group"`.
- **Navigation**: sticky top, frosted (`--bg` + backdrop blur), brand left (⚡ personal-ai), links center, theme switch + CTA + hamburger right. Mobile: links collapse under `.hamburger` toggling `.open` on `#nav-links` with `aria-expanded`.
- **CTA banner**: ember gradient panel, white heading/text, `.btn-white` + `.btn-outline-white` actions centered with wrap.
- **FAQ accordion (new)**: native `<details>`/`<summary>` — no JS needed (ADR-0004), styled with `--surface`, 1px `--border`, 14px radius, chevron via CSS, `summary` padding 18–20px.

## 5. Layout Principles

- Max content width: `1200px` (`.container` = `max-width: 1200px; margin-inline: auto; padding-inline: 24px`).
- Section spacing: `.section { padding: 88px 0 }`, `.section-tight { padding: 40px 0 }`, `.section-alt` adds surface bg + border-block.
- Grids: `grid` with `gap: 24px`; responsive break at 900px (stack to 1fr).
- Whitespace philosophy: generous vertical rhythm; one accent color per viewport.

## 6. Design System Notes for Generation

**Copy this entire block into every baton prompt:**

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, desktop-first, responsive (breakpoint 900px)
- Theme: Light + Dark (via `data-theme="dark"` on `<html>`), warm editorial
- Background: warm paper `#faf9f6` (dark `#171512`)
- Surface: white `#ffffff` (dark `#211e1a`), secondary `#f5f3ef` (dark `#2a2722`)
- Primary/accent: ember orange `#ec7a10`–`#d96106` for buttons, links, badges; `#f19533` for hovers
- Support: moss green `#658a54` for success/demo
- Text: ink `#2a2825` (dark `#f0eeea`); muted `#6b6559` (dark `#a9a294`)
- Font: Inter via Google Fonts (@import inside styles.css)
- Corners: 12–16px cards, 999px pills, 10px small controls
- Shadows: soft `0 12px 24px -8px rgba(42,40,37,0.12)` (dark `rgba(0,0,0,0.5)`), hover lift `translateY(-2px)`
- Spacing: `.container` 1200px max, sections `padding: 88px 0`, tight `40px 0`
- Chrome: copy nav + footer verbatim from `showcase/index.html`; link `styles.css`; end body with `<script src="app.js"></script>`
