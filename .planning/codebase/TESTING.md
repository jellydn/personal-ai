# Testing Patterns

**Analysis Date:** 2026-08-01

## Test Framework

**Runner:**
- None — no test runner, no test files, no CI test step

**Assertion Library:**
- None

**Run Commands:**
```bash
# No test command exists. Verification is manual:
python3 -m http.server 8123   # serve, then manually exercise the pages
```

## Test File Organization

**Location:**
- N/A — no test files exist (verified: `find . -name '*test*' -o -name '*spec*'` returns nothing)

**Naming:**
- N/A

## Test Structure

**Suite Organization:**
- N/A

**Patterns:**
- Verification is manual + visual (see "Verification Approach" below)

## Mocking

**Framework:** None

**Patterns:**
- N/A

## Fixtures and Factories

**Test Data:**
- The `projects` array in `index.html` IS the de-facto fixture — a hand-maintained catalog of 53 projects with a fixed shape (`name, repo, desc, approach, demo, category`)

**Location:**
- Inline in `index.html` (~120 lines)

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
# No coverage tooling
```

## Test Types

**Unit Tests:**
- Not used

**Integration Tests:**
- Not used

**E2E Tests:**
- Not used — no Playwright/Chrome automation committed to the repo

## Verification Approach (how correctness is actually checked)

**Static validation (ad hoc, not committed):**
- JSON-LD parse check: node script reading each `<script type="application/ld+json">` block
- XML well-formedness: `python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml')"`
- Link/asset check: serve the site and confirm all pages + assets return 200 with zero console errors
- Keyboard-reachability: scripted Tab-through confirming `content-visibility` doesn't skip focusable cards

## Common Patterns

**Async Testing:**
- N/A

**Error Testing:**
- N/A

**Recommended addition (gap):**
- A minimal smoke test (e.g. a Node script asserting the projects array has 53 entries with valid shape, category counts sum to 53, and the ItemList JSON-LD matches) would guard the most fragile data-driven surface.

---

*Testing analysis: 2026-08-01*
