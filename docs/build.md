# Build & Deployment

Commands in [AGENTS.md](../AGENTS.md). Details siehe unten.

## Build-Prozess

### build:full (für neue Mix-Posts)
1. `node scripts/fetch-mixcloud.mjs` → Mixcloud-Daten abrufen (parallelisiert) → `src/data/`
2. `node scripts/optimize-images.mjs` → Bilder optimieren
3. `astro build` → statische Seite in `dist/` (inkl. Sitemap via @astrojs/sitemap)
4. `node scripts/generate-rss.mjs` → RSS-Feed → `public/rss.xml` + `dist/rss.xml`
5. `node scripts/generate-urllist.mjs` → `public/urllist.txt` + `dist/urllist.txt`
6. **Automatisch:** OG-Bilder (1200×630 WebP) werden aus Mixcloud-Covers generiert → `public/og/{slug}.webp`

### build:seo (nach Code-Änderungen)
1. `node scripts/generate-rss.mjs` → RSS-Feed aktualisieren
2. `node scripts/generate-urllist.mjs` → urllist.txt generieren

## Caching
- Mixcloud-Script: 24h Cache (`node_modules/.mixcloud-fetch`), Details-Requests parallelisiert
- **Wichtig:** Für neue Mixes auf Mixcloud muss `--force` verwendet werden: `node scripts/fetch-mixcloud.mjs --force`
- `pnpm run build` ist schnell (~15-20s)
- Für frische Daten + SEO: `pnpm run build:full`

## Output
- `dist/` - statische HTML-Dateien
- `dist/sitemap.xml` - generiert von @astrojs/sitemap während Build
- `dist/rss.xml` - RSS-Feed
- `dist/urllist.txt` - URL-Liste für IndexNow (via `pnpm run indexnow-submit`)
- `public/urllist.txt` - Kopie für nächsten Build
- `public/og/` - Open Graph Bilder für Mix-Seiten
