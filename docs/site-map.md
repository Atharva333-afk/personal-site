# Site map

- `index.html` — homepage and site navigation
- `pages/about.html` — Atharva's profile, selected work, and public profiles
- `pages/projects/index.html` — project index
- `pages/projects/mixtape.html` — existing self-contained mixtape experience
- `pages/projects/writing.html` — two original essays and their PDFs
- `pages/projects/privion.html` — team hackathon project
- `pages/projects/arcade.html` — interactive experiments
- `pages/living-resume/index.html` — living resume landing page
- `pages/living-resume/activities.html` — static activity archive; `data/activities.json` can replace entries when populated
- `pages/living-resume/descreened.html` — Descreened story, original photo collage, and public sources
- `pages/living-resume/deca.html` — DECA archive and original photo collage
- `pages/living-resume/bpa.html` — BPA team result and official ranking
- `pages/guestbook.html` — visitor notes, currently stored in the visitor's browser

Shared styles live in `styles/`; page-specific styles live in `styles/pages/`. Shared browser code lives in `scripts/main.js`, with feature modules in `scripts/features/`. Original photos and essays are organized under `assets/`.

## Deployment

This is a static site. It can be hosted with GitHub Pages or any static host. If using GitHub Pages, select the `main` branch and `/(root)` as the source.
