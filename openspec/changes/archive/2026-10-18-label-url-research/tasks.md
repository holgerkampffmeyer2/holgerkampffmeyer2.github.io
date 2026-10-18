# Tasks

## 1. Refactoring `label-url-finder.mjs` (toter Code)

- [x] $1 `processLabel`: leeren `try`-Block und `mbResult`-Plumbing entfernen; `mbCache`-Parameter
      und `loadCache`-Aufruf in `main` entfernen (nicht mehr benötigt)
- [x] $1 Tote Funktionen `pickBestMbUrl` und `extractMbOfficialHomepage` löschen
- [x] $1 Ungenutzten Import `labelMatchKey` und ungenutzte Variable `rateLimit` entfernen
- [x] $1 Report-Quellenangabe korrigieren: nur noch „Domain-Patterns (HEAD-Check) +
      bestehende Registry-URLs", keine MusicBrainz-Behauptung

## 2. Refactorings & Aufräumen

- [x] $1 `scripts/clean-proposals.mjs` löschen
- [x] $1 `tests/dummy.test.mjs` löschen
- [x] $1 `scripts/label-urls.mjs`: O(n²)-`labels.find(...)` in der Schleife durch
      eine `Map` (Name → [id, def]) ersetzen
- [x] $1 Pure Functions auslagern: `slugify`, `findLabelId`, `uniqueId`, `applyUrls`
      → `scripts/lib/label-apply.mjs`; `extractText`, `analyzeContent` (+ Keyword-Konstanten)
      → `scripts/lib/label-quality.mjs`; Skripte importieren daraus

## 3. Unit-Tests (Vitest)

- [x] $1 `tests/label-apply.test.mjs`: `slugify` (Unicode/Slugs), `uniqueId` (Kollisionen),
      `applyUrls` — Merge beider Artefakt-Formate (`suggestions`/`proposals`), Normalisierung
      via `labelMatchKey`, Standard „kein overwrite", `--overwrite`, Track-Zuordnungen unverändert
- [x] $1 `tests/label-url-quality.test.mjs`: `extractText` entfernt script/style inkl.
      `</script >` (CodeQL-Fix), `analyzeContent` — suspicious bei negativem Marker,
      likely-label bei Musik-Keywords + substanzielem Text, thin-content, kein Treffer
      aus Script-Inhalten

## 4. Doku angleichen

- [x] $1 `AGENTS.md`: `label:urls` korrekt als „MusicBrainz url-rels → label-urls.json"
      beschreiben; optionales Pattern-Fallback `node scripts/label-url-finder.mjs` ergänzen
- [x] $1 `docs/music-blog-script.md` §„Label-URLs recherchieren & pflegen": Workflow an
      die tatsächliche Verdrahtung anpassen (echte Artefakt-Namen, Quellen, Apply-Modi)

## 5. Verifikation

- [x] $1 `pnpm run lint`
- [x] $1 `pnpm run check`
- [x] $1 `pnpm test`
- [x] $1 `pnpm run build && pnpm run build:seo`
- [x] $1 `openspec validate label-url-research` und `openspec archive label-url-research -y`
