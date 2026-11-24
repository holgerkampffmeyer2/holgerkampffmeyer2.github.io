# Design

## Context

`src/pages/dj/labels/index.astro` contains two row renderers: SSR markup in the Astro template and a client-side `rowMarkup()` string builder. They already differ in website `aria-label`, date highlighting, chevron path and initial expanded state. There are also three HTML escapers and website URLs are inserted without protocol validation. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- One row renderer for server and client output with byte-identical markup for the same state.
- One escaping helper and one URL allow-list used at the data boundary and render sites.
- Remove provably dead data and module-private exports without behavioral change.

**Non-Goals:**

- No visual redesign, no new interaction, no spec delta.
- No migration of `public/assets/mix-search.js`; it is a standalone legacy script outside the TS bundle.
- No change to the serialized label payload besides dropping `searchText`.

## Decisions

- **Shared string renderer.** `src/utils/label-row.ts` exports `renderLabelRows(items, state)` returning an HTML string. SSR inserts it with `set:html`; the client imports the same function and drops `rowMarkup()` plus the post-render expansion patch. Alternative: Astro component for both paths — rejected because the client path needs a plain string inside a `<script>` and would still need a second serializer.
- **Shared HTML utils.** `src/utils/html.ts` exports `escapeHtml()` and `safeHttpUrl()`. `tracklist-renderer.ts` imports `escapeHtml()` instead of defining its own copy. Alternative: keep local helpers — rejected because the current drift is exactly the failure mode.
- **URL guard at data boundary.** `buildLabelEntries()` normalizes `url` with `safeHttpUrl()`; render sites apply it again. This covers SSR, serialized client data and `[label].astro` at once. Alternative: guard only in templates — rejected because serialized data would remain unsafe.
- **Keep `mix.title`.** It feeds `mixText` and is consumed by `filterMixesForSearch()`; removing it would break title search. `searchText` is removed because `buildLabelEntries()` always populates `search.mixText` and the fallback is unreachable.
- **Privatize unused exports.** Exports with no consumers become module-private; `LabelSortKey`, `LabelSearchEntry`, `matchesSearchText`, `highlightSegments`, `filterMixesForSearch`, `normalizeSearchText`, `scoreLabelMatch`, `LabelRegistryData`, `LabelEntry` and `buildLabelEntries` stay exported.

## Risks / Trade-offs

- [SSR/client markup drift during extraction] → Add parity assertions for `aria-label`, `data-expanded`, `aria-hidden` and highlight markup; rerun Playwright diagnostics.
- [Registry future URL with dangerous scheme] → `safeHttpUrl()` returns `''` for anything other than `http:`/`https:`; the `—` placeholder is already covered by the UI.
- [Hidden consumer of an export] → Run `pnpm run check` after privatizing; grep consumers first.
- [Legacy script remains duplicated] → Explicitly out of scope; document in tasks.

## Migration Plan

Land after `fix-label-year-filter` so the shared renderer consumes corrected mix filtering. Rollback is a single commit revert; no persisted state or generated data changes.
