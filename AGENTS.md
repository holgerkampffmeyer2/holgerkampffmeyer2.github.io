# Agenten-Informationen

## Projekt
Persönliche Website von Holger Kampffmeyer - DJ, Lichttechniker und Event-Technik-Verleih

## Domain
- **Live-Domain:** https://holger-kampffmeyer.de
- **Hosting:** GitHub Pages (holgerkampffmeyer2.github.io)
- **CNAME:** holger-kampffmeyer.de

## Tech-Stack
- **Framework:** Astro 6.x
- **Styling:** Tailwind CSS 4.x
- **Build:** Static Site Generation (SSG)

## Build & Deployment
```bash
pnpm run dev      # Development server
pnpm run lint     # ESLint check
pnpm run check    # TypeScript check
pnpm run build    # Production build -> dist/
pnpm run preview  # Preview production build
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
5. Der RSS-Feed (`public/rss.xml`) wird automatisch bei jedem `pnpm run build` generiert und basiert auf:
   - Änderungsdatum der Astro-Dateien in `src/pages/`
   - Neuesten Mixes aus Mixcloud (`src/data/mixcloud-data.json`)

## Music Blog
- **Seite:** `/dj/mixes` (Startseite mit neuestem Mix + Filter) und `/dj/mixes-blog-archive` (Archiv mit allen Mixes)
- **Daten:** `src/data/blog-posts.json` (wird automatisch generiert)
- **Tracklists:** `src/data/tracklists/` (Quelldateien)
- **Hero-Images:** `public/tracklists/` (WebP)
- **Genre-UseCase-Mapping:** `src/data/genre-use-case-mapping.json`

### Blog-Posts Script
`scripts/fetch-mixcloud-blog.mjs` holt die neuesten 10 Mixes von Mixcloud:
- Genre → Use-Case Mapping (aus `genre-use-case-mapping.json`)
- Sucht Tracklists in `src/data/tracklists/` (Pattern: `*Mix{nummer}*tracklist*.txt`)
- Sucht Hero-Images in `public/tracklists/` (Pattern: `*Mix{nummer}*.webp`)

**Manuell ausführen:**
```bash
node scripts/fetch-mixcloud-blog.mjs
```

Dokumentation: `docs/music-blog-script.md`

## Git-Workflow
```bash
pnpm run lint && pnpm run check && pnpm run build
git add .
git commit -m "describe changes"
git tag -a v.x.x.x -m "version message"
git push && git push origin
```
