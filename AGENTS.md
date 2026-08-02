# Agenten-Informationen

**Projekt:** DJ & Lichttechnik Website - holger-kampffmeyer.de

## Projektübersicht
Persönliche Website von Holger Kampffmeyer – DJ, Lichttechniker und Event-Technik-Verleih.
Primäres Ziel: DJ-Buchungen, Mixcloud-Reichweite, Work-Portfolio.
Sekundäres Ziel: organischer SEO-Traffic über DJ-Mix-Seiten und Tracklists.

## Tech-Stack
- **Framework:** Astro 7.x (SSG, `output: 'static'`)
- **Styling:** Tailwind CSS 4.x + CSS Custom Properties (Theme-System)
- **Package-Manager:** pnpm
- **Node-Version:** >=18
- **Tests:** Vitest (Unit)

## Schnellstart / Docs
- [Build & Deployment](docs/build.md)
- [Music Blog](docs/music-blog-script.md) — Workflow für neue Mix-Posts
- [Design & Architecture](docs/DESIGN.md)
- [Git-Workflow](docs/git.md)

## Build- & Test-Kommandos
- `pnpm run build` — Production Build (Details: [docs/build.md](docs/build.md))
- `pnpm run build:seo` — RSS + urllist.txt
- `pnpm run build:full` — Fetch Mixcloud + Build + SEO (für Mix-Posts)
- `pnpm run dev` — Dev server
- `pnpm run preview` — Preview build
- `pnpm run lint` — ESLint
- `pnpm run check` — TypeScript
- `pnpm test` — Unit-Tests (Vitest)

## CLI-Proxy `rtk`

- Befehle können über den Proxy `rtk` (z.B. `rtk lint`, `rtk pnpm run build`) gefiltert werden.
- **Falls `rtk <cmd>` fehlerhaft/leer läuft** (z.B. `ESLint output (JSON parse failed: EOF ...)`), den Proxy deaktivieren und den Befehl direkt ausführen:
  ```bash
  RTK_DISABLED=1 pnpm run lint
  ```
- `RTK_DISABLED=1` schaltet die Hook-/Proxy-Funktion von rtk komplett ab (kein Wrapping, volle Rohausgabe).

## Git-Workflow
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `ci:`
- Features auf eigenen Branches entwickeln
- Vor Commit/Push: Definition of Done erfüllen
- Keine Secrets committen

## Definition of Done
- Nach Quellcode-Änderungen: `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo`
- Nach reinen .md Änderungen: direkt push (kein lint/check/build)
- Keine offenen TODOs im finalen Code hinterlassen

## Arbeitsweise
- Kleine, nachvollziehbare Änderungen bevorzugen
- Bestehende Patterns zuerst wiederverwenden, dann abstrahieren
- Bei unklaren Anforderungen lieber vorhandene Komponenten erweitern statt neue Systeme einführen

## Wichtige Regeln & Grenzen

### Immer
- Domain: `holger-kampffmeyer.de`

### Vorher fragen
- Dependencies hinzufügen
- Analytics-, Consent- oder Payment-Integrationen ändern

### Nie
- Secrets committen
- Produktive URLs hart codieren (Domain ist `holger-kampffmeyer.de`)

## Wissen & Referenzen
- `docs/` — Projekt-Doku (Build, Music Blog, Design, Git-Workflow)
- `openspec/` — Feature-Specs (OpenSpec)
- `.serena/memories/` — persistentes Projektwissen (Tech-Stack, Konventionen); vor größeren Änderungen relevante Memories lesen

## OpenSpec Feature Development

This project uses OpenSpec for spec-driven development. To define and implement future features:

1. **Create a new change**:
   ```bash
   openspec new change "<feature-name>"
   ```
2. **Define artifacts**: Fill in `proposal.md`, `design.md`, `tasks.md`, and delta specs under `openspec/changes/<feature-name>/specs/`.
3. **Apply & Implement**: Implement the feature according to the specs and tasks.
4. **Archive & Sync**:
   ```bash
   openspec archive <feature-name> -y
   ```

## Workflows

### Neuen Mix-Post erstellen
Auf Zuruf "neuen Mix-Post" / "neuen Blog-Eintrag":
1. [Music-Blog-Script](docs/music-blog-script.md) lesen → Abschnitt "Neuen Mix hinzufügen"
2. **Bei b2b/Guestmix:** Abschnitt "Mixes ohne Mix-Nummer" beachten (Dateinamen-Konvention + Datum-basiertes Matching)
3. Alle Schritte ausführen

## Wartungsskripte
- `node scripts/update-image-refs.mjs` — Ersetzt JPEG/PNG-Bildreferenzen durch WebP-Versionen (falls verfügbar) in allen .astro, .html, .css und .mjs Dateien

## IndexNow
- `pnpm run indexnow-submit` — Sendet alle URLs aus `public/urllist.txt` an die IndexNow API (Bing). Wird nach `build:seo` ausgeführt.

## Bereichsspezifische Hinweise
- **`dj/mixes/[number].astro`**: AudioObject + BreadcrumbList Schema prüfen (Mix-Detailseite)
- **`dj/mixes-weekly.astro`**: Blog + BlogPosting Schema prüfen (Mixes-Übersicht)
- **`dj/mixes-blog-archive.astro`**: Blog-Archiv, kein eigenes JSON-LD nötig
- **`vermietung.astro`**: Nur Weiterleitung zu soundundlicht, kein eigener Content
