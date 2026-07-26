## 1. Create New Utility Files

- [ ] 1.1 Create `src/types/blog.ts` with `BlogPostData` interface
- [ ] 1.2 Create `src/utils/format.ts` with `formatDate()` and `formatDuration()` functions
- [ ] 1.3 Create `src/utils/blog-data.ts` with `loadBlogPosts()` and `createSearchablePosts()` functions

## 2. Update Components

- [ ] 2.1 Update `src/components/BlogPost.astro` - import formatDate from utils
- [ ] 2.2 Update `src/components/dj/MixDetail.astro` - import formatDate, BlogPostData from types
- [ ] 2.3 Update `src/components/MixcloudWidget.astro` - import formatDate from utils

## 3. Update Pages

- [ ] 3.1 Update `src/pages/dj/mixes/[number].astro` - import BlogPostData, loadBlogPosts, formatDate
- [ ] 3.2 Update `src/pages/dj/mixes-weekly.astro` - import BlogPostData, loadBlogPosts, formatDate, createSearchablePosts
- [ ] 3.3 Update `src/pages/dj/mixes-blog-archive.astro` - import BlogPostData, loadBlogPosts, formatDate, createSearchablePosts
- [ ] 3.4 Update `src/pages/djhulk-electronic-music.astro` - import BlogPostData, loadBlogPosts, createSearchablePosts

## 4. Code Style Standardization

- [ ] 4.1 Update quotes to single quotes in affected files
- [ ] 4.2 Add semicolons where missing in affected files

## 5. Verification

- [ ] 5.1 Run `pnpm run lint` - verify no errors
- [ ] 5.2 Run `pnpm run check` - verify no type errors
- [ ] 5.3 Run `pnpm run build` - verify successful build
- [ ] 5.4 Grep for old patterns to ensure no duplicates remain
