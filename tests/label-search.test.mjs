import { describe, it, expect, vi } from 'vitest';

import {
  labelMatchKey,
  buildLabelQuery,
  parseLabelSearch,
  findBestLabel,
  extractLabelUrl,
  lookupLabelUrl,
} from '../scripts/lib/label-search.mjs';

const LABEL_SEARCH_RESPONSE = {
  labels: [
    { id: 'mb-toolroom-trax', name: 'Toolroom Trax', score: 100 },
    { id: 'mb-toolroom', name: 'Toolroom', score: 89 },
  ],
};

const LABEL_RELS_RESPONSE = {
  relations: [
    { type: 'discogs', url: { resource: 'https://www.discogs.com/label/235768' } },
    { type: 'official homepage', url: { resource: 'https://www.toolroomrecords.com/' } },
    { type: 'soundcloud', url: { resource: 'https://soundcloud.com/toolroom' } },
  ],
};

describe('labelMatchKey', () => {
  it('normalizes case and non-alphanumerics', () => {
    expect(labelMatchKey('Like That Underground')).toBe('likethatunderground');
    expect(labelMatchKey('TILL:AM Records')).toBe('tillamrecords');
    expect(labelMatchKey('Non𝄞Stop')).toBe('nonstop');
  });
});

describe('buildLabelQuery', () => {
  it('builds a Lucene label query and escapes quotes', () => {
    expect(buildLabelQuery('Toolroom Trax')).toBe('label:"Toolroom Trax"');
    expect(buildLabelQuery('"Weird" Label')).toBe('label:"\\"Weird\\" Label"');
  });

  it('returns empty for blank input', () => {
    expect(buildLabelQuery('  ')).toBe('');
  });
});

describe('parseLabelSearch', () => {
  it('maps id, name and score', () => {
    expect(parseLabelSearch(LABEL_SEARCH_RESPONSE)).toEqual([
      { id: 'mb-toolroom-trax', name: 'Toolroom Trax', score: 100 },
      { id: 'mb-toolroom', name: 'Toolroom', score: 89 },
    ]);
  });

  it('skips entries without id or name', () => {
    expect(parseLabelSearch({ labels: [{ name: 'NoId' }, { id: 'x' }, {}] })).toEqual([]);
  });
});

describe('findBestLabel', () => {
  it('picks the exact normalized match with the highest score', () => {
    const best = findBestLabel(parseLabelSearch(LABEL_SEARCH_RESPONSE), 'Toolroom Trax');
    expect(best).toMatchObject({ id: 'mb-toolroom-trax', name: 'Toolroom Trax' });
  });

  it('returns null if no exact name matches (no guessing)', () => {
    const candidates = parseLabelSearch({ labels: [{ id: 'a', name: 'Something Else', score: 95 }] });
    expect(findBestLabel(candidates, 'Totally Different Label')).toBeNull();
  });
});

describe('extractLabelUrl', () => {
  it('prefers the official homepage over discogs/soundcloud', () => {
    expect(extractLabelUrl(LABEL_RELS_RESPONSE)).toEqual({
      url: 'https://www.toolroomrecords.com/',
      via: 'official homepage',
    });
  });

  it('falls back to the first http relation', () => {
    expect(extractLabelUrl({ relations: [{ type: 'coverage', url: { resource: 'https://x.de' } }] })).toEqual({
      url: 'https://x.de',
      via: 'coverage',
    });
  });

  it('returns null without relations', () => {
    expect(extractLabelUrl({})).toBeNull();
    expect(extractLabelUrl({ relations: [{ type: 'discogs', url: { resource: 'not-a-url' } }] })).toBeNull();
  });
});

describe('lookupLabelUrl', () => {
  function mockFetch() {
    return vi.fn(async url => {
      if (String(url).includes('/label?')) return { ok: true, json: async () => LABEL_SEARCH_RESPONSE };
      if (String(url).includes('/label/mb-toolroom-trax?')) return { ok: true, json: async () => LABEL_RELS_RESPONSE };
      return { ok: false, status: 404, json: async () => ({}) };
    });
  }

  it('resolves the label website via search + url-rels', async () => {
    const result = await lookupLabelUrl('Toolroom Trax', { fetchImpl: mockFetch() });
    expect(result).toMatchObject({
      name: 'Toolroom Trax',
      url: 'https://www.toolroomrecords.com/',
      source: 'musicbrainz',
      via: 'official homepage',
    });
  });

  it('does not guess a website for an unknown label', async () => {
    const fetchImpl = mockFetch();
    const result = await lookupLabelUrl('Gut Hast Du Uns Alle Gelassen', { fetchImpl });
    expect(result).toBeNull();
  });

  it('uses the cache and skips repeated network calls', async () => {
    const store = {};
    const cache = { get: key => store[key], set: (key, value) => { store[key] = value; } };
    const fetchImpl = mockFetch();
    await lookupLabelUrl('Toolroom Trax', { fetchImpl, cache });
    await lookupLabelUrl('Toolroom Trax', { fetchImpl, cache });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});