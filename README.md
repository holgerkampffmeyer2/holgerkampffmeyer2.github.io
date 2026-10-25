# Holger Kampffmeyer - Personal Website

Persönliche Website von Holger Kampffmeyer - DJ, Lichttechniker und Event-Technik-Verleih aus dem Großraum Stuttgart.

- **Domain:** https://holger-kampffmeyer.de
- **Stack:** Astro 7.x (SSG) + Tailwind CSS 4.x + TypeScript + GitHub Pages

## Structured Data (SEO)

- **dj/videos:** VideoObject-Schema (duration removed, publisher kept)
- **dj/mixes-weekly:** BlogPosting + MusicPlaylist + AudioObject Schema
- **dj/mixes/[slug]:** AudioObject + BreadcrumbList + BlogPosting Schema
- **djhulk-electronic-music:** Person + MusicGroup Schema

## Scripts

- `pnpm run test` / `pnpm test:run` — Unit tests (Vitest)
- `pnpm test:coverage` — Coverage report (v8)
- `pnpm run label:research` — Label research (CUE + MusicBrainz)
- `pnpm run label:apply` — Merge label suggestions
- `pnpm run label:urls` — Label URL research (MusicBrainz url-rels)
- `pnpm run label:urls:apply` — Merge label URLs
- `node scripts/optimize-images.mjs` — Image optimization (WebP)
- `node scripts/create-webp.mjs -w 1200 <file>` — Single image to WebP
- `node scripts/download-instagram.cjs <url>` — Download Instagram image
- `node scripts/fetch-mixcloud.mjs [--force]` — Fetch Mixcloud data (24h cache)
- `node scripts/lastmod.mjs` — Update lastmod cache
- `node scripts/generate-rss.mjs` — Generate RSS feed
- `node scripts/generate-urllist.mjs` — Generate urllist.txt

## CI

- **deploy.yml:** 4 parallel blocking jobs (build, check, lint, test) → deploy
- **weekly-mixcloud.yml:** parallel jobs + smoke test + tests → deploy
- Docs-only pushes (`*.md`, `docs/**`, `README*`) skip deploy

Weitere Informationen für Agenten in [AGENTS.md](AGENTS.md).
Workflow für neue Mix-Posts: [Music Blog Script](docs/music-blog-script.md).
Projektstruktur und Architektur in [docs/DESIGN.md](docs/DESIGN.md).