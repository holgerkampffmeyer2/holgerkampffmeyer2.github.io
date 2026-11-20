# Proposal

## Why

The holger-kampffmeyer.de Astro site has accumulated technical debt over time: duplicated share button configurations, monolithic components (BookingBody at 500+ lines), redundant mobile render logic in TracklistTable, obsolete imports, dead CSS classes, and inline scripts that should be shared assets. These issues increase bundle size, reduce maintainability, and make testing harder. A systematic cleanup will improve build performance, developer experience, and prepare the codebase for future features.

## What Changes

- **Remove unused imports** across 5+ pages (TracklistTable, Hero, formatDate, etc.)
- **Delete dead CSS** classes (`.tracklist-table-desktop`, `.tracklist-mobile-inline`) from TracklistTable
- **Extract HeroSlider inline script** (50 lines) to `/assets/hero-slider.js` loaded via `is:inline`
- **Deduplicate TracklistTable mobile views** – merge `responsive` and `inline` branches (~95% identical)
- **Centralize ShareButtons config** – create `src/utils/share-config.ts` with locale-aware presets, replace hardcoded props in MixDetail and BookingBody
- **Split BookingBody** (500+ lines) into section components: `BookingFacts`, `BookingBio`, `BookingGenres`, `BookingReferences`, `BookingFormats`, `BookingRider`, `BookingPress`, `BookingProcess`, `BookingFAQ`, `BookingContact`, `BookingShare`
- **Split booking.ts** (600+ lines) into `booking.de.ts` / `booking.en.ts` + shared types in `booking.types.ts`
- **Centralize JSON-LD builders** – create `src/utils/schema-builders.ts` for BlogPosting, AudioObject, MusicPlaylist schemas used across 3 mix pages
- **Add unit tests** for utilities: `track-labels.js`, `mix-display.js`, `format.ts`, `share.ts`
- **Consider SVG sprite** for Icon component (50+ inline SVGs) – defer to follow-up if bundle analysis warrants

## Capabilities

### New Capabilities

- `site/share-config`: Locale-aware share button configuration with presets for booking, mix-detail, and generic pages
- `site/schema-builders`: Reusable JSON-LD builders for BlogPosting, AudioObject, MusicPlaylist, BreadcrumbList
- `site/booking-sections`: Composable booking page sections replacing monolithic BookingBody

### Modified Capabilities

- `site/components/tracklist-table`: Mobile render logic deduplicated; dead CSS removed
- `site/components/hero-slider`: Inline script extracted to shared asset
- `site/data/booking`: Split into locale files with shared types; no behavioral change

## Impact

**Affected files:**
- `src/components/dj/TracklistTable.astro` – deduplicate mobile views, remove dead CSS
- `src/components/HeroSlider.astro` – extract script to asset
- `src/components/ShareButtons.astro` – accept config object instead of 13 individual props
- `src/components/booking/BookingBody.astro` – **BREAKING**: split into 11 section components
- `src/data/booking.ts` – **BREAKING**: split into `booking.de.ts`, `booking.en.ts`, `booking.types.ts`
- `src/pages/dj/mixes/[number].astro` – remove unused imports
- `src/pages/dj/mixes-weekly.astro` – remove unused Hero import
- `src/pages/booking.astro` / `src/pages/en/booking.astro` – update to use new section components
- `src/utils/mix-display.js` – add unit tests
- `src/utils/track-labels.js` – add unit tests
- `src/utils/format.ts` – add unit tests
- `src/utils/share.ts` – add unit tests
- New: `src/utils/share-config.ts`, `src/utils/schema-builders.ts`, `src/components/booking/*.astro` (11 files)

**No API changes** – all changes are internal implementation details. Public URLs, JSON-LD output, and user-facing features remain identical.