## ADDED Requirements

### Requirement: loadBlogPosts helper function
The system SHALL provide a `loadBlogPosts(): Promise<BlogPostData[]>` function in `src/utils/blog-data.ts` that loads blog posts from `blog-posts.json`.

#### Scenario: Successfully load blog posts
- **WHEN** `loadBlogPosts()` is called
- **THEN** it returns an array of `BlogPostData` objects from `blog-posts.json`

#### Scenario: Handle missing file gracefully
- **WHEN** `blog-posts.json` cannot be loaded
- **THEN** it returns an empty array `[]`

### Requirement: createSearchablePosts helper function
The system SHALL provide a `createSearchablePosts(posts: BlogPostData[]): SearchablePost[]` function that creates search-optimized post data.

#### Scenario: Create searchable posts from blog posts
- **WHEN** `createSearchablePosts(posts)` is called with posts that have tracklists
- **THEN** it returns objects with: `slug`, `title`, `picture`, `description` (max 300 chars), `tags`, `tracklist`

### Requirement: Eliminate duplicate JSON import pattern
The system SHALL NOT contain inline `await import("../../data/blog-posts.json")` patterns. All pages SHALL use `loadBlogPosts()`.

#### Scenario: No duplicate import patterns
- **WHEN** searching for `await import.*blog-posts` across the codebase
- **THEN** only one definition exists in `src/utils/blog-data.ts`
