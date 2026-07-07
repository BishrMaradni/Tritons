# Munich Tritons Website — Overview & Maintenance Guide

## What This Is

A single-page landing site for the Munich Tritons water polo team. Built with vanilla HTML, CSS, and JavaScript for simple GitHub Pages deployment — no build tools or frameworks required.

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | All page content, SEO metadata, structured data |
| `styles.css` | Dark-first design system, responsive layout |
| `script.js` | Scroll effects, form validation & submission |
| `impressum.html` | Legal notice (German law requirement) |
| `datenschutz.html` | Privacy policy (GDPR requirement) |
| `robots.txt` | Search engine crawl directives |
| `sitemap.xml` | Sitemap for search engines |
| `assets/web/` | Optimized web images |

### Sections (10 total)

1. **Header** — Sticky, glass-blur on scroll. Nav: About, Training, FAQ, Contact
2. **Hero** (`#home`) — Centered layout with Tritons logo, headline, subtitle, two CTAs
3. **Credibility Strip** — FT Gern 1907, Saturdays 8:30 AM, All Levels Welcome, @munich_tritons
4. **About** (`#about`) — Light section. Team introduction with action photo
5. **Why Join** (`#why-join`) — Dark section. Four glass cards: Fitness, Community, Competition, All Levels
6. **Training** (`#training`) — Light section. Schedule, location, match info
7. **Gallery** (`#gallery`) — Light section. Asymmetric 3-image CSS grid
8. **FAQ** (`#faq`) — Light section. 5 accordion-style Q&A with numbered badges
9. **Contact** (`#contact`) — Dark section. Glass form card with mailto fallback
10. **Footer** — Dark gradient. Logo, quick links, social/legal links

### Design System

Single dark-first design (no theme toggle). Colors via CSS custom properties:

- `--navy` / `--navy-deep` — dark backgrounds
- `--paper` — warm off-white for light sections
- `--sun` — gold accent (CTAs, highlights)
- `--water` — water blue accent
- `--glass-bg` / `--glass-border` — glassmorphism on dark sections

Section rhythm: alternating `.section--light` (paper) and `.section--dark` (navy + radial glows).

---

## Running Locally

```bash
python3 -m http.server 8080
# Then visit http://localhost:8080
```

---

## Deploying

Push to `main` on GitHub. The workflow at `.github/workflows/pages.yml` copies the site files to GitHub Pages automatically.

**First-time setup:**
1. Go to the repo's **Settings > Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` or manually trigger the workflow

---

## Contact Form (FormSubmit)

The form uses [FormSubmit](https://formsubmit.co/) to send submissions to `munich.tritons@gmail.com`.

### How It Works

- **Without JavaScript**: The HTML form posts directly to FormSubmit. After submission, the user is redirected back to the site via the `_next` hidden field.
- **With JavaScript**: The form is enhanced with client-side validation and AJAX submission (using `Accept: application/json` header). Success/error feedback is shown inline.
- **Mailto fallback**: A direct email link is always visible below the form.

### First-Time Activation

The very first form submission triggers a confirmation email from FormSubmit to `munich.tritons@gmail.com`. Someone must click the confirmation link in that email. After that, all future submissions are delivered automatically. This is a one-time step.

### Hidden Fields

- `_subject` — Email subject line
- `_next` — Redirect URL after native form submission
- `_captcha` — Disabled (set to false)
- `_template` — Email template format (table)
- `_honey` — Honeypot field for spam protection

---

## Updating Content

### Training Schedule

Edit the `#training` section in `index.html`. Look for the `<dd>` elements inside the `.fact-list`.

### FAQ

Each question is a `<details>` element in the `#faq` section:

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

Add images to the `.gallery-grid` in the `#gallery` section. The grid uses an asymmetric layout — the first image spans 2 rows.

---

## Image Optimization

The `assets/web/` folder contains optimized images. To optimize a new image on macOS:

```bash
sips --resampleWidth 1200 original.jpg --out assets/web/optimized.jpg
```

Target sizes: hero backgrounds ~1920w, content images ~1200w, logos ~500w.

---

## Custom Domain Setup

The canonical domain is `munichtritons.de`. To set it up:

### DNS Records

Add A records at your DNS provider:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

For www subdomain:
```
CNAME    www    bishrmaradni.github.io
```

### GitHub Pages Setup

1. Go to repo **Settings > Pages**
2. Under **Custom domain**, enter `munichtritons.de`
3. Check **Enforce HTTPS**
4. Create a `CNAME` file in the repo root containing `munichtritons.de`

If you also own `munichtritons.com`, set up a redirect at that registrar to point to `munichtritons.de`.

---

## SEO

The site includes: Open Graph tags, Twitter Cards, canonical URL, JSON-LD (SportsTeam schema), semantic HTML, `robots.txt`, `sitemap.xml`.

---

## Legal Pages

German websites require Impressum and Datenschutzerklärung. Both pages exist but have placeholder fields that must be filled in before going live:
- `impressum.html` — club address, board member names, registry number
- `datenschutz.html` — club address, updated for FormSubmit

**Important**: Both pages have TODO comments flagging them for team review.

---

## Accessibility

- Skip-to-content link
- ARIA labels on interactive elements
- `prefers-reduced-motion` support (disables parallax/animations)
- Keyboard-navigable FAQ accordion
- Descriptive alt text on all images
- Scroll-reveal animations with IntersectionObserver
