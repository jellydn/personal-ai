# Demo script (30–60 seconds)

A concise narrative for a portfolio video, LinkedIn post, or interview demo of
`personal-ai`.

## Problem

It is hard to show the breadth of AI-assisted development work. A GitHub profile
is a flat list of repos; a resume does not capture what each project actually
does or whether it runs.

## User action

Open the portfolio site. The homepage loads instantly — 40 projects across four
categories with a hero summary and live filter bar.

## System behaviour

- The page renders a responsive card grid, each card showing the project name, a
  one-line description, the engineering approach, and a demo link when one
  exists.
- Click the "AI agents" category pill: the grid updates to the 9 AI-agent
  projects in real time, with no page reload.
- Type `rag` in the filter box: the grid narrows to the matching projects
  (`rag-blog`) to demonstrate text search.
- Click the "Dev tools" filter pill: the grid updates to 13 developer-tool
  projects, each with a category-colored left border.
- Clear the filter to return to all 40 projects. An empty-state message appears
  if a search matches nothing.

## Result

A visitor can understand nine months of original open-source AI work in under a
minute — what was built, how it was approached, and where to try it — without
reading 40 separate READMEs.

## Engineering highlights

- **Zero-build static site**: a single `index.html` with Tailwind (CDN) and
  vanilla JS. Deploys to GitHub Pages with no build step.
- **Client-side filtering**: search and category filters run entirely in the
  browser; no backend or API calls.
- **Accessible by default**: keyboard-focusable controls, ARIA labels, focus
  rings, and `prefers-reduced-motion` support.
- **Responsive layout**: a 1/2/3-column grid that adapts from mobile to desktop.
- **Staggered entrance animations** with a hover-lift card effect, all disabled
  under reduced-motion preferences.

## Suggested recording flow

1. Show the full homepage (3s).
2. Click the "AI agents" category pill, watch the grid filter (5s).
3. Type `rag` in the search box to demo text search, then clear it (5s).
4. Hover a card to show the lift effect, click a demo link to open a live
   project (10s).
5. Resize the browser narrow to show the responsive single-column layout (5s).
6. End on the footer: "Built with AI assistance" (3s).
