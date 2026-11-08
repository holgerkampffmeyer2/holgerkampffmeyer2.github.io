# Design

## Context

See proposal.md - Why. The codebase has grown organically with duplicated configurations, monolithic components, and inline scripts. All changes are internal refactors with no user-facing behavior changes.

**Current state:**
- `BookingBody.astro`: 500+ lines, 10 sections, mixes data fetching with rendering
- `TracklistTable.astro`: 200+ lines, duplicated mobile render paths for `responsive` vs `inline` modes
- `HeroSlider.astro`: 50-line inline script duplicated in every page using it
- `ShareButtons.astro`: 13 individual props passed from two call sites with hardcoded German labels in one
- `booking.ts`: 600+ lines with duplicated DE/EN content objects
- Mix pages: BlogPosting/AudioObject/MusicPlaylist schemas built inline in 3 pages
- No unit tests for core utilities (`track-labels.js`, `mix-display.js`, `format.ts`, `share.ts`)

## Goals / Non-Goals

**Goals:**
- Reduce component size and duplication
- Extract shared logic to reusable utilities
- Enable unit testing of pure functions
- Maintain 100% visual and behavioral parity
- Keep Astro build passing with zero warnings

**Non-Goals:**
- Visual redesign or UX changes
- New features or JSON-LD schema additions
- Migration to new CSS framework or component library
- SVG sprite migration for icons (deferred to follow-up)

## Decisions

### 1. ShareButtons API: Config object with backward compatibility
**Decision**: Add optional `config: ShareConfigPreset` prop; if provided, use it; else fall back to individual props.

**Rationale**: 
- Cleanest migration path – BookingBody and MixDetail can switch independently
- Zero breaking changes for any unknown consumers
- TypeScript can enforce config shape

**Alternative considered**: Breaking change to config-only. Rejected – risky for unknown consumers.

### 2. BookingBody decomposition: 11 section components
**Decision**: Create one component per section (`BookingFacts`, `BookingBio`, `BookingGenres`, `BookingReferences`, `BookingFormats`, `BookingRider`, `BookingPress`, `BookingProcess`, `BookingFAQ`, `BookingContact`, `BookingShare`), all in `src/components/booking/`.

**Rationale**:
- Each section is already logically isolated in BookingBody with clear data boundaries
- Matches existing `BookingPage.astro` → `BookingBody.astro` pattern
- Enables future per-section customization (e.g., different order for EN/DE)

**Alternative considered**: Keep as single component but extract helper functions. Rejected – doesn't reduce template complexity or enable testing.

### 3. booking.ts split: Types + locale files + backward-compat barrel
**Decision**: 
- `booking.types.ts` – all interfaces
- `booking.de.ts` / `booking.en.ts` – locale content
- `booking.ts` – re-exports types + merged `bookingContent` + `bookingMailto`

**Rationale**:
- Preserves all existing import paths (`from '../data/booking'`)
- Enables locale-only imports for future i18n tooling
- TypeScript compiles to identical JS

**Alternative considered**: Single file with `export const de = {...}, en = {...}`. Rejected – doesn't enable tree-shaking or locale-only imports.

### 4. Schema builders: Pure functions in `src/utils/schema-builders.ts`
**Decision**: Export `buildBlogPostingSchema`, `buildAudioObjectSchema`, `buildMusicPlaylistSchema`, `buildBreadcrumbSchema`, `buildLabelEntities` as pure functions taking data objects, returning schema objects.

**Rationale**:
- Pure functions are testable, cacheable, and framework-agnostic
- Can be used in any Astro page or script
- No Astro-specific dependencies

**Alternative considered**: Astro components that render `<script type="application/ld+json">`. Rejected – less flexible, harder to test, couples schema to rendering.

### 5. TracklistTable mobile deduplication: Single render function
**Decision**: Extract mobile render logic to a `renderMobileTrack(track, label, showLabel)` helper called from both `responsive` and `inline` branches.

**Rationale**: 
- ~95% code duplication eliminated
- Single source of truth for mobile markup
- Minimal risk – pure refactor of template logic

### 6. HeroSlider script extraction: `/assets/hero-slider.js`
**Decision**: Move inline script to `public/assets/hero-slider.js` (served as static asset), load via `<script src="/assets/hero-slider.js" defer is:inline>`.

**Rationale**:
- `is:inline` inlines the external script at build time – same performance as current inline script
- Single source file for slider logic
- Can be cached by browser across pages

**Alternative considered**: ES module in `src/utils/hero-slider.ts` imported by component. Rejected – Astro doesn't bundle client scripts from `src/` the same way; `public/assets/` is the standard pattern.

### 7. Unit tests: Vitest in `src/utils/__tests__/`
**Decision**: Add `*.test.ts` files alongside each utility, run via existing `pnpm test:run`.

**Rationale**: 
- Matches existing test structure
- Pure functions are trivial to test
- No new test infrastructure needed

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| BookingBody split introduces regressions in section order/data passing | Visual regression: compare `pnpm build` output HTML before/after using diff tool; snapshot test key pages |
| ShareButtons config prop type mismatch | TypeScript strict mode catches at build time; add JSDoc for prop shape |
| Schema builders produce invalid JSON-LD | Validate output with Google Rich Results Test on staging; add schema snapshot tests |
| HeroSlider script fails to init on dynamic content | Script uses `document.querySelectorAll` on load – works for static SSG output; no dynamic sliders exist |
| Locale file split breaks `bookingMailto` | Function reads from re-exported merged `bookingContent` – unchanged behavior; add test |
| Dead CSS removal affects unknown styles | Classes `.tracklist-table-desktop` and `.tracklist-mobile-inline` are not in component markup – verify via grep before removal |

## Migration Plan

1. **Phase 1 – Utilities & Config** (independent, low risk):
   - Create `share-config.ts`, `schema-builders.ts`
   - Add unit tests for all 4 utils
   - Update `ShareButtons.astro` to accept config
   - Update `MixDetail.astro` and `BookingBody` to use config

2. **Phase 2 – Component Refactors** (medium risk, test visually):
   - Deduplicate `TracklistTable` mobile views, remove dead CSS
   - Extract `HeroSlider` script to asset
   - Split `booking.ts` into 3 files (verify all imports resolve)

3. **Phase 3 – BookingBody Decomposition** (highest risk):
   - Create 11 section components in `src/components/booking/`
   - Update `BookingPage.astro` to compose sections
   - Delete `BookingBody.astro`
   - Visual diff `/booking` and `/en/booking` before/after

4. **Phase 4 – Mix Pages Schema Cleanup**:
   - Update 3 mix pages to use `schema-builders.ts`
   - Remove inline schema construction

5. **Verification**:
   - `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo && pnpm test:run`
   - Manual visual check of `/booking`, `/en/booking`, `/dj/mixes-weekly`, `/dj/mixes/1`, `/dj/mixes-blog-archive`

## Open Questions

None – all technical decisions resolved. Implementation can proceed.