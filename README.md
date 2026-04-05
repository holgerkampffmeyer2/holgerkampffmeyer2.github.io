# Holger Kampffmeyer - Personal Website

Persönliche Website von Holger Kampffmeyer - DJ, Lichttechniker und Event-Technik-Verleih aus dem Großraum Stuttgart.

## Tech-Stack

- **Framework:** Astro 6.x
- **Styling:** Tailwind CSS 4.x
- **Hosting:** GitHub Pages

## Commands

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `npm install`     | Installs dependencies                            |
| `npm run dev`     | Starts local dev server                          |
| `npm run build`   | Build production -> dist/ (incl. Mixcloud & RSS) |
| `npm run preview` | Preview build locally                            |
| `npm run lint`    | ESLint check                                     |
| `npm run check`   | TypeScript check                                 |

## Wichtige Pfade

- **Source:** `src/pages/`
- **Statische Assets:** `public/` (wird in Root kopiert)
- **Config:** `astro.config.mjs`
- **Mixcloud-Daten:** `src/data/mixcloud-data.json`
- **RSS-Feed:** `public/rss.xml` (wird automatisch bei build generiert)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Git-Workflow

```bash
npm run lint && npm run check && npm run build
git add .
git commit -m "describe changes"
git tag -a v.x.x.x -m "version message"
git push && git push origin
```

## Deployment

Website deployed via GitHub Pages. CNAME: holger-kampffmeyer.de

## Hinweis

Weitere projektbezogene Informationen für Agenten sind in `AGENTS.md` dokumentiert.
