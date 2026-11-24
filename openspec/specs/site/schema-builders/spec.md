# site/schema-builders Specification

## Purpose
Provides reusable JSON-LD schema builders for BlogPosting, AudioObject, MusicPlaylist, BreadcrumbList, ItemList, Blog and CollectionPage schemas (including MusicRecording with label references), eliminating duplicated schema construction across mix pages.

## Requirements

### Requirement: buildBlogPostingSchema creates BlogPosting JSON-LD
The system SHALL export `buildBlogPostingSchema(post, options)` that returns a BlogPosting schema object with headline, description, image, datePublished, author (DJ Hulk), publisher (DJ Hulk), and mainEntityOfPage.

#### Scenario: Build schema for mix detail page
- **WHEN** called with a BlogPostData object and base URL
- **THEN** returns valid BlogPosting schema with all required fields populated

### Requirement: buildAudioObjectSchema creates AudioObject JSON-LD
The system SHALL export `buildAudioObjectSchema(post, structuredTracks, options)` that returns an AudioObject schema with name, description, contentUrl, embedUrl, duration (ISO 8601), genre, datePublished, producer, image, encodingFormat, and associatedMedia (MusicAlbum with tracks as MusicRecording items with label references).

#### Scenario: Build schema with structured tracks
- **WHEN** called with a post and structured tracks containing label references
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
The system SHALL export `buildLabelEntities(structuredTracks, options)` that returns an ItemList of Organization entities with @id, name, url, and description for unique labels in a tracklist.

#### Scenario: Build label entities for mix
- **WHEN** called with structured tracks containing label references
- **THEN** returns ItemList with unique label entities, each with stable @id based on slugified label name

### Requirement: buildTracklistItemList creates track ItemList JSON-LD
The system SHALL export `buildTracklistItemList(post, structuredTracks, options)` that returns an ItemList of MusicRecording entries with position, artist, title, album and label @id references.

#### Scenario: Build tracklist for mix detail
- **WHEN** called with a post and its structured tracks
- **THEN** returns an ItemList whose numberOfItems equals the track count and whose entries reference label entities via recordedBy @id

### Requirement: buildBlogSchema creates Blog JSON-LD
The system SHALL export `buildBlogSchema(posts, options)` that returns a Blog schema with the archive URL, image, DJ Hulk as author and BlogPosting entries for at most the 10 newest given posts.

#### Scenario: Build archive blog schema
- **WHEN** called with the archive posts
- **THEN** returns a Blog schema whose blogPosts array contains at most 10 BlogPosting schemas

### Requirement: buildCollectionPageSchema creates CollectionPage JSON-LD
The system SHALL export `buildCollectionPageSchema(posts, options)` that returns a CollectionPage schema with the archive URL, image, the Blog schema and a MusicAlbum mainEntity whose numTracks matches the full post count.

#### Scenario: Build archive page schema
- **WHEN** called with the archive posts
- **THEN** returns a CollectionPage with no hardcoded domain and a mainEntity containing Blog plus MusicAlbum

### Requirement: buildLabelCollectionSchema creates label overview JSON-LD

The system SHALL export `buildLabelCollectionSchema(entries, segments, options)` that returns an object array containing a `CollectionPage`, a `BreadcrumbList` and an `ItemList` for `/dj/labels`. The builders MUST resolve all URLs from the configured base URL. The ItemList SHALL contain only labels with an indexable detail page.

#### Scenario: Build schema for label overview
- **WHEN** called with label entries and breadcrumb segments
- **THEN** the returned array contains a CollectionPage for `/dj/labels`, a BreadcrumbList with matching positions and an ItemList whose numberOfItems equals the indexable entry count

#### Scenario: Indexability in ItemList
- **WHEN** the entries include both indexable and thin labels
- **THEN** thin labels are excluded from the ItemList and only indexable labels receive an internal URL

#### Scenario: Schema.org-compliant ListItems
- **WHEN** the ItemList is generated for Google carousel validation
- **THEN** every ListItem contains only `@type`, `position` and `url`, with no `name`, `item` or `@id`

#### Scenario: No hardcoded domain
- **WHEN** a custom base URL is passed through options
- **THEN** every generated URL uses that base URL instead of a hardcoded production domain
