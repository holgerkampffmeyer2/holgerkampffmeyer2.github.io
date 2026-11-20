# Spec Delta

## ADDED Requirements

### Requirement: Booking content lives in locale files with shared types
The system SHALL organize booking data as `src/data/booking.types.ts` (interfaces), `src/data/booking.de.ts` (German content) and `src/data/booking.en.ts` (English content).

#### Scenario: Locale-specific imports work
- **WHEN** code imports `{ bookingContent } from '../data/booking.de'`
- **THEN** receives only German content object

#### Scenario: Type imports work from types file
- **WHEN** code imports `{ type BookingContent } from '../data/booking.types'`
- **THEN** receives all type definitions

### Requirement: Booking barrel preserves existing imports
The system SHALL keep `src/data/booking.ts` as a re-export of the merged `bookingContent`, all types and `bookingMailto`.

#### Scenario: Existing imports continue working
- **WHEN** code imports `{ bookingContent, type BookingLocale } from '../data/booking'`
- **THEN** receives identical merged object and types as before refactor

#### Scenario: bookingMailto function preserved
- **WHEN** code imports `{ bookingMailto } from '../data/booking'`
- **THEN** function works identically, reading from merged bookingContent
