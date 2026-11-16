# Atharva Naveen — living résumé

The website is a static site in `dist/`. It was rebuilt from the living résumé HTML supplied by Atharva and keeps its project records, essays, collections, music, and arcade games. The design uses a clean editorial layout with a few quiet desktop and print details.

## Preview

From the parent `Personal Website` directory:

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/atharva-site/dist/`. The separate `atharva-living-resume-refined.html` file in the parent directory is a self-contained version that opens directly without a server.

## Update the content

The exact source attachment is preserved at `../reference/living-resume-original.html`. To re-extract its content and media, then refresh the standalone file:

```sh
node scripts/import-reference.mjs
node scripts/build-standalone.mjs
```

The importer overwrites `dist/content.json`, `dist/games.js`, and the extracted media in `dist/assets/` and `dist/essays/`. Edit `dist/index.html`, `dist/styles.css`, `dist/app.js`, `dist/tools.js`, or `dist/tools-arcade.js` for design and interaction changes. Run the standalone builder after any edit to those files.

Saved items, guestbook notes, game scores, and the fate slider use browser storage. The guestbook is personal to each browser; there is no shared server. Camera images stay in the page until downloaded. The music player loads from Spotify when selected.
