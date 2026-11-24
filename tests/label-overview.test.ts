import { describe, it, expect } from 'vitest';
import type { BlogPostData } from '../src/types/blog';
import { buildLabelEntries, type LabelRegistryData } from '../src/utils/label-overview';
import {
  filterMixesForSearch,
  highlightSegments,
  matchesSearchText,
  scoreLabelMatch,
} from '../src/utils/label-search';
import {
  filterAndSortLabelEntries,
  paginateLabelEntries,
  parseLabelOverviewState,
  serializeLabelOverviewState,
} from '../src/utils/label-overview-state';
import { buildLabelCollectionSchema } from '../src/utils/schema-builders';
import { isIndexableLabel } from '../src/utils/label-indexability.mjs';
import labelsData from '../src/data/labels.json';
import blogData from '../src/data/blog-posts.json';

const registry: LabelRegistryData = {
  labels: {
    toolroom: { name: 'Toolroom Records', url: 'https://toolroomrecords.com' },
    defected: { name: 'Defected Records' },
    halogenix: { name: 'Halogenix' },
  },
  tracks: {
    'Artist A - Track One': 'toolroom',
    'Artist B - Track Two': 'toolroom',
    'Artist C - Track Three': 'toolroom',
    'Artist D - Track Four': 'defected',
    'Artist E - Track Five': 'defected',
  },
};

function makePost(slug: string, title: string, created_time: string, tracklist: string[]): BlogPostData {
  return {
    slug,
    title,
    key: slug,
    url: `https://www.mixcloud.com/djhulk/${slug}/`,
    created_time,
    src: '',
    description: '',
    picture: '',
    audio_length: 3600,
    tags: [],
    useCases: [],
    tracklist,
    hasTracklist: true,
  };
}

const posts = [
  makePost('mix-1', 'Mix 001', '2026-01-15T20:00:00Z', [
    'Artist A - Track One',
    'Artist B - Track Two',
    'Artist D - Track Four',
  ]),
  makePost('mix-2', 'Mix 002', '2025-08-02T20:00:00Z', [
    'Artist C - Track Three',
    'Artist E - Track Five',
  ]),
];

const entries = buildLabelEntries(registry, posts, {
  isLabelIndexable: (name) => name === 'Toolroom Records',
});

describe('buildLabelEntries', () => {
  it('includes every registry label even without mixes', () => {
    expect(entries).toHaveLength(3);
    const halogenix = entries.find((entry) => entry.id === 'halogenix');
    expect(halogenix?.trackCount).toBe(0);
    expect(halogenix?.mixCount).toBe(0);
    expect(halogenix?.isIndexable).toBe(false);
  });

  it('aggregates mixes, tracks, dates and track details', () => {
    const toolroom = entries.find((entry) => entry.id === 'toolroom')!;
    expect(toolroom.trackCount).toBe(3);
    expect(toolroom.mixCount).toBe(2);
    expect(toolroom.latestDate).toBe('2026-01-15T20:00:00Z');
    expect(toolroom.mixes[0].tracks[0]).toEqual({ artist: 'Artist A', title: 'Track One' });
    expect(toolroom.search.years).toEqual(['2026', '2025']);
    expect(toolroom.isIndexable).toBe(true);
  });
});

describe('label search', () => {
  it('finds labels, artists and years but rejects wrong years', () => {
    const toolroom = entries.find((entry) => entry.id === 'toolroom')!;
    expect(scoreLabelMatch(toolroom, 'toolrom')).toBeGreaterThan(0);
    expect(scoreLabelMatch(toolroom, 'Artist B')).toBeGreaterThan(0);
    expect(scoreLabelMatch(toolroom, '2026')).toBeGreaterThan(0);
    expect(scoreLabelMatch(toolroom, '2024')).toBe(0);
  });

  it('matches every word of a multi-word query', () => {
    const toolroom = entries.find((entry) => entry.id === 'toolroom')!;
    expect(scoreLabelMatch(toolroom, 'Toolroom   Records')).toBeGreaterThan(0);
    expect(scoreLabelMatch(toolroom, 'Toolroom Artist B')).toBeGreaterThan(0);
    expect(scoreLabelMatch(toolroom, 'Toolroom Qqqq')).toBe(0);
  });

  it('requires a real token match for multi-word queries', () => {
    const toolroom = entries.find((entry) => entry.id === 'toolroom')!;
    const defected = entries.find((entry) => entry.id === 'defected')!;
    expect(scoreLabelMatch(defected, 'Toolroom Records')).toBe(0);
    expect(scoreLabelMatch(toolroom, 'Toolroom Records')).toBeGreaterThan(0);
    expect(scoreLabelMatch(toolroom, 'Toolrom Records')).toBeGreaterThan(0);
  });

  it('matches text only when the query is present', () => {
    expect(matchesSearchText('Kirk Mannero – Open Up', 'Kirk Mannero')).toBe(true);
    expect(matchesSearchText('Defected Records', 'Kirk Mannero')).toBe(false);
    expect(matchesSearchText('Toolroom Records', '2026')).toBe(false);
  });

  it('filters mixes and tracks down to the matching rows', () => {
    const toolroom = entries.find((entry) => entry.id === 'toolroom')!;
    const filtered = filterMixesForSearch(toolroom.mixes, 'Artist B', toolroom.name);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].slug).toBe('mix-1');
    expect(filtered[0].tracks).toEqual([{ artist: 'Artist B', title: 'Track Two' }]);
  });

  it('keeps every mix when the label name itself matches', () => {
    const toolroom = entries.find((entry) => entry.id === 'toolroom')!;
    expect(filterMixesForSearch(toolroom.mixes, 'Toolroom Records', toolroom.name)).toHaveLength(2);
  });

  it('highlights matching words in result text', () => {
    expect(highlightSegments('Kirk Mannero – Open Up', 'Kirk Mannero')).toEqual([
      { text: 'Kirk', match: true },
      { text: ' ', match: false },
      { text: 'Mannero', match: true },
      { text: ' – Open Up', match: false },
    ]);
  });
});

describe('label overview state', () => {
  it('parses and serializes query parameters', () => {
    const state = parseLabelOverviewState(
      new URLSearchParams('q=Toolroom&sort=mixes&dir=asc&minTracks=3&page=2&perPage=50')
    );

    expect(state).toEqual({
      q: 'Toolroom',
      sort: 'mixes',
      dir: 'asc',
      minTracks: 3,
      page: 2,
      perPage: 50,
    });
    expect(serializeLabelOverviewState(state)).toBe(
      '?q=Toolroom&sort=mixes&dir=asc&minTracks=3&page=2&perPage=50'
    );
  });

  it('preserves internal spaces in the query', () => {
    const state = parseLabelOverviewState(new URLSearchParams('q=Toolroom+Records'));
    expect(state.q).toBe('Toolroom Records');
    expect(serializeLabelOverviewState(state)).toBe('?q=Toolroom+Records');
  });

  it('filters, sorts and clamps pagination', () => {
    const defaultState = parseLabelOverviewState({});
    const sorted = filterAndSortLabelEntries(entries, defaultState);
    expect(sorted[0].id).toBe('toolroom');

    const minimal = filterAndSortLabelEntries(entries, { ...defaultState, minTracks: 3 });
    expect(minimal.map((entry) => entry.id)).toEqual(['toolroom']);

    const result = paginateLabelEntries(entries, { ...defaultState, perPage: 2, page: 9 });
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(1);
  });
});

describe('registry integration', () => {
  const realEntries = buildLabelEntries(labelsData, blogData.posts as unknown as BlogPostData[], {
    isLabelIndexable: isIndexableLabel,
  });

  it('no longer registers Knowledge Magazine', () => {
    expect(Object.keys(labelsData.labels)).not.toContain('knowledge-magazine');
    expect(realEntries.some((entry) => entry.name === 'Knowledge Magazine')).toBe(false);
  });

  it('renders every registry label with stable indexability counts', () => {
    expect(realEntries).toHaveLength(Object.keys(labelsData.labels).length);
    expect(realEntries.filter((entry) => entry.mixCount > 0)).toHaveLength(277);
    expect(realEntries.filter((entry) => entry.isIndexable)).toHaveLength(60);
  });

  it('keeps rendered registry data in Unicode Normalization Form C', () => {
    const serialized = JSON.stringify(realEntries);
    expect(serialized.normalize('NFC')).toBe(serialized);
  });
});

describe('buildLabelCollectionSchema', () => {
  it('uses the configured base URL and links only indexable labels', () => {
    const segments = [
      { label: 'Home', href: '/' },
      { label: 'Record Labels' },
    ];
    const schema = buildLabelCollectionSchema(entries, segments, {
      baseUrl: 'https://example.test',
    }) as Record<string, unknown>[];

    const page = schema[0] as Record<string, unknown>;
    const breadcrumb = schema[1] as { itemListElement: Record<string, unknown>[] };
    const list = schema[2] as {
      numberOfItems: number;
      itemListElement: Record<string, unknown>[];
    };

    expect(page['@id']).toBe('https://example.test/dj/labels#webpage');
    expect(breadcrumb.itemListElement[0].item).toBe('https://example.test/');
    expect(list.numberOfItems).toBe(3);
    expect(list.itemListElement[0].url).toBe('https://example.test/dj/labels/toolroom-records');
    expect(list.itemListElement[1].url).toBeUndefined();
    expect(list.itemListElement[2]['@id']).toBeUndefined();
  });
});
