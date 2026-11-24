# Design

## Context

Labels werden aktuell ausschließlich aus `src/pages/dj/labels/[label].astro` generiert. Die Aggregation liegt in `getStaticPaths()` und ist damit nicht für eine zweite Route wiederverwendbar. Der Site ist statisch (`output: 'static'`), nutzt keine UI-Islands und progressive Enhancement über kleine Inline- oder `public/assets/`-Skripte. Die bestehende Indexierbarkeitsregel erlaubt interne Links und JSON-LD-`@id` nur für Labels mit mindestens drei Tracks. Siehe `proposal.md` für die Motivation.

## Goals / Non-Goals

**Goals:**

- Eine einzige, crawlbare Label-Übersicht mit identischer Datenbasis wie die Detailseiten.
- Alle Registry-Labels sichtbar, inklusive Labels ohne Mixes; dünne Labels ohne interne Detailverlinkung.
- Recherche über Label, Artist, Titel, Mix und Datum mit sortierbaren Spalten und teilbarer URL.
- Accordion-Verhalten und Animation analog zu `/work`, ergänzt um Tastaturfokus.
- Vollständige SEO-Ausstattung: Title, Description, kanonische URL, Breadcrumb, strukturierte Daten, Sitemap/`urllist.txt`.

**Non-Goals:**

- Keine neuen Dependencies, kein clientseitiges Framework, keine Server-/API-Route.
- Keine Änderung am `tracklist`-Datenmodell (`string[]`) oder an der Mixcloud-Fetch-Pipeline.
- Keine Löschung der 217 dünnen Detailseiten in diesem Change.
- Keine englische Übersetzung der Label-Übersicht.

## Decisions

1. **Geteilte Aggregation statt Duplizierung.** `buildLabelEntries()` wandert in `src/utils/label-overview.ts` und liefert für jede Route dieselben Einträge inklusive `searchText`, `trackCount`, `mixCount`, `latestDate` und `isIndexable`. Detailseite und Übersicht konsumieren diese Funktion. Alternativ verworfen: Kopie der `getStaticPaths()`-Logik — zu hohes Drift-Risiko bei neuen Mixes.

2. **SSR rendert alle Zeilen, JavaScript enhanced.** Die 279 Zeilen liegen im statischen HTML; Suche, Sortierung und Pagination blenden nur ein/aus. So bleibt die Seite ohne JavaScript nutzbar und für Crawler vollständig sichtbar. Alternativ verworfen: nur die erste Seite serverseitig rendern und den Rest aus JSON nachrendern — mehr Komplexität und schlechtere No-JS-Erfahrung.

3. **Eigene Suchlogik ohne Dependency.** Normalisierung und Token-/Bigram-Ähnlichkeit werden aus `scripts/lib/track-match.mjs` in eine DOM-freie, unit-testbare Util überführt. Exakte Treffer und Präfixe haben Vorrang, Fuzzy ist Fallback mit Schwelle. Datum wird exakt (`YYYY`, `YYYY-MM-DD`) behandelt, weil fuzzy Datumsvergleiche mehr False Positives erzeugen als Nutzen bringen. Alternativ verworfen: Fuse.js/MiniSearch — neue Dependency und projekteigene Logik ist bereits vorhanden.

4. **URL-Query als UI-State.** `q`, `sort`, `dir`, `minTracks`, `page` werden via `history.replaceState` gepflegt; `Layout.astro` kanonisiert ohnehin auf den Pfad ohne Parameter. Filter- und Sortierwechsel setzen `page=1` zurück.

5. **Accordion nach `/work`.** State wird über `data-expanded`, `aria-expanded`, `aria-controls` und `aria-hidden` gesteuert; Animation über `grid-template-rows`, Opacity und Clip-Transform inklusive `prefers-reduced-motion`. Die `/work`-Focusline (42 % Viewport) wird übernommen und zusätzlich `focusin` ausgewertet. Ein `suppressAutoFocus`-Flag verhindert, dass Scrollen eine fokussierte oder manuell geöffnete Zeile sofort wieder schließt.

6. **Schema-Builder im Zentrum.** `buildLabelCollectionSchema()` ergänzt `schema-builders.ts` und liefert `CollectionPage`, `BreadcrumbList` und `ItemList`. Alle URLs werden über `resolveUrl(path, baseUrl)` gebaut. Die `ItemList` enthält alle Labels, aber interne `url`/`@id` nur für indexierbare Labels. Damit bleibt die Regel aus `openspec/specs/label-registry/spec.md` gewahrt.

7. **Navigation unter `DJing`.** Die Übersicht ist ein Unterpunkt des bestehenden Dropdowns; die Active-State-Logik markiert `DJing` bereits für `/dj`-Pfade. Weil das Dropdown bisher nur per Hover öffnet, wird `group-focus-within` ergänzt. Alternativ verworfen: neuer Top-Level-Punkt — das Menü ist bereits voll, und die thematische Zuordnung wäre falsch.

8. **Lastmod-Korrektur.** `resolveSourceFiles()` bildet `dj/labels/<slug>` auf `src/pages/dj/labels/[label].astro` ab, statt auf eine nicht existierende Datei. Die neue Indexseite erhält nach dem Commit einen Cache-Eintrag über `node scripts/lastmod.mjs`.

## Risks / Trade-offs

- [Großes DOM bei 279 Zeilen] → Alle Zeilen sind initial eingeklappt; Expandierinhalte werden erst bei Bedarf sichtbar, Pagination begrenzt sichtbare Zeilen auf 25/50.
- [Fuzzy-False-Positives] → Exakt-/Präfix-Treffer zuerst, Score-Schwelle, gewichtete Felder; Datum exakt.
- [Fokus-Logik konkurriert mit Scroll-Autofokus] → `suppressAutoFocus` bei Fokus oder kürzlichem manuellen Toggle; `requestAnimationFrame`-Drosselung wie in `/work`.
- [Stale Suchartefakte können `knowledge-magazine` erneut vorschlagen] → Nur `src/data/labels.json` ist versioniert; generierte Caches/Reports werden nicht bearbeitet, die nächste `label:apply`-Prüfung muss den Vorschlag verwerfen.
- [Dropdown war per Tastatur nicht erreichbar] → `focus-within` wird im selben Change ergänzt; alle anderen Submenüs profitieren davon.
- [Query-Parameter in Sitemap/IndexNow] → Kanonische URL bleibt `/dj/labels`; `build:seo` nimmt nur die Basisroute auf.

## Migration Plan

1. Registry-Eintrag entfernen, OpenSpec-Artefakte und Code ändern.
2. Build, SEO-Build und Tests ausführen; `smoke-dist.mjs` prüft die neue Route und die Indexierbarkeitsregeln.
3. Nach dem Commit `node scripts/lastmod.mjs` ausführen, damit die neue Seite und die korrigierte dynamische Route echte Lastmod-Daten erhalten.
4. Rollback: Change revertieren; die alte Label-Detailroute bleibt unverändert verfügbar, solange ihre Aggregation aus dem gemeinsamen Util kommt.

## Open Questions

Keine. Alle Entscheidungen wurden vorab mit dem Nutzer geklärt.
