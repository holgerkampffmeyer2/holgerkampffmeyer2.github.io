# Proposal

## Why

The DJ Hulk website needs a professional Booking & EPK (Electronic Press Kit) page to convert visitors into booking inquiries. Currently, booking information is scattered across the DJ profile page and the contact section. A dedicated, bilingual (DE/EN) booking page with complete rider, press photos, downloadable EPK PDF, social proof (follower counts), and structured data will improve conversion rates and provide bookers with everything they need in one place.

## What Changes

- New bilingual pages: `/booking` (DE) and `/en/booking` (EN) with full booking content
- New data file: `src/data/booking.ts` with complete DE/EN content (hero, facts, bio, genres, references, formats, rider, press kit, process, FAQ, contact, share, labels)
- New components: `BookingPage`, `BookingBody`, `SocialStats` (count-up follower tiles), `PressPhotoGrid` (downloadable press photos), `ShareButtons` (native share, WhatsApp, Facebook, X, LinkedIn, Email, Copy Link)
- New utility: `src/utils/share.ts` with pure share URL builders (tested)
- New build-time script: `scripts/fetch-social-stats.mjs` fetches Instagram, Facebook, Mixcloud follower counts → `src/data/social-stats.json`
- New image pipeline: `scripts/import-booking-images.mjs` converts source images to WebP/JPG for display and press download; `scripts/generate-booking-og.mjs` creates 1200×630 OG images
- New PDF generation: `scripts/generate-epk-pdf.mjs` uses Playwright to render `/booking` and `/en/booking` to A4 PDFs (`public/files/dj-hulk-epk-de.pdf`, `-en.pdf`)
- Integration: Hero slider CTA, index page booking section, DJ profile page CTAs, Links page booking card + EPK download, Navbar + Footer links
- SEO: BreadcrumbList, Service schema, FAQPage schema, hreflang alternates, localized OG locale, canonical URLs, redirects from `/dj/epk`, `/epk`, `/presskit`, `/booking.html` → `/booking`
- Tests: unit tests for `share.ts` and `booking.ts`

## Capabilities

### New Capabilities
- `booking-epk-page`: Complete bilingual booking/EPK page with hero, facts, bio, genres, references, formats, rider, press kit with downloadable photos and assets, process steps, FAQ, contact, social sharing, PDF generation, and social proof stats
- `social-stats-fetch`: Build-time script to fetch follower counts from Instagram, Facebook, Mixcloud public endpoints with fallback to cached values

### Modified Capabilities
- `core-features`: Adds booking/EPK page to core pages, extends navigation and footer, adds redirects, adds new build scripts (`stats:fetch`, `epk:og`, `epk:pdf`), updates sitemap priorities

## Impact

- New files: `src/data/booking.ts`, `src/utils/share.ts`, `src/data/social-stats.json`, `src/components/SocialStats.astro`, `src/components/PressPhotoGrid.astro`, `src/components/ShareButtons.astro`, `src/components/booking/BookingBody.astro`, `src/components/booking/BookingPage.astro`, `src/pages/booking.astro`, `src/pages/en/booking.astro`, `scripts/fetch-social-stats.mjs`, `scripts/import-booking-images.mjs`, `scripts/generate-booking-og.mjs`, `scripts/generate-epk-pdf.mjs`, test files
- Modified: `AGENTS.md`, `package.json`, `astro.config.mjs`, `src/layouts/Layout.astro`, `src/components/Navbar.astro`, `src/components/Footer.astro`, `src/pages/index.astro`, `src/pages/links.astro`, `src/pages/djhulk-electronic-music.astro`, `src/data/faqs.json`, `src/data/jsonLd.ts`, `src/components/Icon.astro` (new icons)
- Assets: `src/assets/img/booking/*.webp`, `public/img/press/*`, `public/og/booking-dj-hulk-de.jpg`, `-en.jpg`, `public/files/dj-hulk-epk-de.pdf`, `-en.pdf`
- CI: `build:full` now includes `fetch-social-stats`; PDFs are committed, not generated in CI