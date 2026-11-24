# Tasks

## 1. Datenbasis und Registry

- [x] 1.1 Entferne `knowledge-magazine` aus `src/data/labels.json` und verifiziere, dass kein Track auf die ID verweist und die Registry-Validierung leer bleibt
- [x] 1.2 Extrahiere die Label-Aggregation in `src/utils/label-overview.ts` inklusive `searchText`, `mixCount`, `trackCount`, `latestDate` und `isIndexable`, verifiziert durch Unit-Tests für 279 Labels, 277 mit Mixes und 2 ohne Mixes
- [x] 1.3 Portiere Normalisierung und gewichtete Ähnlichkeitssuche in eine DOM-freie Util und teste exakte Treffer, Tippfehler, Artist-/Titel-/Mixsuche und exakte Jahressuche

## 2. Übersichtsseite

- [x] 2.1 Erstelle `src/pages/dj/labels/index.astro` mit Tabelle, Sortierköpfen, Filterchips, Suchfeld, Pagination und SSR-Rendern aller Zeilen, verifiziert durch Build und Heading-Structure-Test
- [x] 2.2 Implementiere das `/work`-Accordion mit `data-expanded`, ARIA-State, Animation und `prefers-reduced-motion`, verifiziert durch statische Markup-Prüfung im Smoke-Test
- [x] 2.3 Implementiere Scroll-Fokus plus Tastaturfokus mit Suppression manuell geöffneter Zeilen, verifiziert durch Unit-Tests der DOM-freien Fokuslogik
- [x] 2.4 Verdrahte URL-Query-State (`q`, `sort`, `dir`, `minTracks`, `page`), Filter-Reset auf Seite 1 und 25/50-Zeilen-Pagination, verifiziert durch Unit-Tests der State-Helper

## 3. Navigation, Schema und SEO

- [x] 3.1 Ergänze `Labels` unter `DJing` in `Navbar.astro` inklusive `group-focus-within` und verifiziere Desktop- und Mobile-Link im gebauten HTML
- [x] 3.2 Ergänze `buildLabelCollectionSchema()` in `src/utils/schema-builders.ts` und teste CollectionPage, BreadcrumbList, ItemList sowie Indexierbarkeits-Gating ohne hartcodierte Domain
- [x] 3.3 Nutze den neuen Schema-Builder und Breadcrumb auf `/dj/labels`, setze Title, Description und kanonische URL und verifiziere die JSON-LD-Blöcke im gebauten HTML
- [x] 3.4 Ergänze Breadcrumb-Parent `Labels`, Rücklink und `BreadcrumbList` auf den Label-Detailseiten und ersetze hartcodierte Domains durch `resolveUrl`, verifiziert durch Schema- und Smoke-Tests
- [x] 3.5 Ergänze `/dj/labels` in `SiteNavigationElement` und `docs/DESIGN.md`, verifiziert durch Build und Sitemap-/Urllist-Prüfung
- [x] 3.6 Korrigiere `resolveSourceFiles()` in `scripts/lastmod.mjs` für dynamische Label-Routen und verifiziere ein nicht-epoch `lastmod` im Sitemap-Eintrag von `ministry-of-sound`

## 4. Verifikation

- [x] 4.1 Ergänze `tests/label-overview.test.ts` für Aggregation, Suche, State und Fokuslogik; verifiziert durch `pnpm test:run`
- [x] 4.2 Erweitere `scripts/smoke-dist.mjs` um die neue Route, Navigation, Accordion-Markup und das unveränderte Thin-Label-Verhalten; verifiziert durch `node scripts/smoke-dist.mjs`
- [x] 4.3 Führe `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo && pnpm test:run` aus und verifiziere einen fehlerfreien Lauf

## Workflow follow-up

- Archive den Change nach Review und Definition of Done mit `openspec archive label-overview -y`.
- Führe nach dem Commit `node scripts/lastmod.mjs` aus, damit der Cache die neue Seite und die korrigierte dynamische Route enthält.
