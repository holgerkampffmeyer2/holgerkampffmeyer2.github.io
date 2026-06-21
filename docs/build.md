# Build & Deployment

Commands in [AGENTS.md](../AGENTS.md). Details siehe unten.

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

## Output
- `dist/` - statische HTML-Dateien
- `dist/sitemap.xml` - generiert von @astrojs/sitemap während Build
- `dist/rss.xml` - RSS-Feed
- `dist/urllist.txt` - URL-Liste für IndexNow (via `pnpm run indexnow-submit`)
- `public/urllist.txt` - Kopie für nächsten Build
