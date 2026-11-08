import { describe, it, expect } from 'vitest';
import type { BlogPostData } from '../../types/blog';
import {
  buildBlogPostingSchema,
  buildAudioObjectSchema,
  buildMusicPlaylistSchema,
  buildBreadcrumbSchema,
  buildLabelEntities,
  buildTracklistItemList,
} from '../schema-builders';

const mockPost: BlogPostData = {
  slug: 'mix-123',
  title: 'Test Mix 123',
  key: 'test-key',
  url: 'https://www.mixcloud.com/test/mix-123/',
  created_time: '2024-01-15T12:00:00Z',
  src: 'https://www.mixcloud.com/widget/iframe/?feed=%2Ftest%2Fmix-123%2F',
  description: 'A test mix description',
  picture: '/img/test.jpg',
  audio_length: 3660,
  tags: ['House', 'Tech House'],
  useCases: ['gym', 'drive'],
  tracklist: [
    'Artist One - Track One',
    'Artist Two - Track Two',
  ],
  hasTracklist: true,
};

const mockStructuredTracks = [
  { position: 1, artist: 'Artist One', title: 'Track One', label: { name: 'Toolroom', url: 'https://toolroom.com' } },
  { position: 2, artist: 'Artist Two', title: 'Track Two', label: { name: 'Defected', url: 'https://defected.com' } },
  { position: 3, artist: 'Artist Three', title: 'Track Three', label: null },
];

type SchemaObject = Record<string, unknown>;

describe('buildBlogPostingSchema', () => {
  it('returns valid BlogPosting schema with all required fields', () => {
    const schema = buildBlogPostingSchema(mockPost) as SchemaObject;

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.headline).toBe('Test Mix 123');
    expect(schema.description).toBe('A test mix description');
    expect(schema.image).toBe('/img/test.jpg');
    expect(schema.datePublished).toBe('2024-01-15T12:00:00Z');
    expect((schema.author as SchemaObject)['@type']).toBe('Person');
    expect((schema.author as SchemaObject).name).toBe('DJ Hulk');
    expect((schema.publisher as SchemaObject).name).toBe('DJ Hulk');
    expect((schema.mainEntityOfPage as SchemaObject)['@id']).toContain('/dj/mixes/mix-123');
  });

  it('uses custom baseUrl when provided', () => {
    const schema = buildBlogPostingSchema(mockPost, { baseUrl: 'https://example.com' }) as SchemaObject;
    expect((schema.mainEntityOfPage as SchemaObject)['@id']).toBe('https://example.com/dj/mixes/mix-123');
  });

  it('uses custom author when provided', () => {
    const schema = buildBlogPostingSchema(mockPost, { authorName: 'Custom DJ', authorUrl: 'https://custom.com' }) as SchemaObject;
    expect((schema.author as SchemaObject).name).toBe('Custom DJ');
    expect((schema.author as SchemaObject).url).toBe('https://custom.com');
  });
});

describe('buildAudioObjectSchema', () => {
  it('returns valid AudioObject schema with track items', () => {
    const schema = buildAudioObjectSchema(mockPost, mockStructuredTracks) as SchemaObject;

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('AudioObject');
    expect(schema.name).toBe('Test Mix 123');
    expect(schema.contentUrl).toBe('https://www.mixcloud.com/test/mix-123/');
    expect(schema.embedUrl).toBe('https://www.mixcloud.com/widget/iframe/?feed=%2Ftest%2Fmix-123%2F');
    expect(schema.duration).toBe('PT60M60S');
    expect(schema.genre).toEqual(['House', 'Tech House']);
    expect((schema.associatedMedia as SchemaObject)['@type']).toBe('MusicAlbum');
    expect((schema.associatedMedia as SchemaObject).track).toHaveLength(3);
  });

  it('includes label recordedBy references for tracks with labels', () => {
    const schema = buildAudioObjectSchema(mockPost, mockStructuredTracks) as SchemaObject;
    const tracks = (schema.associatedMedia as SchemaObject).track as SchemaObject[];

    expect((tracks[0].recordedBy as SchemaObject)['@id']).toContain('/dj/labels/toolroom');
    expect((tracks[1].recordedBy as SchemaObject)['@id']).toContain('/dj/labels/defected');
    expect(tracks[2].recordedBy).toBeUndefined();
  });

  it('includes @graph with label entities when labels exist', () => {
    const schema = buildAudioObjectSchema(mockPost, mockStructuredTracks) as SchemaObject;
    expect(schema['@graph']).toBeDefined();
    expect(Array.isArray(schema['@graph'])).toBe(true);
    expect((schema['@graph'] as unknown[]).length).toBe(2);
  });

  it('excludes @graph when no labels exist', () => {
    const tracksWithoutLabels = mockStructuredTracks.map((t) => ({ ...t, label: null }));
    const schema = buildAudioObjectSchema(mockPost, tracksWithoutLabels) as SchemaObject;
    expect(schema['@graph']).toBeUndefined();
  });
});

describe('buildMusicPlaylistSchema', () => {
  it('returns valid MusicPlaylist schema', () => {
    const posts = [mockPost, { ...mockPost, slug: 'mix-124', title: 'Test Mix 124' }];
    const schema = buildMusicPlaylistSchema(posts) as SchemaObject;

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('MusicPlaylist');
    expect(schema.name).toBe('DJ Hulk Weekly Mixes');
    expect(schema.numTracks).toBe(2);
    expect(schema.genre).toEqual(['House', 'Tech House', 'Deep House', 'Latin House']);
  });
});

describe('buildBreadcrumbSchema', () => {
  it('returns valid BreadcrumbList with correct positions', () => {
    const segments = [
      { label: 'Home', href: '/' },
      { label: 'DJ Hulk', href: '/djhulk-electronic-music/' },
      { label: 'Weekly DJ Mixes', href: '/dj/mixes-weekly' },
    ];
    const schema = buildBreadcrumbSchema(segments) as SchemaObject;

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect((schema.itemListElement as SchemaObject[])).toHaveLength(3);
    expect((schema.itemListElement as SchemaObject[])[0].position).toBe(1);
    expect((schema.itemListElement as SchemaObject[])[0].name).toBe('Home');
    expect((schema.itemListElement as SchemaObject[])[0].item).toBe('https://holger-kampffmeyer.de/');
    expect((schema.itemListElement as SchemaObject[])[2].position).toBe(3);
    expect((schema.itemListElement as SchemaObject[])[2].item).toBe('https://holger-kampffmeyer.de/dj/mixes-weekly');
  });

  it('handles segments without href (current page)', () => {
    const segments = [
      { label: 'Home', href: '/' },
      { label: 'Current Page' },
    ];
    const schema = buildBreadcrumbSchema(segments) as SchemaObject;
    expect((schema.itemListElement as SchemaObject[])[1].item).toBeUndefined();
  });
});

describe('buildLabelEntities', () => {
  it('returns ItemList with unique label entities', () => {
    const schema = buildLabelEntities(mockStructuredTracks) as SchemaObject | null;

    expect(schema).not.toBeNull();
    expect(schema!['@type']).toBe('ItemList');
    expect(schema!.numberOfItems).toBe(2);
    expect((schema!.itemListElement as SchemaObject[])).toHaveLength(2);
    expect(((schema!.itemListElement as SchemaObject[])[0].item as SchemaObject).name).toBe('Toolroom');
    expect(((schema!.itemListElement as SchemaObject[])[1].item as SchemaObject).name).toBe('Defected');
  });

  it('returns null when no labels', () => {
    const tracksWithoutLabels = mockStructuredTracks.map((t) => ({ ...t, label: null }));
    const schema = buildLabelEntities(tracksWithoutLabels);
    expect(schema).toBeNull();
  });

  it('deduplicates labels by name', () => {
    const tracksWithDupes = [
      ...mockStructuredTracks,
      { position: 4, artist: 'Artist Four', title: 'Track Four', label: { name: 'Toolroom', url: 'https://toolroom.com' } },
    ];
    const schema = buildLabelEntities(tracksWithDupes) as SchemaObject | null;
    expect(schema!.numberOfItems).toBe(2);
  });
});

describe('buildTracklistItemList', () => {
  it('returns valid ItemList for tracklist', () => {
    const schema = buildTracklistItemList(mockPost, mockStructuredTracks) as SchemaObject;

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('ItemList');
    expect(schema.name).toBe('Tracklist for Test Mix 123');
    expect(schema.numberOfItems).toBe(3);
    expect((schema.itemListElement as SchemaObject[])).toHaveLength(3);
    expect((schema.itemListElement as SchemaObject[])[0].position).toBe(1);
    expect(((schema.itemListElement as SchemaObject[])[0].item as SchemaObject).name).toBe('Track One');
    expect((((schema.itemListElement as SchemaObject[])[0].item as SchemaObject).byArtist as SchemaObject).name).toBe('Artist One');
  });
});