# Design

## Context

See proposal.md for motivation. The current site has DJ content split across `/djhulk-electronic-music`, `/links`, and contact sections. No dedicated booking/EPK page exists. The tech stack is Astro 7 (SSG, static output), Tailwind CSS 4, pnpm, TypeScript, Vitest. Existing patterns: data-driven content in `src/data/*.ts`, components in `src/components/`, pages in `src/pages/`, build scripts in `scripts/`, JSON-LD in `src/data/jsonLd.ts`, bilingual via separate page directories (`/en/...`), Layout props for SEO/JSON-LD, SectionNav for long pages, IntersectionObserver for animations.

## Goals / Non-Goals

**Goals:**
- Single source of truth for booking content (`src/data/booking.ts`) used by pages, components, and PDF generation
- Bilingual pages with correct hreflang, canonical, localized OG locale, and SEO
- Build-time social stats fetch with resilient parsing and cache fallback
- EPK PDFs generated from built HTML via Playwright (committed, not CI-generated)
- Reusable components: SocialStats (count-up), PressPhotoGrid, ShareButtons, BookingBody, BookingPage
- Integration into existing navigation, hero, index, DJ profile, Links page
- Print stylesheet hiding nav/footer/share for clean PDFs
- Unit tests for share utilities and booking data integrity

**Non-Goals:**
- No backend/form handling (mailto + WhatsApp only)
- No runtime API calls (all data at build time)
- No analytics/tracking additions
- No translation system (manual DE/EN content)
- No CMS integration

## Decisions

### 1. Data model: `src/data/booking.ts` as single source
**Decision**: All booking content (DE/EN) lives in one TypeScript file with typed interfaces, exporting `bookingContent` record and `bookingMailto(lang)` helper.
**Rationale**: Keeps content co-located, type-safe, importable by pages, components, tests, and PDF script. Avoids duplication between page and PDF.
**Alternative considered**: Separate JSON files per language + separate component props. Rejected due to duplication risk and lack of type safety.

### 2. Page architecture: `BookingPage` component + thin page wrappers
**Decision**: `src/components/booking/BookingPage.astro` contains hero, SectionNav, BookingBody, Layout, SEO, JSON-LD. Pages `booking.astro` and `en/booking.astro` are one-liners importing it with `lang` prop.
**Rationale**: DRY - avoids duplicating 300+ lines of page structure. Language is the only variable.
**Alternative**: Two full page files. Rejected due to maintenance burden.

### 3. Section composition: `BookingBody` with all sections
**Decision**: `BookingBody.astro` renders all sections (facts, bio, genres, references, SocialStats, formats, rider, press, process, FAQ, contact, share) as separate `<section id="...">` elements for SectionNav anchoring.
**Rationale**: Single component keeps data flow simple (one `content` import). Sections are semantically distinct with own IDs.
**Alternative**: Split into many small components. Rejected - adds indirection without reuse benefit.

### 4. Social stats: Build-time fetch with cache fallback
**Decision**: `scripts/fetch-social-stats.mjs` runs at build time (in `build:full`), fetches 3 platforms with platform-specific UAs/parsers, writes `src/data/social-stats.json` only on change. Component reads JSON at build time.
**Rationale**: No runtime dependencies, no API keys needed (public endpoints), CI-friendly (exits 0 on partial failure), simple JSON consumed by Astro.
**Alternatives**: Runtime fetch via Cloudflare Workers / edge function (adds infra), client-side fetch (CORS, privacy, layout shift). Rejected.

### 5. Count-up animation: IntersectionObserver + requestAnimationFrame
**Decision**: `SocialStats.astro` inlines vanilla JS that observes counters, animates 0→target in 1.6s with cubic ease-out, respects `prefers-reduced-motion`, formats via `Intl.NumberFormat(locale)`.
**Rationale**: Zero dependencies, works with Astro's island-free static HTML, progressive enhancement (fallback to final value if JS disabled), accessibility compliant.
**Alternative**: `react-countup` / similar library. Rejected - adds bundle weight, Astro islands not needed for simple animation.

### 6. PDF generation: Playwright rendering built `dist/`
**Decision**: `scripts/generate-epk-pdf.mjs` starts a static HTTP server on `dist/`, launches Chromium, navigates to `/booking` and `/en/booking`, emulates print media, generates A4 PDFs to `public/files/`. PDFs committed to repo.
**Rationale**: Guarantees PDF matches live page exactly (same CSS, same content), print stylesheet hides nav/footer/share, no separate PDF template to maintain. CI does not generate (no Playwright browsers), PDFs committed after local build.
**Alternatives**: `@react-pdf/renderer` (separate template), Puppeteer + `astro preview` (similar but less standard). Rejected.

### 7. Print stylesheet: Global `@media print` in BookingPage
**Decision**: `<style is:global>` in `BookingPage.astro` overrides CSS custom properties to light theme, hides `nav`, `footer`, `[data-section-nav]`, `[data-share-root]`, `[data-print-epk]`, `[data-native-share]`, `[data-copy-bio]`, `[data-copy-url]`, sets white background, removes gradients.
**Rationale**: Single source of truth for print styles, scoped to booking pages via component, no extra CSS files.
**Alternative**: Separate `print.css` imported conditionally. Rejected - more files, same result.

### 8. Share utilities: Pure functions in `src/utils/share.ts`
**Decision**: `buildShareLinks`, `buildMailto`, `buildWhatsAppMessage` are pure, tested functions. `ShareButtons.astro` calls `buildShareLinks` in frontmatter, renders `<a>` for each platform, `<button>` for copy, `<button data-native-share>` for Web Share API.
**Rationale**: Testable without DOM, reusable, no framework coupling. Native share only shown when `navigator.share` exists.
**Alternative**: Inline URL construction in component. Rejected - untestable, duplicated logic.

### 9. Icons: Extended `Icon.astro` with 10 new icons
**Decision**: Added `whatsapp`, `x`, `share`, `link`, `download`, `calendar`, `phone`, `print`, `arrow-up`, `copy` with inline SVG paths, added to DEFAULTS.
**Rationale**: Consistent with existing pattern (inline SVG map), no external icon library, tree-shakeable via component.
**Alternative**: `lucide-astro` / `astro-icon`. Rejected - adds dependency, existing pattern works well.

### 10. SEO: Layout extensions for multilingual
**Decision**: Extended `Layout.astro` props: `lang`, `keywords`, `ogLocale`, `alternates`, `skipLinkLabel`. `<html lang={lang}>`, keywords meta, alternate links, og:locale from prop, skip link label localized.
**Rationale**: Minimal changes to existing Layout, supports all bilingual pages, backward compatible (defaults to DE).
**Alternative**: Separate Layout per language. Rejected - duplication.

### 11. Redirects: Astro config redirects map
**Decision**: Added 5 redirects in `astro.config.mjs`: `/dj/epk`, `/epk`, `/presskit`, `/booking.html` → `/booking`; `/en/epk` → `/en/booking`.
**Rationale**: Centralized, handled by Astro's static redirect generation (creates HTML meta refresh), no server config needed.
**Alternative**: Netlify/Vercel redirects. Rejected - platform-specific.

### 12. Sitemap priorities: Booking pages at 0.9 weekly
**Decision**: In sitemap serialize, `/booking` and `/en/booking` get `priority: 0.9`, `changefreq: WEEKLY`.
**Rationale**: High-value conversion pages, updated when content changes.
**Alternative**: Default 0.5. Rejected - underweights business-critical pages.

### 13. FAQ integration: Extended `faqs.json` with booking entries
**Decision**: Added 6 DE + 6 EN FAQs with `pages: ["booking-de"]` / `["booking-en"]`. `getFaqsForPage` and `getFaqSchema` work unchanged.
**Rationale**: Reuses existing FAQ infrastructure, single source for page rendering and JSON-LD.
**Alternative**: Inline FAQs in booking.ts. Rejected - loses FAQPage schema generation.

### 14. Image pipeline: Sharp + import script
**Decision**: `scripts/import-booking-images.mjs` uses Sharp to convert source PNG/JPG to WebP (display, 1200w max) and JPG (press downloads, 1920w max), writes CREDITS.txt.
**Rationale**: Automates conversion, consistent quality, press downloads are high-res JPG for print use, display images are optimized WebP.
**Alternative**: Manual conversion. Rejected - error-prone, not reproducible.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Instagram/Facebook HTML structure changes break parsing | Cache fallback keeps last good values; script exits 0 in non-strict mode; parsing uses multiple fallback regexes |
| Playwright Chromium not installed in CI | PDFs generated locally and committed; `epk:pdf` script documents requirement |
| Large PDF file size (~4MB) due to high-res images | Print stylesheet limits image height, but PDF still embeds full-res; acceptable for press kit |
| Count-up animation layout shift | `tabular-nums` class on counters, fixed-width containers |
| Native share button flicker on unsupported browsers | Button rendered with `hidden` attribute, shown only after `navigator.share` check |
| Bilingual content drift | Single `booking.ts` with typed interfaces; tests validate both locales have same keys |
| Build time increase from social fetch | 20s timeout per platform, parallel not needed (3×20s = 60s max); only in `build:full` |
| Redirects create duplicate content in sitemap | Astro sitemap excludes redirect pages (they have no source file); only canonical pages indexed |

## Migration Plan

1. All code and content implemented in this change (already done)
2. Run `pnpm run stats:fetch` to populate initial social-stats.json
3. Run `pnpm run epk:og` to generate OG images
4. Run `pnpm run build && pnpm run epk:pdf` to generate PDFs
5. Commit: `src/`, `scripts/`, `public/files/*.pdf`, `public/og/*.jpg`, `src/assets/img/booking/`, `public/img/press/`, `tests/`, `package.json`, `astro.config.mjs`, `AGENTS.md`
6. Deploy via existing CI (build:full includes stats fetch, PDFs already in repo)
7. Verify live: `/booking`, `/en/booking`, PDF downloads, social share, print dialog

## Open Questions

None - all decisions resolved during implementation.