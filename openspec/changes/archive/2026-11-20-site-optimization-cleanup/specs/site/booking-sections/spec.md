# Spec Delta

## Purpose

Decomposes the monolithic BookingBody component into 11 composable section components (Facts, Bio, Genres, References, Formats, Rider, Press, Process, FAQ, Contact, Share) that can be composed in BookingPage while preserving identical HTML output and JSON-LD.

## ADDED Requirements

### Requirement: BookingFacts renders facts grid
The system SHALL export `BookingFacts.astro` that accepts `facts: BookingFact[]` and `labels.factSheet` and renders a 4-column responsive grid of definition lists matching current BookingBody #facts section output.

#### Scenario: Renders German facts
- **WHEN** passed `bookingContent.de.facts` and `bookingContent.de.labels.factSheet`
- **THEN** renders 8 fact cards in lg:grid-cols-4 with correct labels and values

### Requirement: BookingBio renders bio with copyable press bio
The system SHALL export `BookingBio.astro` that accepts `bio` object and `labels` and renders the bio paragraphs plus press bio aside with copy button matching current BookingBody #bio section output.

#### Scenario: Copy button copies press bio
- **WHEN** user clicks copy button in press bio aside
- **THEN** clipboard receives press bio text and button shows "Bio kopiert" / "Bio copied" temporarily

### Requirement: BookingGenres renders genre groups
The system SHALL export `BookingGenres.astro` that accepts `genres` object and renders genre groups as 3-column grid with chip-style genre items matching current BookingBody #genres section output.

#### Scenario: Renders genre chips
- **WHEN** passed `bookingContent.de.genres`
- **THEN** renders the genre groups in a 3-column grid with chip-style items and matching labels

### Requirement: BookingReferences renders reference cards
The system SHALL export `BookingReferences.astro` that accepts `references` object and `trust` array and renders reference cards in 4-column grid plus trust badges matching current BookingBody #references section output.

#### Scenario: Renders references and trust badges
- **WHEN** passed `bookingContent.de.references` and `bookingContent.de.trust`
- **THEN** renders the reference cards in a 4-column grid followed by the trust badges

### Requirement: BookingFormats renders format cards
The system SHALL export `BookingFormats.astro` that accepts `formats` object and renders format cards in 3-column grid with optional external link matching current BookingBody #formats section output.

#### Scenario: Renders format cards with optional link
- **WHEN** passed `bookingContent.de.formats`
- **THEN** renders each format in a 3-column grid, adding an external link only when that format defines a URL

### Requirement: BookingRider renders rider groups
The system SHALL export `BookingRider.astro` that accepts `rider` object and renders 3 numbered rider groups with checklists matching current BookingBody #rider section output.

#### Scenario: Renders numbered rider checklists
- **WHEN** passed `bookingContent.de.rider`
- **THEN** renders three numbered groups, each containing the checklist items from the content

### Requirement: BookingPress renders press kit section
The system SHALL export `BookingPress.astro` that accepts `press` object, `labels`, and `lang` and renders press section with PDF download, ZIP download, print button, PressPhotoGrid, and asset links matching current BookingBody #press section output.

#### Scenario: Renders press kit downloads
- **WHEN** passed `bookingContent.de.press`, its labels and `lang="de"`
- **THEN** renders the PDF/ZIP/print buttons, the PressPhotoGrid and the localized asset links

### Requirement: BookingProcess renders process steps
The system SHALL export `BookingProcess.astro` that accepts `process` object and renders 5-column numbered process steps matching current BookingBody #process section output.

#### Scenario: Renders five numbered steps
- **WHEN** passed `bookingContent.de.process`
- **THEN** renders five numbered steps in a 5-column grid with their titles and descriptions

### Requirement: BookingFAQ renders FAQ section
The system SHALL export `BookingFAQ.astro` that accepts `faqs` array and `faq` config and renders FAQ details elements matching current BookingBody #faq section output (reusing FAQSection component logic).

#### Scenario: Renders FAQ details
- **WHEN** passed the booking FAQs and FAQ config
- **THEN** renders one `<details>` element per FAQ with question and answer from the content

### Requirement: BookingContact renders contact section
The system SHALL export `BookingContact.astro` that accepts `contact` object, `facts` array, `labels`, `mailto` string, and `lang` and renders contact links (email, WhatsApp, phone) plus location aside matching current BookingBody #contact section output.

#### Scenario: Renders contact links and location
- **WHEN** passed `bookingContent.de.contact`, facts, labels, `bookingMailto` and `lang="de"`
- **THEN** renders the email, WhatsApp and phone links and the location aside with the localized labels

### Requirement: BookingShare renders share section
The system SHALL export `BookingShare.astro` that accepts `share` config, `url`, `heroTitle`, `labels`, and `lang` and renders ShareButtons with config plus back-to-top link matching current BookingBody #share section output.

#### Scenario: Renders share buttons with locale preset
- **WHEN** the German booking page passes `shareConfig.booking.de` to `BookingShare`
- **THEN** renders ShareButtons with those labels and the back-to-top link

### Requirement: BookingPage composes all sections
The system SHALL modify `BookingPage.astro` to import and compose all 11 section components in the same order as current BookingBody, passing the same data from `bookingContent[lang]`.

#### Scenario: German booking page renders identically
- **WHEN** visiting `/booking` after refactor
- **THEN** HTML output, JSON-LD, and all interactive behavior match pre-refactor exactly

#### Scenario: English booking page renders identically
- **WHEN** visiting `/en/booking` after refactor
- **THEN** HTML output, JSON-LD, and all interactive behavior match pre-refactor exactly