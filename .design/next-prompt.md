---
page: blog
layout: standard
---
A blog/posts index page for the personal-ai showcase: a reading-list landing page introducing short posts on AI-assisted development, with a teaser card grid of planned posts and a clear "first post coming soon" state — honest (per the site voice: "real things, not demos"), not a fake blog.

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

**Page Structure:**
1. Nav — copy verbatim from `showcase/index.html`, with the Blog link added to `.nav-links` (after "FAQ", before "GitHub") and marked `class="active"` on this page
2. Page hero — `.hero.hero-compact` with `.container`: `.badge` "Blog", H1 "Notes on building with AI", one supporting line
3. Posts section — `.section.section-tight` with `.container`: an empty-state card (`.card` style) explaining the first post is in progress, plus a 2–3 card teaser grid of planned topics (e.g. "What 'AI-built' really means", "Running 53 projects in 9 months", "Buildless sites that stay fast") using the site's card + badge styling. Teaser cards are non-link (no fake URLs)
4. CTA section — reuse the `.cta-banner` pattern: "Prefer the code?" + "Browse the 53 projects" (features.html) + "Open the tracker" (GitHub) buttons
5. Footer — copy verbatim from `showcase/index.html`
6. `<script src="app.js"></script>` at end of body

Write the file to `showcase/blog.html`. After writing, add the Blog link to `.nav-links` on ALL existing pages (index, features, how-it-works, faq) and add `blog.html` to `sitemap.xml` (ADR-0002), with `lastmod` today and priority 0.7.
