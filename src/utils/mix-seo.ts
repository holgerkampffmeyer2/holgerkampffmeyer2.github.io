import type { BlogPostData } from '../types/blog';
import { formatDate } from './format.js';
import { getMixDisplay } from './mix-display.js';

export interface MixLabelInfo {
  name: string;
  url: string | null;
  count: number;
}

export interface RelatedMix {
  slug: string;
  title: string;
  href: string;
  reason: string;
}

export interface MixCandidate {
  post: BlogPostData;
  labels: MixLabelInfo[];
}

const TITLE_MAX_LENGTH = 68;
const DESCRIPTION_MIN_LENGTH = 140;
const DESCRIPTION_MAX_LENGTH = 160;

const USE_CASE_TEXT: Record<string, string> = {
  gym: 'Gym-Sessions',
  drive: 'Autofahrten',
  work: 'Fokus-Phasen bei der Arbeit',
  party: 'Vorpartys',
};

function cleanTag(tag: string): string {
  return tag
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\bhouse\b/i, 'House')
    .replace(/\bafro\b/i, 'Afro')
    .replace(/\btech\b/i, 'Tech')
    .replace(/\bdeep\b/i, 'Deep')
    .replace(/\bfunky\b/i, 'Funky');
}

function normalizeWords(text: string): string[] {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function selectedGenres(post: BlogPostData, name: string): string[] {
  const tags = (post.tags || [])
    .map(cleanTag)
    .filter((tag, index, all) => all.indexOf(tag) === index)
    .filter((tag) => tag.length > 2);

  const specific = tags.filter((tag) => tag.toLowerCase() !== 'house');
  const pool = specific.length > 0 ? specific : tags;

  const nameWords = new Set(normalizeWords(name));
  const alreadyInName = (tag: string) => {
    const words = normalizeWords(tag);
    return words.length > 0 && words.every((word) => nameWords.has(word));
  };

  return pool.filter((tag) => !alreadyInName(tag)).slice(0, 2);
}

function genrePart(post: BlogPostData, name: string): string {
  const selected = selectedGenres(post, name);
  if (selected.length === 0) return '';

  const separator = selected.some((tag) => tag.includes('&')) ? ', ' : ' & ';
  return selected.join(separator);
}

function mixName(post: BlogPostData): string {
  const display = getMixDisplay(post.key, post.title);
  if (display.mixNum) return `Mix#${display.mixNum}`;

  const cleaned = post.title
    .replace(/^DJ\s*Hulk\s*[-–|]\s*/i, '')
    .replace(/\s*[-–]\s*DJ\s*Hulk\s*$/i, '')
    .trim();

  return trimWords(cleaned, 30);
}

function trimWords(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 10 ? cut.slice(0, lastSpace) : cut).trim();
}

function germanDate(dateStr: string): string {
  if (!dateStr) return '';
  return formatDate(dateStr);
}

function durationText(seconds: number): string {
  if (!seconds || seconds < 60) return '';
  return `${Math.round(seconds / 60)} Minuten`;
}

function useCaseTexts(post: BlogPostData): string[] {
  return (post.useCases || []).map((key) => USE_CASE_TEXT[key]).filter(Boolean);
}

export function buildMixBreadcrumbLabel(post: BlogPostData): string {
  const display = getMixDisplay(post.key, post.title);
  if (display.mixNum) return `Mix#${display.mixNum}`;

  const cleaned = post.title
    .replace(/^DJ\s*Hulk\s*[-–|]\s*/i, '')
    .replace(/\s*[-–]\s*DJ\s*Hulk\s*$/i, '')
    .trim();

  return trimWords(cleaned, 34);
}

export function buildMixCardTitle(post: BlogPostData): string {
  const name = mixName(post);
  const genre = genrePart(post, name);
  if (!genre) return name;
  return trimWords(`${name} – ${genre}`, 48);
}

export function buildMixTitle(post: BlogPostData, labels: MixLabelInfo[]): string {
  const brand = ' | DJ Hulk';
  const name = mixName(post);
  const genre = genrePart(post, name);
  const genreShort = selectedGenres(post, name)[0] || '';
  const label = labels.find((entry) => !/unreleased|unknown/i.test(entry.name))?.name;

  const withBrand = (base: string) =>
    base.length + brand.length <= TITLE_MAX_LENGTH ? `${base}${brand}` : null;

  const candidates = [
    withBrand(genre ? `${name} – ${genre}` : name),
    withBrand(genreShort && genreShort !== genre ? `${name} – ${genreShort}` : ''),
    withBrand(label ? `${name} – ${label}` : ''),
    withBrand(name),
  ].filter((candidate): candidate is string => Boolean(candidate));

  if (candidates.length > 0) return candidates[0];

  const shortened = trimWords(name, TITLE_MAX_LENGTH - brand.length);
  return `${shortened}${brand}`;
}

const DESCRIPTION_FILLERS = [
  'Komplette Tracklist mit Künstlern und Labels auf der Seite.',
  'Vollständige Tracklist mit Künstlern und Labels.',
  'Alle Tracks mit Künstlern und Labels.',
  'Tracklist mit Künstlern und Labels ansehen.',
  'Stream auf Mixcloud.',
  'DJ Hulk aus Stuttgart.',
];

function fitDescription(parts: string[]): string {
  let text = parts.join(' ').replace(/\s+/g, ' ').trim();

  if (text.length > DESCRIPTION_MAX_LENGTH) {
    const kept: string[] = [];
    for (const part of parts) {
      const next = [...kept, part].join(' ');
      if (next.length > DESCRIPTION_MAX_LENGTH) break;
      kept.push(part);
    }
    text = kept.join(' ').replace(/\s+/g, ' ').trim();
  }

  if (text.length < DESCRIPTION_MIN_LENGTH) {
    for (const filler of DESCRIPTION_FILLERS) {
      if (text.length >= DESCRIPTION_MIN_LENGTH) break;
      const next = `${text} ${filler}`;
      if (next.length > DESCRIPTION_MAX_LENGTH) continue;
      text = next;
    }
  }

  if (text.length > DESCRIPTION_MAX_LENGTH) {
    text = trimWords(text.slice(0, DESCRIPTION_MAX_LENGTH - 1), DESCRIPTION_MAX_LENGTH);
  }

  return text.replace(/[,\s]+$/, '.');
}

export function buildMixDescription(post: BlogPostData, labels: MixLabelInfo[]): string {
  const name = mixName(post);
  const date = germanDate(post.created_time);
  const trackCount = post.tracklist?.length || 0;
  const genre = genrePart(post, name);
  const labelNames = labels.slice(0, 3).map((label) => label.name);
  const useCase = useCaseTexts(post)[0];

  const lead = [
    name,
    date ? `vom ${date}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const body = [
    trackCount ? `${trackCount} Tracks` : '',
    genre ? `${trackCount ? 'zwischen' : 'mit'} ${genre}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const parts = [body ? `${lead}: ${body}.` : `${lead}.`];

  if (labelNames.length > 0) {
    parts.push(`Labels: ${labelNames.join(', ')}.`);
  }

  if (useCase) {
    parts.push(`Ideal für ${useCase}.`);
  }

  return fitDescription(parts);
}

export function buildMixIntro(post: BlogPostData, labels: MixLabelInfo[]): string[] {
  const name = mixName(post);
  const date = germanDate(post.created_time);
  const trackCount = post.tracklist?.length || 0;
  const genre = genrePart(post, name);
  const duration = durationText(post.audio_length);
  const labelNames = labels.slice(0, 3).map((label) => label.name);
  const useCases = useCaseTexts(post);

  const sentences: string[] = [];

  const lead = `${name}${date ? ` vom ${date}` : ''}`;

  sentences.push(
    `${[
      lead,
      trackCount ? `: ${trackCount} Tracks` : '',
      genre ? ` zwischen ${genre}` : '',
      duration ? ` auf ${duration}` : '',
    ]
      .filter(Boolean)
      .join('')}.`
  );

  if (labelNames.length > 0) {
    const range = labelNames.length > 2
      ? `${labelNames.slice(0, -1).join(' über ')} bis ${labelNames[labelNames.length - 1]}`
      : labelNames.join(' bis ');
    sentences.push(
      `Die Auswahl reicht von ${range} und zeigt, wie breit das Repertoire auf den Dancefloor geht.`
    );
  }

  const highlights = (post.tracklist || []).slice(0, 2);
  if (highlights.length > 0) {
    sentences.push(
      `Höhepunkte sind ${highlights.map((track) => `„${track}“`).join(' und ')}.`
    );
  }

  if (useCases.length > 0) {
    sentences.push(
      `Der Mix funktioniert besonders gut für ${useCases.join(', ')} und hält das Tempo über die volle Länge konstant.`
    );
  }

  sentences.push('Die komplette Tracklist mit Künstlern und Labels findest du unter dem Mixcloud-Player.');

  return sentences;
}

export function buildRelatedMixes(
  post: BlogPostData,
  candidates: MixCandidate[],
  limit = 3
): RelatedMix[] {
  const ownLabels = new Set(
    candidates.find((entry) => entry.post.slug === post.slug)?.labels.map((label) => label.name) || []
  );
  const ownTags = new Set((post.tags || []).map((tag) => tag.toLowerCase()));

  const scored = candidates
    .filter((entry) => entry.post.slug !== post.slug && entry.post.hasTracklist)
    .map((entry) => {
      const sharedTags = (entry.post.tags || []).filter((tag) =>
        ownTags.has(tag.toLowerCase())
      ).length;
      const sharedLabels = entry.labels.filter((label) => ownLabels.has(label.name)).length;
      return { entry, sharedTags, sharedLabels, score: sharedTags * 2 + sharedLabels * 3 };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return candidates
      .filter((entry) => entry.post.slug !== post.slug && entry.post.hasTracklist)
      .slice(0, limit)
      .map((entry) => ({
        slug: entry.post.slug,
        title: buildMixCardTitle(entry.post),
        href: `/dj/mixes/${entry.post.slug}`,
        reason: 'Neueste Mixes',
      }));
  }

  return scored.slice(0, limit).map(({ entry, sharedLabels }) => ({
    slug: entry.post.slug,
    title: buildMixCardTitle(entry.post),
    href: `/dj/mixes/${entry.post.slug}`,
    reason: sharedLabels > 0 ? 'Gleiches Label' : 'Ähnliche Genres',
  }));
}
