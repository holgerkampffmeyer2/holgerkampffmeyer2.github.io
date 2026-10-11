# Proposal

## Why

Tracklisten auf den Mix-Seiten sollen optional das Record-Label zeigen und auf die
Label-Website verlinken. Die dafür nötige Registry (`src/data/labels.json`, ID-basiert)
und die Render-Komponente existieren bereits, aber es gibt **keine Daten** und keinen
Weg, sie systematisch zu befüllen. Die Labels stecken größtenteils in den Quelldatei-Tags
der Rekordbox-CUEs (`publisher`, Album-`[Label]`, Promo-`comment`); der Rest ist online
recherchierbar. Ohne Automatisierung müssten ~716 eindeutige Tracks manuell gepflegt werden.

## What Changes

- **Neues Maintainer-Tooling** (Node, `scripts/`), das aus allen Rekordbox-CUEs einen
  Track-Pool bildet, die referenzierten Quelldateien per `ffprobe` nach Label-Tags
  auswertet (offline) und die verbleibenden Tracks über die MusicBrainz-Search-API (online)
  nachschlägt.
- **Vorschlags-Artefakt** `label-research.json` (+ Report) als Ergebnis; kein direktes
  Schreiben in die Registry.
- **Expliziter Apply-Schritt**, der reviewte Vorschläge in `src/data/labels.json` merged
  und die Registry validiert.
- **Dokumentation** des Workflows und der Konfidenz-Regeln.

## Capabilities

### New Capabilities
- `label-registry`: ID-basierte Sidecar-Registry (`labels.json`) inkl. Track-Abgleich,
  Auflösung Label→Name/URL und Konsistenz-Validierung; optionale Label-Spalte in der
  Tracklist-Tabelle, nur wenn mindestens ein Track ein Label hat.
- `track-label-research`: Offline-/Online-Recherche-Pipeline, die für die Tracks aus
  `blog-posts.json` Label-Vorschläge erzeugt (CUE-Quelldatei-Tags zuerst, MusicBrainz-Fallback)
  und als reviewbares Artefakt ausgibt.

### Modified Capabilities
(none)

## Impact

- **Neu**: `scripts/label-research.mjs`, `scripts/label-apply.mjs`, `scripts/lib/*`
- **Genutzt (bereits vorhanden)**: `src/data/labels.json`, `src/utils/track-labels.js`,
  `src/components/dj/TracklistTable.astro`
- **Dependencies**: keine neuen (nutzt `node-fetch`, `ffprobe`, `node:child_process`)
- **Extern**: liest CUE-Dateien aus einem per CLI/Env konfigurierten Verzeichnis; online
  nur MusicBrainz (rate-limitiert, mit Cache)
- **Artefakte**: `label-research.json` und Report sind Zwischenstände, nicht Teil des Builds
