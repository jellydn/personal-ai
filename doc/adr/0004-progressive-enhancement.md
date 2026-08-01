# 4. Progressive enhancement for performance and motion

Date: 2026-08-01

## Status

Accepted

## Context

The static site needed modern performance and motion affordances — prioritized LCP
images, deferred rendering of off-screen content, and scroll-driven entrance/parallax
effects — without a build step, without a JS animation library, and without degrading
experience for older browsers, keyboard-only users, or users with
`prefers-reduced-motion`. The portfolio also renders 53 cards at once, so render cost
matters.

## Decision

Apply each enhancement **progressively**, gated so the page always works without it:

- **Images**: LCP image on each page gets `fetchpriority="high"` plus explicit
  `width`/`height` (no CLS); all below-fold images use `loading="lazy"`.
- **Deferral**: `content-visibility: auto` + `contain-intrinsic-size` on below-fold
  blocks (portfolio cards `n+7`; showcase category/feature/workflow media). The first
  row — which holds the LCP image — is deliberately excluded.
- **Motion**: scroll-driven `fadeInUp` and a hero parallax (via the individual
  `translate` property) are inside `@supports (animation-timeline: view())`, so only
  supporting browsers get them; everyone else gets the original load-time entrance.
- **Reduced motion**: a `prefers-reduced-motion` block disables all animation and
  transitions.

## Consequences

### 📋 Positive

- Better Core Web Vitals (LCP, CLS) without a performance framework.
- Old browsers, screen readers, and reduced-motion users get the same content with a
  graceful fallback — no broken layout, no motion sickness.
- `@supports` + `content-visibility` are pure CSS: no JS, no library, no build step.

### 📋 Negative

- Two animation paths to maintain (load-time entrance + scroll-driven variant) — the
  CSS is more complex than a naive approach.
- `contain-intrinsic-size` estimates are hand-chosen; `auto` self-corrects after first
  render, but a wrong estimate can cause a one-time scroll jump.
- Scroll-driven animation ranges (e.g. `entry 0% entry 55%`) are tuned by eye; they
  need re-checking if layout spacing changes.
