# Build & Deployment

## Commands
```bash
pnpm run dev        # Development server
pnpm run lint       # ESLint check (incl. path validation)
pnpm run check      # TypeScript check
pnpm run build      # Production build -> dist/ (schnell, cached data)
pnpm run build:full # Full build + Mixcloud fetch (RSS, Sitemap)
pnpm run build:data # Nur Daten fetch, kein Build
pnpm run preview    # Preview production build
```

## Build-Prozess
1. Astro build (`dist/`)
2. Scripts nach Build: `scripts/update-sitemap.mjs` (automatisch)

## Caching
- Mixcloud-Scripts: 24h Cache (`node_modules/.mixcloud-blog-fetch`)
- `pnpm run build` ist schnell (~25s) wegen Cache
- Für frische Daten: `pnpm run build:full` oder `node scripts/fetch-mixcloud-blog.mjs --force`

## Output
- `dist/` - statische HTML-Dateien
- `public/sitemap.xml` - wird automatisch aktualisiert
- `public/urllist.txt` - URLs für Suchmaschinen
- `public/rss.xml` - RSS-Feed (nur bei build:full)