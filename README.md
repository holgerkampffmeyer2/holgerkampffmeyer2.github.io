# Holger Kampffmeyer - Personal Website

Persönliche Website von Holger Kampffmeyer - DJ, Lichttechniker und Event-Technik-Verleih aus dem Großraum Stuttgart.

## Tech-Stack

- **Framework:** Astro 6.x
- **Styling:** Tailwind CSS 4.x
- **Hosting:** GitHub Pages

## Commands

| Command            | Action                                           |
| :----------------- | :----------------------------------------------- |
| `pnpm install`     | Installs dependencies                            |
| `pnpm run dev`     | Starts local dev server                          |
| `pnpm run build`   | Build production -> dist/ (incl. Mixcloud & RSS) |
| `pnpm run preview` | Preview build locally                            |
| `pnpm run lint`    | ESLint check                                     |
| `pnpm run check`   | TypeScript check                                 |

## Wichtige Pfade

- **Source:** `src/pages/`
- **Statische Assets:** `public/` (wird in Root kopiert)
- **Config:** `astro.config.mjs`
- **Mixcloud-Daten:** `src/data/mixcloud-data.json`
- **Blog-Posts:** `src/data/blog-posts.json` (Weekly DJ Mixes)
- **Tracklists:** `src/data/tracklists/`
- **Hero-Images:** `public/tracklists/`
- **RSS-Feed:** `public/rss.xml` (wird automatisch bei build generiert)
- **Sitemap:** `public/sitemap.xml` (wird automatisch aktualisiert inkl. aller Mix-Seiten)
- **URL-Liste:** `public/urllist.txt` (wird automatisch generiert)
- **Dokumentation:** `docs/music-blog-script.md`

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Git-Workflow

```bash
# Für Quellcode-Änderungen (Astro, TypeScript, Scripts):
pnpm run lint && pnpm run check && pnpm run build
git add .
git commit -m "describe changes"
git tag -a v.x.x.x -m "version message"
git push && git push origin

# Für reine Dokumentations-Änderungen (.md):
git add .
git commit -m "describe changes"
git push
```

## Deployment

Website deployed via GitHub Pages. CNAME: holger-kampffmeyer.de

## Structured Data (SEO)

- **Vermietung:** FAQ-Schema (6 FAQs pro Seite, JSON-LD)
- **dj/videos:** VideoObject-Schema (8 Videos)

## Hinweis

Weitere projektbezogene Informationen für Agenten sind in `AGENTS.md` dokumentiert.
