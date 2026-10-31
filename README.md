# Atharva's personal site

A small, hand-built home for projects, writing, activities, and experiments. The pages are plain HTML, CSS, and JavaScript so the site can be read and hosted without a build step.

## Structure

```text
.
├── index.html
├── pages/
│   ├── projects/       # project index, writing, arcade, mixtape
│   ├── living-resume/  # resume landing page and activity archive
│   └── guestbook.html
├── assets/             # images, audio, icons, fonts
├── styles/             # shared and page styles
├── scripts/            # navigation and feature modules
├── data/               # project, activity, and song data
└── docs/                # sitemap and credits
```

## Preview locally

Run a static server from the repository root:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. This also allows the activity page to load its JSON data.

The guestbook currently uses browser local storage. Notes are visible only in the browser where they were submitted; connect a backend before treating it as a shared public guestbook.

## Customize

- Put project thumbnails in `assets/images/projects/` and banners in `assets/images/banners/`.
- Keep activity entries in `data/activities.json`.
- When separating the mixtape source, move song metadata into `data/songs.json` and interaction code into `scripts/features/mixtape.js`.
- Add third-party attribution to `docs/credits.md`.
