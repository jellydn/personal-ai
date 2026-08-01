---
page: contact
layout: standard
---
A contact/support page for the personal-ai showcase: a simple, honest landing point for people who want to reach the author or get help with a project. No fake forms that go nowhere — per the site voice ("real things, not demos"), direct real links (email, GitHub issues, YouTube) are the primary actions, with an optional lightweight `<details>`/`<summary>` "Before you reach out" accordion answering where to report bugs and how fast replies come.

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
1. Nav — copy verbatim from `showcase/index.html`, with the Contact link added to `.nav-links` (after "Blog", before "GitHub") and marked `class="active"` on this page
2. Page hero — `.hero.hero-compact` with `.container`: `.badge` "Contact", H1 "Say hello, or get help", one supporting line
3. Contact section — `.section.section-tight` with `.container`: a 3-card grid (`.cards`) of real contact options — (a) "Open an issue" (GitHub repo issues link, for bugs/feature requests), (b) "Email the author" (mailto: link), (c) "YouTube / IT Man channel" (for longer-form questions). Each card uses `.card` + `.card-icon` (ember/moss/ink) + `.badge` label + short line + a real `btn btn-primary` or `btn btn-ghost` action
4. "Before you reach out" section — `.section-tight`: a `.faq-list` of 2–3 native `<details>`/`<summary>` items (ADR-0004, no JS): "Have a bug in a project?" (open an issue on that repo, include steps), "Will you reply to everything?" (honest — triaged, usually within a few days), "Can I contribute?" (open an issue or PR; the tracker itself welcomes improvements)
5. CTA section — reuse the `.cta-banner` pattern: "Meanwhile, explore the work" + "Browse the 53 projects" (features.html) + "Open the tracker" (GitHub) buttons
6. Footer — copy verbatim from `showcase/index.html`
7. `<script src="app.js"></script>` at end of body

Write the file to `showcase/contact.html`. After writing, add the Contact link to `.nav-links` on ALL existing pages (index, features, how-it-works, faq, blog) and add `contact.html` to `sitemap.xml` (ADR-0002), with `lastmod` today and priority 0.6.
