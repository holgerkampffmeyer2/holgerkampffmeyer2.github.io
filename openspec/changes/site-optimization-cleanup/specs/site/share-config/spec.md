# Spec Delta

## Purpose

Provides locale-aware share button configuration presets for booking pages, mix detail pages, and generic pages, eliminating hardcoded prop duplication across components.

## ADDED Requirements

### Requirement: ShareConfig provides preset configurations
The system SHALL export a `ShareConfig` object with preset configurations for `booking`, `mix-detail`, and `generic` page types, each containing localized labels for all 13 share button types (native, whatsapp, facebook, x, linkedin, email, pinterest, reddit, telegram, copy, plus copied state).

#### Scenario: Booking page uses German preset
- **WHEN** a German booking page imports `shareConfig.booking.de`
- **THEN** it receives an object with all 13 label keys populated with German strings matching current `bookingContent.de.share` values

#### Scenario: Booking page uses English preset
- **WHEN** an English booking page imports `shareConfig.booking.en`
- **THEN** it receives an object with all 13 label keys populated with English strings matching current `bookingContent.en.share` values

#### Scenario: Mix detail page uses preset
- **WHEN** a mix detail page imports `shareConfig.mixDetail.de`
- **THEN** it receives an object with label keys optimized for mix sharing (hashtags, text template)

### Requirement: ShareButtons component accepts config object
The system SHALL modify `ShareButtons.astro` to accept a single `config` prop of type `ShareConfigPreset` instead of 13 individual string props, while maintaining backward compatibility for any existing direct usages.

#### Scenario: Component uses config object
- **WHEN** `ShareButtons` receives a `config` prop with all required labels
- **THEN** it renders all share buttons with the provided labels

#### Scenario: Component falls back to individual props
- **WHEN** `ShareButtons` receives individual props without `config`
- **THEN** it renders using the individual props (backward compatibility)