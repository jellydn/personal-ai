# Screenshot capture guide

This guide describes how to capture the screenshots used by the project README
and the showcase marketing site.

## README screenshot

A single wide shot of the portfolio homepage showing the hero, the filter bar,
and the first two rows of project cards.

`docs/images/demo.png` was captured for the 47-project catalog (20 web apps,
11 AI agents, 13 dev tools, 3 experiments). Recapture it after a catalog change
so the README screenshot keeps matching the live counts.

### Setup

1. Start the dev server:

   ```bash
   npm install
   npm run dev
   ```

2. Open the printed local URL (default `http://localhost:3000`) in Chrome or
   Firefox.

### Application state to display

- **Filter**: "All" (default) so every category is visible.
- **Search**: leave empty so the full grid renders.
- **Scroll**: top of the page — the hero, stat badges, filter bar, and the first
  two rows of cards should all be visible without scrolling.

### Sample input

No input is required. For an alternative shot, click the **"AI agents"** filter
pill to show only the AI-agent category (11 cards). This demonstrates category
filtering. To demonstrate text search instead, type `rag` in the filter box to
narrow to the RAG-related projects.

### Expected output

- Hero headline: **"AI-built. Open source. Personal."**
- Stat badges: **20 web apps**, **11 AI agents**, **13 dev tools**, **3 experiments**.
- A responsive 3-column card grid (on desktop) with category badges, project
  names, descriptions, and demo links.
- Cards have a colored left border keyed to their category and a hover lift
  effect.

### Recommended browser viewport

- **Desktop**: 1440 × 1024 **CSS viewport** at a 2× device-pixel-ratio, which
  captures as 2880 × 2048 **physical screenshot pixels** (matching
  `docs/images/demo.png`). The CSS viewport is what the page renders in; the
  saved image's pixel dimensions are double that on a Retina/2x display.
- Set browser zoom to 100%.
- Hide the bookmarks bar for a cleaner shot.

### Sensitive information to hide

This site contains **no secrets, tokens, or personal data** beyond the author's
public name and links, so no redaction is required. If you capture the terminal
in the same frame, ensure no environment variables or API keys are visible.

### Saving the screenshot

Save the final image to this folder as `demo.png`:

```text
docs/images/demo.png
```

Then reference it from the project README:

```markdown
![Application screenshot](docs/images/demo.png)
```

## Showcase screenshots

`showcase/screenshots/` holds the images used by the marketing pages. They are
captures of the running site, so they go stale whenever the catalog does.

| Asset | Source page | Viewport | Format |
| --- | --- | --- | --- |
| `hero.png` | `index.html` (top) | 1280 × 900 | PNG |
| `filter-web.png`, `filter-ai.png`, `filter-dev.png`, `filter-experiments.png` | `index.html`, with the matching filter pill clicked | 1280 × 900 | PNG |
| `search-local.png`, `search-pomodoro.png` | `index.html`, with `local` / `pomodoro` typed into the search box | 1280 × 900 | PNG |
| `hero-web.jpg` | `index.html`, full page | 1200 wide | JPEG |
| `mobile-web.jpg` | `index.html`, full page | 520 wide | JPEG |
| `demo/portfolio.png` | `index.html`, full page | 1280 wide | PNG |
| `demo/showcase-home.png` | `showcase/index.html`, full page | 1280 wide | PNG |
| `demo/how-it-works.png` | `showcase/how-it-works.html`, full page | 1280 wide | PNG |
| `demo/features.png` | `showcase/features.html`, full page | 1280 wide | PNG |
| `og-card.png` | `docs/og-card.html` (a layout, not a page) | 1200 × 630 | PNG |

Serve the repository root and drive Chrome with `agent-browser`
(`set viewport <w> <h> <scale>`, then `screenshot [--full]`).

### Two gotchas worth knowing

1. **Full-page captures go blank below the first screens.** `index.html` and
   `showcase/styles.css` use `content-visibility: auto` to defer off-screen
   rendering, so an unscrolled full-page capture leaves those regions empty.
   Injecting `* { content-visibility: visible !important; }` fixes it, and on
   `index.html` also removes the `contain-intrinsic-size` placeholder padding
   (the page's true height is ~4941px, not the ~5202px it reserves).
2. **Do not use that override on `showcase/how-it-works.html`.** It makes the
   page's 11,509px-tall phone-frame image contain itself, inflating the document
   from 7,023px to 16,548px and capturing a layout that is not what visitors
   see. Capture that page with no override.

Both gotchas are inherited from the existing assets: the committed captures
predate this note and contain the same deferred-rendering gaps.

### Verifying a capture without eyeballing it

Declared dimensions in the HTML must match the files. `width`/`height`
attributes are set from the real asset sizes, so after recapturing, compare each
`<img>` against the file and update any that changed:

```bash
sips -g pixelWidth -g pixelHeight showcase/screenshots/<asset>
```

`mac-ocr` can confirm a capture shows what it should — for example that
`hero.png` reads back "47 projects" and the 20/11/13/3 stat chips. It is not
reliable on very tall images (a 520×11,082 file returns nothing); crop bands
with ffmpeg and OCR those instead.

### Regenerating the OG share card

The card is a rendered layout. `docs/og-card.html` is its committed source, so
regenerate rather than redesign:

```bash
python3 -m http.server 4321 --bind 127.0.0.1     # from the repository root
agent-browser set viewport 1200 630 1
agent-browser open http://127.0.0.1:4321/docs/og-card.html
agent-browser wait --fn "document.fonts.status === 'loaded'"
agent-browser screenshot showcase/screenshots/og-card.png
```

Keep the counts inside `docs/og-card.html` in sync with the catalog in
`index.html` when you regenerate it.
