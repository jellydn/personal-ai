# Codebase Structure

**Analysis Date:** 2026-08-01

## Directory Layout

```
personal-ai/
├── index.html              # Portfolio app: 53-project tracker (search/filter, SEO, JSON-LD)
├── README.md               # Project catalog + docs
├── robots.txt              # SEO: allow-all + sitemap reference
├── sitemap.xml             # SEO: 4 canonical URLs
├── favicon.svg / favicon-32.png / apple-touch-icon.png  # Root favicon set
├── showcase/               # Self-contained marketing site
│   ├── index.html          # Showcase home (hero, stats, features)
│   ├── features.html       # Feature deep-dives
│   ├── how-it-works.html   # Step-by-step workflow walkthrough
│   ├── styles.css          # Shared design-token stylesheet
│   ├── favicon.*           # Vendored favicons (standalone deploy)
│   └── screenshots/        # Captured app screenshots + animated GIF
├── doc/adr/                # Architecture decision records (4 ADRs)
├── .github/workflows/deploy.yml  # GitHub Pages deploy
└── .planning/codebase/     # This codebase map (7 docs)
```

## Directory Purposes

**`showcase/`:**
- Purpose: Marketing site for the portfolio tracker
- Contains: 3 HTML pages, one shared stylesheet, screenshots, vendored favicons
- Key files: `index.html`, `features.html`, `how-it-works.html`, `styles.css`, `screenshots/`

**`doc/adr/`:**
- Purpose: Architecture decision records
- Contains: 4 markdown ADRs + index
- Key files: `0001-buildless-static-site.md`, `0002-github-pages-repo-root-deploy.md`, `0003-vendored-favicons-showcase.md`, `0004-progressive-enhancement.md`

**`.github/workflows/`:**
- Purpose: CI/CD
- Contains: `deploy.yml` (Pages deploy on push to `main`)

## Key File Locations

**Entry Points:**
- `index.html`: Portfolio root (the app)
- `showcase/index.html`: Showcase home
- `.github/workflows/deploy.yml`: Deploy trigger

**Configuration:**
- `.github/workflows/deploy.yml`: Deployment config
- `robots.txt` / `sitemap.xml`: SEO config

**Core Logic:**
- `index.html`: `projects` array, `filter()`, `renderCard()`, category maps, JSON-LD injection
- `showcase/styles.css`: Design tokens + all showcase styles

**Testing:**
- None — no test files exist

## Naming Conventions

**Files:**
- Pages: lowercase kebab (`index.html`, `features.html`, `how-it-works.html`)
- ADRs: `<number>-<kebab-title>.md` (`0001-buildless-static-site.md`)
- Screenshots: descriptive kebab (`filter-ai.png`, `search-local.png`, `hero-web.jpg`)

**Directories:**
- Lowercase singular (`showcase/`, `doc/`, `.github/`)

## Where to Add New Code

**New Feature (portfolio):**
- Primary code: `index.html` — add to the `projects` array, extend `renderCard()`/`filter()` as needed
- Docs: `README.md` catalog + `doc/adr/` if architectural

**New Showcase Page:**
- Implementation: `showcase/<page>.html` — copy nav/footer verbatim from an existing page, add styles to `styles.css`

**Utilities:**
- Shared helpers: inline in the page that uses them (no shared JS module exists)

## Special Directories

**`.freebuff/`:**
- Purpose: Runtime data (SQLite db, preview logs) — NOT part of the product
- Generated: Yes
- Committed: No (should be gitignored)

**`.commandcode/`:**
- Purpose: Editor/agent workspace metadata
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-08-01*
