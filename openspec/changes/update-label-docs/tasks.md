# Tasks

## 1. README und AGENTS

- [ ] 1.1 Add `/dj/labels` and `/dj/labels/<slug>` plus their schema types to the README structured-data section and verify both routes are listed.
- [ ] 1.2 Add label-overview and label-detail bullets to `AGENTS.md` "Bereichsspezifische Hinweise" and verify the wording matches `Record Labels` in the implementation.
- [ ] 1.3 Extend the label workflow section with automatic overview/detail regeneration, `build:seo`, `MIN_LABEL_TRACKS` and the build-command corrections from `package.json`, and verify the listed commands exist.

## 2. Design- und Build-Doku

- [ ] 2.1 Add `labels/index.astro` to the `docs/DESIGN.md` tree, align `[slug]`/`[label]` with the implementation, and verify the note about labels without mixes is present.
- [ ] 2.2 Expand the route table with sorting, 25/50 pagination, `minTracks=3`, URL query state and accordion behavior, and verify a pointer to `openspec/specs/dj/label-overview/spec.md` exists.
- [ ] 2.3 Correct build descriptions in `docs/DESIGN.md` and `docs/build.md` to include `generate-mix-og.mjs`, `fetch-social-stats.mjs`, `lastmod.mjs`, `og:mix` and `indexnow-submit`, and verify every named script exists in `package.json`.
- [ ] 2.4 Document thin-label exclusion from sitemap/`urllist.txt` and lastmod for dynamic label routes, and verify the statements match `astro.config.mjs` and `scripts/generate-urllist.mjs`.

## 3. Music-Blog-Workflow

- [ ] 3.1 Add the label pages to both structure lists in `docs/music-blog-script.md` and verify `/dj/labels` and `/dj/labels/<slug>` appear in both places.
- [ ] 3.2 Document the MixDetail label chips and the effect of `labels.json` on overview/detail pages in the "Record-Labels pflegen" section, and verify the section mentions all consumers.
- [ ] 3.3 Update the post-apply step with `build:seo`, the three-track threshold and label troubleshooting, and verify cross-links use `Record Labels`.

## 4. Review

- [ ] 4.1 Review the full Markdown diff and verify no stale `Labels` navigation wording or outdated build description remains.

## Workflow follow-up

- This is a docs-only change; per `AGENTS.md` no lint/check/build is required. Keep archived OpenSpec artifacts untouched as historical records.
