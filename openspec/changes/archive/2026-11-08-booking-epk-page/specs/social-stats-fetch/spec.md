# Spec Delta

## Purpose

Fetches follower counts from Instagram, Facebook, and Mixcloud at build time with resilient parsing and fallback to cached values, outputting a JSON file consumed by the SocialStats component for count-up animation tiles.

## ADDED Requirements

### Requirement: Build-time social stats fetch with multiple sources
The system SHALL provide a CLI script that fetches follower counts from three platforms:
- Instagram: public profile HTML (`/djhulk_de/?hl=de`) with iPhone User-Agent, parsing `edge_followed_by.count` JSON or fallback regex for "X Follower"
- Facebook: page plugin iframe (`/plugins/page.php?href=...`) parsing regex for "X Follower" / "X Gefällt mir"
- Mixcloud: public API (`/api.mixcloud.com/holger-kampffmeyer/`) parsing `follower_count` JSON

#### Scenario: All three sources return valid counts
- **WHEN** script runs with network access
- **THEN** it outputs JSON with `updatedAt` (ISO date) and `platforms` object containing `instagram`, `facebook`, `mixcloud` each with `count` (integer), `url` (profile URL), and `handle`

#### Scenario: Partial failure falls back to cache
- **WHEN** one or more sources fail or return invalid counts
- **THEN** script keeps previous cached counts for failed platforms, logs warning, exits 0 (non-strict mode)

#### Scenario: Strict mode fails on any error
- **WHEN** `--strict` flag is used and any platform fails
- **THEN** script exits with code 1

### Requirement: Count parsing handles locale formats
The system SHALL parse follower counts in German (1.234), English (1,234), and abbreviated (1.2K, 1.5M) formats, normalizing to integer.

#### Scenario: German dot-thousands parsed correctly
- **WHEN** source returns "1.310 Follower"
- **THEN** parsed count is 1310

#### Scenario: English comma-thousands parsed correctly
- **WHEN** source returns "1,218 Follower"
- **THEN** parsed count is 1218

#### Scenario: Abbreviated counts parsed correctly
- **WHEN** source returns "1.2K" or "1.5M"
- **THEN** parsed counts are 1200 and 1500000

### Requirement: Output JSON schema and caching
The system SHALL write `src/data/social-stats.json` with schema:
```json
{
  "updatedAt": "2026-11-01",
  "platforms": {
    "instagram": {"count": 1218, "url": "https://www.instagram.com/djhulk_de/", "handle": "@djhulk_de"},
    "facebook": {"count": 1310, "url": "https://www.facebook.com/holger.kampffmeyer/", "handle": "holger.kampffmeyer"},
    "mixcloud": {"count": 11732, "url": "https://www.mixcloud.com/holger-kampffmeyer/", "handle": "holger-kampffmeyer"}
  }
}
```
File is only rewritten when counts change; `updatedAt` updates only on change.

#### Scenario: JSON file updated only on count change
- **WHEN** script runs and counts match cache
- **THEN** file is not rewritten, "No changes" logged

#### Scenario: JSON file updated with new date on change
- **WHEN** script runs and any count differs from cache
- **THEN** file rewritten with new `updatedAt` (today ISO date)

### Requirement: Integration with build pipeline
The system SHALL expose `pnpm run stats:fetch` script and be included in `pnpm run build:full` after `fetch-mixcloud` and before `optimize-images`.

#### Scenario: stats:fetch runs standalone
- **WHEN** `pnpm run stats:fetch` executed
- **THEN** script fetches and updates social-stats.json

#### Scenario: build:full includes social stats fetch
- **WHEN** `pnpm run build:full` executed
- **THEN** `fetch-social-stats.mjs` runs after `fetch-mixcloud.mjs` and before `optimize-images.mjs`

### Requirement: SocialStats component consumes data
The system SHALL provide a `SocialStats.astro` component that reads `social-stats.json` at build time, renders three tiles (Instagram, Facebook, Mixcloud) with icons, count-up animation (0 to target in 1.6s ease-out, respects `prefers-reduced-motion`), formatted numbers per locale, platform label, handle, profile link, and "Updated" timestamp.

#### Scenario: Tiles display correct counts and animate
- **WHEN** component renders on page
- **THEN** three tiles show with correct platform icons, counts from JSON, locale-formatted numbers, and count-up animation triggers on scroll

#### Scenario: Reduced motion skips animation
- **WHEN** user has `prefers-reduced-motion: reduce`
- **THEN** counts display final value immediately without animation

#### Scenario: Updated timestamp localized
- **WHEN** component renders
- **THEN** "Stand" / "Updated" label shows date in German (DD. MMMM YYYY) or English (MMMM DD, YYYY) format

### Requirement: Unit tests for fetch logic and data
The system SHALL include unit tests covering `parseCount` function (locale formats, abbreviations, edge cases) and `booking.ts` content validation (bilingual keys, paths, rider groups, press photos with credit, contact data, mailto generation).

#### Scenario: parseCount tests pass
- **WHEN** `pnpm test:run tests/share.test.mjs` runs
- **THEN** all parseCount and buildShareLinks tests pass

#### Scenario: booking data tests pass
- **WHEN** `pnpm test:run tests/booking-data.test.mjs` runs
- **THEN** all booking content validation tests pass