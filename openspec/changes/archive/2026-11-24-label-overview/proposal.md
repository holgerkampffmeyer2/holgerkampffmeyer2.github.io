# Proposal

## Why

Die 277 generierten Label-Detailseiten sind faktisch verwaist: Sie werden nur als Chips auf Mix-Detailseiten verlinkt, dort begrenzt auf die Top-5-Labels und ausschließlich für die 60 indexierbaren Labels. Es gibt keinen Einstieg über Navigation, Breadcrumb oder eine Indexseite, und kein Weg, Labels übergreifend nach Tracks, Mixes, Artists oder Datum zu recherchieren.

## What Changes

- Neue zentrale Übersichtsseite `/dj/labels` mit allen Registry-Labels (nach Entfernung von `knowledge-magazine`: 279 Einträge), inklusive der Labels ohne Mixes.
- Label-zentrierte Tabelle mit aufklappbaren Mixes; Animation und ARIA-Verhalten folgen dem `/work`-Accordion inklusive Scroll- und Tastaturfokus.
- Suche über Label, Artist, Tracktitel, Mixnamen und Datum; Filter für `≥3 Tracks`; sortierbare Spalten; clientseitige Pagination mit URL-Query-State.
- Dünne Labels bleiben sichtbar, werden aber nicht als interne Detailseite verlinkt und erhalten kein JSON-LD-`@id`; externe Website-Links bleiben möglich.
- `Labels` wird als Eintrag unter `DJing` in Haupt- und Mobilemenü ergänzt; das Dropdown wird per `focus-within` auch mit der Tastatur erreichbar.
- Detailseiten erhalten einen Breadcrumb-Parent `Labels`, einen Rücklink zur Übersicht und JSON-LD ohne hartcodierte Domain.
- Neue Schema-Builder für die Label-Übersicht (`CollectionPage`, `BreadcrumbList`, `ItemList`) in `src/utils/schema-builders.ts`.
- Lastmod-Auflösung für dynamische Label-Routen wird korrigiert; die neue Seite wird in Sitemap, `urllist.txt` und `SiteNavigationElement` aufgenommen.
- `knowledge-magazine` wird aus `src/data/labels.json` entfernt; `halogenix` und `four-corners-music` bleiben als Labels ohne Mixes erhalten.

## Capabilities

### New Capabilities

- `dj/label-overview`: Zentrale, durchsuchbare und sortierbare Label-Übersicht mit aufklappbaren Mixes, Pagination und SEO-Metadaten.

### Modified Capabilities

- `site/schema-builders`: Neuer Builder für die CollectionPage-/ItemList-Struktur der Label-Übersicht.

## Impact

- Neue Route `src/pages/dj/labels/index.astro`; geteilte Aggregations- und Suchlogik in `src/utils/`.
- Änderungen an `src/data/labels.json`, `src/components/Navbar.astro`, `src/data/jsonLd.ts`, `src/pages/dj/labels/[label].astro`, `src/utils/schema-builders.ts`, `scripts/lastmod.mjs`, `docs/DESIGN.md`.
- Keine neuen Dependencies; Fuzzy-Suche wird aus bestehender Normalisierungs-/Ähnlichkeitslogik portiert und unit-getestet.
- Sitemap, `urllist.txt`, `SiteNavigationElement`, Smoke-Tests und Heading-Struktur-Tests sind betroffen.
