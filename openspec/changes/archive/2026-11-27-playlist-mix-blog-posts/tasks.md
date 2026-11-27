# Tasks

## 1. Playlist-Quelle

- [ ] 1.1 Playlist-Descriptor in `MIXCLOUD_SOURCES` ergänzen und `fetchSource()` auf `/playlists/<slug>/cloudcasts/` inkl. `paging.next` umstellen; verifiziert durch einen Unit-Test mit gemocktem `fetch`, der zwei Seiten und einen doppelten Key liefert.
- [ ] 1.2 Key-basiertes Dedupe und Sortierung nach `created_time` beibehalten; verifiziert durch `pnpm test:run tests/fetch-mixcloud-pure.test.mjs`.

## 2. Kuratierte Zuordnung

- [ ] 2.1 `src/data/playlist-mix-map.json` für alle 65 eindeutigen Playlist-Keys anlegen, mit `folder`, `tracklist`, `hero`, `status` und optional `note`; verifiziert durch einen Test, der Map-Keys gegen die Playlist-API-Fixture prüft.
- [ ] 2.2 Fetcher wendet die Map vor Nummer/Fuzzy/Datum an und markiert fehlende Zuordnungen als `metadata-only`; verifiziert durch Tests für map-Gewinn, Fuzzy-Konflikt und fehlende Map.
- [ ] 2.3 Importierte Tracklists und Hero-WebPs liegen repo-lokal in `tracklists/` und `public/tracklists/`; verifiziert durch `node scripts/fetch-mixcloud.mjs --force` ohne Rekordbox-Pfad.

## 3. Featured-Auswahl

- [ ] 3.1 `mixcloud-data.json` wird nur aus eigenen Uploads geschrieben, `blog-posts.json` aus allen Quellen; verifiziert durch Test und Sichtprüfung, dass `mixes[0]` weiterhin Mix204 ist.
- [ ] 3.2 Keine Änderung an `links.astro` nötig; verifiziert durch Build und Öffnen von `/links`.

## 4. Labels

- [ ] 4.1 Für jede zugeordnete CUE-Ordnergruppe `pnpm run label:research --offline` ausführen und results in `label-research.json` sammeln; verifiziert durch nicht leeren Offline-Anteil im Report.
- [ ] 4.2 Online-Fallback mit MusicBrainz ausführen und Vorschläge manuell sichten; verifiziert durch geprüftes `label-research.json` ohne offensichtliche Promo-/Publisher-Fehler.
- [ ] 4.3 `pnpm run label:apply --dry-run`, danach Apply sowie `label:urls`/`label:urls:apply --dry-run` und Apply; verifiziert durch `src/data/labels.json` und anschließendes `build:seo`.

## 5. Integration und DoD

- [ ] 5.1 `node scripts/fetch-mixcloud.mjs --force` ausführen und 65 eindeutige Posts, Duplicate-Entfernung und korrekte `hasTracklist`-Flags prüfen.
- [ ] 5.2 `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo && pnpm test:run` ausführen; verifiziert durch fehlerfreien Durchlauf.
- [ ] 5.3 `node scripts/smoke-dist.mjs` ausführen und `/links`, RSS und `urllist.txt` stichprobenartig prüfen; verifiziert durch fehlerfreien Smoke-Test.

## Workflow follow-up

- Nach Review: `openspec archive playlist-mix-blog-posts -y`.
