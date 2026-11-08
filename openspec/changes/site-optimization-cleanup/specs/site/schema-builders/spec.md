# Spec Delta

## Purpose

Provides reusable JSON-LD schema builders for BlogPosting, AudioObject, MusicPlaylist, BreadcrumbList, and MusicRecording with label references, eliminating duplicated schema construction across mix pages.

## ADDED Requirements

### Requirement: buildBlogPostingSchema creates BlogPosting JSON-LD
The system SHALL export `buildBlogPostingSchema(post, options)` that returns a BlogPosting schema object with headline, description, image, datePublished, author (DJ Hulk), publisher (DJ Hulk), and mainEntityOfPage.

#### Scenario: Build schema for mix detail page
- **WHEN** called with a BlogPostData object and base URL
- **THEN** returns valid BlogPosting schema with all required fields populated

### Requirement: buildAudioObjectSchema creates AudioObject JSON-LD
The system SHALL export `buildAudioObjectSchema(post, trackLabels, options)` that returns an AudioObject schema with name, description, contentUrl, embedUrl, duration (ISO 8601), genre, datePublished, producer, image, encodingFormat, and associatedMedia (MusicAlbum with tracks as MusicRecording items with label references).

#### Scenario: Build schema with track labels
- **WHEN** called with a post that has tracklist and label mappings
- **THEN** returns AudioObject with associatedMedia.track array where each track has recordedBy @id referencing label entities

### Requirement: buildMusicPlaylistSchema creates MusicPlaylist JSON-LD
The system SHALL export `buildMusicPlaylistSchema(posts, options)` that returns a MusicPlaylist schema with name, description, url, image, genre array, and numTracks.

#### Scenario: Build schema for mixes overview page
- **WHEN** called with array of posts with tracklists
- **THEN** returns valid MusicPlaylist schema

### Requirement: buildBreadcrumbSchema creates BreadcrumbList JSON-LD
The system SHALL export `buildBreadcrumbSchema(segments)` that returns a BreadcrumbList schema from an array of {label, href} objects.

#### Scenario: Build breadcrumb for mix detail
- **WHEN** called with segments for Home → DJ Hulk → Weekly Mixes → Mix Title
- **THEN** returns BreadcrumbList with correct position numbering and item URLs

### Requirement: buildLabelEntities creates label ItemList JSON-LD
The system SHALL export `buildLabelEntities(tracks, trackLabels)` that returns an ItemList of Organization entities with @id, name, url, and description for unique labels in a tracklist.

#### Scenario: Build label entities for mix
- **WHEN** called with structured tracks containing label references
- **THEN** returns ItemList with unique label entities, each with stable @id based on slugified label name