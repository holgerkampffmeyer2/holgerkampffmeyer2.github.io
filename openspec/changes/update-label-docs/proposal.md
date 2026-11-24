# Proposal

## Why

Die neue Label-Übersicht ist im Projektwissen und in den Ablaufdokumenten kaum beschrieben; mehrere Build-Beschreibungen sind zudem veraltet. Wer Labels pflegt oder den Build erklärt, findet die neuen Routes, Suchzustände und Noindex-Regeln nicht wieder.

## What Changes

- `README.md`, `AGENTS.md`, `docs/DESIGN.md`, `docs/music-blog-script.md` und `docs/build.md` um die Routes `/dj/labels` und `/dj/labels/<slug>` ergänzen.
- Suche, `minTracks=3`, Sortierung, 25/50-Pagination, URL-Query-State und Accordion-Verhalten als aktuelles Verhalten dokumentieren.
- Den Zusammenhang zwischen `labels.json`, Overview/Detailseiten, Mix-Detail-Chips, `build:seo`, `MIN_LABEL_TRACKS` und Sitemap/`urllist.txt` beschreiben.
- Veraltete Build-Beschreibungen korrigieren: `generate-mix-og.mjs`, `fetch-social-stats.mjs`, `lastmod.mjs`; `og:mix` und `indexnow-submit` ergänzen.
- `openspec/specs/dj/label-overview/spec.md` bleibt die kanonische Verhaltensreferenz; archivierte Change-Artefakte werden nicht umgeschrieben.

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- Reine Markdown-Änderungen; kein Source-Code und keine Spec-Änderung.
- Keine neuen Dependencies.
- Definition of Done: nach reinen `.md`-Änderungen kein lint/check/build nötig.
