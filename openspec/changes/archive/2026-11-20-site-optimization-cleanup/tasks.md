# Tasks

## 1. Utilities & Config (Phase 1)

- [x] 1.1 Create `src/utils/share-config.ts` with `ShareConfigPreset` type and presets for `booking.de`, `booking.en`, `mixDetail.de`, `mixDetail.en`, `generic.de`, `generic.en` – exports match current label values in `bookingContent`
- [x] 1.2 Create `src/utils/schema-builders.ts` with `buildBlogPostingSchema`, `buildAudioObjectSchema`, `buildMusicPlaylistSchema`, `buildBreadcrumbSchema`, `buildLabelEntities` – each returns a valid schema object for sample data
- [x] 1.3 Add unit tests in `src/utils/__tests__/share-config.test.ts` for preset structure and locale keys
- [x] 1.4 Add unit tests in `src/utils/__tests__/schema-builders.test.ts` for each builder with sample post data
- [x] 1.5 Add unit tests in `src/utils/__tests__/track-labels.test.ts` for `normalizeTrack`, `buildTrackLabels`, `validateLabelRegistry`
- [x] 1.6 Add unit tests in `src/utils/__tests__/mix-display.test.ts` for `getMixDisplay` with various slug/title patterns
- [x] 1.7 Add unit tests in `src/utils/__tests__/format.test.ts` for `formatDate`, `formatDuration`, `toIsoDuration`
- [x] 1.8 Add unit tests in `src/utils/__tests__/share.test.ts` for `buildShareLinks`, `buildMailto`, `buildWhatsAppMessage`
- [x] 1.9 Run `pnpm test:run` – all unit tests pass

## 2. ShareButtons & Consumer Updates (Phase 1 cont.)

- [x] 2.1 Modify `src/components/ShareButtons.astro` to accept optional `config: ShareConfigPreset` prop; fall back to individual props when absent – TypeScript compiles
- [x] 2.2 Update `src/components/dj/MixDetail.astro` to use `shareConfig.mixDetail.de` as `config` prop – share buttons render with correct labels
- [x] 2.3 Update `src/components/booking/BookingShare.astro` to use `shareConfig.booking.de`/`en` as `config` – share section renders with localized labels
- [x] 2.4 Run `pnpm run build` – no TypeScript errors, build succeeds

## 3. TracklistTable Deduplication & Cleanup (Phase 2)

- [x] 3.1 Extract mobile track render logic to `src/utils/tracklist-renderer.ts` (`renderMobileTracklist`) – single source of truth for mobile markup
- [x] 3.2 `TracklistTable` calls `renderMobileTracklist` for both `responsive` and `inline` display modes – identical output
- [x] 3.3 Remove dead CSS classes `.tracklist-table-desktop` and `.tracklist-mobile-inline` from the component
- [x] 3.4 Build and smoke-check generated pages – tracklists render on weekly, archive and detail pages

## 4. HeroSlider Script Extraction (Phase 2)

- [x] 4.1 Create `public/assets/hero-slider.js` with slider logic from `HeroSlider.astro` (auto-advance, prev/next, dots, intersection observer)
- [x] 4.2 Replace the inline script with `<script src="/assets/hero-slider.js" defer is:inline>`
- [x] 4.3 Build and verify the external script reference in the generated homepage HTML

## 5. Booking Data Split (Phase 2)

- [x] 5.1 Create `src/data/booking.types.ts` with all interfaces from `booking.ts`
- [x] 5.2 Create `src/data/booking.de.ts` exporting German content
- [x] 5.3 Create `src/data/booking.en.ts` exporting English content
- [x] 5.4 Keep `src/data/booking.ts` as backward-compatible barrel for types, merged `bookingContent` and `bookingMailto`
- [x] 5.5 Run `pnpm run check` – no errors
- [x] 5.6 Run `pnpm run build` – `/booking` and `/en/booking` render

## 6. BookingBody Decomposition (Phase 3)

- [x] 6.1–6.11 Create the 11 section components in `src/components/booking/` (Facts, Bio, Genres, References, Formats, Rider, Press, Process, FAQ, Contact, Share)
- [x] 6.12 Update `src/components/booking/BookingPage.astro` to compose all sections in order with `bookingContent[lang]`
- [x] 6.13 Delete `src/components/booking/BookingBody.astro`
- [x] 6.14 Keep `src/pages/booking.astro` and `src/pages/en/booking.astro` as `BookingPage` consumers
- [x] 6.15 Run `pnpm run build` – succeeds
- [x] 6.16 Verify the generated HTML contains all 11 section ids on `/booking` and `/en/booking`

## 7. Mix Pages Schema Cleanup (Phase 4)

- [x] 7.1 Update `src/pages/dj/mixes-weekly.astro` to use the schema builders
- [x] 7.2 Update `src/pages/dj/mixes/[number].astro` to use the schema builders
- [x] 7.3 Update `src/pages/dj/mixes-blog-archive.astro` to use `buildBlogSchema`, `buildCollectionPageSchema` and `buildBreadcrumbSchema`
- [x] 7.4 Remove inline schema construction from all 3 mix pages
- [x] 7.5 Run `pnpm run build && pnpm run build:seo` – sitemap, RSS, JSON-LD output valid

## 8. Obsolete Import Cleanup (Phase 4)

- [x] 8.1 Remove unused `TracklistTable` import from `src/pages/dj/mixes/[number].astro`
- [x] 8.2 Remove unused `formatDate` import from `src/pages/dj/mixes/[number].astro`
- [x] 8.3 Verify no unused `Hero`/`formatDate` imports remain in the 3 mix-page frontmatter blocks

## 9. Final Verification

- [x] 9.1 Run `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo && pnpm test:run` – full pipeline passes
- [x] 9.2 Run `node scripts/smoke-dist.mjs` and check generated HTML for the key pages
- [x] 9.3 Parse all generated JSON-LD blocks locally – no malformed schema

## Workflow follow-up

- [x] `openspec validate site-optimization-cleanup --strict` passes without errors or info notices
- [x] Archive the change: `openspec archive site-optimization-cleanup -y`
- [x] Verify the archived specs appear in `openspec/specs/`
