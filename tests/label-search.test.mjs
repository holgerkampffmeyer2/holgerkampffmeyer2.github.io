import { describe, it, expect } from 'vitest';
import {
  labelCacheKey,
  labelMatchKey,
  buildLabelQuery,
  parseLabelSearch,
  findBestLabel,
  extractLabelUrl,
} from '../scripts/lib/label-search.mjs';

describe('labelCacheKey', () => {
  it('generates consistent cache key with prefix', () => {
    expect(labelCacheKey('Toolroom Records')).toBe('mb-label:toolroom records');
    expect(labelCacheKey('  Defected Records  ')).toBe('mb-label:defected records');
  });

  it('handles empty and null input', () => {
    expect(labelCacheKey('')).toBe('mb-label:');
    expect(labelCacheKey(null)).toBe('mb-label:');
    expect(labelCacheKey(undefined)).toBe('mb-label:');
  });
});

describe('labelMatchKey', () => {
  it('normalizes label names for comparison', () => {
    expect(labelMatchKey('Toolroom Records')).toBe('toolroomrecords');
    expect(labelMatchKey('toolroom-records')).toBe('toolroomrecords');
    expect(labelMatchKey('Toolroom_Records')).toBe('toolroomrecords');
  });

  it('removes diacritics', () => {
    expect(labelMatchKey('Café del Mar')).toBe('cafedelmar');
    expect(labelMatchKey('Sónar Records')).toBe('sonarrecords');
  });

  it('handles empty input', () => {
    expect(labelMatchKey('')).toBe('');
    expect(labelMatchKey(null)).toBe('');
  });

  it('removes non-alphanumeric characters', () => {
    expect(labelMatchKey('Label & Co.')).toBe('labelco');
    expect(labelMatchKey('Label/Name')).toBe('labelname');
  });
});

describe('buildLabelQuery', () => {
  it('builds Lucene query for label search', () => {
    expect(buildLabelQuery('Toolroom Records')).toBe('label:"Toolroom Records"');
  });

  it('escapes special characters', () => {
    expect(buildLabelQuery('Label "Quote"')).toBe('label:"Label \\"Quote\\""');
    expect(buildLabelQuery('Label\\Backslash')).toBe('label:"Label\\\\Backslash"');
  });

  it('returns empty string for empty input', () => {
    expect(buildLabelQuery('')).toBe('');
    expect(buildLabelQuery(null)).toBe('');
  });

  it('trims whitespace', () => {
    expect(buildLabelQuery('  Toolroom  ')).toBe('label:"Toolroom"');
  });
});

describe('parseLabelSearch', () => {
  it('parses label search results', () => {
    const data = {
      labels: [
        { id: '123', name: 'Toolroom Records', score: 95 },
        { id: '456', name: 'Defected Records', score: 88 }
      ]
    };
    const result = parseLabelSearch(data);
    expect(result).toEqual([
      { id: '123', name: 'Toolroom Records', score: 95 },
      { id: '456', name: 'Defected Records', score: 88 }
    ]);
  });

  it('filters out invalid entries', () => {
    const data = {
      labels: [
        { id: '123', name: 'Valid Label', score: 90 },
        { id: '', name: 'No ID' },
        { name: 'No ID either' },
        { id: '456' }
      ]
    };
    const result = parseLabelSearch(data);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Valid Label');
  });

  it('handles empty or missing labels array', () => {
    expect(parseLabelSearch({})).toEqual([]);
    expect(parseLabelSearch({ labels: [] })).toEqual([]);
    expect(parseLabelSearch(null)).toEqual([]);
  });
});

describe('findBestLabel', () => {
  const candidates = [
    { id: '1', name: 'Toolroom Records', score: 90 },
    { id: '2', name: 'Toolroom Trax', score: 85 },
    { id: '3', name: 'Defected Records', score: 95 }
  ];

  it('returns exact match after normalization', () => {
    const result = findBestLabel(candidates, 'Toolroom Records');
    expect(result).toEqual({ id: '1', name: 'Toolroom Records', score: 90 });
  });

  it('ignores case and punctuation in match', () => {
    const result = findBestLabel(candidates, 'toolroom records');
    expect(result).toEqual({ id: '1', name: 'Toolroom Records', score: 90 });
  });

  it('picks highest score among exact matches', () => {
    const multiExact = [
      { id: '1', name: 'Toolroom', score: 80 },
      { id: '2', name: 'Toolroom', score: 95 }
    ];
    const result = findBestLabel(multiExact, 'Toolroom');
    expect(result.score).toBe(95);
  });

  it('returns null when no exact match', () => {
    const result = findBestLabel(candidates, 'NonExistent Label');
    expect(result).toBeNull();
  });

  it('handles empty candidates', () => {
    expect(findBestLabel([], 'Toolroom')).toBeNull();
  });

  it('handles empty target name', () => {
    expect(findBestLabel(candidates, '')).toBeNull();
  });
});

describe('extractLabelUrl', () => {
  it('extracts URL by priority order', () => {
    const data = {
      relations: [
        { url: { resource: 'https://soundcloud.com/label' }, type: 'soundcloud' },
        { url: { resource: 'https://label.com' }, type: 'official homepage' },
        { url: { resource: 'https://bandcamp.com/label' }, type: 'bandcamp' }
      ]
    };
    const result = extractLabelUrl(data);
    expect(result).toEqual({
      url: 'https://label.com',
      via: 'official homepage'
    });
  });

  it('falls back to next priority when preferred missing', () => {
    const data = {
      relations: [
        { url: { resource: 'https://discogs.com/label' }, type: 'discogs' },
        { url: { resource: 'https://bandcamp.com/label' }, type: 'bandcamp' }
      ]
    };
    const result = extractLabelUrl(data);
    expect(result).toEqual({
      url: 'https://discogs.com/label',
      via: 'discogs'
    });
  });

  it('returns first candidate when no priority match', () => {
    const data = {
      relations: [
        { url: { resource: 'https://example.com/label' }, type: 'unknown' }
      ]
    };
    const result = extractLabelUrl(data);
    expect(result).toEqual({
      url: 'https://example.com/label',
      via: 'unknown'
    });
  });

  it('filters out non-HTTP URLs', () => {
    const data = {
      relations: [
        { url: { resource: 'mailto:label@example.com' }, type: 'email' },
        { url: { resource: 'https://valid.com' }, type: 'official homepage' }
      ]
    };
    const result = extractLabelUrl(data);
    expect(result.url).toBe('https://valid.com');
  });

  it('returns null for empty relations', () => {
    expect(extractLabelUrl({})).toBeNull();
    expect(extractLabelUrl({ relations: [] })).toBeNull();
    expect(extractLabelUrl(null)).toBeNull();
  });
});