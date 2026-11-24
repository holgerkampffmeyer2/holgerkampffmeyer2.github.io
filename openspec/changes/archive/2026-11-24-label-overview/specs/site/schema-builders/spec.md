# Spec Delta

## ADDED Requirements

### Requirement: buildLabelCollectionSchema creates label overview JSON-LD

The system SHALL export `buildLabelCollectionSchema(entries, segments, options)` that returns an object array containing a `CollectionPage`, a `BreadcrumbList` and an `ItemList` for `/dj/labels`. The builders MUST resolve all URLs from the configured base URL. Internal label URLs MUST appear only for indexable labels.

#### Scenario: Build schema for label overview
- **WHEN** called with label entries and breadcrumb segments
- **THEN** the returned array contains a CollectionPage for `/dj/labels`, a BreadcrumbList with matching positions and an ItemList whose numberOfItems equals the entry count

#### Scenario: Indexability in ItemList
- **WHEN** the entries include both indexable and thin labels
- **THEN** only indexable labels receive an internal `url` or `@id`; thin labels are represented by name and position without an internal target

#### Scenario: No hardcoded domain
- **WHEN** a custom base URL is passed through options
- **THEN** every generated URL uses that base URL instead of a hardcoded production domain
