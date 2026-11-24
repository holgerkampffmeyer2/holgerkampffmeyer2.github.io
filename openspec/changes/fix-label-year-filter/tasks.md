# Tasks

## 1. Suchmodell erweitern

- [ ] 1.1 Add `created_time` to `SearchableMix` in `src/utils/label-search.ts` and verify `pnpm run check` passes.
- [ ] 1.2 Add a non-exported `getYearTokens()` helper that recognizes four-digit `19xx`/`20xx` tokens and verify it through unit tests against `filterMixesForSearch()`.

## 2. Filterpfade absichern

- [ ] 2.1 Apply the year guard to the label-name early return in `filterMixesForSearch()` and verify a year-only query returns only mixes from that year.
- [ ] 2.2 Apply the same year guard to the text-match filter and verify a year+text query returns only mixes that satisfy both signals.
- [ ] 2.3 Cover multiple year tokens with `some` semantics and an unknown year with an empty result, and verify the tests pass.

## 3. Regression und Integration

- [ ] 3.1 Add the year scenarios from `specs/dj/label-overview/spec.md` to `tests/label-overview.test.ts` and verify `pnpm test:run` passes.
- [ ] 3.2 Run `pnpm run lint && pnpm run check && pnpm run build && pnpm run build:seo && pnpm test:run && node scripts/smoke-dist.mjs` and verify all steps are green.

## Workflow follow-up

- Archive the change after review; no migration or generated-data update is required.
