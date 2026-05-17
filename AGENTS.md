# Agenten-Informationen

**Projekt:** DJ & Lichttechnik Website - holger-kampffmeyer.de

## Projektkontext
Persönliche Website von Holger Kampffmeyer – DJ, Lichttechniker und Event-Technik-Verleih.
Primäres Ziel: DJ-Buchungen, Mixcloud-Reichweite, Work-Portfolio.
Sekundäres Ziel: organischer SEO-Traffic über DJ-Mix-Seiten und Tracklists.

## Tech-Stack
- **Framework:** Astro 6.x (SSG, `output: 'static'`)
- **Styling:** Tailwind CSS 4.x + CSS Custom Properties (Theme-System)
- **Package-Manager:** pnpm
- **Node-Version:** >=18

## Schnellstart
- [Build & Deployment](docs/build.md)
- [Music Blog](docs/music-blog-script.md) — Workflow für neue Mix-Posts
- [Design & Architecture](docs/DESIGN.md)
- [Git-Workflow](docs/git.md)

## Workflows

### Neuen Mix-Post erstellen
Auf Zuruf "neuen Mix-Post" / "neuen Blog-Eintrag":
1. [Music-Blog-Script](docs/music-blog-script.md) lesen → Abschnitt "Neuen Mix hinzufügen"
2. Alle Schritte ausführen

## Build-Kommandos
- `pnpm run build` — Production Build (Details: [docs/build.md](docs/build.md))
- `pnpm run build:seo` — RSS + urllist.txt
- `pnpm run build:full` — Fetch Mixcloud + Build + SEO (für Mix-Posts)
- `pnpm run dev` — Dev server
- `pnpm run preview` — Preview build
- `pnpm run lint` — ESLint
- `pnpm run check` — TypeScript

## Wichtige Regeln
1. Domain IMMER auf `holger-kampffmeyer.de` setzen

## Definition of Done
- Nach Quellcode-Änderungen: `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo`
- Nach reinen .md Änderungen: direkt push (kein lint/check/build)
- Keine offenen TODOs im finalen Code hinterlassen

## Arbeitsweise
- Kleine, nachvollziehbare Änderungen bevorzugen
- Bestehende Patterns zuerst wiederverwenden, dann abstrahieren
- Bei unklaren Anforderungen lieber vorhandene Komponenten erweitern statt neue Systeme einführen

## Bereichsspezifische Hinweise
- **`dj/mixes/[number].astro`**: AudioObject + BreadcrumbList Schema prüfen (Mix-Detailseite)
- **`dj/mixes.astro`**: Blog + BlogPosting Schema prüfen (Mixes-Übersicht)
- **`dj/mixes-blog-archive.astro`**: Blog-Archiv, kein eigenes JSON-LD nötig
- **`vermietung.astro`**: Nur Weiterleitung zu soundundlicht, kein eigener Content

## Sicherheit & Grenzen
- Keine Analytics-, Consent- oder Payment-Integrationen ändern ohne explizite Anweisung
- Keine Dependencies hinzufügen ohne Begründung und Zustimmung
- Keine produktiven URLs hart codieren (Domain ist `holger-kampffmeyer.de`)
