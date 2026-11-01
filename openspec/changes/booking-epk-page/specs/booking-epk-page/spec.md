# Spec Delta

## Purpose

Provides a complete bilingual (German/English) booking and electronic press kit page for DJ Hulk, including hero with LCP image, trust badges, fact sheet, bio with copyable press text, genre groups, references, booking formats, technical rider with preferred and alternative setups, press kit with downloadable photos and assets, booking process steps, FAQ, contact section with mailto/WhatsApp/phone, native and manual sharing, and print-to-PDF functionality.

## ADDED Requirements

### Requirement: Bilingual booking page with localized content
The system SHALL serve `/booking` (German) and `/en/booking` (English) with fully localized content including hero, all sections, and UI labels.

#### Scenario: German page loads with correct language and SEO
- **WHEN** user navigates to `/booking`
- **THEN** page renders with `lang="de"`, German content, `og:locale="de_DE"`, German canonical URL, and `hreflang` alternates for `de`, `en`, and `x-default`

#### Scenario: English page loads with correct language and SEO
- **WHEN** user navigates to `/en/booking`
- **THEN** page renders with `lang="en"`, English content, `og:locale="en_US"`, English canonical URL, and `hreflang` alternates for `de`, `en`, and `x-default`

#### Scenario: Language switch links work
- **WHEN** user clicks the language link in the hero
- **THEN** navigation switches to the alternate language page with correct `hreflang`

### Requirement: Hero section with LCP image and primary CTAs
The system SHALL display a full-height hero section with the DJ Hulk neon image as LCP background, gradient overlay, eyebrow label, title, subtitle, description, three CTAs (Booking inquiry, EPK PDF download, Share page), trust badges, and language switch.

#### Scenario: Hero renders with preloaded LCP image
- **WHEN** page loads
- **THEN** the hero image is preloaded, used as background with gradient overlay, and the page title matches content

#### Scenario: Primary CTA links to contact section
- **WHEN** user clicks "Booking anfragen" / "Request booking"
- **THEN** page scrolls smoothly to `#contact` section

#### Scenario: Secondary CTA downloads EPK PDF
- **WHEN** user clicks "EPK als PDF" / "Download EPK"
- **THEN** browser downloads `/files/dj-hulk-epk-de.pdf` or `-en.pdf`

### Requirement: Section navigation with scroll-spy
The system SHALL render a sticky section navigation below the hero linking to all major sections (facts, bio, genres, references, formats, rider, press, process, FAQ, contact) with active link highlighting via IntersectionObserver.

#### Scenario: Section nav highlights current section
- **WHEN** user scrolls through the page
- **THEN** the corresponding nav link receives the `active` class

#### Scenario: Clicking nav link scrolls to section
- **WHEN** user clicks a section nav link
- **THEN** page scrolls smoothly to the section with 90px offset

### Requirement: Fact sheet with key booking information
The system SHALL display a grid of facts (genres, formats, location, travel, equipment, languages, availability, rates) with label/value pairs.

#### Scenario: Facts display correctly in both languages
- **WHEN** page renders
- **THEN** all 8 facts show with localized labels and values

### Requirement: Bio with copyable press text
The system SHALL show the DJ bio with multiple paragraphs and a sidebar containing a concise press bio with a copy-to-clipboard button that shows feedback.

#### Scenario: Copy press bio to clipboard
- **WHEN** user clicks the copy button in the press bio sidebar
- **THEN** the press bio text is copied, button label changes to "Bio kopiert" / "Bio copied" for 2 seconds

### Requirement: Genre groups with pill-style tags
The system SHALL display genre groups (House & Tech House, Techno & Bass, Retro & Crowd Pleaser) each with a list of pill-style genre tags.

#### Scenario: Genres render with correct grouping
- **WHEN** page renders
- **THEN** three genre group cards appear with correct titles and items

### Requirement: References with venue metadata
The system SHALL list references (venues, events, radio) with name, meta (date/type/location), and description in a card grid.

#### Scenario: References display with trust badges
- **WHEN** page renders
- **THEN** 8 reference cards appear plus a row of trust badges (Romy S., EX-Club Zollamt, etc.)

### Requirement: Booking formats grid
The system SHALL display booking formats (Clubnight, Festival, Corporate, Private, Warm-up, All Night Long, DJ+Equipment) in a card grid with icons.

#### Scenario: All 7 formats render correctly
- **WHEN** page renders
- **THEN** 7 format cards appear with titles, descriptions, and party icon

### Requirement: Technical rider with preferred and alternative setups
The system SHALL show the rider in three columns: Preferred Setup (2× CDJ-3000, DJM-900NXS2/V10, booth monitor, XLR, table, power), Alternative (own laptop + DDJ-1000, RCA/XLR, optional booth monitor, table, power), Backup & Schedule (USB/headphones, booth access 30min, drinks, rates on request).

#### Scenario: Rider displays with numbered columns
- **WHEN** page renders
- **THEN** three numbered rider groups appear with correct items and note about full rider in EPK

### Requirement: Press kit with downloadable photos and assets
The system SHALL provide a press section with PDF download, print-to-PDF button, press photo grid (6 photos with download links, credit for live B&W photo), and asset links (logo SVG/PNG, promo card, press bio anchor).

#### Scenario: PDF download works
- **WHEN** user clicks "EPK als PDF herunterladen" / "Download EPK as PDF"
- **THEN** browser downloads the localized EPK PDF

#### Scenario: Print-to-PDF triggers browser print dialog
- **WHEN** user clicks "Als PDF drucken" / "Print as PDF"
- **THEN** `window.print()` is called with print stylesheet hiding nav/footer/share

#### Scenario: Press photos render with credits
- **WHEN** page renders
- **THEN** 6 photos appear with alt text, download links, and live B&W photo shows "Foto: Crossi0711" / "Photo: Crossi0711" linking to Instagram

#### Scenario: Assets list includes all required items
- **WHEN** page renders
- **THEN** 4 asset links appear: Logo SVG, Logo PNG, Promo Card, Press Bio anchor

### Requirement: Booking process steps
The system SHALL display 5 numbered steps (Anfrage senden, Verfügbarkeit & Angebot, Rider & Technik, Bestätigung, Auftritt) in a grid.

#### Scenario: Process steps render with zero-padded numbers
- **WHEN** page renders
- **THEN** 5 steps appear with numbers 01–05, titles, and descriptions

### Requirement: FAQ section with schema
The system SHALL render FAQs from `faqs.json` for `booking-de` and `booking-en` using `<details>` elements with `set:html` for answers, and generate FAQPage JSON-LD schema.

#### Scenario: FAQs load from data file
- **WHEN** page renders
- **THEN** 6 FAQ items appear per language with questions and HTML answers

#### Scenario: FAQPage schema included in head
- **WHEN** page source is inspected
- **THEN** JSON-LD `@type: FAQPage` with 6 Question/Answer pairs is present

### Requirement: Contact section with mailto, WhatsApp, phone
The system SHALL show contact buttons for email (mailto with prefilled subject/body), WhatsApp (deep link with prefilled text), and phone (tel: link), plus response time and location.

#### Scenario: Email CTA opens mailto with prefilled content
- **WHEN** user clicks email button
- **THEN** mailto opens with subject "Booking-Anfrage: [Event] am [Datum]" / "Booking request: [event] on [date]" and body template

#### Scenario: WhatsApp CTA opens chat with prefilled text
- **WHEN** user clicks WhatsApp button
- **THEN** WhatsApp web/app opens with `https://wa.me/491711467491?text=...`

### Requirement: Social sharing with native and fallback buttons
The system SHALL provide a share section with native Web Share API button (shown only if supported), plus WhatsApp, Facebook, X, LinkedIn, Email, and Copy Link buttons using prefilled URLs.

#### Scenario: Native share button appears only when supported
- **WHEN** page loads on a device with `navigator.share`
- **THEN** native share button is visible; hidden otherwise

#### Scenario: Copy link copies canonical URL
- **WHEN** user clicks copy button
- **THEN** clipboard receives page URL, label changes to "Link kopiert" / "Link copied" for 2 seconds

### Requirement: SEO and structured data
The system SHALL include BreadcrumbList (Home → Booking), Service schema (DJ Booking, provider Person, areaServed Stuttgart), FAQPage schema, canonical URL, hreflang alternates, localized OG locale, keywords, and Open Graph image (1200×630).

#### Scenario: All required JSON-LD schemas present
- **WHEN** page source is inspected
- **THEN** BreadcrumbList, Service, FAQPage, WebPage, LocalBusiness (from site), SiteNavigationElement schemas are present

#### Scenario: Canonical and alternates correct
- **WHEN** page source is inspected
- **THEN** canonical URL matches page, 3 alternate links (de, en, x-default) present

### Requirement: Redirects from legacy paths
The system SHALL redirect `/dj/epk`, `/epk`, `/presskit`, `/booking.html` to `/booking` and `/en/epk` to `/en/booking`.

#### Scenario: Legacy paths redirect to canonical
- **WHEN** user visits any legacy path
- **THEN** 301 redirect to correct canonical booking page

### Requirement: Integration into existing pages
The system SHALL link to booking from Hero slider (home), index page booking section, DJ profile page (hero and contact), Links page (booking card + EPK download), Navbar (Booking item), Footer (Booking & EPK link).

#### Scenario: Home page hero includes booking CTA
- **WHEN** user visits `/`
- **THEN** first hero slide has "Booking & EPK" button linking to `/booking`

#### Scenario: DJ profile page has booking CTAs
- **WHEN** user visits `/djhulk-electronic-music`
- **THEN** hero has "Booking & EPK" button, contact section has "Booking & EPK" primary button

#### Scenario: Links page shows booking and EPK download
- **WHEN** user visits `/links`
- **THEN** internal links to `/booking` and `/files/dj-hulk-epk-de.pdf` appear without external target

## REMOVED Requirements

### Requirement: Legacy EPK redirect
**Reason**: Replaced by canonical `/booking` with full EPK functionality
**Migration**: Redirects handled via Astro config redirects