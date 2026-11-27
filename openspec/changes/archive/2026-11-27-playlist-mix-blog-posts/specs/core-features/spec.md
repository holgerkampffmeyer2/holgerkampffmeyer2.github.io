# Spec Delta

## MODIFIED Requirements

### Requirement: DJ & Music Blog System

The system SHALL integrate Mixcloud data, dynamic mix detail pages with AudioObject schema,
weekly mixes blog and archive, and the DJ Hulk electronic music landing page.
Mix detail pages use `formatDuration` (display, `m:ss`) and `toIsoDuration` (Schema, `PTnMnS`).
Playlist-importierte Mixes SHALL als Blog-Posts verfügbar sein, dürfen aber die Featured-Auswahl
für eigene Uploads nicht verdrängen.

#### Scenario: User opens a mix detail page

- **WHEN** user navigates to `/dj/mixes/[number]`
- **THEN** the mix player, tracklist, and structured JSON-LD data are rendered

#### Scenario: Playlist guest mix is imported

- **WHEN** the playlist contains a guest mix with a local tracklist and hero image
- **THEN** the mix is rendered like other mix posts under `/dj/mixes/`

#### Scenario: Featured player after playlist import

- **WHEN** a playlist guest mix is newer than the latest own upload
- **THEN** the featured player still shows the latest own upload
