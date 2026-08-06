---
page: _complete
---
The personal-ai showcase site is complete. All planned pages are live and wired into the nav, sitemap, and CI guards.

## What was built (7 pages)

- `index.html` — Homepage: hero, stats, 41-project gallery with category filtering + lightbox
- `features.html` — Feature deep-dive: search, filters, categories, live captures
- `how-it-works.html` — How it works: 6-step workflow
- `faq.html` — FAQ (design-loop iteration 1)
- `blog.html` — Blog index: honest "first post coming soon" state (iteration 2)
- `contact.html` — Contact: 3 real-channel cards + "Before you reach out" accordion (iteration 3)
- `changelog.html` — Changelog: dated ship log with commit hashes (iteration 4)

## Remaining idea (deliberately parked)

- Individual blog post template — ONLY worth building once a first real post exists. The site ships "real things, not demos" (ADR-0004, voice rule), so a template with placeholder content would violate that. Reopen this baton when `showcase/blog.html` has its first genuine post.

## How to restart the loop later

When the first real blog post lands, create `.design/next-prompt.md` with `page: posts/<slug>` and copy the chrome from `showcase/blog.html`, following the standard iteration protocol in the design-loop skill.
