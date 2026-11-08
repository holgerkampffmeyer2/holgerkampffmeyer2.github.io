import type { BlogPostData } from '../types/blog';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface SchemaBuilderOptions {
  baseUrl?: string;
  authorName?: string;
  authorUrl?: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveUrl(path: string, baseUrl: string): string {
  return new URL(path, baseUrl).href;
}

export function buildBlogPostingSchema(
  post: BlogPostData,
  options: SchemaBuilderOptions = {}
): object {
  const { baseUrl = 'https://holger-kampffmeyer.de', authorName = 'DJ Hulk', authorUrl = 'https://holger-kampffmeyer.de/djhulk-electronic-music/' } = options;
  const postUrl = resolveUrl(`/dj/mixes/${post.slug}`, baseUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.title,
    description: post.description?.substring(0, 500) || '',
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

export interface TrackWithLabel {
  position: number;
  artist: string;
  title: string;
  label?: { name: string; url: string | null } | null;
}

export function buildAudioObjectSchema(
  post: BlogPostData,
  structuredTracks: TrackWithLabel[],
  options: SchemaBuilderOptions = {}
): object {
  const { baseUrl = 'https://holger-kampffmeyer.de', authorName = 'DJ Hulk', authorUrl = 'https://holger-kampffmeyer.de/djhulk-electronic-music/' } = options;

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
    ...(t.label && {
      recordedBy: {
        '@id': resolveUrl(`/dj/labels/${slugify(t.label.name)}`, baseUrl),
      },
    }),
    genre: post.tags,
    datePublished: post.created_time,
  }));

  const labelEntities = structuredTracks
    .filter((t) => t.label)
    .reduce((acc, t) => {
      if (t.label && !acc.has(t.label.name)) {
        acc.set(t.label.name, {
          '@type': 'Organization',
          '@id': resolveUrl(`/dj/labels/${slugify(t.label.name)}`, baseUrl),
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

export function buildLabelEntities(
  structuredTracks: TrackWithLabel[],
  options: SchemaBuilderOptions = {}
): object | null {
  const { baseUrl = 'https://holger-kampffmeyer.de' } = options;

  const labelEntities = structuredTracks
    .filter((t) => t.label)
    .reduce((acc, t) => {
      if (t.label && !acc.has(t.label.name)) {
        acc.set(t.label.name, {
          '@type': 'Organization',
          '@id': resolveUrl(`/dj/labels/${slugify(t.label.name)}`, baseUrl),
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
  const { baseUrl = 'https://holger-kampffmeyer.de' } = options;

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
        ...(t.label && {
          recordedBy: {
            '@id': resolveUrl(`/dj/labels/${slugify(t.label.name)}`, baseUrl),
          },
        }),
        genre: post.tags,
        datePublished: post.created_time,
      },
    })),
  };
}