# Munich Tritons Website

Official website for the **Munich Tritons** water polo team, part of [FT Gern](https://ftgern.de). A single-page landing site built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

**Live:** [munichtritons.de](https://munichtritons.de) (or [bishrmaradni.github.io/Tritons](https://bishrmaradni.github.io/Tritons))

## Quick Start

```bash
# Option 1: open directly
open index.html

# Option 2: local server (for form testing)
python3 -m http.server 8000
```

## File Structure

```
index.html              Main page (8 sections)
styles.css              All styles, dark mode, responsive
script.js               Theme toggle, scroll effects, form handler
robots.txt              Search engine directives
sitemap.xml             Sitemap for SEO
assets/                 Original high-res images
assets/web/             Optimized images for the site
.github/workflows/      GitHub Pages deployment
docs/                   Documentation
```

## Deployment

Push to `main` and GitHub Actions deploys automatically via the `Deploy GitHub Pages` workflow.

1. Go to **Settings > Pages** and set Source to **GitHub Actions**.
2. Push to `main` or trigger the workflow manually.

## Documentation

See [docs/WEBSITE_OVERVIEW.md](docs/WEBSITE_OVERVIEW.md) for the full guide: content updates, Formspree setup, domain configuration, image optimization, and more.
