# core-features Specification

## Purpose
TBD - created by archiving change document-current-features. Update Purpose after archive.
## Requirements
### Requirement: Core Pages and Theme System
The system SHALL provide core pages (Home, Link-in-Bio, Impressum) and a dynamic multi-theme system supporting default, deep-bass, electric-night, and golden-hour themes.

#### Scenario: User visits home page
- **WHEN** user loads the home page (`/`)
- **THEN** the hero section, navigation, service overview, FAQs, and Google reviews are displayed with the active theme

### Requirement: DJ & Music Blog System
The system SHALL integrate Mixcloud data, dynamic mix detail pages with AudioObject schema, weekly mixes blog and archive, and the DJ Hulk electronic music landing page.

#### Scenario: User opens a mix detail page
- **WHEN** user navigates to `/dj/mixes/[number]`
- **THEN** the mix player, tracklist, and structured JSON-LD data are rendered

### Requirement: Events, Portfolio and Rental
The system SHALL display past events/portfolio, EM3F gallery, video showcase, and event technology rental information.

#### Scenario: User views work portfolio
- **WHEN** user visits `/work`
- **THEN** past event references and visual media are shown

### Requirement: Build and SEO Automation
The system SHALL optimize images to WebP, generate RSS feeds and URL lists (`urllist.txt`), and submit URLs to the IndexNow API.

#### Scenario: Running SEO build
- **WHEN** `pnpm run build:seo` is executed
- **THEN** RSS feed and URL list are updated and submitted to IndexNow

