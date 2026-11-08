# Tasks

## 1. Utilities & Config (Phase 1)

- [ ] 1.1 Create `src/utils/share-config.ts` with `ShareConfigPreset` type and presets for `booking.de`, `booking.en`, `mixDetail.de`, `mixDetail.en`, `generic.de`, `generic.en` – verify exports match current label values in `bookingContent`
- [ ] 1.2 Create `src/utils/schema-builders.ts` with `buildBlogPostingSchema`, `buildAudioObjectSchema`, `buildMusicPlaylistSchema`, `buildBreadcrumbSchema`, `buildLabelEntities` – verify each returns valid schema object for sample data
- [ ] 1.3 Add unit tests in `src/utils/__tests__/share-config.test.ts` for preset structure and locale keys
- [ ] 1.4 Add unit tests in `src/utils/__tests__/schema-builders.test.ts` for each builder with sample post data
- [ ] 1.5 Add unit tests in `src/utils/__tests__/track-labels.test.ts` for `normalizeTrack`, `buildTrackLabels`, `validateLabelRegistry`
- [ ] 1.6 Add unit tests in `src/utils/__tests__/mix-display.test.ts` for `getMixDisplay` with various slug/title patterns
- [ ] 1.7 Add unit tests in `src/utils/__tests__/format.test.ts` for `formatDate`, `formatDuration`, `toIsoDuration`
- [ ] 1.8 Add unit tests in `src/utils/__tests__/share.test.ts` for `buildShareLinks`, `buildMailto`, `buildWhatsAppMessage`
- [ ] 1.9 Run `pnpm test:run` – verify all new tests pass and coverage thresholds met

## 2. ShareButtons & Consumer Updates (Phase 1 cont.)

- [ ] 2.1 Modify `src/components/ShareButtons.astro` to accept optional `config: ShareConfigPreset` prop; if present, use `config.*` for labels; else fall back to individual props – verify TypeScript compiles
- [ ] 2.2 Update `src/components/dj/MixDetail.astro` to import `shareConfig.mixDetail.de` and pass as `config` prop – verify share buttons render with correct labels
- [ ] 2.3 Update `src/components/booking/BookingBody.astro` (temporarily) to import `shareConfig.booking.de`/`en` and pass as `config` – verify share section renders identically
- [ ] 2.4 Run `pnpm run build` – verify no TypeScript errors and build succeeds

## 3. TracklistTable Deduplication & Cleanup (Phase 2)

- [ ] 3.1 Extract mobile track render logic to helper function `renderMobileTrack(track, label, showLabel)` in `TracklistTable.astro` script section
- [ ] 3.2 Refactor `responsive` and `inline` mobile branches to both call `renderMobileTrack` – verify identical output
- [ ] 3.3 Remove dead CSS classes `.tracklist-table-desktop` and `.tracklist-mobile-inline` from `<style>` block
- [ ] 3.4 Run `pnpm run build` and visually verify `/dj/mixes/1` and `/dj/mixes-weekly` tracklists render correctly on mobile and desktop

## 4. HeroSlider Script Extraction (Phase 2)

- [ ] 4.1 Create `public/assets/hero-slider.js` with slider logic from `HeroSlider.astro` inline script (auto-advance, prev/next, dots, intersection observer)
- [ ] 4.2 Modify `src/components/HeroSlider.astro` to replace inline `<script>` with `<script src="/assets/hero-slider.js" defer is:inline>`
- [ ] 4.3 Run `pnpm run build` and verify HeroSlider on `/` (homepage) functions: auto-advance, prev/next buttons, dot navigation

## 5. Booking Data Split (Phase 2)

- [ ] 5.1 Create `src/data/booking.types.ts` with all interfaces from `booking.ts` (BookingLocale, BookingContent, BookingFact, BookingGenreGroup, BookingReference, BookingFormat, RiderGroup, PressPhoto, ProcessStep, UseCaseConfig)
- [ ] 5.2 Create `src/data/booking.de.ts` exporting `bookingContent.de` (German content object)
- [ ] 5.3 Create `src/data/booking.en.ts` exporting `bookingContent.en` (English content object)
- [ ] 5.4 Modify `src/data/booking.ts` to re-export all types from `booking.types.ts`, import and merge `bookingContent` from `.de.ts`/`.en.ts`, re-export `bookingMailto` – verify all existing imports resolve
- [ ] 5.5 Run `pnpm run check` – verify TypeScript compiles with no errors
- [ ] 5.6 Run `pnpm run build` – verify `/booking` and `/en/booking` render identically

## 6. BookingBody Decomposition (Phase 3)

- [ ] 6.1 Create `src/components/booking/BookingFacts.astro` – accepts `facts`, `label`; renders 4-col grid – verify with `bookingContent.de.facts`
- [ ] 6.2 Create `src/components/booking/BookingBio.astro` – accepts `bio`, `labels`; renders paragraphs + press bio aside with copy button – verify copy functionality
- [ ] 6.3 Create `src/components/booking/BookingGenres.astro` – accepts `genres`; renders 3-col genre groups – verify chip rendering
- [ ] 6.4 Create `src/components/booking/BookingReferences.astro` – accepts `references`, `trust`; renders 4-col cards + trust badges
- [ ] 6.5 Create `src/components/booking/BookingFormats.astro` – accepts `formats`; renders 3-col format cards with optional external link
- [ ] 6.6 Create `src/components/booking/BookingRider.astro` – accepts `rider`; renders 3 numbered groups with checklists
- [ ] 6.7 Create `src/components/booking/BookingPress.astro` – accepts `press`, `labels`, `lang`; renders PDF/ZIP/print buttons, PressPhotoGrid, asset links
- [ ] 6.8 Create `src/components/booking/BookingProcess.astro` – accepts `process`; renders 5-col numbered steps
- [ ] 6.9 Create `src/components/booking/BookingFAQ.astro` – accepts `faqs`, `faqConfig`; renders FAQ details (reuse `FAQSection` pattern)
- [ ] 6.10 Create `src/components/booking/BookingContact.astro` – accepts `contact`, `facts`, `labels`, `mailto`, `lang`; renders contact links + location aside
- [ ] 6.11 Create `src/components/booking/BookingShare.astro` – accepts `shareConfig`, `url`, `heroTitle`, `labels`, `lang`; renders ShareButtons + back-to-top
- [ ] 6.12 Modify `src/components/booking/BookingPage.astro` to import and compose all 11 sections in order, passing data from `bookingContent[lang]`
- [ ] 6.13 Delete `src/components/booking/BookingBody.astro`
- [ ] 6.14 Update `src/pages/booking.astro` and `src/pages/en/booking.astro` to use `BookingPage` (already do) – verify no import changes needed
- [ ] 6.15 Run `pnpm run build` – verify build succeeds
- [ ] 6.16 Visual diff: compare `/booking` and `/en/booking` HTML output before/after (save pre-refactor build, diff post-refactor) – verify zero structural differences

## 7. Mix Pages Schema Cleanup (Phase 4)

- [ ] 7.1 Update `src/pages/dj/mixes-weekly.astro` to import and use `buildBlogPostingSchema`, `buildAudioObjectSchema`, `buildMusicPlaylistSchema`, `buildBreadcrumbSchema`, `buildLabelEntities` from `schema-builders.ts`
- [ ] 7.2 Update `src/pages/dj/mixes/[number].astro` to use schema builders for BlogPosting, AudioObject, ItemList, label entities
- [ ] 7.3 Update `src/pages/dj/mixes-blog-archive.astro` to use schema builders for Blog, CollectionPage, BreadcrumbList
- [ ] 7.4 Remove inline schema construction code from all 3 pages
- [ ] 7.5 Run `pnpm run build && pnpm run build:seo` – verify sitemap, RSS, JSON-LD output valid

## 8. Obsolete Import Cleanup (Phase 4)

- [ ] 8.1 Remove unused `TracklistTable` import from `src/pages/dj/mixes/[number].astro`
- [ ] 8.2 Remove unused `formatDate` import from `src/pages/dj/mixes/[number].astro`
- [ ] 8.3 Remove unused `Hero` import from `src/pages/dj/mixes-weekly.astro`
- [ ] 8.4 Run `pnpm run check` – verify no unused import warnings

## 9. Final Verification

- [ ] 9.1 Run `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo && pnpm test:run` – verify full CI pipeline passes
- [ ] 9.2 Manual smoke test: visit `/`, `/booking`, `/en/booking`, `/dj/mixes-weekly`, `/dj/mixes/1`, `/dj/mixes-blog-archive`, `/dj/videos`, `/dj/em3f`, `/work`, `/links`, `/vermietung`, `/impressum` – verify no visual regressions
- [ ] 9.3 Verify JSON-LD on key pages with Google Rich Results Test (or local schema validator) – verify no schema regressions

## Workflow follow-up

- Archive the change after review requirements are satisfied: `openspec archive site-optimization-cleanup -y`
- Verify the archived specs appear in `openspec/specs/`