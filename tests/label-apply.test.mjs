import { describe, it, expect } from 'vitest';

import {
  slugify,
  findLabelId,
  uniqueId,
  applyUrlSuggestions,
  urlSuggestionsFromArtifact,
} from '../scripts/lib/label-apply.mjs';

function makeRegistry() {
  return {
    labels: {
      'defected': { name: 'Defected', url: 'https://defected.com' },
      'toolroom': { name: 'Toolroom', url: '' },
      tillam: { name: 'TILL:AM Records', url: '' },
    },
    tracks: {
      'Basement Jaxx - Fly Life': 'defected',
      'Some Artist - Track': 'toolroom',
    },
  };
}

describe('slugify', () => {
  it('lowercases and joins non-alphanumerics with dashes', () => {
    expect(slugify('Defected Records')).toBe('defected-records');
    expect(slugify('TILL:AM Records')).toBe('till-am-records');
  });

  it('strips diacritics via NFKD', () => {
    expect(slugify('Ölwerke Records')).toBe('olwerke-records');
    expect(slugify('Café Bahnhof')).toBe('cafe-bahnhof');
  });

  it('never returns an empty slug', () => {
    expect(slugify('!!!')).toBe('label');
    expect(slugify('')).toBe('label');
  });
});

describe('findLabelId', () => {
  it('matches case-insensitively with trimmed names', () => {
    expect(findLabelId(makeRegistry().labels, '  defected ')).toBe('defected');
    expect(findLabelId(makeRegistry().labels, '  till:am RECORDS ')).toBe('tillam');
  });

  it('returns null for unknown labels', () => {
    expect(findLabelId(makeRegistry().labels, 'Unknown Label')).toBeNull();
  });
});

describe('uniqueId', () => {
  it('returns the base if free', () => {
    expect(uniqueId(makeRegistry().labels, 'new-label')).toBe('new-label');
  });

  it('appends a numeric suffix on collision', () => {
    const labels = { toolroom: {}, 'toolroom-2': {} };
    expect(uniqueId(labels, 'toolroom')).toBe('toolroom-3');
  });
});

describe('urlSuggestionsFromArtifact', () => {
  it('reads the label-urls format (suggestions)', () => {
    const suggestions = [{ name: 'Toolroom', url: 'https://toolroom.com' }];
    expect(urlSuggestionsFromArtifact({ suggestions })).toEqual(suggestions);
  });

  it('reads the finder format (proposals)', () => {
    const proposals = [{ name: 'Toolroom', url: 'https://toolroom.com' }];
    expect(urlSuggestionsFromArtifact({ proposals })).toEqual(proposals);
  });

  it('prefers suggestions over proposals and falls back to an empty list', () => {
    expect(urlSuggestionsFromArtifact({ suggestions: [1], proposals: [2] })).toEqual([1]);
    expect(urlSuggestionsFromArtifact({})).toEqual([]);
    expect(urlSuggestionsFromArtifact(null)).toEqual([]);
  });
});

describe('applyUrlSuggestions', () => {
  it('merges urls by normalized name without touching tracks', () => {
    const registry = makeRegistry();
    const tracksBefore = JSON.parse(JSON.stringify(registry.tracks));

    const stats = applyUrlSuggestions(registry, [
      { name: 'till:am records', url: 'https://tillam.example' },
      { name: 'Toolroom', url: 'https://toolroomrecords.example' },
    ]);

    expect(registry.labels.tillam.url).toBe('https://tillam.example');
    expect(registry.labels.toolroom.url).toBe('https://toolroomrecords.example');
    expect(stats).toEqual({ proposals: 2, updated: 2, skipped: 0 });
    expect(registry.tracks).toEqual(tracksBefore);
  });

  it('keeps existing urls unless overwrite is set', () => {
    const registry = makeRegistry();
    const suggestion = [{ name: 'Defected', url: 'https://new-defected.example' }];

    const stats = applyUrlSuggestions(registry, suggestion);
    expect(registry.labels.defected.url).toBe('https://defected.com');
    expect(stats).toEqual({ proposals: 1, updated: 0, skipped: 1 });

    const forced = applyUrlSuggestions(registry, suggestion, { overwrite: true });
    expect(registry.labels.defected.url).toBe('https://new-defected.example');
    expect(forced).toEqual({ proposals: 1, updated: 1, skipped: 0 });
  });

  it('ignores suggestions without a url and unknown labels', () => {
    const registry = makeRegistry();
    const stats = applyUrlSuggestions(registry, [
      { name: 'Toolroom', url: null },
      { name: 'No Such Label', url: 'https://nowhere.example' },
    ]);

    expect(registry.labels.toolroom.url).toBe('');
    expect(stats).toEqual({ proposals: 2, updated: 0, skipped: 0 });
  });
});
