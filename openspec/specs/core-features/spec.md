# core-features Specification

## Purpose

Kernfunktionen der DJ Hulk Website: DJ/Mix-Blog, Event-Portfolio, Vermietungs-Landingpage,
Theme-System und SEO-Automatisierung.

## Requirements

### Requirement: Core Pages and Theme System
The system SHALL provide core pages (Home, Link-in-Bio, Impressum) and a dynamic theme system.
Alternative themes (deep-bass, electric-night, golden-hour) are defined inline in `Layout.astro`
via `data-theme` URL parameter (`?theme=deep-bass|electric-night|golden-hour`), not as separate CSS files.

#### Scenario: User visits home page
- **WHEN** user loads the home page (`/`)
- **THEN** the hero section, navigation, service overview, and FAQs are displayed with the active theme

#### Scenario: Theme switch via URL
- **WHEN** user visits `/?theme=electric-night`
- **THEN** the page renders with electric-night color variables

### Requirement: DJ & Music Blog System
The system SHALL integrate Mixcloud data, dynamic mix detail pages with AudioObject schema,
weekly mixes blog and archive, and the DJ Hulk electronic music landing page.
Mix detail pages use `formatDuration` (display, `m:ss`) and `toIsoDuration` (Schema, `PTnMnS`).

#### Scenario: User opens a mix detail page
- **WHEN** user navigates to `/dj/mixes/[number]`
- **THEN** the mix player, tracklist, and structured JSON-LD data are rendered

### Requirement: Events, Portfolio and Rental
The system SHALL display past events/portfolio, EM3F gallery, video showcase, and event technology rental information.
Rental page (`/vermietung`) redirects to `soundundlicht-stuttgart.de` without FAQPage schema.

#### Scenario: User views work portfolio
- **WHEN** user visits `/work`
- **THEN** past event references and visual media are shown

#### Scenario: User visits rental page
- **WHEN** user visits `/vermietung`
- **THEN** landing page with CTA to external rental site is shown (no FAQPage schema)

### Requirement: Build and SEO Automation
The system SHALL optimize images to WebP, generate RSS feeds and URL lists (`urllist.txt`),
and submit URLs to the IndexNow API.
CI: `deploy.yml` runs 4 parallel blocking jobs (`build`, `check`, `lint`, `test`) → `deploy`.
`weekly-mixcloud.yml` runs parallel jobs + smoke test + tests → `deploy`.
Both workflows use `concurrency.cancel-in-progress: true`.

#### Scenario: Running SEO build
- **WHEN** `pnpm run build:seo` is executed
- **THEN** RSS feed and URL list are updated and submitted to IndexNow

