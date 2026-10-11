/**
 * MusicBrainz-Label-Entity-Recherche für Label-Websites.
 *
 * Sucht ein Label über den Label-Index (`/ws/2/label?query=label:"..."`) und
 * liest die verknüpften URLs über `/ws/2/label/<id>?inc=url-rels&fmt=json`
 * (offizielle Homepage, Diskogs, Bandcamp, SoundCloud …). Es werden nur
 * reale, von MusicBrainz gelieferte URLs übernommen – es wird nichts geraten.
 */

import { MUSICBRAINZ_API, createRateLimiter } from './label-lookup.mjs';

export { createRateLimiter };

const USER_AGENT = 'holger-kampffmeyer.de label-research/0.1 ( https://holger-kampffmeyer.de )';
const KEY_PREFIX = 'mb-label:';

/**
 * Cache-Schlüssel für eine Label-Recherche (deckungsgleich mit `lookupLabelUrl`).
 * @param {string} name
 * @returns {string}
 */
export function labelCacheKey(name) {
  return `${KEY_PREFIX}${String(name ?? '').trim().toLowerCase()}`;
}

/**
 * Bevorzugte URL-Beziehungstypen für Labels (höchste Priorität zuerst).
 * Höchste Priorität hat die offizielle Homepage, danach Diskogs (stabil bei
 * Rebrandings), dann Bandcamp/SoundCloud/Beatport.
 */
const URL_PRIORITY = ['official homepage', 'discogs', 'bandcamp', 'soundcloud', 'beatport', 'online data'];

/**
 * Normalisierter Vergleichsschlüssel für Label-Namen.
 * @param {string} value
 * @returns {string}
 */
export function labelMatchKey(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function escapeLabelQuery(value) {
  return String(value ?? '').replace(/[\\"]/g, '\\$&').trim();
}

/**
 * Baut die MusicBrainz-Label-Suchanfrage (Lucene over Label-Index).
 * @param {string} name
 * @returns {string}
 */
export function buildLabelQuery(name) {
  const clean = escapeLabelQuery(name).trim();
  return clean ? `label:"${clean}"` : '';
}

/**
 * Extrahiert die Kandidaten aus einer Label-Suche.
 * @param {{ labels?: any[] }} data
 * @returns {{ id: string, name: string, score: number }[]}
 */
export function parseLabelSearch(data) {
  const labels = Array.isArray(data?.labels) ? data.labels : [];
  return labels
    .filter(item => item?.id && item?.name)
    .map(item => ({ id: item.id, name: String(item.name), score: Number(item.score ?? 0) }));
}

/**
 * Wählt den passendsten Label-Kandidaten über den normalisierten Namensvergleich.
 * Nur exakte Treffer nach Normalisierung werden akzeptiert (kein Raten bei
 * mehrdeutigen Namen); bei mehreren exakten Treffern gewinnt der höchste Score.
 * @param {ReturnType<typeof parseLabelSearch>} candidates
 * @param {string} targetName
 * @returns {object | null}
 */
export function findBestLabel(candidates, targetName) {
  const targetKey = labelMatchKey(targetName);
  if (!targetKey) return null;
  const exact = candidates.filter(candidate => labelMatchKey(candidate.name) === targetKey);
  if (!exact.length) return null;
  return exact.reduce((best, candidate) => (candidate.score > best.score ? candidate : best), exact[0]);
}

/**
 * Wählt die beste URL aus den Verknüpfungen eines Labels (`inc=url-rels`).
 * @param {{ relations?: any[] }} data
 * @returns {{ url: string, via: string } | null}
 */
export function extractLabelUrl(data) {
  const relations = Array.isArray(data?.relations) ? data.relations : [];
  const candidates = relations
    .filter(relation => /^https?:\/\//i.test(relation?.url?.resource ?? ''))
    .map(relation => ({ url: relation.url.resource, via: String(relation.type ?? '') }));

  for (const preferred of URL_PRIORITY) {
    const exact = candidates.find(candidate => candidate.via.toLowerCase() === preferred);
    if (exact) return exact;
  }
  return candidates[0] ?? null;
}

async function fetchJson(fetchImpl, url) {
  const response = await fetchImpl(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
  if (!response.ok) throw new Error(`MusicBrainz HTTP ${response.status}`);
  return response.json();
}

/**
 * Sucht die Website eines Labels über MusicBrainz.
 * @param {string} name
 * @param {{
 *   fetchImpl?: typeof fetch,
 *   cache?: { get: (key: string) => any, set: (key: string, value: any) => void },
 *   rateLimit?: () => Promise<void>,
 * }} [options]
 * @returns {Promise<{ name: string, url: string, source: 'musicbrainz', via: string, mbid: string } | null>}
 */
export async function lookupLabelUrl(name, options = {}) {
  const { fetchImpl = globalThis.fetch, cache, rateLimit } = options;
  const cleanName = String(name ?? '').trim();
  const query = buildLabelQuery(cleanName);
  if (!query) return null;

  const cacheKey = `mb-label:${cleanName.toLowerCase()}`;
  if (cache) {
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached || null;
  }

  let mbid = null;
  try {
    if (rateLimit) await rateLimit();
    const searchUrl = `${MUSICBRAINZ_API}/label?query=${encodeURIComponent(query)}&fmt=json&limit=5`;
    const best = findBestLabel(parseLabelSearch(await fetchJson(fetchImpl, searchUrl)), cleanName);
    mbid = best?.id ?? null;
  } catch {
    if (cache) cache.set(cacheKey, null);
    return null;
  }
  if (!mbid) {
    if (cache) cache.set(cacheKey, null);
    return null;
  }

  let link = null;
  try {
    if (rateLimit) await rateLimit();
    const labelUrl = `${MUSICBRAINZ_API}/label/${mbid}?inc=url-rels&fmt=json`;
    link = extractLabelUrl(await fetchJson(fetchImpl, labelUrl));
  } catch {
    if (cache) cache.set(cacheKey, null);
    return null;
  }

  if (!link?.url) {
    if (cache) cache.set(cacheKey, null);
    return null;
  }

  const result = { name: cleanName, url: link.url, source: 'musicbrainz', via: link.via, mbid };
  if (cache) cache.set(cacheKey, result);
  return result;
}