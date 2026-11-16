# Atharva Naveen — personal website

This repository contains the complete source, generated site, extracted media, essays, and historical HTML references for Atharva Naveen's personal website.

## Repository layout

- `atharva-site/dist/` — deployable static website.
- `atharva-site/scripts/` — scripts that import the reference HTML and build the standalone page.
- `atharva-site/.openai/` — hosting configuration for the static site (`dist/` is the publish directory).
- `reference/` — source attachment and historical site versions.
- `reference/variants/` — earlier edited HTML variants kept for provenance.
- `atharva-living-resume-refined.html` — generated, self-contained version that can be opened directly.

## Preview locally

From the repository root:

```sh
python3 -m http.server 4173
```

Then open [http://127.0.0.1:4173/atharva-site/dist/](http://127.0.0.1:4173/atharva-site/dist/).

## Refresh generated content

The importer extracts content and media from `reference/living-resume-original.html` into the deployable site. The standalone builder then creates the self-contained HTML file at the repository root.

```sh
node atharva-site/scripts/import-reference.mjs
node atharva-site/scripts/build-standalone.mjs
```

The importer refreshes `atharva-site/dist/content.json`, `atharva-site/dist/games.js`, `atharva-site/dist/assets/`, and `atharva-site/dist/essays/`. The builder refreshes `atharva-living-resume-refined.html`.

## Notes

The site is static and has no server-side persistence. Saved items, guestbook notes, game scores, and the fate slider use browser storage. Camera images remain in the browser until downloaded, and the music player loads selected tracks from Spotify.
