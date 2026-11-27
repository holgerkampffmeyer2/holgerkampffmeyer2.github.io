# Proposal

## Why

Die Playlist „Hulk's B2b s and guestmixes“ enthält 65 eindeutige Mixes, von denen bisher nur 6 als vollständige Blog-Posts existieren. Der aktuelle Fetcher liest nur User-Cloudcasts und kann die Playlist nicht als Quelle nutzen, obwohl für viele Mixe lokale Rekordbox-CUEs, Tracklists und Cover vorhanden sind.

## What Changes

- Mixcloud-Fetcher unterstützt eine Playlist als Quelle inkl. Pagination und Key-Dedupe.
- Neue kuratierte Zuordnung von Mixcloud-Key → lokalem Rekordbox-Ordner, Tracklist und Cover; Fuzzy/Datum-Matching bleibt nur Fallback.
- Tracklists werden aus vorhandenen `.txt`-Dateien oder Rekordbox-CUEs abgeleitet und mit einem passenden Hero-Bild nach `tracklists/` übernommen.
- `blog-posts.json` erhält alle Playlist-Mixes; `mixcloud-data.json` bleibt auf eigene Uploads begrenzt, damit `/links` nicht auf einen Gastmix umspringt.
- Label-Recherche läuft halbautomatisch über CUE-Tags und MusicBrainz, gefolgt von manueller Sichtung und URL-Recherche.
- Tests sichern Playlist-Pagination, Dedupe, kuratierte Zuordnung und Featured-Auswahl ab.

## Capabilities

### New Capabilities

- `mixcloud-playlist-ingestion`: Einlesen einer Mixcloud-Playlist als Blog-Quelle, kuratierte Verknüpfung mit lokalen Mix-Ordnern und Trennung von Featured-Mix und Blog-Posts.

### Modified Capabilities

- `core-features`: Der DJ-&-Music-Blog muss Playlist-Mixes als Posts aufnehmen dürfen, ohne die Featured-Auswahl auf `/links` zu verändern.

## Impact

- `scripts/fetch-mixcloud.mjs`, `src/data/blog-posts.json`, `src/data/mixcloud-data.json`, `src/types/blog.ts`
- Neue Dateien: `src/data/playlist-mix-map.json`, `tracklists/*`, `public/tracklists/*`, Tests
- Label-Artefakte: `label-research.json`, `label-urls.json`, `src/data/labels.json`
- Seiten: `src/pages/links.astro`, `src/pages/djhulk-electronic-music.astro` (indirekt über `mixcloud-data.json`)
- Keine neuen externen Abhängigkeiten.
