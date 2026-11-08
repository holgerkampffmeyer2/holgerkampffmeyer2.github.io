# Tasks

## 1. Data & Content

- [x] 1.1 Create `src/data/booking.ts` with typed interfaces and bilingual content (DE/EN) — verify file exists and exports `bookingContent`, `bookingMailto`
- [x] 1.2 Add FAQ entries to `src/data/faqs.json` for `booking-de` and `booking-en` — verify 6 DE + 6 EN entries with correct `pages` array
- [x] 1.3 Extend `src/components/Icon.astro` with new icons (whatsapp, x, share, link, download, calendar, phone, print, arrow-up, copy) — verify icons render in components

## 2. Utility Functions & Tests

- [x] 2.1 Create `src/utils/share.ts` with `buildShareLinks`, `buildMailto`, `buildWhatsAppMessage` — verify TypeScript compiles
- [x] 2.2 Write `tests/share.test.mjs` covering `buildShareLinks`, `buildMailto`, `buildWhatsAppMessage` — verify `pnpm test:run tests/share.test.mjs` passes
- [x] 2.3 Write `tests/booking-data.test.mjs` validating bilingual keys, paths, rider groups, press photos with credit, contact data, mailto generation — verify `pnpm test:run tests/booking-data.test.mjs` passes

## 3. Social Stats Fetch & Component

- [x] 3.1 Create `scripts/fetch-social-stats.mjs` with platform-specific fetch/parse, cache fallback, JSON output — verify `node scripts/fetch-social-stats.mjs` runs and updates `src/data/social-stats.json`
- [x] 3.2 Create `src/data/social-stats.json` with initial fallback counts — verify file exists with correct schema
- [x] 3.3 Create `src/components/SocialStats.astro` with count-up animation, locale formatting, IntersectionObserver — verify component renders on booking page with animated counters
- [x] 3.4 Add `pnpm run stats:fetch` script to `package.json` and include in `build:full` — verify `pnpm run build:full` includes stats fetch step

## 4. Booking Components

- [x] 4.1 Create `src/components/booking/BookingBody.astro` with all sections (facts, bio, genres, references, SocialStats, formats, rider, press, process, FAQ, contact, share) — verify component renders without errors
- [x] 4.2 Create `src/components/PressPhotoGrid.astro` with downloadable photos, credits, asset links — verify grid renders 6 photos with download buttons and Crossi0711 credit link
- [x] 4.3 Create `src/components/ShareButtons.astro` with native share, WhatsApp, Facebook, X, LinkedIn, Email, Copy Link — verify buttons generate correct URLs and copy works
- [x] 4.4 Create `src/components/booking/BookingPage.astro` with hero, SectionNav, BookingBody, Layout, SEO, JSON-LD, print styles — verify page renders with correct structure

## 5. Pages & Routing

- [x] 5.1 Create `src/pages/booking.astro` (DE) and `src/pages/en/booking.astro` (EN) as thin wrappers — verify both pages build and serve correct language
- [x] 5.2 Add redirects in `astro.config.mjs` for `/dj/epk`, `/epk`, `/presskit`, `/booking.html` → `/booking` and `/en/epk` → `/en/booking` — verify `pnpm run build` generates redirect pages
- [x] 5.3 Update sitemap priorities in `astro.config.mjs` for `/booking` and `/en/booking` (0.9, weekly) — verify sitemap includes correct priorities
- [x] 5.4 Extend `Layout.astro` with `lang`, `keywords`, `ogLocale`, `alternates`, `skipLinkLabel` props — verify bilingual pages have correct HTML lang, alternates, og:locale

## 6. Navigation & Integration

- [x] 6.1 Add "Booking" item to `Navbar.astro` with active state for `/booking` and `/en/booking` — verify nav highlights on booking pages
- [x] 6.2 Add "Booking & EPK" link to `Footer.astro` — verify link appears and navigates correctly
- [x] 6.3 Update `src/pages/index.astro`: hero slide booking CTA, new booking section before contact, contact CTA links to `/booking` — verify home page shows booking integration
- [x] 6.4 Update `src/pages/links.astro`: booking card (internal), EPK PDF download (internal with download attr) — verify links work without target="_blank"
- [x] 6.5 Update `src/pages/djhulk-electronic-music.astro`: hero booking CTA, contact section booking primary button — verify DJ profile page has booking CTAs
- [x] 6.6 Update `src/data/jsonLd.ts` siteNavigationJsonLd to include Booking & EPK — verify JSON-LD includes booking navigation element

## 7. Image Pipeline & OG Images

- [x] 7.1 Create `scripts/import-booking-images.mjs` converting source images to WebP (display) and JPG (press) — verify `src/assets/img/booking/*.webp` and `public/img/press/*` generated
- [x] 7.2 Create `scripts/generate-booking-og.mjs` generating 1200×630 OG images for DE/EN — verify `public/og/booking-dj-hulk-de.jpg` and `-en.jpg` exist
- [x] 7.3 Add `pnpm run epk:og` script — verify script runs successfully

## 8. PDF Generation

- [x] 8.1 Create `scripts/generate-epk-pdf.mjs` with static server + Playwright rendering `/booking` and `/en/booking` to A4 PDFs — verify `pnpm run epk:pdf` produces `public/files/dj-hulk-epk-de.pdf` and `-en.pdf`
- [x] 8.2 Add `pnpm run epk:pdf` script — verify script runs after build
- [x] 8.3 Verify PDFs render correctly (content, print styles, no nav/footer) — verify manual inspection of generated PDFs

## 9. Build, Lint, Test, Documentation

- [x] 9.1 Run `pnpm run lint` — verify zero errors
- [x] 9.2 Run `pnpm run check` — verify TypeScript passes
- [x] 9.3 Run `pnpm run build` — verify production build succeeds with all pages
- [x] 9.4 Run `pnpm run build:seo` — verify RSS, urllist.txt include booking pages
- [x] 9.5 Run `pnpm test:run` — verify all 237 tests pass
- [x] 9.6 Update `AGENTS.md` with new scripts, workflows, area hints — verify documentation reflects all new commands and processes
- [x] 9.7 Create OpenSpec change artifacts (proposal, specs, design, tasks) — verify `openspec status --change booking-epk-page` shows all artifacts done

## 10. Verification & Polish

- [x] 10.1 Manual smoke test: visit `/booking` and `/en/booking` in preview — verify hero, sections, navigation, share, contact, PDF download, print
- [x] 10.2 Verify social stats tiles animate on scroll and respect reduced motion
- [x] 10.3 Verify copy-to-clipboard works for press bio and share link
- [x] 10.4 Verify native share button appears only on supported browsers
- [x] 10.5 Verify hreflang alternates and canonical URLs in page source
- [x] 10.6 Verify FAQPage JSON-LD schema present with 6 items per language
- [x] 10.7 Verify Service JSON-LD schema with provider Person and areaServed Stuttgart
- [x] 10.8 Commit all generated assets (PDFs, OG images, optimized images, social-stats.json) — verify git status shows intended files