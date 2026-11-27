# Spec Delta

## Purpose

Die Playlist-Quelle erweitert den Mix-Blog um B2B- und Guestmixes, indem sie Mixcloud-Playlisteinträge mit lokalen Mix-Archivdateien verknüpft und die Featured-Auswahl stabil hält.

## ADDED Requirements

### Requirement: Playlist cloudcasts are ingested

Das System SHALL alle Cloudcasts der konfigurierten Mixcloud-Playlist als Blog-Quelle lesen, auch wenn mehrere API-Seiten nötig sind. Einträge mit identischem Mixcloud-Key MUST nur einmal verarbeitet werden.

#### Scenario: Playlist spans multiple pages

- **WHEN** die Playlist-API eine `paging.next`-URL zurückgibt
- **THEN** werden auch die Cloudcasts der Folge_pages gelesen und in die Mixliste aufgenommen

#### Scenario: Duplicate cloudcast key

- **WHEN** ein Cloudcast in der Playlist mehrfach vorkommt
- **THEN** wird er im resultierenden Datensatz nur einmal berücksichtigt

### Requirement: Curated local asset mapping wins

Das System SHALL eine fest committete Zuordnung von Mixcloud-Key zu lokaler Tracklist und Hero-Datei verwenden, bevor allgemeine Nummer-, Ähnlichkeits- oder Datum-Heuristiken angewendet werden.

#### Scenario: Mapped mix with local tracklist

- **WHEN** ein Playlist-Eintrag in der Zuordnung eine vorhandene Tracklist und ein vorhandenes Hero-Bild hat
- **THEN** erhält der resultierende Post genau diese Tracklist und dieses Hero-Bild

#### Scenario: Conflicting fuzzy candidate

- **WHEN** ein anderer lokaler Dateiname ähnlicher zum Mixcloud-Titel ist als der zugeordnete
- **THEN** wird dennoch die kuratierte Zuordnung verwendet

#### Scenario: Unmapped mix

- **WHEN** für einen Playlist-Eintrag keine Zuordnung mit Tracklist existiert
- **THEN** wird der Post ohne Tracklist und ohne Detailseite angelegt

### Requirement: Featured mix selection stays on own uploads

Das System SHALL Playlist-Mixes in `blog-posts.json` aufnehmen, aber `mixcloud-data.json` SHALL weiterhin nur eigene Uploads des Kontos `holger-kampffmeyer` enthalten.

#### Scenario: Newer third-party playlist mix

- **WHEN** ein Playlist-Mix von einem fremden Mixcloud-Konto neuer ist als der letzte eigene Mix
- **THEN** bleibt der letzte eigene Mix der featured Eintrag auf `/links`

#### Scenario: Playlist mix on own account

- **WHEN** ein Playlist-Mix unter `/holger-kampffmeyer/` liegt
- **THEN** darf er in `mixcloud-data.json` aufgenommen werden

### Requirement: Importable assets are repository-local

Das System SHALL importierte Tracklists und Hero-Bilder im Repository ablegen, damit ein Build ohne Zugriff auf den lokalen Rekordbox-Ordner funktioniert.

#### Scenario: Build on CI

- **WHEN** der Build ohne den lokalen Rekordbox-Pfad ausgeführt wird
- **THEN** werden alle zugeordneten Tracklists und Hero-Bilder aus dem Repository gelesen
