# Project Vision

> **AGENT INSTRUCTION:** Read this file before every iteration. It is the project's long-term memory.

## 1. Core Identity

| Field | Value |
|-------|-------|
| **Project Name** | personal-ai — AI Portfolio & Showcase |
| **Mission** | Showcase 53 real, runnable, forkable open-source projects built with AI over 9 months, and market the live portfolio tracker |
| **Target Audience** | Developers evaluating AI-assisted development; recruiters; open-source explorers |
| **Voice & Tone** | Warm, confident, understated — "real things, not demos"; technical but friendly |
| **Region** | Global (English, en-US spellings) |

## 2. Visual Language

- **Primary Vibe**: Clean and modern — generous whitespace, high-contrast typography
- **Secondary Vibe**: Warm and approachable — ember-orange accents, soft surfaces
- **Anti-Vibes**: Not corporate, not cluttered, not neon-cyber

## 3. Technical Setup

- **Output Directory**: `showcase/` (the existing live site — NOT `site/public/`; this repo pre-dates the design-loop and deploys the repo root to GitHub Pages per ADR-0002)
- **CSS**: hand-written `showcase/styles.css` with design tokens + dark mode via `[data-theme="dark"]` (buildless, per ADR-0001 — no Tailwind CDN in the showcase)
- **Dark Mode**: Yes — `data-theme` attribute on `<html>`, toggled by `showcase/app.js` (light/dark/system)
- **Fonts**: `Inter` via Google Fonts `@import` in `styles.css`
- **Behavior JS**: `showcase/app.js` (theme, mobile nav, lightbox) shared via `<script src="app.js">` at end of body
- **Constraints from ADRs**: buildless (0001), repo-root deploy with relative links (0002), vendored favicons (0003), progressive enhancement / no-JS must work (0004), chrome duplication is an accepted cost with ADR-0005 as the revisit note

## 4. Live Sitemap

Update this when a page is successfully generated.

- [x] `showcase/index.html` — Homepage: hero, stats, project gallery with lightbox, CTA
- [x] `showcase/features.html` — Feature deep-dive: search, filters, categories, live captures
- [x] `showcase/how-it-works.html` — How it works: 6-step workflow
- [x] `showcase/faq.html` — FAQ: questions about the tracker, AI-built projects, open source (design-loop iteration 1)
- [x] `showcase/blog.html` — Blog index: honest "first post coming soon" state + planned-topics teaser grid (design-loop iteration 2)
- [x] `showcase/contact.html` — Contact/support: 3 real-channel cards (GitHub issues, noreply email, YouTube), "Before you reach out" accordion, CTA (design-loop iteration 3)
- [x] `showcase/changelog.html` — Changelog: honest dated ship log with commit hashes, "How the tracker stays honest" accordion, CTA (design-loop iteration 4)

## 5. Roadmap (Backlog)

Pick the next task from here. Remove items as they're completed.

_Empty — all planned pages are live. See Ideas below._

## 6. Creative Freedom

When the roadmap is empty, follow these guidelines to add pages:

1. **Stay on-brand** — new pages must fit the established vibe
2. **Enhance the core** — support the site mission (53 projects, AI-built, open source)
3. **Naming convention** — lowercase, descriptive filenames (e.g. `faq.html`)

### Ideas to Explore
- [ ] Individual blog post template (only once the first real post exists — the site ships "real things, not demos", so no placeholder posts)

## 7. Rules of Engagement

1. Do NOT recreate pages already marked `[x]` in Section 4
2. ALWAYS update `.design/next-prompt.md` before completing an iteration
3. Remove consumed ideas from Section 6
4. Copy header/nav/footer from existing pages — never regenerate (this is the ADR-0005 documented cost)
5. All internal links must point to real pages; new pages must be added to the nav on ALL existing pages
6. When adding a page, also add its URL to `sitemap.xml` (ADR-0002: sitemap lists canonical URLs)
7. Use native HTML for no-JS functionality (details/summary accordion) per ADR-0004
