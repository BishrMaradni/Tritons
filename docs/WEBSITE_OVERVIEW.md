# Munich Tritons Website — Overview & Maintenance Guide

## What This Is

A single-page landing site for the Munich Tritons water polo team. Built with vanilla HTML, CSS, and JavaScript for simple GitHub Pages deployment — no build tools or frameworks required.

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | All page content, SEO metadata, structured data |
| `styles.css` | Styling, responsive layout, dark/light mode |
| `script.js` | Theme toggle, scroll effects, form submission |
| `robots.txt` | Search engine crawl directives |
| `sitemap.xml` | Sitemap for search engines |
| `assets/` | Original high-resolution images (not served to users) |
| `assets/web/` | Optimized web images (served to users) |

### Sections

1. **Hero** (`#home`) — Full-width hero with team logo and CTAs
2. **Link Banner** — Instagram and FT Gern links
3. **About** (`#about`) — Team introduction with action photo
4. **Why Join** (`#why-join`) — Four benefit cards
5. **Training** (`#training`) — Schedule, location, match info
6. **Gallery** (`#gallery`) — Photo grid
7. **FAQ** (`#faq`) — Accordion-style Q&A
8. **Contact** (`#contact`) — Inquiry form (via Formspree)

### Theming

Colors are controlled by CSS custom properties in `:root` and `[data-theme="night"]`. The main tokens:

- `--ink` / `--paper` — text and background
- `--sun` — gold accent
- `--pool` — dark navy for hero/footer

The theme toggle saves preference to `localStorage`.

---

## Running Locally

```bash
# Just open the file
open index.html

# Or use a local server (needed for form testing)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

---

## Deploying

Push to `main` on GitHub. The workflow at `.github/workflows/pages.yml` copies the site files to GitHub Pages automatically.

**First-time setup:**
1. Go to the repo's **Settings > Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` or manually trigger the workflow

---

## Updating Content

### Training Schedule

Edit the training details in `index.html` inside the `#training` section. Look for the `.detail-card` elements:

```html
<span class="detail-value">Saturdays, 8:30 – 10:00 am</span>
```

### FAQ

Each question is a native `<details>` element in the `#faq` section. Add or edit entries:

```html
<details class="faq-item reveal">
  <summary>
    <span>Your question here?</span>
    <svg class="icon faq-chevron" aria-hidden="true"><use href="#icon-chevron-down"></use></svg>
  </summary>
  <p>Your answer here.</p>
</details>
```

### Gallery

Add images to the `.gallery-grid` in the `#gallery` section. Optimize new images first (see below).

---

## Contact Form (Formspree)

The form currently has a placeholder `{FORM_ID}`. To make it work:

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form — Formspree gives you an endpoint like `https://formspree.io/f/xyzabcde`
3. In `index.html`, replace `{FORM_ID}` with your form ID:

```html
<form class="join-form" action="https://formspree.io/f/xyzabcde" method="POST" ...>
```

4. Deploy and test. Submissions will appear in your Formspree dashboard and be forwarded to your email.

**Note:** The form includes a honeypot field (`_gotcha`) for spam protection and a hidden `_subject` field for email subject lines.

---

## Image Optimization

Original images in `assets/` are very large (8000x8000px, 28MB total). The `assets/web/` folder contains optimized versions.

To optimize a new image on macOS:

```bash
# Resize to max 1200px wide, preserving aspect ratio
sips --resampleWidth 1200 original.jpg --out assets/web/optimized.jpg

# For PNG logos, use 500px width
sips --resampleWidth 500 logo.png --out assets/web/logo-web.png
```

Target sizes: hero backgrounds ~1920w, content images ~1200w, logos ~500w, favicons 32/180px.

---

## Custom Domain Setup

The canonical domain is `munichtritons.de`. To set it up:

### DNS Records

Add these records at your DNS provider:

**Option A — A records (recommended):**
```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

**Option B — CNAME:**
```
CNAME    @    bishrmaradni.github.io
```

**For www subdomain (either option):**
```
CNAME    www    bishrmaradni.github.io
```

### GitHub Pages Setup

1. Go to repo **Settings > Pages**
2. Under **Custom domain**, enter `munichtritons.de`
3. Check **Enforce HTTPS** (may take a few minutes to provision the certificate)
4. Create a `CNAME` file in the repo root containing `munichtritons.de`

### Secondary Domain

If you also own `munichtritons.com`, set up a redirect at that registrar to point to `munichtritons.de`.

---

## SEO

The site includes:

- Open Graph meta tags (title, description, image, URL)
- Twitter Card meta tags
- Canonical URL (`https://munichtritons.de/`)
- JSON-LD structured data (SportsTeam schema)
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- `robots.txt` and `sitemap.xml`

To update the OG image, replace `assets/web/og-image.jpg` (should be 1200x630px or similar).

---

## Legal Compliance (German Law)

German websites require:

- **Impressum** (legal notice) — mandatory for any non-purely-personal site
- **Datenschutzerklärung** (privacy policy) — mandatory under GDPR

The footer has placeholder links for these. You should create separate pages or sections with the required legal text. Consult with FT Gern about whether the club's existing Impressum covers this site.

---

## Accessibility

The site includes:
- Skip-to-content link
- ARIA labels on interactive elements
- `prefers-reduced-motion` support (disables parallax/animations)
- Keyboard-navigable FAQ accordion
- Descriptive alt text on all images
- Sufficient color contrast in both themes
