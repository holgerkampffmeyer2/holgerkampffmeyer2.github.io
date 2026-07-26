## Context

The Astro SSG project has grown organically, leading to code duplication across pages and components. Key duplicated elements:
- `BlogPostData` interface (5 identical copies)
- `formatDate()` function (5 copies with mixed locales)
- JSON import pattern for blog data (4 copies)
- `searchablePosts` creation logic (3 copies)

Current file structure:
```
src/
├── components/     # Astro components
├── data/           # JSON data files + TypeScript configs
├── layouts/        # Layout.astro
├── pages/          # Astro pages
└── utils/          # dj-schema.js, mix-display.js
```

## Goals / Non-Goals

**Goals:**
- Eliminate duplicate type definitions (single source of truth)
- Centralize formatting functions with consistent locale (`de-DE`)
- Extract repeated data loading patterns into reusable helpers
- Standardize code style (single quotes, always semicolons)
- Maintain 100% backward compatibility (no behavioral changes)

**Non-Goals:**
- Refactoring the entire codebase style (only affected files)
- Changing the data model or JSON structure
- Adding new dependencies
- Modifying the build pipeline

## Decisions

### 1. File locations

**Decision:** Create `src/types/blog.ts` and extend `src/utils/`

**Rationale:**
- `src/types/` follows TypeScript convention for type definitions
- `src/utils/` already exists and contains similar utilities
- Keeps related code together without creating new top-level directories

**Alternatives considered:**
- `src/lib/` (not used in this project)
- Putting types in `src/data/` (mixes concerns)

### 2. Export style

**Decision:** Named exports (not default exports)

**Rationale:**
- Explicit imports are clearer (`import { BlogPostData } from ...`)
- Better IDE support and refactoring
- Matches existing pattern in `usecase-config.ts`

### 3. Locale standardization

**Decision:** Use `de-DE` for all `formatDate()` calls

**Rationale:**
- German website targeting German audience
- `MixcloudWidget.astro` already uses `de-DE`
- Consistent user experience

**Trade-off:** Some pages currently show `en-GB` format (DD/MM/YYYY) - will change to `DD.MM.YYYY`

### 4. Function signatures

**Decision:** Keep existing function signatures where possible

**Rationale:**
- Minimizes changes in calling code
- `formatDate(dateStr: string)` remains unchanged
- `loadBlogPosts()` returns same structure as current inline code

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Breaking imports | Use TypeScript path aliases (`@types/*`, `@utils/*`) |
| Merge conflicts with pending PRs | Coordinate timing, keep PR small |
| Missing a duplicate instance | Grep for old patterns after refactoring |
| Locale change confuses users | Visual QA of date formats |

## Migration Plan

1. Create new utility files (`types/blog.ts`, `utils/format.ts`, `utils/blog-data.ts`)
2. Update imports in each affected file (one at a time)
3. Run `pnpm run lint && pnpm run check` after each file
4. Full build verification at end
5. No rollback needed (purely additive until old code is removed)

## Open Questions

None - all decisions resolved with user input (single quotes, always semicolons, de-DE locale).
