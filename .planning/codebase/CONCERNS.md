# Codebase Concerns

**Analysis Date:** 2026-08-01

## Tech Debt

**Duplicated category-style maps (`index.html`):**
- Issue: Four near-identical lookup functions (`getCategoryColor`, `getCategoryBorder`, `getCategoryBadge`, `getCategoryLabel`) map the same four category keys to different visual tokens, with inconsistent fallbacks
- Files: `index.html` (functions around `renderCard`)
- Impact: Inconsistent styling if a category is added to one map but not another; more code to maintain
- Fix approach: Consolidate into a single `CATEGORY_STYLE` config object

**Triplicated showcase chrome (`showcase/`):**
- Issue: Header, nav, footer, theme-switch markup and the dark-mode/pre-paint scripts are copied verbatim across `index.html`, `features.html`, `how-it-works.html`
- Files: `showcase/index.html`, `showcase/features.html`, `showcase/how-it-works.html`
- Impact: Any nav/theme change must be replicated in three files (documented in ADR-0001 as an accepted cost)
- Fix approach: Accept (buildless tradeoff) or add a tiny templating step later

**Dead CSS (`.contact-form`, `.skeleton`):**
- Issue: `.contact-form`/`.contact-grid` block in `showcase/styles.css` styles nothing (no contact form exists); `.skeleton`/`@keyframes shimmer` in `index.html` are never used (grid renders synchronously)
- Files: `showcase/styles.css` (contact block), `index.html` (skeleton block)
- Impact: Misleading — readers assume a form/loading state exists; maintenance cost
- Fix approach: Delete both blocks

**`transition: all` (×8):**
- Issue: Eight `transition: all` rules (7 in `showcase/styles.css`, 1 in `index.html`) animate every property instead of listing them
- Files: `showcase/styles.css` (nav-links, nav-cta, theme-switch buttons, .btn, .card, .project-pill, .contact-link), `index.html` (.filter-pill)
- Impact: Minor perf cost + unpredictable transitions (flagged by the web-design-guidelines audit)
- Fix approach: List explicit properties (`transition: color 0.18s ease, background 0.18s ease`)

## Known Bugs

**Search input missing label/name (`index.html:208`):**
- Symptoms: Screen readers can't identify the search field; no `name` for form semantics; placeholder "Filter projects..." uses `...` instead of `…`
- Files: `index.html:208`
- Trigger: Any screen-reader use or form submission
- Workaround: None — accessibility gap (flagged in audit, not yet fixed)

**Lazy images without dimensions (showcase):**
- Symptoms: 10 `loading="lazy"` images (6 in `features.html`, 4 in `how-it-works.html`) lack `width`/`height`, so layout shifts as they load
- Files: `showcase/features.html`, `showcase/how-it-works.html`
- Trigger: Scrolling to a lazy image in a non-supporting or pre-reserve browser
- Workaround: None — CLS risk (flagged in audit)

## Security Considerations

**Area: Static content only:**
- Risk: Low — no server code, no user input, no secrets in the repo
- Files: all
- Current mitigation: No attack surface (static HTML/CSS/JS, all outbound links use `rel="noopener"`)
- Recommendations: None urgent; consider adding `.freebuff/` to `.gitignore` so runtime DB/logs never get committed

## Performance Bottlenecks

**53-card grid rendering (`index.html`):**
- Problem: Re-rendering the full grid on every keystroke (search) — worst case 53 cards
- Files: `index.html` (`filter()` + `renderCard()`)
- Cause: Full `innerHTML` rebuild per input event; no debounce
- Improvement path: Currently mitigated by `content-visibility: auto` on cards n+7; a small debounce on the search input or incremental rendering would further reduce work (not currently a real problem at this scale)

## Fragile Areas

**Portfolio data array (`index.html`):**
- Files: `index.html` (`projects` array)
- Why fragile: 53 hand-maintained entries with no validation; a malformed entry or a count mismatch silently renders wrong
- Safe modification: Keep the entry shape identical (`name, repo, desc, approach, demo, category`); counts are derived so they self-correct
- Test coverage: None — no tests guard the array

**Showcase nav/theme replication:**
- Files: `showcase/*.html` (×3)
- Why fragile: Manual copy-paste of shared chrome
- Safe modification: Edit one page, copy to the other two, verify all three
- Test coverage: None

## Scaling Limits

**Catalog size:**
- Current capacity: 53 projects (fits one page comfortably)
- Limit: ~150–200 before the single-page grid feels heavy (mitigated by `content-visibility`)
- Scaling path: Pagination, category-aware lazy sections, or a generated static site

## Dependencies at Risk

**Tailwind CDN (`index.html`):**
- Risk: Runtime dependency on `cdn.tailwindcss.com`; page styling breaks if the CDN is unreachable
- Impact: Portfolio page loses all utility styling
- Migration plan: Vendor the compiled CSS (as `showcase/` already does with hand-written CSS) or pin a version

## Missing Critical Features

**Feature gap: No automated verification**
- Problem: No tests, no lint, no CI check — regressions only surface visually
- Blocks: Confident iteration on the data array and shared chrome
- Suggested: A lightweight smoke script + optionally a `.gitignore` for `.freebuff/`

## Test Coverage Gaps

**Untested area: `projects` data + filtering logic:**
- What's not tested: Array integrity (53 entries, valid categories), filter/search behavior, ItemList JSON-LD parity
- Files: `index.html`
- Risk: A typo'd entry or category silently breaks counts/filters
- Priority: Medium

---

*Concerns audit: 2026-08-01*
