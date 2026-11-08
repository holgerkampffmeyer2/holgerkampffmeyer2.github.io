# Spec Delta

## MODIFIED Requirements

### Requirement: Booking content split into locale files with shared types
The system SHALL reorganize `src/data/booking.ts` into three files:
- `src/data/booking.types.ts` – exports all TypeScript interfaces (BookingLocale, BookingContent, BookingFact, BookingGenreGroup, BookingReference, BookingFormat, RiderGroup, PressPhoto, ProcessStep, UseCaseConfig)
- `src/data/booking.de.ts` – exports `bookingContent.de` with all German content
- `src/data/booking.en.ts` – exports `bookingContent.en` with all English content
- `src/data/booking.ts` – re-exports types and merged `bookingContent` object for backward compatibility

#### Scenario: Existing imports continue working
- **WHEN** code imports `{ bookingContent, type BookingLocale } from '../data/booking'`
- **THEN** receives identical merged object and types as before refactor

#### Scenario: Locale-specific imports work
- **WHEN** code imports `{ bookingContent } from '../data/booking.de'`
- **THEN** receives only German content object

#### Scenario: Type imports work from types file
- **WHEN** code imports `{ type BookingContent } from '../data/booking.types'`
- **THEN** receives all type definitions

#### Scenario: bookingMailto function preserved
- **WHEN** code imports `{ bookingMailto } from '../data/booking'`
- **THEN** function works identically, reading from merged bookingContent