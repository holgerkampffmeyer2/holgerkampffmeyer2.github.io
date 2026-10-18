# Design

## Context

Die URL-Erweiterung wurde als Ergänzung zur `track-label-research`-Pipeline gebaut, aber nie
spezifiziert. Aktuell existieren **zwei** parallele Werkzeuge für denselben Zweck:

- `scripts/label-urls.mjs` (kanonisch, via `pnpm run label:urls`): MusicBrainz-Label-Entity
  mit `inc=url-rels`, Logik in der getesteten Library `scripts/lib/label-search.mjs`,
  Ausgabe `label-urls.json`.
- `scripts/label-url-finder.mjs` (nicht verdrahtet): Domain-Pattern-Fallback mit
  HEAD-Check; der MusicBrainz-Pfad ist ein nie gefüllter `try`-Block mit toten Funktionen
  (`pickBestMbUrl`, `extractMbOfficialHomepage`), trotz gegenteiliger Report-Angabe.
- `scripts/label-url-quality.mjs`: HTML-Quality-Check (CodeQL-Fix `296ac43`).
- `scripts/clean-proposals.mjs`: One-Shot-Cleanup mit hartkodiertem WSL-Pfad.
- `scripts/label-apply.mjs --urls`: URL-Only-Merge.

`AGENTS.md` und `docs/music-blog-script.md` beschreiben die Pipeline falsch (Output
`label-url-proposals.json`, Quellen „MusicBrainz + Patterns" für `label:urls`).

## Goals / Non-Goals

**Goals:**
- Eine kanonische Recherche-Pipeline (`label:urls` → `label-urls.mjs`) und klar benannte,
  optionale Zusatzwerkzeuge.
- Code ohne toten, nicht implementierten Ballast; Berichte nennen nur echte Quellen.
- Testbare Pure Functions in `scripts/lib/`, Unit-Tests für Merge- und Quality-Logik.
- Spezifikation des bisher undokumentierten Umfangs (diese Change).

**Non-Goals:**
- Keine neue Funktionalität (z. B. zusätzliche URL-Quellen wie Discogs-Suche).
- Keine Änderung an Registry-Daten (`src/data/labels.json`).
- Keine Konsolidierung beider Werkzeuge in ein einziges Skript — der Pattern-Fallback
  bleibt bewusst separat und optional.

## Decisions

1. **`label-urls.mjs` bleibt kanonisch** für `label:urls`. *Alternativen:* Finder
   verdrahten (bricht bestehende `label-urls.json`-Artefakte und `label:urls:apply`),
   vollständige Konsolidierung (mehrerer Aufwand, kein funktionaler Gewinn). Die Lib
   dahinter ist getestet; der Finder-Pattern-Teil wird als benanntes Fallback-Skript
   dokumentiert.
2. **Toten MusicBrainz-Pfad im Finder entfernen statt reparieren.** Die url-rels-Recherche
   steckt bereits in `label-search.mjs`; ein zweiter MB-Client dort wäre Doppelung.
   Report-Text wird korrigiert (nur „Domain-Patterns + HEAD-Check").
3. **Pure Functions auslagern** (`label-apply.mjs` → `scripts/lib/label-apply.mjs`,
   `label-url-quality.mjs` → `scripts/lib/label-quality.mjs`), damit Vitest sie direkt
   laden kann — Muster wie `scripts/lib/label-search.mjs`. Die Skripte bleiben dünne
   CLI-Orchestrierung.
4. **`clean-proposals.mjs` löschen**: Wirkung ist in `labels.json` eingearbeitet, die
   hartkodierten Listen sind nur dort sinnvoll, und der Absolute-Pfad verstößt gegen die
   Regel „keine maschinenspezifischen Pfade". *Alternative:* portabel machen — verworfen,
   da kein Wiederholungsbedarf erkennbar.
5. **`dummy.test.mjs` löschen** — kein realer Test.

## Risiken / Trade-offs

- [Entfernen des MB-Pfads im Finder reduziert scheinbar Rechercheabdeckung] → Betrieb
  zeigt: Der Pfad lief ohnehin nie Ergebnisse; `label-urls.mjs` deckt MB real ab.
- [Zwei Skripte mit getrennten Artefakten bleiben potenziell verwechselbar] → Mitgegeben:
  Doku angleichen (echte Namen, echte Outputs) + `applyUrls` akzeptiert beide
  Artefakt-Formate (`suggestions` wie `proposals`).
- [Auslagerung der Pure Functions ändert Aufruflinien] → CLI-Verhalten unverändert;
  Verifikation über bestehenden Testlauf + Build.

## Migration Plan

Keine Deployment-Migration (Build-Zeit-Werkzeuge). Schritte: Code bereinigen → Tests
ergänzen → Doku angleichen → Verifikation (`lint`, `check`, `test`, `build`,
`build:seo`) → Change archivieren. Rückgängig machen wäre ein `git revert` der Commits.

## Open Questions

Keine — kanonisches Werkzeug, Finder-Scope und Umgang mit `clean-proposals.mjs`
(siehe Decisions) sind geklärt.
