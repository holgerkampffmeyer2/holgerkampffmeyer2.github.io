## ADDED Requirements

### Requirement: Central formatDate function
The system SHALL provide a `formatDate(dateStr: string): string` function in `src/utils/format.ts` that formats date strings to `de-DE` locale (TT.MM.JJJJ).

#### Scenario: Format valid date string
- **WHEN** `formatDate("2026-07-25")` is called
- **THEN** it returns `"25.07.2026"`

#### Scenario: Handle empty date string
- **WHEN** `formatDate("")` is called
- **THEN** it returns an empty string `""`

### Requirement: Central formatDuration function
The system SHALL provide a `formatDuration(seconds: number): string` function in `src/utils/format.ts` that formats duration to ISO 8601 format.

#### Scenario: Format duration to ISO 8601
- **WHEN** `formatDuration(330)` is called (5 minutes 30 seconds)
- **THEN** it returns `"PT5M30S"`

### Requirement: Consistent locale
The system SHALL use `de-DE` locale for all date formatting. Pages currently using `en-GB` SHALL be updated.

#### Scenario: All formatDate calls use de-DE
- **WHEN** searching for `toLocaleDateString` across the codebase
- **THEN** all instances use `'de-DE'` locale
