export interface LabelSearchEntry {
  id: string;
  name: string;
  searchText?: string;
  search?: {
    name: string;
    mixText: string;
    trackText: string;
    years: string[];
  };
}

const FUZZY_THRESHOLD = 0.62;
const HIGHLIGHT_THRESHOLD = 0.8;

export interface SearchSegment {
  text: string;
  match: boolean;
}

export interface SearchableTrack {
  artist: string;
  title: string;
}

export interface SearchableMix {
  title: string;
  displayLabel: string;
  tracks: SearchableTrack[];
}

export function getSearchTokens(query: string): string[] {
  return normalizeSearchText(query).split(' ').filter(Boolean);
}

function getTextTokens(query: string): string[] {
  return getSearchTokens(query).filter((token) => !/^(19|20)\d{2}$/.test(token));
}

function containsExactToken(text: string, token: string): boolean {
  return normalizeSearchText(text)
    .split(' ')
    .filter(Boolean)
    .some((word) => word === token || (token.length >= 3 && word.includes(token)));
}

function matchesTokens(text: string, tokens: string[]): boolean {
  if (!tokens.length) return false;
  const normalized = normalizeSearchText(text);
  if (!normalized) return false;
  const words = normalized.split(' ').filter(Boolean);

  return tokens.every((token) =>
    words.some(
      (word) =>
        word === token ||
        (token.length >= 3 && word.includes(token)) ||
        (token.length >= 3 && searchSimilarity(word, token) >= FUZZY_THRESHOLD)
    )
  );
}

export function matchesSearchText(text: string, query: string): boolean {
  return matchesTokens(text, getTextTokens(query));
}

export function highlightSegments(text: string, query: string): SearchSegment[] {
  const tokens = getSearchTokens(query);
  const value = String(text || '');
  if (!tokens.length || !value) return [{ text: value, match: false }];

  const ranges: Array<[number, number]> = [];
  const wordPattern = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

  for (const match of value.matchAll(wordPattern)) {
    const start = match.index ?? 0;
    const word = match[0];
    const normalizedWord = normalizeSearchText(word);
    if (!normalizedWord) continue;

    const isMatch = tokens.some(
      (token) =>
        normalizedWord === token ||
        (token.length >= 3 && normalizedWord.includes(token)) ||
        (token.length >= 3 && searchSimilarity(normalizedWord, token) >= HIGHLIGHT_THRESHOLD)
    );
    if (!isMatch) continue;

    const end = start + word.length;
    const last = ranges[ranges.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else ranges.push([start, end]);
  }

  if (!ranges.length) return [{ text: value, match: false }];

  const segments: SearchSegment[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) segments.push({ text: value.slice(cursor, start), match: false });
    segments.push({ text: value.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < value.length) segments.push({ text: value.slice(cursor), match: false });
  return segments;
}

export function filterMixesForSearch<T extends SearchableMix>(
  mixes: T[],
  query: string,
  labelName = ''
): T[] {
  const tokens = getTextTokens(query);
  if (!tokens.length || matchesTokens(labelName, tokens)) return mixes;

  return mixes
    .map((mix) => {
      const mixMatches = matchesTokens(`${mix.title} ${mix.displayLabel}`, tokens);
      const tracks = mixMatches
        ? mix.tracks
        : mix.tracks.filter((track) => matchesTokens(`${track.artist} ${track.title}`, tokens));
      return { ...mix, tracks };
    })
    .filter(
      (mix) => mix.tracks.length > 0 || matchesTokens(`${mix.title} ${mix.displayLabel}`, tokens)
    );
}

export function normalizeSearchText(value: string): string {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bigrams(value: string): Set<string> {
  const result = new Set<string>();
  for (let index = 0; index < value.length - 1; index += 1) {
    result.add(value.slice(index, index + 2));
  }
  return result;
}

function diceCoefficient(left: string, right: string): number {
  if (left === right) return 1;
  if (left.length < 2 || right.length < 2) return 0;

  const leftBigrams = bigrams(left);
  const rightBigrams = bigrams(right);
  let shared = 0;

  for (const gram of leftBigrams) {
    if (rightBigrams.has(gram)) shared += 1;
  }

  return (2 * shared) / (leftBigrams.size + rightBigrams.size);
}

export function searchSimilarity(left: string, right: string): number {
  const a = normalizeSearchText(left);
  const b = normalizeSearchText(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 4 || b.length < 4) return 0;
  if (a.startsWith(b) || b.startsWith(a)) return 0.9;
  if (a.includes(b) || b.includes(a)) return 0.8;
  return diceCoefficient(a, b) * 0.9;
}

function fieldScore(field: string, queryToken: string): number {
  const normalizedField = normalizeSearchText(field);
  const normalizedQuery = normalizeSearchText(queryToken);
  if (!normalizedQuery || !normalizedField) return 0;
  if (normalizedField.includes(normalizedQuery)) return 1;

  let best = 0;
  for (const token of normalizedField.split(' ')) {
    const score = searchSimilarity(token, normalizedQuery);
    if (score > best) best = score;
  }

  return best >= FUZZY_THRESHOLD ? best : 0;
}

export function scoreLabelMatch(entry: LabelSearchEntry, query: string): number {
  const tokens = getSearchTokens(query);
  if (!tokens.length) return 0;

  const yearTokens = tokens.filter((token) => /^(19|20)\d{2}$/.test(token));
  const textTokens = tokens.filter((token) => !/^(19|20)\d{2}$/.test(token));
  const years = entry.search?.years ?? [];

  if (yearTokens.length && !yearTokens.every((year) => years.includes(year))) return 0;
  if (!textTokens.length) return yearTokens.length ? 1 : 0;

  const fields = [
    { value: entry.search?.name ?? entry.name, weight: 5 },
    { value: entry.search?.mixText ?? entry.searchText ?? '', weight: 3 },
    { value: entry.search?.trackText ?? '', weight: 2 },
  ];

  const hasExact = textTokens.some((token) =>
    fields.some((field) => containsExactToken(field.value, token))
  );
  if (textTokens.length > 1 && !hasExact) return 0;

  let total = 0;
  for (const token of textTokens) {
    let best = 0;
    for (const field of fields) {
      if (!matchesTokens(field.value, [token])) continue;
      best = Math.max(best, fieldScore(field.value, token) * field.weight);
    }
    if (best === 0) return 0;
    total += best;
  }

  return total / textTokens.length;
}
