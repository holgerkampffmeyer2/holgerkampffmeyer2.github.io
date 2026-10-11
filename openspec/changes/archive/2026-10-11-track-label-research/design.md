# Design

## Kontext

Die Label-Spalte, die Registry `src/data/labels.json` und die Auflösung
(`src/utils/track-labels.js` → `normalizeTrack`, `buildTrackLabels`, `validateLabelRegistry`)
existieren bereits aus der vorangegangenen Arbeit. Dieses Change ergänzt **nur** das Tooling
zur Befüllung der Registry sowie die Dokumentation; die Render-Logik bleibt unverändert und
wird lediglich als Capability `label-registry` spezifiziert.

## Goals / Non-Goals

**Goals**
- Offline-first: vorhandene Tags in den Quelldateien nutzen (schnell, keine Rate-Limits).
- iTunes nur als Fallback für die verbleibenden Tracks.
- Jeder Vorschlag ist belegt und reviewbar; kein automatisches Schreiben in die Registry.
- Kein maschinenspezifischer Pfad im Repo.
- Kein neues npm-Dependency.

**Non-Goals**
- Kein automatischer Merge ohne Review.
- Keine weiteren Online-Portale (Deezer/Bandcamp/Beatport) in dieser Iteration.
- Keine Änderung am `tracklist: string[]`-Datenmodell oder an der Suche.

## Architektur

Drei reine, testbare Library-Module unter `scripts/lib/` plus zwei ausführende Skripte:

```
scripts/lib/track-match.mjs   # Normalisierung, Bracket-/Remix-Handling, Fuzzy-Score
scripts/lib/label-clean.mjs   # gemeinsame Label-Bereinigung/-Filter (alle Quellen)
scripts/lib/cue.mjs           # CUE-Parser + ffprobe-Tag-Extraktor (Label-Hinweise)
scripts/lib/label-lookup.mjs  # MusicBrainz-Client (Retry, Rate-Limit, Cache, Parsing)

scripts/label-research.mjs    # Orchestrierung → label-research.json + Report + labels.csv
scripts/label-apply.mjs       # Merge in src/data/labels.json + validateLabelRegistry
```

Die Module importieren **keine** Astro-/App-Module, sondern werden von den Skripten und
von Vitest direkt geladen (Muster wie `src/utils/mix-display.js`).

## Datenfluss

1. **Repo-Tracks**: `src/data/blog-posts.json` → alle `tracklist`-Einträge deduplizieren
   (Schlüssel bleibt der veröffentlichte String).
2. **CUE-Pool**: alle `*.cue` im `--cue-dir` parsen → `{ performer, title, sourceFile }`;
   Jingles/Zwischenansagen filtern.
3. **Offline-Tags**: je referenzierter Quelldatei einmalig `ffprobe`
   (`format_tags=publisher,album,comment`) → Label-Kandidat nach Priorität
   `publisher` > Album-`[Label]` > `comment`-Promo-Muster.
4. **Fuzzy-Match**: Repo-Track gegen CUE-Pool (Artist+Titel, remix-/klammer-tolerant,
   vertauschte Reihenfolge) → offline Label mit `confidence`.
5. **Online-Fallback**: verbleibende Tracks gegen iTunes (`label`-Feld).
6. **Ausgabe**: `label-research.json` (Vorschläge) + Report (Statistik). Registry bleibt unberührt.
7. **Apply** (separater Aufruf): Vorschläge lesen, Label-Namen normalisieren und deduplizieren,
   IDs vergeben, in `labels`/`tracks` mergen, dann `validateLabelRegistry` ausführen.

## Entscheidungen

- **Node statt Python-Import**: Konsistent mit den bestehenden `scripts/*.mjs`, keine
  Cross-Repo-Kopplung; die Python-Logik (`wav-to-aac-converter/src/metadata.py`,
  `src/utils.py`) dient nur als Referenz für Such-URL, Fuzzy-Schwellwert und Remix-Handling.
- **Online-Quelle MusicBrainz** (statt iTunes): Die iTunes-Search-API liefert kein
  `label`-Feld mehr (nur `copyright` am Album, oft Distributor). MusicBrainz liefert über
  `recording` → `release?inc=labels` belastbare Label-Namen. Beatport wurde geprüft und
  verworfen: Web-Search ist per Cloudflare-Challenge (403) geblockt, die API verlangt OAuth (401).
- **Globaler Pool statt Mix↔CUE-Zuordnung**: Die CUE-Aufnahmen sind teils andere/partielle
  Mitschnitte als die veröffentlichten Tracklisten; ein globaler, deduplizierter Pool ist
  robuster und deckt Wiederholungen automatisch ab.
- **ID-basierte Registry** (bereits implementiert): Tracks referenzieren Labels über eine
  stabile ID; Umbenennungen betreffen nur `labels`.
- **Report-Artefakte außerhalb des Builds**: `label-research.json` und Report werden nicht
  committet (`.gitignore`), `labels.json` nur nach Review.

## Risiken / Trade-offs

- **Fuzzy-Falschtreffer**: mitigiert durch Konservativität – nur „sicher" gematchte
  Offline-Treffer automatisch; alles andere bleibt im Report zur Sichtprüfung.
- **Unvollständige/rote Quelldateien**: Dateien ohne Tags und ohne Online-Treffer bleiben
  offen; das ist erwartet und blockiert nichts.
- **iTunes-Abdeckung**: nur so gut wie der Katalog; akzeptiert, da später erweiterbar.

## Offene Fragen

(geklärt) Node im Repo · Vorschlag+Apply mit Review · MusicBrainz als Online-Quelle · CUE-Pfad per CLI/Env · OpenSpec.
