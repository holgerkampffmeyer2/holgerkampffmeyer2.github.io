import type { BlogPostData } from '../types/blog';
import type { buildTrackLabels } from './track-labels.js';

export interface TrackLabelInfo {
  name: string;
  url: string | null;
}

export type TrackLabelResolver = ReturnType<typeof buildTrackLabels>;

export interface StructuredTrack {
  position: number;
  artist: string;
  title: string;
  label: TrackLabelInfo | null;
}

export interface LabelCount extends TrackLabelInfo {
  count: number;
}

export function splitTrack(track: string): { artist: string; title: string } {
  const parts = track.split(' - ');
  const artist = parts[0]?.replace(/,$/, '') || '';
  const title = parts.slice(1).join(' - ').replace(/,$/, '') || track;
  return { artist, title };
}

export function buildStructuredTracks(
  tracks: string[],
  trackLabels: TrackLabelResolver
): StructuredTrack[] {
  return (tracks || []).map((track, index) => {
    const label = trackLabels.get(track);
    const { artist, title } = splitTrack(track);
    return {
      position: index + 1,
      artist,
      title,
      label: label ? { name: label.name, url: label.url } : null,
    };
  });
}

export function countTopLabels(
  tracks: string[],
  trackLabels: TrackLabelResolver,
  limit = Number.POSITIVE_INFINITY
): LabelCount[] {
  const counts = new Map<string, LabelCount>();

  for (const track of tracks || []) {
    const label = trackLabels.get(track);
    if (!label) continue;
    const current = counts.get(label.name) || { name: label.name, url: label.url, count: 0 };
    current.count += 1;
    counts.set(label.name, current);
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getCandidates(posts: BlogPostData[], trackLabels: TrackLabelResolver) {
  return posts.map((post) => ({
    post,
    labels: countTopLabels(post.tracklist || [], trackLabels),
  }));
}
