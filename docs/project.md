# Projekt-Info

## Domain
- **Live:** https://holger-kampffmeyer.de
- **Hosting:** GitHub Pages (holgerkampffmeyer2.github.io)
- **CNAME:** holger-kampffmeyer.de

## Tech-Stack
- **Framework:** Astro 6.x
- **Styling:** Tailwind CSS 4.x
- **Build:** Static Site Generation (SSG)

## Wichtige Pfade
- **Source:** `src/pages/`
- **Statische Assets:** `public/` (wird in Root kopiert)
- **Config:** `astro.config.mjs`
- **Daten:** `src/data/`

## Astro-Konfiguration
- `site:` muss auf `https://holger-kampffmeyer.de` gesetzt sein
- `output: 'static'` für SSG

## SEO
- Vermietungs-Seiten: FAQ-Schema in `src/pages/vermietung/*.astro`
- Videos: VideoObject Schema in `src/pages/dj/videos.astro`
- Mix-Seiten: AudioObject + BreadcrumbList