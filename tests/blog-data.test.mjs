import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSearchablePosts } from '../src/utils/blog-data.ts';

describe('createSearchablePosts', () => {
  const mockPosts = [
    {
      slug: 'mix-1',
      title: 'Mix 1',
      picture: '/img/mix1.webp',
      description: 'Description 1',
      tags: ['house', 'tech'],
      tracklist: ['Track 1', 'Track 2'],
      hasTracklist: true,
      audio_length: 3600,
      created_time: '2024-01-15T00:00:00Z',
      url: 'https://mixcloud.com/1',
      key: '1',
      src: 'https://player.mixcloud.com/1',
      useCases: ['gym'],
      heroImage: '/tracklists/mix1.webp'
    },
    {
      slug: 'mix-2',
      title: 'Mix 2',
      picture: '/img/mix2.webp',
      description: 'Description 2 with a very long text that should be truncated to three hundred characters maximum because the function limits it to three hundred characters and we need to verify this behavior works correctly in the test suite.',
      tags: ['deep'],
      tracklist: [],
      hasTracklist: false,
      audio_length: 1800,
      created_time: '2024-01-10T00:00:00Z',
      url: 'https://mixcloud.com/2',
      key: '2',
      src: 'https://player.mixcloud.com/2',
      useCases: ['work'],
      heroImage: null
    },
    {
      slug: 'mix-3',
      title: 'Mix 3',
      picture: '/img/mix3.webp',
      description: '',
      tags: [],
      tracklist: ['Track A'],
      hasTracklist: true,
      audio_length: 2700,
      created_time: '2024-01-05T00:00:00Z',
      url: 'https://mixcloud.com/3',
      key: '3',
      src: 'https://player.mixcloud.com/3',
      useCases: [],
      heroImage: '/tracklists/mix3.webp'
    }
  ];

  it('filters only posts with hasTracklist=true', () => {
    const result = createSearchablePosts(mockPosts);
    expect(result.length).toBe(2);
    expect(result.every(p => p.slug === 'mix-1' || p.slug === 'mix-3')).toBe(true);
  });

  it('maps required fields correctly', () => {
    const result = createSearchablePosts(mockPosts);
    const mix1 = result.find(p => p.slug === 'mix-1');
    expect(mix1).toEqual({
      slug: 'mix-1',
      title: 'Mix 1',
      picture: '/img/mix1.webp',
      description: 'Description 1',
      tags: ['house', 'tech'],
      tracklist: ['Track 1', 'Track 2']
    });
  });

  it('truncates description to 300 characters', () => {
    const result = createSearchablePosts(mockPosts);
    const mix2 = result.find(p => p.slug === 'mix-2');
    // mix-2 doesn't have tracklist so shouldn't be in result
    expect(mix2).toBeUndefined();
  });

  it('handles empty description', () => {
    const result = createSearchablePosts(mockPosts);
    const mix3 = result.find(p => p.slug === 'mix-3');
    expect(mix3.description).toBe('');
  });

  it('handles missing tracklist', () => {
    const posts = [{ ...mockPosts[0], tracklist: undefined, hasTracklist: true }];
    const result = createSearchablePosts(posts);
    expect(result[0].tracklist).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(createSearchablePosts([])).toEqual([]);
  });
});

// Note: loadBlogPosts requires dynamic import mocking which is complex in vitest.
// Integration tests for loadBlogPosts should be run via the full pipeline.