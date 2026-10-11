## ADDED Requirements

### Requirement: BlogPostData interface definition
The system SHALL provide a central `BlogPostData` interface in `src/types/blog.ts` that defines the structure of blog post data.

#### Scenario: Interface includes all required fields
- **WHEN** a developer imports `BlogPostData` from `@types/blog`
- **THEN** the interface includes: `slug`, `title`, `key`, `url`, `created_time`, `src`, `description`, `picture`, `audio_length`, `tags`, `useCases`, `tracklist`, `hasTracklist`, `heroImage?`, `ogImage?`

### Requirement: Single source of truth
The system SHALL NOT define `BlogPostData` in any other file. All pages and components SHALL import from `src/types/blog.ts`.

#### Scenario: No duplicate interface definitions
- **WHEN** searching for `interface BlogPostData` across the codebase
- **THEN** only one definition exists in `src/types/blog.ts`
