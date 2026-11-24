# Proposal

## Why

Die Datumssuche in der Label-Übersicht ist nur auf Label-Ebene korrekt: Reine Jahresabfragen zeigen alle Mixes einer Zeile, und Kombinationen wie `2026 Artist` ignorieren das Jahr bei der Mix-Auswahl. Das widerspricht der bestehenden Anforderung, dass die Datumssuche nicht fuzzy ist, und führt zu sichtbar falschen Treffern.

## What Changes

- `SearchableMix` erhält `created_time`, damit die Mix-Ebene das Jahr prüfen kann.
- `filterMixesForSearch()` wendet Year-Tokens auf beiden Pfaden an: bei Treffern im Labelnamen und bei Treffern in Mix-/Track-Texten.
- Ein Mix gilt bei mehreren Jahresbegriffen als Treffer, wenn er zu einem der angegebenen Jahre passt; die Label-Ebene behält ihre bestehende `every`-Semantik.
- Regressionstests für reine Jahressuche, Jahr+Text-Suche und ein nicht vorhandenes Jahr.

## Capabilities

### New Capabilities

### Modified Capabilities

- `dj/label-overview`: Die Datumssuche gilt auch für die angezeigten Mixes einer Trefferzeile, nicht nur für die Label-Auswahl.

## Impact

- `src/utils/label-search.ts` und `tests/label-overview.test.ts`.
- Keine Änderung an URL-State, Sortierung, Pagination oder JSON-LD.
- Keine neuen Dependencies.
