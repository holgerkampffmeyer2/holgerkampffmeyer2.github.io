import type { BlogPostData } from '../types/blog';
import { labelSlug } from './label-slug.js';
import type { StructuredTrack } from './mix-track-data';
import type { LabelIndexablePredicate } from '../../types/label-indexability.js';
import type { LabelEntry } from './label-overview.js';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface SchemaBuilderOptions {
  baseUrl?: string;
  authorName?: string;
  authorUrl?: string;
  description?: string;
  isLabelIndexable?: LabelIndexablePredicate;
}

function resolveUrl(path: string, baseUrl: string): string {
  return new URL(path, baseUrl).href;
}

export function buildBlogPostingSchema(
  post: BlogPostData,
  options: SchemaBuilderOptions = {}
): object {
  const { baseUrl = 'https://holger-kampffmeyer.de', authorName = 'DJ Hulk', authorUrl = 'https://holger-kampffmeyer.de/djhulk-electronic-music/', description } = options;
  const postUrl = resolveUrl(`/dj/mixes/${post.slug}`, baseUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.title,
    description: description || post.description?.substring(0, 500) || '',
    image: post.picture,
    datePublished: post.created_time,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };
}

export type TrackWithLabel = StructuredTrack;

export function buildAudioObjectSchema(
  post: BlogPostData,
  structuredTracks: TrackWithLabel[],
  options: SchemaBuilderOptions = {}
): object {
  const { baseUrl = 'https://holger-kampffmeyer.de', authorName = 'DJ Hulk', authorUrl = 'https://holger-kampffmeyer.de/djhulk-electronic-music/', isLabelIndexable = () => true } = options;

  const trackItems = structuredTracks.map((t) => ({
    '@type': 'MusicRecording',
    name: t.title,
    byArtist: {
      '@type': 'Person',
      name: t.artist,
    },
    inAlbum: {
      '@type': 'MusicAlbum',
      name: post.title,
    },
    position: t.position,
    ...(t.label && isLabelIndexable(t.label.name) && {
      recordedBy: {
        '@id': resolveUrl(`/dj/labels/${labelSlug(t.label.name)}`, baseUrl),
      },
    }),
    genre: post.tags,
    datePublished: post.created_time,
  }));

  const labelEntities = structuredTracks
    .filter((t) => t.label && isLabelIndexable(t.label.name))
    .reduce((acc, t) => {
      if (t.label && !acc.has(t.label.name)) {
        acc.set(t.label.name, {
          '@type': 'Organization',
          '@id': resolveUrl(`/dj/labels/${labelSlug(t.label.name)}`, baseUrl),
          name: t.label.name,
          url: t.label.url || undefined,
          description: `Record label: ${t.label.name}`,
        });
      }
      return acc;
    }, new Map<string, object>());

  return {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: post.title,
    description: post.description?.substring(0, 500) || '',
    contentUrl: post.url,
    embedUrl: post.src,
    duration: post.audio_length ? `PT${Math.floor(post.audio_length / 60)}M${post.audio_length % 60}S` : undefined,
    datePublished: post.created_time,
    genre: post.tags,
    producer: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    image: post.picture,
    encodingFormat: 'audio/mpeg',
    associatedMedia: {
      '@type': 'MusicAlbum',
      name: post.title,
      byArtist: {
        '@type': 'Person',
        name: authorName,
        url: authorUrl,
      },
      datePublished: post.created_time,
      genre: post.tags,
      track: trackItems,
    },
    ...(labelEntities.size > 0 && {
      '@graph': Array.from(labelEntities.values()),
    }),
  };
}

export function buildMusicPlaylistSchema(
  posts: BlogPostData[],
  options: SchemaBuilderOptions = {}
): object {
  const { baseUrl = 'https://holger-kampffmeyer.de' } = options;
  const playlistUrl = resolveUrl('/dj/mixes-weekly/', baseUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'DJ Hulk Weekly Mixes',
    description: 'Weekly electronic music DJ mixes by DJ Hulk with full tracklists. Specialized for gym, driving, work focus, and pre-party.',
    url: playlistUrl,
    image: resolveUrl('/img/_81A4010.webp', baseUrl),
    genre: ['House', 'Tech House', 'Deep House', 'Latin House'],
    numTracks: posts.length,
  };
}

export function buildBreadcrumbSchema(
  segments: BreadcrumbSegment[],
  options: SchemaBuilderOptions = {}
): object {
  const { baseUrl = 'https://holger-kampffmeyer.de' } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: segment.label,
      ...(segment.href && { item: resolveUrl(segment.href, baseUrl) }),
    })),
  };
}

export function buildLabelCollectionSchema(
  entries: LabelEntry[],
  segments: BreadcrumbSegment[],
  options: SchemaBuilderOptions = {}
): object[] {
  const {
    baseUrl = 'https://holger-kampffmeyer.de',
    description = 'Durchsuchbare Übersicht aller Record Labels in den DJ-Hulk-Mixes mit Tracklists und Release-Daten.',
    isLabelIndexable,
  } = options;
  const pageUrl = resolveUrl('/dj/labels', baseUrl);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#webpage`,
      mainEntityOfPage: pageUrl,
      name: 'Record Labels in DJ Hulk Mixes',
      description,
      inLanguage: 'de-DE',
    },
    buildBreadcrumbSchema(segments, { baseUrl }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#labels`,
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => {
        const labelUrl = resolveUrl(`/dj/labels/${entry.slug}`, baseUrl);
        const indexable = isLabelIndexable ? isLabelIndexable(entry.name) : entry.isIndexable;

        return {
          '@type': 'ListItem',
          position: index + 1,
          name: entry.name,
          ...(indexable
            ? { url: labelUrl, '@id': `${labelUrl}#organization` }
            : { item: { '@type': 'Organization', name: entry.name } }),
        };
      }),
    },
  ];
}

export function buildLabelEntities(
  structuredTracks: TrackWithLabel[],
  options: SchemaBuilderOptions = {}
): object | null {
  const { baseUrl = 'https://holger-kampffmeyer.de', isLabelIndexable = () => true } = options;

  const labelEntities = structuredTracks
    .filter((t) => t.label && isLabelIndexable(t.label.name))
    .reduce((acc, t) => {
      if (t.label && !acc.has(t.label.name)) {
        acc.set(t.label.name, {
          '@type': 'Organization',
          '@id': resolveUrl(`/dj/labels/${labelSlug(t.label.name)}`, baseUrl),
          name: t.label.name,
          url: t.label.url || undefined,
          description: `Record label: ${t.label.name}`,
        });
      }
      return acc;
    }, new Map<string, object>());

  if (labelEntities.size === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Record labels',
    numberOfItems: labelEntities.size,
    itemListElement: Array.from(labelEntities.values()).map((label, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: label,
    })),
  };
}

export function buildTracklistItemList(
  post: BlogPostData,
  structuredTracks: TrackWithLabel[],
  options: SchemaBuilderOptions = {}
): object {
  const { baseUrl = 'https://holger-kampffmeyer.de', isLabelIndexable = () => true } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Tracklist for ${post.title}`,
    numberOfItems: structuredTracks.length,
    itemListElement: structuredTracks.map((t) => ({
      '@type': 'ListItem',
      position: t.position,
      item: {
        '@type': 'MusicRecording',
        name: t.title,
        byArtist: {
          '@type': 'Person',
          name: t.artist,
        },
        inAlbum: {
          '@type': 'MusicAlbum',
          name: post.title,
        },
        ...(t.label && isLabelIndexable(t.label.name) && {
          recordedBy: {
            '@id': resolveUrl(`/dj/labels/${labelSlug(t.label.name)}`, baseUrl),
          },
        }),
        genre: post.tags,
        datePublished: post.created_time,
      },
    })),
  };
}

export function buildBlogSchema(
  posts: BlogPostData[],
  options: SchemaBuilderOptions = {}
): object {
  const {
    baseUrl = 'https://holger-kampffmeyer.de',
    authorName = 'DJ Hulk',
    authorUrl = 'https://holger-kampffmeyer.de/djhulk-electronic-music/',
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'DJ Hulk Weekly Mixes Blog',
    description: 'Weekly electronic music DJ mixes by DJ Hulk with full tracklists. House, Tech House, Deep House, Latin House.',
    url: resolveUrl('/dj/mixes-blog-archive/', baseUrl),
    image: resolveUrl('/img/_81A4010.webp', baseUrl),
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    blogPosts: posts.slice(0, 10).map((post) => buildBlogPostingSchema(post, options)),
  };
}

export function buildCollectionPageSchema(
  posts: BlogPostData[],
  options: SchemaBuilderOptions = {}
): object {
  const {
    baseUrl = 'https://holger-kampffmeyer.de',
    authorName = 'DJ Hulk',
    authorUrl = 'https://holger-kampffmeyer.de/djhulk-electronic-music/',
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'DJ Hulk Mix Archive',
    description: 'Complete archive of DJ Hulk\'s electronic music mixes with tracklists - House, Tech House, Deep House, Latin House.',
    url: resolveUrl('/dj/mixes-blog-archive/', baseUrl),
    image: resolveUrl('/img/_81A4010.webp', baseUrl),
    mainEntity: [
      buildBlogSchema(posts, options),
      {
        '@type': 'MusicAlbum',
        name: 'DJ Hulk Mix Archive',
        description: 'All DJ mixes with tracklists by DJ Hulk',
        byArtist: {
          '@type': 'Person',
          name: authorName,
          url: authorUrl,
        },
        genre: ['House', 'Tech House', 'Deep House', 'Latin House'],
        numTracks: posts.length,
      },
    ],
  };
}