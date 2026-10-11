# Tasks

## 1. Library-Module

- [x] 1.1 `scripts/lib/track-match.mjs`: `normalizeTrack`, `stripAllBracketed`,
      `cleanTitleForSearch`, `extractRemixHandle`, `trackMatchScore` (0..1)
- [x] 1.2 `scripts/lib/cue.mjs`: `parseCue(content)`, `readCueDir(dir)`,
      `extractLabelFromTags(tags)` (publisher > Album-`[Label]` > Promo-comment),
      `readTags(file)` via `ffprobe`; Jingle-Filter
- [x] 1.3 `scripts/lib/label-lookup.mjs`: `lookupLabelOnline(artist, title)` (MusicBrainz
      `recording` → `release?inc=labels`, `label-info`-Extraktion, `recordingConfidence`),
      `buildQuery`/`primaryArtist`, Retry/Rate-Limit/Cache, User-Agent

## 2. Recherche-Skript

- [x] 2.1 `scripts/label-research.mjs`: CLI/Env `--cue-dir` (Default aus Env), `--data`,
      `--limit`, `--offline`; Repo-Tracks laden und dedupen
- [x] 2.2 Pool aus CUE-Tags bilden, Repo-Tracks fuzzy matchen → Offline-Label
- [x] 2.3 Verbleibende Tracks per MusicBrainz nachschlagen → Online-Label
- [x] 2.4 `label-research.json` + Markdown-Report (Statistik) schreiben; Registry unberührt
- [x] 2.5 Verzeichnis-Fehler/fehlendes `ffprobe` sauber behandeln (Abbruch mit Meldung)

## 3. Apply-Skript

- [x] 3.1 `scripts/label-apply.mjs`: Vorschläge lesen, Label-Namen normalisieren/deduplizieren,
      IDs vergeben, in `src/data/labels.json` mergen
- [x] 3.2 `validateLabelRegistry` aufrufen und Probleme ausgeben (kein stiller Merge)
- [x] 3.3 `--dry-run`-Option, die nur den Diff zeigt

## 4. Tests (Vitest)

- [x] 4.1 `tests/track-match.test.mjs`: Normalisierung, Klammern, Remix-Handles, Score, verdrehte Reihenfolge
- [x] 4.2 `tests/cue.test.mjs`: CUE-Parsing, Jingle-Filter, Tag-Label-Extraktion (publisher/Album/comment)
- [x] 4.3 `tests/label-lookup.test.mjs`: MusicBrainz-Response-Verarbeitung (Fixture, kein Netz)

## 5. Integration & Doku

- [x] 5.1 `package.json`: Skripte `label:research` und `label:apply`
- [x] 5.2 `.gitignore`: `label-research.json`, Report-Artefakte
- [x] 5.3 `docs/music-blog-script.md`: Abschnitt „Labels recherchieren & pflegen"
      (Workflow, Pfade, Konfidenz-Regeln, Review)

## 6. Verifikation

- [x] 6.1 `pnpm run lint`
- [x] 6.2 `pnpm run check`
- [x] 6.3 `pnpm test`
- [x] 6.4 `pnpm run build && pnpm run build:seo`
- [x] 6.5 Probelauf gegen echten CUE-Pfad (offline) und Parse-Ergebnis sichten
