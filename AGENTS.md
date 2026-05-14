# Agenten-Informationen

**Projekt:** DJ & Lichttechnik Website - holger-kampffmeyer.de

## Schnellstart
- [Build & Deployment](docs/build.md)
- [Music Blog](docs/music-blog-script.md)
- [Projekt-Info](docs/project.md)
- [Git-Workflow](docs/git.md)
- [Design & Architecture](docs/DESIGN.md)

## Wichtige Regeln
1. **DESIGN.md lesen** für Design/Details
2. Domain IMMER auf `holger-kampffmeyer.de` setzen
3. Nach Quellcode-Änderungen: lint → check → build → build:seo → commit → push
4. Nach reinen .md Änderungen: direkt push (kein lint/check/build)
5. **Neuen Mix-Post erstellen**: Bei "neuen Post/Tracklist" → automatisch in `tracklists/` nach höchster Mix-Nummer suchen, Tracklist nach `src/data/tracklists/` kopieren, Bild (PNG→WebP) mit `node scripts/create-webp.mjs -w 600 <datei>` nach `public/tracklists/` konvertieren (resized auf 600px, da Thumbnail nur 400px), dann `pnpm run build:full` → commit → push

## Build-Commands
- `pnpm run build` — nur Astro Build (schnell)
- `pnpm run build:seo` — RSS + Sitemap generieren (nach build ausführen)
- `pnpm run build:full` — Fetch Mixcloud + SEO + Build (für Mix-Posts)