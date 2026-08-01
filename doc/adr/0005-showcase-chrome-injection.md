# 5. Showcase chrome injection (revisit note for ADR-0001)

Date: 2026-08-01

## Status

Proposed — revisit note for [ADR-0001](0001-buildless-static-site.md)

## Context

The showcase's shared chrome — header, nav, theme-switch, and footer markup — is copied
**verbatim across all three pages** (`showcase/index.html`, `features.html`,
`how-it-works.html`). Every chrome change is a 3-file edit with copy-paste drift risk:
for example, the `aria-controls` a11y fix had to land in three places, and the recent
simplify pass had to re-touch all three pages for a single nav/JS concern.

Since ADR-0001 was written, the duplication has **shrunk by half**: the behavior JS
(theme toggle, mobile nav, lightbox) now lives once in shared `showcase/app.js`,
leaving the HTML chrome as the only remaining 3× copy. The architecture review
flagged this as candidate #3 and identified a real ADR-0001 tension: fixing it would
touch ADR-0001 ("no build step; chrome duplication is an accepted cost") and
ADR-0004 (progressive enhancement — no-JS visitors must still see the nav).

## Decision

Document the tension and the two options rather than silently re-litigating the
accepted cost:

1. **Keep the duplication** (status quo, per ADR-0001) — zero risk, but every chrome
   edit stays a 3-file change.
2. **Inject chrome from one definition** — add a tiny `renderChrome()` to the existing
   shared `showcase/app.js` that fills header/nav/footer from a single definition,
   **with static fallback markup present in each page** so no-JS visitors and crawlers
   still see the nav (per ADR-0004). The seam is small; the deep part is the single
   chrome definition.

This ADR records the tension and the trade-offs now. Option 2 is the recommended path
**only if** the next chrome change (a nav edit, a footer change) lands in all three
files again — at that point the maintenance cost is real and recurring, and option 2
becomes worth the ADR-0001 amendment. Until then, option 1 stands.

## Consequences

### 📋 Positive

- The tension is on record: a future contributor or agent finds *why* the chrome is
  triplicated and what the escape hatch is, instead of rediscovering it.
- Option 2's design constraint (static fallback per ADR-0004) is captured before any
  implementation, so a rushed fix can't regress no-JS users or SEO.
- The decision path is explicit: reopen ADR-0001 only when a third chrome edit
  demonstrates the recurring cost.

### 📋 Negative

- The duplication remains an accepted cost for now — chrome edits are still 3-file.
- If option 2 is ever adopted, it adds a JS-rendered chrome path alongside the static
  fallback, which is more moving parts than the current copy-paste (per ADR-0004's
  "two animation paths" trade-off philosophy, this is a deliberate, documented cost).
- `renderChrome()` must keep the injected markup byte-consistent with the fallback or
  drift between JS-on and JS-off views.
