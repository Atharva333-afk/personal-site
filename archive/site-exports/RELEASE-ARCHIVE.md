# Legacy release archive register

<p align="center">
  <strong>64 unique standalone exports · pre-Git historical record · no original creation dates reconstructed</strong>
</p>

This ledger records every HTML snapshot kept in this folder. It is intentionally separate from [`../../RELEASES.md`](../../RELEASES.md): the root release history describes commits with reliable dates, while these files document an earlier, recovered design history.

## How to read this record

- **Archive ID** is a stable catalog reference, not a semantic version or original release number.
- **Observed modules** are confirmed from the saved HTML. A filename can suggest intent, but this ledger distinguishes that from a verified feature.
- **Size class** helps separate compact shell experiments from later self-contained exports carrying embedded media.
- **Order** is reliable only inside a filename’s explicit numbered series. The archive was recovered together on November 16, 2026, so filesystem timestamps cannot be used as historical release dates.

## Evidence summary

| Evidence | Finding |
| --- | --- |
| Files preserved | 64 HTML exports |
| Duplicate content | None — all 64 have unique SHA-256 hashes |
| Compact experiments | 23 `to-know-is-to-not-know` snapshots, roughly 141–265 KB before media-heavy variants |
| Media-heavy branch | 5 late `to-know-is-to-not-know (16)` revisions, roughly 7.4 MB |
| Feature-focused exports | 25 explicitly named iterations spanning contact links, favicon, sound, retro links, writing, portfolio, Paint, games, mascot guide, sports, USA jersey, and Big Questions |
| Full interactive exports | 15 mixtape and living-résumé snapshots with the complete module family, including guestbook and 100-song mixtape |
| Separate artifact | `index (5).html` is an ASA Apex Securities portfolio-management page, not a personal-site snapshot |

## Lineage map

```text
To Know Is To Not Know core
├─ early homepage shell (base through (4))
├─ mascot-guide continuation ((5), (7)–(11))
└─ Paint continuation ((12)–(16), then the (16) media-heavy forks)

Feature branches
├─ contact + favicon + retro + writing + portfolio + Paint
├─ games + sound / softer-sound + mascot-guide
├─ sports archive → overlap → refined → USA jersey / Blueprint USA variations
└─ Big Questions → 100-song mixtape → living résumé folders

Formal Git history
└─ root RELEASES.md (v0.1.0 onward)
```

The map reflects feature evidence and filename families. It is a reconstruction of branches, not a claim that every row was published in this exact order.

## Register A — To Know Is To Not Know core

These 23 snapshots are the earliest preserved family. The first four show an early homepage shell; the site guide is present by `(5)`; JS Paint is present by `(12)`. The five large `(16)` forks are distinct media-heavy versions, not duplicates.

| Archive ID | Saved export | Size class | Observed modules / record note |
| --- | --- | --- | --- |
| TN-00 | [`to-know-is-to-not-know.html`](<to-know-is-to-not-know.html>) | 231 KB | Early homepage shell; no later module markers detected. |
| TN-01 | [`to-know-is-to-not-know (1).html`](<to-know-is-to-not-know (1).html>) | 231 KB | Early homepage shell revision. |
| TN-02 | [`to-know-is-to-not-know (2).html`](<to-know-is-to-not-know (2).html>) | 231 KB | Early homepage shell revision. |
| TN-03 | [`to-know-is-to-not-know (3).html`](<to-know-is-to-not-know (3).html>) | 231 KB | Early homepage shell revision. |
| TN-04 | [`to-know-is-to-not-know (4).html`](<to-know-is-to-not-know (4).html>) | 141 KB | Compact core-shell revision. |
| TN-05 | [`to-know-is-to-not-know (5).html`](<to-know-is-to-not-know (5).html>) | 200 KB | Homepage shell plus site-guide mascot. |
| TN-07 | [`to-know-is-to-not-know (7).html`](<to-know-is-to-not-know (7).html>) | 201 KB | Mascot-guide continuation. |
| TN-08 | [`to-know-is-to-not-know (8).html`](<to-know-is-to-not-know (8).html>) | 200 KB | Mascot-guide continuation. |
| TN-09 | [`to-know-is-to-not-know (9).html`](<to-know-is-to-not-know (9).html>) | 206 KB | Mascot-guide continuation. |
| TN-10 | [`to-know-is-to-not-know (10).html`](<to-know-is-to-not-know (10).html>) | 208 KB | Mascot-guide continuation. |
| TN-11 | [`to-know-is-to-not-know (11).html`](<to-know-is-to-not-know (11).html>) | 254 KB | Mascot-guide continuation. |
| TN-12 | [`to-know-is-to-not-know (12).html`](<to-know-is-to-not-know (12).html>) | 218 KB | JS Paint and mascot-guide markers. |
| TN-13 | [`to-know-is-to-not-know (13).html`](<to-know-is-to-not-know (13).html>) | 221 KB | JS Paint and mascot-guide continuation. |
| TN-14 | [`to-know-is-to-not-know (14).html`](<to-know-is-to-not-know (14).html>) | 226 KB | JS Paint and mascot-guide continuation. |
| TN-15 | [`to-know-is-to-not-know (15).html`](<to-know-is-to-not-know (15).html>) | 245 KB | JS Paint and mascot-guide continuation. |
| TN-16 | [`to-know-is-to-not-know (16).html`](<to-know-is-to-not-know (16).html>) | 251 KB | JS Paint and mascot-guide continuation. |
| TN-16A | [`to-know-is-to-not-know (16) (1).html`](<to-know-is-to-not-know (16) (1).html>) | 255 KB | Distinct `(16)` fork; JS Paint and mascot-guide markers. |
| TN-16B | [`to-know-is-to-not-know (16) (2).html`](<to-know-is-to-not-know (16) (2).html>) | 265 KB | Distinct `(16)` fork; JS Paint and mascot-guide markers. |
| TN-16C | [`to-know-is-to-not-know (16) (3).html`](<to-know-is-to-not-know (16) (3).html>) | 7.38 MB | Media-heavy `(16)` fork; JS Paint and mascot-guide markers. |
| TN-16D | [`to-know-is-to-not-know (16) (4).html`](<to-know-is-to-not-know (16) (4).html>) | 7.38 MB | Media-heavy `(16)` fork; JS Paint and mascot-guide markers. |
| TN-16D1 | [`to-know-is-to-not-know (16) (4) (1).html`](<to-know-is-to-not-know (16) (4) (1).html>) | 7.38 MB | Separate copy-derived fork; unique content hash. |
| TN-16E | [`to-know-is-to-not-know (16) (5).html`](<to-know-is-to-not-know (16) (5).html>) | 7.38 MB | Media-heavy `(16)` fork; unique content hash. |
| TN-16F | [`to-know-is-to-not-know (16) (6).html`](<to-know-is-to-not-know (16) (6).html>) | 7.39 MB | Media-heavy `(16)` fork; unique content hash. |

`(6)` is absent from the recovered core series; this ledger records the gap rather than fabricating an export that was not preserved.

## Register B — explicit feature branches

These 25 exports use descriptive filenames. The module named in the filename is treated as the branch intent and was verified against the saved page where possible.

| Archive ID | Saved export | Size class | Verified record |
| --- | --- | --- | --- |
| FT-01 | [`to-know-with-email.html`](<to-know-with-email.html>) | 12.15 MB | Contact-email link; retro, Paint, mascot, sports, and USA-jersey modules. |
| FT-02 | [`to-know-with-favicon.html`](<to-know-with-favicon.html>) | 12.15 MB | FT-01 feature set plus favicon metadata. |
| FT-03 | [`to-know-with-retro.html`](<to-know-with-retro.html>) | 12.15 MB | Retro profile link, Paint, mascot, sports, and USA-jersey modules. |
| FT-04 | [`to-know-with-writing.html`](<to-know-with-writing.html>) | 12.66 MB | Adds writing archive to the early interactive shell. |
| FT-05 | [`to-know-with-portfolio.html`](<to-know-with-portfolio.html>) | 12.69 MB | Adds portfolio explorer alongside writing and Paint. |
| FT-06 | [`to-know-with-paint.html`](<to-know-with-paint.html>) | 12.70 MB | Paint studio branch with email, favicon, retro, writing, and portfolio. |
| FT-07 | [`to-know-with-games.html`](<to-know-with-games.html>) | 12.73 MB | Adds games arcade to the early module family. |
| FT-08 | [`to-know-with-sound.html`](<to-know-with-sound.html>) | 12.76 MB | Adds audio/sound controls; includes games and Big Questions. |
| FT-09 | [`to-know-with-softer-sound.html`](<to-know-with-softer-sound.html>) | 12.76 MB | Distinct softer-audio variation; unique hash. |
| FT-10 | [`to-know-with-mascot-guide.html`](<to-know-with-mascot-guide.html>) | 12.77 MB | Explicit guide/mascot version with sound, games, and Big Questions. |
| FT-11 | [`to-know-sports-archive (1).html`](<to-know-sports-archive (1).html>) | 8.24 MB | Sports-archive-focused branch with Paint and mascot guide. |
| FT-12 | [`to-know-sports-overlap (1).html`](<to-know-sports-overlap (1).html>) | 10.70 MB | Sports overlap layout; USA National Team jersey is present. |
| FT-13 | [`to-know-sports-refined.html`](<to-know-sports-refined.html>) | 10.12 MB | Refined sports branch; USA jersey remains present. |
| FT-14 | [`to-know-with-complete-usa-jersey.html`](<to-know-with-complete-usa-jersey.html>) | 13.13 MB | Complete USA-jersey branch with the broader interactive module family. |
| FT-15 | [`to-know-with-blueprint-usa.html`](<to-know-with-blueprint-usa.html>) | 13.06 MB | Blueprint USA baseline: email, favicon, sound, retro, writing, portfolio, Paint, games, mascot, Big Questions, sports, and USA jersey. |
| FT-16 | [`to-know-with-blueprint-usa (1).html`](<to-know-with-blueprint-usa (1).html>) | 13.06 MB | Unique Blueprint USA iteration. |
| FT-17 | [`to-know-with-blueprint-usa (2).html`](<to-know-with-blueprint-usa (2).html>) | 13.06 MB | Unique Blueprint USA iteration. |
| FT-18 | [`to-know-with-blueprint-usa (3).html`](<to-know-with-blueprint-usa (3).html>) | 13.75 MB | Larger Blueprint USA iteration; full baseline module set remains. |
| FT-19 | [`to-know-with-blueprint-usa (4).html`](<to-know-with-blueprint-usa (4).html>) | 13.75 MB | Unique Blueprint USA iteration. |
| FT-20 | [`to-know-with-blueprint-usa (5).html`](<to-know-with-blueprint-usa (5).html>) | 13.75 MB | Unique Blueprint USA iteration. |
| FT-21 | [`to-know-with-blueprint-usa (6).html`](<to-know-with-blueprint-usa (6).html>) | 13.75 MB | Unique Blueprint USA iteration. |
| FT-22 | [`to-know-with-blueprint-usa (7).html`](<to-know-with-blueprint-usa (7).html>) | 13.78 MB | First saved Blueprint USA variant with the guestbook module. |
| FT-23 | [`to-know-with-big-questions.html`](<to-know-with-big-questions.html>) | 12.76 MB | Big Questions branch with email, favicon, retro, writing, portfolio, Paint, games, mascot, sports, and USA jersey. |
| FT-24 | [`to-know-with-big-questions-clean.html`](<to-know-with-big-questions-clean.html>) | 12.75 MB | Distinct clean treatment of the Big Questions branch. |
| FT-25 | [`to-know-with-big-questions-refined.html`](<to-know-with-big-questions-refined.html>) | 12.76 MB | Distinct refined treatment; the source contains an explicit `version` text match. |

## Register C — mixtape and living-résumé exports

All 15 files below expose the full interactive family: portfolio, writing archive, JS Paint, games arcade, mascot guide, Big Questions, sports/USA jersey, guestbook, and mixtape. Their different hashes and file sizes confirm that they are distinct source snapshots, even where the recovered filenames do not explain a semantic difference.

| Archive ID | Saved export | Size class | Record note |
| --- | --- | --- | --- |
| MX-00 | [`atharva-website-with-mixtape.html`](<atharva-website-with-mixtape.html>) | 15.07 MB | Mixtape-era baseline export. |
| MX-01 | [`atharva-website-100-song-mixtape.html`](<atharva-website-100-song-mixtape.html>) | 15.23 MB | Explicit 100-song mixtape export. |
| MX-02 | [`atharva-website-100-song-mixtape (1).html`](<atharva-website-100-song-mixtape (1).html>) | 19.06 MB | Distinct numbered mixtape iteration. |
| MX-03 | [`atharva-website-100-song-mixtape (2).html`](<atharva-website-100-song-mixtape (2).html>) | 19.07 MB | Distinct numbered mixtape iteration. |
| MX-04 | [`atharva-website-100-song-mixtape (4).html`](<atharva-website-100-song-mixtape (4).html>) | 19.10 MB | Distinct numbered mixtape iteration. |
| MX-06 | [`atharva-website-100-song-mixtape (6) (1).html`](<atharva-website-100-song-mixtape (6) (1).html>) | 19.10 MB | Recovered copy-derived numbered fork; unique hash. |
| MX-07 | [`atharva-website-100-song-mixtape (7) (1).html`](<atharva-website-100-song-mixtape (7) (1).html>) | 19.07 MB | Recovered copy-derived numbered fork; unique hash. |
| LR-00 | [`atharva-living-resume-folders.html`](<atharva-living-resume-folders.html>) | 19.07 MB | Living-résumé folders baseline. |
| LR-01 | [`atharva-living-resume-folders(1).html`](<atharva-living-resume-folders(1).html>) | 20.82 MB | Distinct living-résumé revision. |
| LR-02 | [`atharva-living-resume-folders(1) (1).html`](<atharva-living-resume-folders(1) (1).html>) | 20.86 MB | Distinct living-résumé revision. |
| LR-03 | [`atharva-living-resume-folders(1) (2).html`](<atharva-living-resume-folders(1) (2).html>) | 20.73 MB | Distinct living-résumé revision. |
| LR-04 | [`atharva-living-resume-folders(1) (3).html`](<atharva-living-resume-folders(1) (3).html>) | 21.64 MB | Distinct living-résumé revision. |
| LR-05 | [`atharva-living-resume-folders(1) (4).html`](<atharva-living-resume-folders(1) (4).html>) | 23.85 MB | Media-expanded living-résumé revision. |
| LR-06 | [`atharva-living-resume-folders(1) (5).html`](<atharva-living-resume-folders(1) (5).html>) | 23.85 MB | Media-expanded living-résumé revision. |
| LR-07 | [`atharva-living-resume-folders(1) (6).html`](<atharva-living-resume-folders(1) (6).html>) | 23.85 MB | Media-expanded living-résumé revision. |

## Register D — separate preserved artifact

| Archive ID | Saved export | Size class | Classification |
| --- | --- | --- | --- |
| OT-01 | [`index (5).html`](<index (5).html>) | 78 KB | **ASA Apex Securities — V09 Portfolio Management.** Preserved because it was recovered with the site exports; it is not a personal-site version and has no personal-site module markers. |

## Verification and future recording

Run this from the repository root to re-check the inventory and prove each saved export remains distinct:

```sh
find archive/site-exports -maxdepth 1 -type f -name '*.html' -print0 \
  | sort -z \
  | xargs -0 shasum -a 256
```

For future site changes, record four facts together: the Git commit, the release tag, deployment date, and a short feature summary. That will let new releases live in [`../../RELEASES.md`](../../RELEASES.md) while this document remains the immutable record of pre-Git work.
