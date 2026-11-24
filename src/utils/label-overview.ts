import type { BlogPostData } from '../types/blog';
import { labelSlug } from './label-slug.js';
import { buildTrackLabels } from './track-labels.js';
import { splitTrack, type TrackLabelResolver } from './mix-track-data.js';
import { buildMixBreadcrumbLabel } from './mix-seo.js';
import { normalizeSearchText } from './label-search.js';

export interface LabelRegistryData {
  labels: Record<string, { name: string; url?: string }>;
  tracks: Record<string, string>;
}

export interface LabelTrack {
  artist: string;
  title: string;
}

export interface LabelMix {
  slug: string;
  title: string;
  displayLabel: string;
  created_time: string;
  tracks: LabelTrack[];
}

export interface LabelSearchFields {
  name: string;
  mixText: string;
  trackText: string;
  years: string[];
}

export interface LabelEntry {
  id: string;
  name: string;
  url: string;
  slug: string;
  mixes: LabelMix[];
  trackCount: number;
  mixCount: number;
  latestDate: string;
  isIndexable: boolean;
  searchText: string;
  search: LabelSearchFields;
}

export interface LabelOverviewOptions {
  isLabelIndexable?: (name: string) => boolean;
}

export function buildLabelEntries(
  registry: LabelRegistryData,
  posts: BlogPostData[],
  options: LabelOverviewOptions = {}
): LabelEntry[] {
  const labelDefs = registry.labels ?? {};
  const resolver = buildTrackLabels(registry) as TrackLabelResolver;
  const isLabelIndexable = options.isLabelIndexable ?? (() => false);
  const byId = new Map<string, LabelEntry>();

  for (const [id, def] of Object.entries(labelDefs)) {
    byId.set(id, {
      id,
      name: def.name,
      url: def.url || '',
      slug: labelSlug(def.name),
      mixes: [],
      trackCount: 0,
      mixCount: 0,
      latestDate: '',
      isIndexable: false,
      searchText: '',
      search: { name: def.name, mixText: '', trackText: '', years: [] },
    });
  }

  for (const post of posts) {
    if (!post.hasTracklist) continue;

    for (const track of post.tracklist || []) {
      const label = resolver.get(track);
      if (!label?.id || !byId.has(label.id)) continue;

      const entry = byId.get(label.id)!;
      const { artist, title } = splitTrack(track);
      let mix = entry.mixes.find((item) => item.slug === post.slug);

      if (!mix) {
        mix = {
          slug: post.slug,
          title: post.title,
          displayLabel: buildMixBreadcrumbLabel(post),
          created_time: post.created_time,
          tracks: [],
        };
        entry.mixes.push(mix);
      }

      mix.tracks.push({ artist, title });
      entry.trackCount += 1;
    }
  }

  return Array.from(byId.values())
    .map((entry) => {
      entry.mixes.sort((a, b) => b.created_time.localeCompare(a.created_time));
      entry.mixCount = entry.mixes.length;
      entry.latestDate = entry.mixes[0]?.created_time || '';
      entry.isIndexable = isLabelIndexable(entry.name);

      const mixText = entry.mixes.map((mix) => `${mix.title} ${mix.displayLabel}`).join(' ');
      const trackText = entry.mixes
        .flatMap((mix) => mix.tracks.map((track) => `${track.artist} ${track.title}`))
        .join(' ');
      const years = Array.from(
        new Set(entry.mixes.map((mix) => mix.created_time.slice(0, 4)).filter(Boolean))
      );

      entry.search = { name: entry.name, mixText, trackText, years };
      entry.searchText = normalizeSearchText(
        [entry.name, mixText, trackText, years.join(' ')].join(' ')
      );
      return entry;
    })
    .sort((a, b) => b.trackCount - a.trackCount || a.name.localeCompare(b.name, 'de'));
}
