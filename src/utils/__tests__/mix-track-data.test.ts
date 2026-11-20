import { describe, it, expect } from 'vitest';
import type { BlogPostData } from '../../types/blog';
import {
  buildStructuredTracks,
  countTopLabels,
  getCandidates,
  splitTrack,
  type TrackLabelResolver,
} from '../mix-track-data';

const resolver: TrackLabelResolver = {
  get(track) {
    if (track === 'Artist A - Track One') {
      return { id: 'label-a', name: 'Label A', url: 'https://example.com' };
    }
    if (track === 'Artist B - Track Two') {
      return { id: 'label-b', name: 'Label B', url: null };
    }
    return null;
  },
  hasAny(tracks) {
    return tracks.some((track) => this.get(track) !== null);
  },
};

const post = {
  slug: 'mix-1',
  tracklist: ['Artist A - Track One', 'Artist B - Track Two', 'Artist C - Track Three'],
} as BlogPostData;

describe('splitTrack', () => {
  it('splits artist and title and removes trailing commas', () => {
    expect(splitTrack('Artist A, - Track One,')).toEqual({ artist: 'Artist A', title: 'Track One' });
  });

  it('keeps additional separators in the title', () => {
    expect(splitTrack('Artist - Part One - Part Two')).toEqual({
      artist: 'Artist',
      title: 'Part One - Part Two',
    });
  });
});

describe('buildStructuredTracks', () => {
  it('adds positions and resolved labels', () => {
    expect(buildStructuredTracks(post.tracklist, resolver)).toEqual([
      {
        position: 1,
        artist: 'Artist A',
        title: 'Track One',
        label: { name: 'Label A', url: 'https://example.com' },
      },
      {
        position: 2,
        artist: 'Artist B',
        title: 'Track Two',
        label: { name: 'Label B', url: null },
      },
      { position: 3, artist: 'Artist C', title: 'Track Three', label: null },
    ]);
  });
});

describe('countTopLabels', () => {
  it('sorts by frequency and applies the limit', () => {
    const tracks = [
      'Artist A - Track One',
      'Artist B - Track Two',
      'Artist A - Track One',
    ];
    expect(countTopLabels(tracks, resolver, 1)).toEqual([
      { name: 'Label A', url: 'https://example.com', count: 2 },
    ]);
  });
});

describe('getCandidates', () => {
  it('pairs posts with their label statistics', () => {
    expect(getCandidates([post], resolver)[0].labels).toHaveLength(2);
  });
});
