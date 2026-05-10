# Build & Deployment

## Commands
```bash
pnpm run dev        # Development server
pnpm run lint       # ESLint check (incl. path validation)
pnpm run check      # TypeScript check
pnpm run build      # Production build -> dist/ (nur Astro, schnell)
pnpm run build:seo  # RSS + Sitemap generieren (nach build ausführen)
pnpm run build:full # Full build + Mixcloud fetch + SEO
pnpm run preview    # Preview production build
```

## Build-Prozess
1. `pnpm run build` → Astro build (`dist/`)
2. `pnpm run build:seo` → RSS + Sitemap generieren
3. `pnpm run build:full` → Beides + Mixcloud Fetch

## Caching
- Mixcloud-Script: 24h Cache (`node_modules/.mixcloud-fetch`)
- `pnpm run build` ist schnell (~15-20s)
- Für frische Daten + SEO: `pnpm run build:full`

## Output
- `dist/` - statische HTML-Dateien
- `public/sitemap.xml` - nach build:seo
- `public/urllist.txt` - nach build:seo
- `public/rss.xml` - nach build:seo