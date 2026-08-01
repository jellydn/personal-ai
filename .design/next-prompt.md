---
page: changelog
layout: standard
---
A changelog page for the personal-ai showcase: an honest, dated record of how the tracker itself evolves. Per the site voice ("real things, not demos"), only real shipped changes — no placeholder dates, no "coming soon" entries. Keep it short: the tracker is a one-person project, so the changelog reads like release notes, not a marketing timeline.

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
- Spacing: `.container` 1120px max, sections `padding: 88px 0`, tight `40px 0`
- Chrome: copy nav + footer verbatim from `showcase/index.html`; link `styles.css`; end body with `<script src="app.js"></script>`

**Page Structure:**
1. Nav — copy verbatim from `showcase/index.html` (now with the Contact link in `.nav-links`), with the Changelog link added to `.nav-links` (after "Contact", before "GitHub") and marked `class="active"` on this page
2. Page hero — `.hero.hero-compact` with `.container`: `.badge` "Changelog", H1 "What's new in the tracker", one supporting line (honest framing: the tracker ships in small, real increments)
3. Changelog section — `.section.section-tight` with `.container`: a `section-head` (`.kicker` "Ship log", H2 "Real changes, dated") then a vertical list of entries. Each entry: a `.card` (or a lightweight timeline row) with a mono date badge (e.g. `2026-07`), a version/hash label, and 2–4 bullet points of genuinely shipped improvements — draw these from what this repo has actually done: the 53-project catalog with category filtering, the CI category-completeness guard (`scripts/check-category-config.js`), the theme toggle + headless smoke test (`scripts/check-theme-toggle.js`), the lightbox/mobile-nav smoke test (`scripts/check-showcase-interactions.js`), the showcase site pages, dark mode, README/demo-script documentation. Keep claims accurate — no invented features
4. "How the tracker stays honest" section — `.section-tight`: a `.faq-list` of 2–3 native `<details>`/`<summary>` items (ADR-0004, no JS): "Where do the 53 projects come from?" (curated, real, runnable), "How is the site deployed?" (GitHub Actions → Pages, buildless per ADR-0002), "Why do you keep a changelog at all?" (public record of real work)
5. CTA section — reuse the `.cta-banner` pattern: "See the code behind these notes" + "Browse the 53 projects" (features.html) + "Open the tracker" (GitHub) buttons
6. Footer — copy verbatim from `showcase/index.html`
7. `<script src="app.js"></script>` at end of body

Write the file to `showcase/changelog.html`. After writing, add the Changelog link to `.nav-links` on ALL existing pages (index, features, how-it-works, faq, blog, contact) and add `changelog.html` to `sitemap.xml` (ADR-0002), with `lastmod` today and priority 0.5.
