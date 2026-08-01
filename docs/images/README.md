# Screenshot capture guide

This guide describes how to capture the recommended portfolio screenshot for the
`personal-ai` project README.

## Recommended screenshot

A single wide shot of the portfolio homepage showing the hero, the filter bar,
and the first two rows of project cards.

## Setup

1. Start the dev server:

   ```bash
   npm install
   npm run dev
   ```

2. Open the printed local URL (default `http://localhost:3000`) in Chrome or
   Firefox.

## Application state to display

- **Filter**: "All" (default) so every category is visible.
- **Search**: leave empty so the full grid renders.
- **Scroll**: top of the page — the hero, stat badges, filter bar, and the first
  two rows of cards should all be visible without scrolling.

## Sample input

No input is required. For an alternative shot, click the **"AI agents"** filter
pill to show only the AI-agent category (15 cards). This demonstrates category
filtering. To demonstrate text search instead, type `rag` in the filter box to
narrow to the RAG-related projects.

## Expected output

- Hero headline: **"AI-built. Open source. Personal."**
- Stat badges: **17 web apps**, **15 AI agents**, **17 dev tools**, **4 experiments**.
- A responsive 3-column card grid (on desktop) with category badges, project
  names, descriptions, and demo links.
- Cards have a colored left border keyed to their category and a hover lift
  effect.

## Recommended browser viewport

- **Desktop**: 1440 × 1024 **CSS viewport** at a 2× device-pixel-ratio, which
  captures as 2880 × 2048 **physical screenshot pixels** (matching
  `docs/images/demo.png`). The CSS viewport is what the page renders in; the
  saved image's pixel dimensions are double that on a Retina/2x display.
- Set browser zoom to 100%.
- Hide the bookmarks bar for a cleaner shot.

## Sensitive information to hide

This site contains **no secrets, tokens, or personal data** beyond the author's
public name and links, so no redaction is required. If you capture the terminal
in the same frame, ensure no environment variables or API keys are visible.

## Saving the screenshot

Save the final image to this folder as `demo.png`:

```text
docs/images/demo.png
```

Then reference it from the project README:

```markdown
![Application screenshot](docs/images/demo.png)
```
