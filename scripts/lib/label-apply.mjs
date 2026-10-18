import { labelMatchKey } from './label-search.mjs';

export function slugify(name) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'label';
}

export function findLabelId(labels, name) {
  const target = name.trim().toLowerCase();
  for (const [id, def] of Object.entries(labels)) {
    if ((def?.name ?? '').trim().toLowerCase() === target) return id;
  }
  return null;
}

export function uniqueId(labels, base) {
  let id = base;
  let suffix = 2;
  while (labels[id]) id = `${base}-${suffix++}`;
  return id;
}

export function urlSuggestionsFromArtifact(artifact) {
  return artifact?.suggestions ?? artifact?.proposals ?? [];
}

export function applyUrlSuggestions(registry, suggestions, options = {}) {
  const byName = new Map(suggestions.map(suggestion => [labelMatchKey(suggestion.name), suggestion]));

  let updated = 0;
  let skipped = 0;
  for (const [id, def] of Object.entries(registry.labels ?? {})) {
    const label = byName.get(labelMatchKey(def?.name ?? ''));
    if (!label?.url) continue;
    if (def?.url && !options.overwrite) {
      skipped++;
      continue;
    }
    registry.labels[id].url = label.url;
    updated++;
  }

  return { proposals: suggestions.length, updated, skipped };
}
