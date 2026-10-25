# format-utils Specification

## Purpose

Zentrale Formatierungs-Helfer in `src/utils/format.ts` (de-DE-Datumsformat,
ISO-8601-Dauer für Schema, menschenlesbare Dauer für Display), um konsistente
Ausgabeformate über alle Seiten zu gewährleisten.

## Requirements

### Requirement: Central formatDate function
The system SHALL provide a `formatDate(dateStr: string): string` function in `src/utils/format.ts` that formats date strings to `de-DE` locale (TT.MM.JJJJ).

#### Scenario: Format valid date string
- **WHEN** `formatDate("2026-07-25")` is called
- **THEN** it returns `"25.07.2026"`

#### Scenario: Handle empty date string
- **WHEN** `formatDate("")` is called
- **THEN** it returns an empty string `""`

### Requirement: Central formatDuration function (display)
The system SHALL provide a `formatDuration(seconds: number): string` function in `src/utils/format.ts` that formats duration for human display as `m:ss`.

#### Scenario: Format duration for display
- **WHEN** `formatDuration(330)` is called (5 minutes 30 seconds)
- **THEN** it returns `"5:30"`
- **WHEN** `formatDuration(60)` is called
- **THEN** it returns `"1:00"`
- **WHEN** `formatDuration(65)` is called
- **THEN** it returns `"1:05"`

### Requirement: Central toIsoDuration function (Schema)
The system SHALL provide a `toIsoDuration(seconds: number): string` function in `src/utils/format.ts` that formats duration for Schema.org as ISO 8601 `PTnMnS`.

#### Scenario: Format duration to ISO 8601
- **WHEN** `toIsoDuration(330)` is called (5 minutes 30 seconds)
- **THEN** it returns `"PT5M30S"`
- **WHEN** `toIsoDuration(60)` is called
- **THEN** it returns `"PT1M0S"`

### Requirement: Consistent locale
The system SHALL use `de-DE` locale for all date formatting. Pages currently using `en-GB` SHALL be updated.

#### Scenario: All formatDate calls use de-DE
- **WHEN** searching for `toLocaleDateString` across the codebase
- **THEN** all instances use `'de-DE'` locale