# Spec Delta

## MODIFIED Requirements

### Requirement: TracklistTable renders responsive table on desktop, inline list on mobile
The system SHALL render a semantic HTML table on desktop (>=1024px) with columns for Artist, Title, and optionally Label (when any track has a label). On mobile (<1024px), it SHALL render an inline flex-based list with the same data. The `responsive` and `inline` displayMode values SHALL produce identical mobile output (single code path).

#### Scenario: Desktop renders table with label column
- **WHEN** displayMode is "responsive" or "table" and viewport >=1024px and at least one track has a label
- **THEN** renders table with Artist, Title, Label columns; label cells link to label URL when available

#### Scenario: Desktop renders table without label column
- **WHEN** displayMode is "responsive" or "table" and viewport >=1024px and no tracks have labels
- **THEN** renders table with only Artist and Title columns

#### Scenario: Mobile renders inline list
- **WHEN** displayMode is "responsive" or "inline" and viewport <1024px
- **THEN** renders inline flex list with artist – title (label) format; single code path for both modes

#### Scenario: Label links open in new tab with nofollow
- **WHEN** a track has a label with URL
- **THEN** label renders as `<a target="_blank" rel="noopener noreferrer nofollow">`

### Requirement: Dead CSS classes removed
The system SHALL NOT include `.tracklist-table-desktop` or `.tracklist-mobile-inline` CSS classes in the component output.

#### Scenario: No dead classes in output
- **WHEN** component renders
- **THEN** generated HTML contains no references to `.tracklist-table-desktop` or `.tracklist-mobile-inline`