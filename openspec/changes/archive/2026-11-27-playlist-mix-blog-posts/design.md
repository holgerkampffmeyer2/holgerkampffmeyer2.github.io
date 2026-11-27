# Design

## Context

`fetch-mixcloud.mjs` liest aktuell nur die User-Cloudcasts von `holger-kampffmeyer` und `365fmradio` (gefiltert). Die Playlist „Hulk's B2b s and guestmixes“ enthält 67 Einträge, 65 eindeutig; 48 davon haben keinen Post, 11 nur einen Post ohne Tracklist. Die lokalen Rekordbox-Aufnahmen liegen unter `/mnt/c/Users/holge/Music/rekordbox/Recording/DJ Hulk`, oft mit `.cue`, `.txt` und Cover, aber mit abweichenden Aufnahmedaten. `/links` liest `mixes[0]` aus `mixcloud-data.json`.

## Goals / Non-Goals

**Goals:**

- Alle eindeutigen Playlist-Einträge als Posts verfügbar machen.
- Tracklist/Hero deterministisch aus einer committeten Zuordnung beziehen.
- Den featured Mini-Player auf dem letzten eigenen Upload halten.
- Label-Vorschläge reviewbar erzeugen und erst nach Sichtung übernehmen.

**Non-Goals:**

- Kein UI-Redesign und keine neue Astro-Route.
- Kein dauerhafter Zugriff auf den Rekordbox-Pfad zur Buildzeit.
- Keine automatische Übernahme ungeprüfter Label-Vorschläge.
- Keine Änderung am Mixcloud-Tracklisten-Upload selbst.

## Decisions

1. **Playlist als Source-Descriptor:** `MIXCLOUD_SOURCES` erhält zusätzlich einen Playlist-Eintrag. `fetchSource()` verwendet `/playlists/<slug>/cloudcasts/` und folgt `paging.next`. Die vorhandenen Cloudcast-Felder werden unverändert weiterverarbeitet.
   *Alternative:* eigener separater Fetch-Skript-Pfad — verworfen, weil Dedupe, Detail-Fetch und Post-Aufbau identisch sind.

2. **Kuratierte Zuordnung als Primärquelle:** `src/data/playlist-mix-map.json` verknüpft Mixcloud-Key → Ordner, Tracklist, Hero, Status und optionaler Notiz. Die Zuordnung wird vor Nummer/Fuzzy/Datum ausgewertet; Heuristiken bleiben nur Fallback für nicht zugeordnete Mixe.
   *Alternative:* rein heuristisches Matching — verworfen, weil z. B. `Techno Empathy`, `Tony C B2B` und `365 FM Exclusive` mehrdeutig sind und lokal abweichende Daten haben.

3. **Tracklists/Cover einmalig importieren:** Vorhandene `.txt` werden normalisiert; fehlende Tracklisten werden aus `.cue` erzeugt (Jingles ausgeschlossen). Ergebnisdateien und Hero-WebPs werden nach `tracklists/` committet. Der Build benötigt keinen Rekordbox-Zugriff.
   *Alternative:* CUE zur Buildzeit lesen — verworfen wegen CI-Pfadabhängigkeit und fehlender Reproduzierbarkeit.

4. **Featured-Daten trennen:** `blog-posts.json` bekommt alle Playlist-Mixes. `mixcloud-data.json` wird weiterhin nur aus eigenen Uploads (`key.startsWith('/holger-kampffmeyer/')`) geschrieben. Damit bleiben `/links` und die DJ-Landingpage indirekt stabil ohne Komponentenänderung.
   *Alternative:* Flag in `mixcloud-data.json` und Filtern in Astro — verworfen, weil mehr Dateien berührt würden und die Datenbedeutung unscharf würde.

5. **Labels bleiben Review-Pipeline:** Recherche pro zugeordnetem CUE-Ordner mit Offline-Priorität, danach MusicBrainz-Fallback. Apply und URL-Apply laufen nur nach Sichtung der Artefakte.
   *Alternative:* direkte Registry-Schreibung — verworfen wegen Fehleranfälligkeit bei Promo-Tags und Namensvettern.

## Risks / Trade-offs

- **Falsche CUE-Zuordnung** → kuratierte Map mit `status`/`note`, Review vor Apply, Heuristiken nur Fallback.
- **Fehlende Tracklist oder fehlendes Cover** → `status: "metadata-only"`; Post ohne `hasTracklist`, keine Detailseite; offene Liste im Report.
- ** Änderung an Mixcloud-Slugs** → Key-basierte Zuordnung und Dedupe; alte OG-Dateien können zurückbleiben und werden separat geprüft.
- **API- oder Paginierungsänderung** → Tests mit gemocktem `fetch`; Fehler führen zu klarem Abbruch statt still leerer Daten.
- **Label-Fehler durch Promo-/Publisher-Tags** → manuelle Sichtung, `unreleased` für Edits/Bootlegs, URL-Priorität laut Doku.
- **Label-Indexierungsschwellen** → nach Apply `build:seo` neu generieren und Sitemap/urllist prüfen.

## Migration Plan

1. OpenSpec-Artefakte und Zuordnungsdatei committen.
2. Importierte Tracklists/Hero-Bilder und Tests ergänzen.
3. `node scripts/fetch-mixcloud.mjs --force` ausführen; Zahlen und `/links` prüfen.
4. Label-Recherche, Review und Apply in Batch-Gruppen.
5. `lint`, `check`, `build`, `build:seo`, `test:run`, `smoke-dist` ausführen.
6. Rollback: geänderte JSON/Assets aus Git wiederherstellen; generierte OG-/SEO-Artefakte neu bauen.
