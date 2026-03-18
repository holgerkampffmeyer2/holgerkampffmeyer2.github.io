# Agenten-Informationen

## Projekt
Persönliche Website von Holger Kampffmeyer - DJ, Lichttechniker und Event-Technik-Verleih

## Domain
- **Live-Domain:** https://holger-kampffmeyer.de
- **Hosting:** GitHub Pages (holgerkampffmeyer2.github.io)
- **CNAME:** holger-kampffmeyer.de

## Tech-Stack
- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS 4.x
- **Build:** Static Site Generation (SSG)

## Build & Deployment
```bash
npm run dev      # Development server
npm run lint     # ESLint check
npm run check    # TypeScript check
npm run build    # Production build -> dist/
npm run preview  # Preview production build
```

## Wichtige Pfade
- **Source:** `src/pages/`
- **Statische Assets:** `public/` (wird in Root kopiert)
- **Config:** `astro.config.mjs`

## Astro-Konfiguration
- `site:` muss auf `https://holger-kampffmeyer.de` gesetzt sein
- `output: 'static'` für SSG

## Wichtige Regeln
1. **DESIGN.md lesen** für Design, Architektur und Technologie
2. Domain IMMER auf `holger-kampffmeyer.de` setzen
3. Neue Seiten in `src/pages/` erstellen
4. Nach Änderungen: lint -> check -> build -> commit -> push
5. Der RSS-Feed (`public/rss.xml`) wird automatisch bei jedem `npm run build` generiert und basiert auf:
   - Änderungsdatum der Astro-Dateien in `src/pages/`
   - Neuesten Mixes aus Mixcloud (`src/data/mixcloud-data.json`)

## Git-Workflow
```bash
npm run lint && npm run check && npm run build
git add .
git commit -m "describe changes"
git tag -a v.x.x.x -m "version message"
git push && git push origin
```
