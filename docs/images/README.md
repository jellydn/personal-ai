# Screenshot capture guide

This guide describes how to capture the screenshots used by the project README
and the showcase marketing site.

## README screenshot

A single wide shot of the portfolio homepage showing the hero, the filter bar,
and the first two rows of project cards.

`docs/images/demo.png` was captured for the 47-project catalog (20 web apps,
11 AI agents & apps, 13 dev tools, 3 experiments). Recapture it after a catalog change
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

No input is required. For an alternative shot, click the **"AI agents & apps"** filter
pill to show only the AI category (11 cards). This demonstrates category
filtering. To demonstrate text search instead, type `rag` in the filter box to
narrow to the RAG-related projects.

### Expected output

- Hero headline: **"AI-built. Open source. Personal."**
- Stat badges: **20 web apps**, **11 AI agents & apps**, **13 dev tools**, **3 experiments**.
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

### Render all content before capture

Deferred rendering, lazy images, and scroll-driven animations can leave blank
regions in full-page captures. Apply this capture-only override on every page:

```js
const style = document.createElement('style');
style.textContent = '* { content-visibility: visible !important; animation: none !important; transition: none !important; }';
document.head.append(style);
document.querySelectorAll('img').forEach(image => image.loading = 'eager');
await document.fonts.ready;
await Promise.all([...document.images].map(image => image.decode()));
```

Wait for two animation frames before capture. The walkthrough becomes taller
when its phone image renders at its full aspect ratio; this is real content,
not a recursive image. Do not preserve deferred placeholder heights.

Capture at 2×, then downsample to the asset widths in the table. Keep the README
capture at 2×. Capture the catalog images first, then the features and walkthrough
pages, then the showcase home, which embeds those images. The search GIF is an
older interaction recording, not part of this static-image refresh.

Check the raw screenshot bounds before resizing. Some browser versions produce
a full-page canvas twice as wide and tall as the rendered content at 2×. In that
case, crop to the rendered bounds first; resizing the whole canvas preserves
empty right and bottom regions.

### Verify dimensions and visible content

Declared dimensions in the HTML must match the files. `width`/`height`
attributes are set from the real asset sizes, so after recapturing, compare each
`<img>` against the file and update any that changed:

```bash
sips -g pixelWidth -g pixelHeight showcase/screenshots/<asset>
```

Inspect each capture, including crops from tall images, for blank cards, missing
images, clipped labels, and stale counts. OCR can help check the 47-project total
and the 20/11/13/3 chips, but does not replace visual inspection.

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
