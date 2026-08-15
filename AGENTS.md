# AGENTS.md

Guidance for working on the Rawan Adel portfolio project.

## Project overview

Static single-page portfolio for Rawan Adel, Backend Software Engineer (.NET).
Built with plain HTML/CSS/JS — no build step, no runtime CDN dependencies
(Google Fonts is the only external resource).

## Layout

```
rawan_adel.net_portfolio/
├── index.html          # shell: head, theme script, partial placeholders
├── css/styles.css      # design tokens (CSS vars) + components + themes
├── js/main.js          # partial loader + interactivity
├── sections/           # one HTML partial per section
│   ├── nav.html
│   ├── hero.html
│   ├── experience.html
│   ├── skills.html
│   ├── projects.html
│   ├── achievements.html
│   ├── education.html
│   ├── certificates.html
│   ├── volunteering.html
│   └── footer.html
├── assets/favicon.svg  # monogram favicon
├── assets/avatar.jpeg  # hero portrait
├── DESIGN.md           # design spec (tokens, typography, spacing)
└── AGENTS.md           # this file
```

## Section partials

- Each page section lives in `sections/<name>.html` and is injected into
  `<div id="partial-<name>">` by `js/main.js` at runtime via `fetch`.
- To add/edit a section, edit the matching file in `sections/` — `index.html`
  stays untouched unless you add a new section (then add a placeholder div).
- Interactivity binds only after all partials load, so section IDs and `.reveal`
  elements are picked up automatically.

## Design system

- `css/styles.css` defines CSS custom properties for every token in
  `DESIGN.md` under `:root` (light) and `[data-theme="dark"]` (uses the
  inverse/dark tokens).
- Typography: Montserrat (headlines) + Inter (body/labels) with system-font
  fallbacks. Utility classes: `.headline-xl`, `.headline-lg`, `.headline-md`,
  `.body-lg`, `.body-md`, `.label-md`, `.label-sm`.
- Components: `.container`, `.btn`, `.card`, `.bento-grid`, `.chip`, `.section`,
  `.nav`.
- The source of truth for the layout is `code.html` (design mockup). Content
  is placeholder copy to be replaced later.

## Implementation plan

1. **Structure** — `index.html`, `css/styles.css`, `js/main.js`,
   `assets/favicon.svg`, `assets/` for the avatar.
2. **Design system** — CSS variables from DESIGN.md, light + dark themes,
   semantic component classes.
3. **Sections** — Nav, Hero, Skills (bento grid), Experience, Projects,
   Achievements, Volunteering, Education, Footer. Reuse existing copy as
   placeholders.
4. **Interactivity** (`js/main.js`) — mobile nav toggle, dark mode toggle
   (persisted to localStorage, defaults to light), scroll
   reveal via IntersectionObserver, scrollspy for active nav highlighting,
   smooth scroll with `scroll-padding-top` for the fixed header.
5. **Accessibility** — skip link, focus-visible rings, aria labels on icon
   buttons, semantic landmarks, `prefers-reduced-motion` support.
6. **Responsive** — mobile-first; bento grid collapses on small screens.
7. **Verification** — open locally, test at 360px / 768px / 1280px, verify
   dark/light toggle and nav behavior. No deployment configured.

## Conventions

- No build tooling; keep files dependency-free.
- Do not add comments to code unless asked.
- Use semantic HTML and follow the DESIGN.md tokens for any new styling.
- The site must work when served statically from any folder/host.
- Because sections load via `fetch`, opening `index.html` directly from disk
  (`file://`) won't render them — serve the folder with a static server
  (e.g. `python -m http.server`) or a hosting service.
