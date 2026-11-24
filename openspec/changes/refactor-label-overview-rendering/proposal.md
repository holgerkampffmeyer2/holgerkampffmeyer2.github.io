# Proposal

## Why

Die Label-Übersicht rendert Mixzeilen zweimal: serverseitig in der Astro-Datei und clientseitig in einer Template-Zeichenkette. Beide Varianten sind bereits auseinandergedriftet (Website-`aria-label`, Datumsmarkierung, initialer Expanded-Zustand, Chevron-Icon); zusätzlich existieren drei HTML-Escaper und Website-URLs werden ohne Schema-Prüfung gesetzt.

## What Changes

- Eine gemeinsame `renderLabelRows()`-Funktion für SSR und Client; die clientseitige `rowMarkup()` und der nachträgliche Expanded-Patch entfallen.
- Ein gemeinsames `src/utils/html.ts` mit `escapeHtml()` und `safeHttpUrl()`; `escapeHtml()` wird auch vom Tracklist-Renderer genutzt.
- Website-URLs werden am Datenrand in `buildLabelEntries()` auf `http:`/`https:` begrenzt und zusätzlich an den Renderstellen abgesichert.
- Totes `searchText` wird entfernt; `mix.title` bleibt bewusst erhalten, weil es in der Mix-Suche benötigt wird.
- Moduleigene Exporte ohne Konsumenten werden privatisiert.

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- `src/pages/dj/labels/index.astro`, `src/pages/dj/labels/[label].astro`, `src/utils/label-overview.ts`, `src/utils/label-search.ts`, `src/utils/label-overview-state.ts`, `src/utils/tracklist-renderer.ts`.
- Neue Utils `src/utils/html.ts` und `src/utils/label-row.ts`; `public/assets/mix-search.js` bleibt als eigenständiges Legacy-Skript außen vor.
- Keine Änderung an sichtbarem Verhalten oder Specs; Existing-HTML-Parität wird mit Tests abgesichert.
- Keine neuen Dependencies.
