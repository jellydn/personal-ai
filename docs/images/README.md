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

No input is required. For an alternative shot, type `agent` in the filter box to
show only the AI-agent category (7 cards). This demonstrates the live search.

## Expected output

- Hero headline: **"AI-built. Open source. Personal."**
- Stat badges: **12 web apps**, **7 AI agents**, **11 dev tools**, **4 experiments**.
- A responsive 3-column card grid (on desktop) with category badges, project
  names, descriptions, and demo links.
- Cards have a colored left border keyed to their category and a hover lift
  effect.

## Recommended browser viewport

- **Desktop**: 1440 × 900 (Retina/2x if available).
- Set browser zoom to 100%.
- Hide the bookmarks bar for a cleaner shot.

## Sensitive information to hide

This site contains **no secrets, tokens, or personal data** beyond the author's
public name and links, so no redaction is required. If you capture the terminal
in the same frame, ensure no environment variables or API keys are visible.

## Saving the screenshot

Save the final image to this folder as `demo.png`:

```
docs/images/demo.png
```

Then reference it from the project README:

```markdown
![Application screenshot](docs/images/demo.png)
```
