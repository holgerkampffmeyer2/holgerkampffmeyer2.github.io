# Tasks

## 1. Gemeinsame Utils

- [ ] 1.1 Create `src/utils/html.ts` with `escapeHtml()` and `safeHttpUrl()`, and verify unit tests cover `& < > " '` escaping plus rejection of `javascript:`/`data:` URLs.
- [ ] 1.2 Switch `src/utils/tracklist-renderer.ts` to the shared `escapeHtml()` and verify existing tests still pass.

## 2. Ein Renderer für SSR und Client

- [ ] 2.1 Create `src/utils/label-row.ts` with `renderLabelRows(items, state)` and verify a unit test compares website `aria-label`, `data-expanded`, `aria-hidden` and highlighted date markup against the existing SSR output.
- [ ] 2.2 Use the shared renderer in `src/pages/dj/labels/index.astro` via `set:html` and in the client script, remove `rowMarkup()` and the post-render expansion patch, and verify `pnpm run check` plus the Playwright label diagnostics.
- [ ] 2.3 Align the chevron icon source and latest-date highlighting with the SSR markup and verify the built HTML contains no second renderer implementation.

## 3. URL-Hardening und Dead Code

- [ ] 3.1 Apply `safeHttpUrl()` in `buildLabelEntries()` and at the SSR/client/detail render sites, and verify an unsafe registry URL renders the `—` placeholder in a test.
- [ ] 3.2 Remove dead `searchText` from `LabelEntry`/`LabelSearchEntry` and `index.astro`, keep `mix.title`, and verify a search for a descriptive word from a raw mix title still returns that mix.
- [ ] 3.3 Privatize module-only exports listed in `design.md`, and verify `pnpm run check` reports no broken consumers.

## 4. Integration

- [ ] 4.1 Run `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo && pnpm test:run && node scripts/smoke-dist.mjs` and verify all steps are green.
- [ ] 4.2 Re-run `dist` checks for NFC, no `aria-disabled` pagination links and no `<article class="label-mix-card">`, and verify all patterns are absent.

## Workflow follow-up

- Archive after review; `public/assets/mix-search.js` remains untouched and can be handled in a separate legacy-script change if needed.
