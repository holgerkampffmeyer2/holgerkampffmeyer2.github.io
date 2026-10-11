## Why

The codebase has significant code duplication across Astro pages and components:
- `BlogPostData` interface is defined identically in 5 files
- `formatDate()` function exists 5 times with mixed locales (de-DE vs en-GB)
- JSON import pattern for `blog-posts.json` is duplicated 4 times with identical try/catch
- `searchablePosts` creation logic is duplicated 3 times

This duplication makes maintenance error-prone (changing one instance requires finding all others) and creates inconsistency (mixed locales, mixed quote styles, mixed semicolon usage).

## What Changes

- **New `src/types/blog.ts`**: Central `BlogPostData` interface used across all files
- **New `src/utils/format.ts`**: Central `formatDate()` and `formatDuration()` functions with consistent `de-DE` locale
- **New `src/utils/blog-data.ts`**: Helper functions `loadBlogPosts()` and `createSearchablePosts()` to eliminate duplicate JSON import logic
- **Update imports** in 5+ files to use centralized modules
- **Standardize code style**: Single quotes, always semicolons across affected files

## Capabilities

### New Capabilities
- `shared-types`: Central TypeScript interfaces for blog post data structures
- `format-utils`: Shared formatting utilities for dates and durations
- `blog-data-helpers`: Helper functions for loading and processing blog data

### Modified Capabilities
(none - this is a pure refactoring with no behavioral changes)

## Impact

- **Files modified**: ~10 Astro pages and components
- **Files created**: 3 new TypeScript modules
- **Dependencies**: None added or removed
- **Behavior**: No functional changes - purely structural refactoring
- **Risk**: Low - all changes are import path updates and function extraction
