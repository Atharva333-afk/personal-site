# Publishing and search indexing

The HTML pages in this repository have short, descriptive titles and descriptions, normal links between pages, and real text in the initial response. The original writing PDFs and photo collages are separate assets.

## Before requesting indexing

1. Publish one public site. GitHub Pages can serve this repository from `main` and `/(root)`. The repository URL alone is not a website URL.
2. Confirm the final homepage and every project page returns HTTP 200 at the chosen domain. Set one preferred domain and redirect alternate hostnames to it.
3. Add absolute canonical URLs and a sitemap using that verified domain. Include only public, indexable HTML pages in the sitemap. The unfinished arcade page currently uses `noindex`.
4. Add the public site to Google Search Console, submit the sitemap, and inspect the homepage plus a few project URLs. Indexing and ranking are Google's decisions, not a result of adding metadata.
5. When the interactive single-file experience is published, link it from the lightweight pages rather than using its roughly 20 MB HTML as the only entry point. Its embedded media pushes visible content beyond Google's per-file crawl limit.

Keep page content accurate as projects change. Replace placeholder pages with original work before allowing them into search results.
