# Munich Tritons Website

Static website for the Munich Tritons water polo team.

## GitHub Pages

This repository is ready to publish with GitHub Pages through GitHub Actions.

1. Push the repository to GitHub on the `main` branch.
2. In GitHub, open `Settings` > `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push a change or run the `Deploy GitHub Pages` workflow manually.

The workflow publishes only:

- `index.html`
- `styles.css`
- `script.js`
- `assets/`

No build step is required.
