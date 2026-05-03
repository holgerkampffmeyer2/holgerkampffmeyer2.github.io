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
3. Nach Quellcode-Änderungen: lint → check → build → commit → push
4. Nach reinen .md Änderungen: direkt push (kein lint/check/build)
5. **Neuen Mix-Post erstellen**: Bei "neuen Post/Tracklist" → automatisch in `tracklists/` nach höchster Mix-Nummer suchen, Tracklist nach `src/data/tracklists/` kopieren, Bild (PNG→WebP) nach `public/tracklists/` konvertieren, dann `pnpm run build:full` → commit → push