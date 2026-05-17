# Build & Deployment

## Commands
```bash
pnpm run dev        # Development server
pnpm run lint       # ESLint check (incl. path validation)
pnpm run check      # TypeScript check
pnpm run build      # Production build -> dist/ (inkl. Sitemap via @astrojs/sitemap)
pnpm run build:seo  # RSS + urllist.txt generieren (nach build ausführen)
pnpm run build:full # Full build + Mixcloud fetch + RSS + Sitemap + urllist.txt
pnpm run preview    # Preview production build
```

## Build-Prozess

### build:full (für Mix-Posts)
1. `node scripts/fetch-mixcloud.mjs` → Mixcloud-Daten abrufen (parallelisiert) → `src/data/`
2. `node scripts/generate-rss.mjs` → RSS-Feed → `public/rss.xml`
3. `astro build` → statische Seite in `dist/` (inkl. Sitemap via @astrojs/sitemap)
4. `node scripts/generate-urllist.mjs` → `public/urllist.txt` + `dist/urllist.txt`

### build:seo (nach Code-Änderungen)
1. `node scripts/generate-rss.mjs` → RSS-Feed aktualisieren
2. `node scripts/generate-urllist.mjs` → urllist.txt generieren

## Caching
- Mixcloud-Script: 24h Cache (`node_modules/.mixcloud-fetch`), Details-Requests parallelisiert
- `pnpm run build` ist schnell (~15-20s)
- Für frische Daten + SEO: `pnpm run build:full`

## Fonts
- **Self-hosted** via `@fontsource-variable/josefin-sans`
- `@font-face` deklariert in `src/styles/fonts.css` (separat ausgelagert)
- `fonts.css` wird in `Layout.astro` + `global.css` importiert
- Kein externer Request zu Google Fonts mehr

## Theme-System
- Farb-Theme definiert in `src/styles/themes/*.css` je Theme-Datei
- Aktives Theme: `src/styles/themes/default.css` (via `@import` in `global.css`)
- Theme-Wechsel via `?theme=<name>` URL-Parameter
- Verfügbare Themes: `default`, `deep-bass`, `electric-night`, `golden-hour`
- Alle Farben über `var(--color-*)` Custom Properties — keine hartcodierten rgba-Werte

## Output
- `dist/` - statische HTML-Dateien
- `dist/sitemap.xml` - generiert von @astrojs/sitemap während Build
- `dist/rss.xml` - RSS-Feed
- `dist/urllist.txt` - URL-Liste für Bing IndexNow
- `public/urllist.txt` - Kopie für nächsten Build
