# Portfolio — Md Eaftekhirul Islam

A clean, single‑page portfolio optimized for readability and recruiter scanning. Built as a static site suitable for GitHub Pages.

## Overview

- Purpose: present projects, skills, and education with a professional tone
- Stack: HTML, CSS, vanilla JavaScript (no build tooling required)
- Theme: metallic blue palette with subtle, distant background animation
- Accessibility: honors `prefers-reduced-motion` and keeps content contrast high

## Features

- Dark/Light theme toggle with persistence (`localStorage`)
- Full‑page canvas background (Three.js) tuned for calm visuals
- Micro‑interactions (hover lift, gradient accent, scroll reveal)
- Secure external links (`rel="noopener noreferrer"`)
- JSON‑LD Person schema (basic metadata)

## File Structure

```
index.html    # page markup and JSON-LD
styles.css    # theme, layout, animations
script.js     # theme toggle, background animation, reveals
favicon.svg   # site icon
.gitignore    # repo hygiene
```

## Local Preview

You can open `index.html` directly in a browser. For a nicer experience, use a simple static server:

```
# Option 1: Python (if installed)
python -m http.server 8000

# Option 2: Node.js (if installed)
npx serve .
```

Then visit `http://localhost:8000` (or the address printed by the server).

## Deployment (GitHub Pages)

1. Push this folder to a GitHub repository (e.g., `eis-1/portfolio`).
2. On GitHub: Settings → Pages → Build and deployment
   - Source: Deploy from a branch
   - Branch: `main` (root)
3. Your site will be available at `https://<username>.github.io/<repo>/`.

Notes:
- This portfolio is static; no backend required.
- For full‑stack demos, deploy the backend separately and link it from the portfolio.

## Accessibility

- Respects `prefers-reduced-motion: reduce` to disable animations
- Keyboard‑focus styles are present (`:focus-visible`)
- High‑contrast text on dark backgrounds

## Maintenance

- Content lives in `index.html`
- Styling tweaks in `styles.css`
- Behavior and animation tuning in `script.js`

## License

Personal portfolio; licensed for personal use. If you fork, please adjust content and attribution accordingly.
