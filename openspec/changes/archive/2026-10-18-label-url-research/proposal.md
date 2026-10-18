# Proposal

## Why

Die Label-Registry enthält Labels ohne Website; es wurde (Commit `fc8a91b`) Tooling gebaut,
das dafür URL-Vorschläge erzeugt (`label:urls`, Pattern-Fallback, Quality-Check), jedoch ohne
jede OpenSpec-Dokumentation — und die Doku (`AGENTS.md`, `docs/music-blog-script.md`) beschreibt
eine Pipeline, die so nicht verdrahtet ist: `label:urls` läuft tatsächlich auf
`scripts/label-urls.mjs` (nur MusicBrainz url-rels), nicht auf `scripts/label-url-finder.mjs`
(Patterns), dessen MusicBrainz-Pfad zudem nie implementiert wurde (toter Code). Der Umfang
muss nachträglich als Capability spezifiziert, der Code bereinigt und die Doku angleicht
werden.

## What Changes

- **Neue Capability `label-url-research`**: Retroaktive Spezifikation der kompletten
  Label-URL-Pipeline — MusicBrainz-Recherche (`label:urls`), optionales Pattern-Fallback,
  Quality-Check und der URL-Only-Apply-Modus (`label-apply.mjs --urls`).
- **Refactoring**: `scripts/label-url-finder.mjs` — nie implementierten MusicBrainz-Pfad
  entfernen (leerer `try`-Block, tote Funktionen `pickBestMbUrl`/`extractMbOfficialHomepage`,
  ungenutzte Imports/Parameter), Report-Quellenangabe korrigieren (nur noch Domain-Patterns).
- **Refactoring**: testbare Pure Functions aus `label-apply.mjs` und `label-url-quality.mjs`
  nach `scripts/lib/` auslagern; O(n²)-Lookup in `label-urls.mjs` durch Map ersetzen.
- **Entfernung**: `scripts/clean-proposals.mjs` löschen (One-Shot-Cleanup mit hartkodiertem
  maschinenspezifischen Pfad, Wirkung ist in `labels.json` bereits eingearbeitet).
- **Tests**: Unit-Tests für URL-Merge-Logik und Quality-Check (inkl. CodeQL-Fix
  `296ac43`); nutzloses `tests/dummy.test.mjs` entfernen.
- **Docs**: `AGENTS.md` und `docs/music-blog-script.md` an die tatsächliche Verdrahtung
  angleichen.

## Capabilities

### New Capabilities
- `label-url-research`: Recherche, Prüfung und Übernahme von Label-Websites in die
  Registry — reviewbare Artefakte, MusicBrainz-Quelle mit Rate-Limit/Cache, optionales
  Domain-Pattern-Fallback, HTML-Quality-Check, URL-Only-Merge ohne Track-Zuordnungen.

### Modified Capabilities
(none)

## Impact

- **Geändert**: `scripts/label-url-finder.mjs`, `scripts/label-urls.mjs`, `scripts/label-apply.mjs`, `scripts/label-url-quality.mjs`
- **Neu**: `scripts/lib/label-apply.mjs`, `scripts/lib/label-quality.mjs`, `tests/label-apply.test.mjs`, `tests/label-url-quality.test.mjs`
- **Gelöscht**: `scripts/clean-proposals.mjs`, `tests/dummy.test.mjs`
- **Docs**: `AGENTS.md`, `docs/music-blog-script.md`
- **Registry-Daten**: unverändert (`src/data/labels.json` wird von diesem Change nicht angefasst)
- **Dependencies**: keine neuen
