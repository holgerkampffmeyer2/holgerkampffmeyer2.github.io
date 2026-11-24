# Design

## Context

The new label overview and detail routes are implemented and specified, but project docs still describe an older site shape and older build commands. `openspec/specs/dj/label-overview/spec.md` is current and is the behavioral source of truth. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- Make the two label routes, their query-state behavior and their noindex rules discoverable from the docs a maintainer actually reads.
- Align build-command descriptions with `package.json`.
- Keep one canonical behavior spec instead of duplicating it across five documents.

**Non-Goals:**

- No source-code changes and no spec delta.
- No rewriting of archived OpenSpec change artifacts; they remain historical records.
- No new documentation file.

## Decisions

- **Update in place.** Add the routes to README.md, AGENTS.md, DESIGN.md, music-blog-script.md and build.md instead of creating a separate label handbook. Alternative: new `docs/labels.md` — rejected because it would add another place to keep in sync.
- **Point to the spec for behavior.** Detailed scenario lists stay in `openspec/specs/dj/label-overview/spec.md`; docs summarize with a pointer. Alternative: copy scenarios into DESIGN.md — rejected because of drift.
- **Derive build text from scripts.** Build descriptions mention `generate-mix-og.mjs`, `fetch-social-stats.mjs`, `lastmod.mjs`, `og:mix` and `indexnow-submit` exactly as wired in `package.json`.
- **Document data flow once.** `labels.json` → registry utilities → overview/detail pages, MixDetail chips, `MIN_LABEL_TRACKS`, `build:seo`, sitemap and `urllist.txt` are described together in the label-pflegen workflow section.

## Risks / Trade-offs

- [Docs drift again] → Explicit pointer to the canonical spec and exact script names.
- [Pure Markdown change skips build verification] → Per AGENTS.md this is expected; verify with diff review only.
- [Archive wording differs from shipped UI] → Leave archive untouched; document actual `Record Labels` behavior in current docs.

## Migration Plan

None. Merge as a docs-only change; no deployment side effects beyond published documentation.
