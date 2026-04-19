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
pnpm run dev        # Development server
pnpm run lint       # ESLint check
pnpm run check      # TypeScript check
pnpm run build      # Production build -> dist/ + sitemap (schnell, ohne Datenfetch)
pnpm run build:full # Full build mit Mixcloud fetch (cached, 24h)
pnpm run build:data # Nur Daten fetch, kein Build
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
4. Nach Änderungen an Quellcode (Astro, TypeScript, Scripts): lint -> check -> build -> commit -> push
5. Nach Änderungen nur an Dokumentation (.md): direkt commit -> push (kein lint/check/build nötig)
6. Build-Optimierung: Mixcloud-Scripts haben 24h Cache. `pnpm run build` ist schnell (~25s).
7. Sitemap (`public/sitemap.xml`) wird automatisch nach jedem Build aktualisiert (via `scripts/update-sitemap.mjs`)
8. RSS-Feed (`public/rss.xml`) wird bei `build:full` generiert (nicht bei `build`)

## Music Blog
Alle Informationen zum Music Blog findest du in [docs/music-blog-script.md](docs/music-blog-script.md).

### Neuen Mix hinzufügen
1. **Tracklist:** Nach `src/data/tracklists/` (`DJ Hulk - Mix{nummer} Genre-tracklist.txt`)
2. **Hero-Image:** PNG nach `tracklists/` konvertieren → WebP nach `public/tracklists/`:
   ```bash
   # Konvertiere PNG zu WebP (aus tracklists/ Ordner)
   node -e "import('sharp').then(m=>m.default('tracklists/Mixcloud Post Mix{nummer}.png').webp({quality:80}).toFile('public/tracklists/Mix{nummer}.webp'))"
   # Oder mit dem sharp CLI direkt
   node -e "import('sharp').then(m=>m.default('C:/work/holgerkampffmeyer2.github.io/tracklists/Mixcloud Post Mix177.png').webp({quality:80}).toFile('public/tracklists/Mix177.webp'))"
   ```
3. Build: `pnpm run build` (fetch-mixcloud-blog.mjs → blog-posts.json → Seiten generiert)

**Seiten-Struktur:**
- `/dj/mixes` - Weekly DJ Mixes (Übersicht + neuester Mix)
- `/dj/mixes/{nummer}` - Einzelne Mix-Seite mit Player + Tracklist (z.B. `/dj/mixes/176`)
- `/dj/mixes-blog-archive` - Mix Archive (kompakte Kartenansicht)
- `/dj/mixes-all` - Full Mixcloud Library (alle Mixcloud-Mixes)

**Daten:** `src/data/blog-posts.json` (wird automatisch generiert)

**SEO:** Jede Mix-Seite hat eigenes AudioObject JSON-LD + BreadcrumbList

## Structured Data (SEO)
Alle Vermietungs-Seiten haben **FAQ-Schema** für Rich-Suchergebnisse in Google.
- `src/pages/vermietung/*.astro` - Jeweils 6 FAQs mit JSON-LD
- `src/pages/dj/videos.astro` - VideoObject Schema für 8 Videos

## Git-Workflow
```bash
pnpm run lint && pnpm run check && pnpm run build
git add .
git commit -m "describe changes"
git tag -a v.x.x.x -m "version message"
git push && git push origin
```
