# Site map

- `index.html` — homepage and site navigation
- `pages/projects/index.html` — project index
- `pages/projects/mixtape.html` — existing self-contained mixtape experience
- `pages/projects/writing.html` — writing archive
- `pages/projects/arcade.html` — interactive experiments
- `pages/living-resume/index.html` — living resume landing page
- `pages/living-resume/activities.html` — activity archive, populated from `data/activities.json`
- `pages/guestbook.html` — visitor notes, currently stored in the visitor's browser

Shared styles live in `styles/`; page-specific styles live in `styles/pages/`. Shared browser code lives in `scripts/main.js`, with feature modules in `scripts/features/`. Images, audio, icons, and fonts are organized under `assets/`.

## Deployment

This is a static site. It can be hosted with GitHub Pages or any static host. If using GitHub Pages, select the `main` branch and `/(root)` as the source.
