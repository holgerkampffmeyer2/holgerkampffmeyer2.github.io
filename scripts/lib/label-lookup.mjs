/**
 * Online-Label-Recherche über die MusicBrainz-Webservice-API.
 *
 * Ablauf je Track: Recherche-Aufnahme finden (`/ws/2/recording`) und über das
 * zugehörige Release die Label-Angaben lesen (`/ws/2/release/<id>?inc=labels`).
 *
 * Hinweis: Die iTunes-Search-API liefert kein `label`-Feld und Beatport ist per
 * Cloudflare/OAuth geblockt – daher MusicBrainz. Die API verlangt eine
 * aussagekräftige User-Agent-Kennung und max. ~1 Request/Sekunde.
 */

import { cleanTitleForSearch, trackMatchKey, trackMatchScore } from './track-match.mjs';
import { cleanLabel } from './label-clean.mjs';

export const MUSICBRAINZ_API = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'holger-kampffmeyer.de label-research/0.1 ( https://holger-kampffmeyer.de )';

function escapeQuery(value) {
  return String(value ?? '').replace(/[\\"]/g, '\\$&').trim();
}

/**
 * Reduziert mehrere Artists auf den ersten (MusicBrainz-Suche wird sonst zu streng).
 * @param {string} artist
 * @returns {string}
 */
export function primaryArtist(artist) {
  return String(artist ?? '')
    .split(/[,&]|\bfeat\.?\b|\bft\.?\b|\bvs\.?\b|\bx\b/i)[0]
    .trim();
}

/**
 * Baut die MusicBrainz-Recherche-Anfrage aus Artist und Titel.
 * @param {string} artist
 * @param {string} title
 * @returns {string}
 */
export function buildQuery(artist, title) {
  const parts = [];
  const cleanTitle = cleanTitleForSearch(title ?? '').trim();
  const cleanArtist = primaryArtist(artist);
  if (cleanTitle) parts.push(`recording:"${escapeQuery(cleanTitle)}"`);
  if (cleanArtist) parts.push(`artist:"${escapeQuery(cleanArtist)}"`);
  return parts.join(' AND ');
}

/**
 * Extrahiert die Kandidaten aus einer MusicBrainz-Recording-Suche.
 * @param {{ recordings?: any[] }} data
 * @returns {{ title: string, artistName: string, releaseId: string | null, releaseTitle: string }[]}
 */
export function parseRecordingSearch(data) {
  const recordings = Array.isArray(data?.recordings) ? data.recordings : [];
  return recordings.map(recording => {
    const artistName = (recording?.['artist-credit'] ?? [])
      .map(credit => credit?.name ?? credit?.artist?.name ?? '')
      .filter(Boolean)
      .join(', ');
    const release = (recording?.releases ?? []).find(item => item?.id) ?? {};
    return {
      title: recording?.title ?? '',
      artistName,
      releaseId: release.id ?? null,
      releaseTitle: release.title ?? '',
    };
  });
}

/**
 * Bewertet, wie sicher eine MB-Aufnahme zum gesuchten Track passt (0..1).
 * Der Titel zählt am stärksten (Klammern entfernt), Artist-Überlappung als Bonus;
 * fehlende Artist-Überlappung wirkt als Strafe – verhindert falsche Zuordnungen,
 * wenn der Titel mehrdeutig ist.
 * @param {{ title: string, artistName: string }} recording
 * @param {string} artist
 * @param {string} title
 * @returns {number}
 */
export function recordingConfidence(recording, artist, title) {
  const targetTitle = trackMatchKey(cleanTitleForSearch(title));
  const recTitle = trackMatchKey(cleanTitleForSearch(recording.title));
  const titleScore = targetTitle && recTitle === targetTitle
    ? 1
    : (targetTitle && recTitle ? trackMatchScore(targetTitle, recTitle) : 0);

  const targetTokens = new Set(trackMatchKey(artist).split(' ').filter(Boolean));
  const recTokens = trackMatchKey(recording.artistName).split(' ').filter(Boolean);
  const overlap = recTokens.filter(token => targetTokens.has(token)).length;
  const artistBonus = overlap > 0 ? Math.min(overlap, 3) * 0.1 : -0.25;

  return Math.max(0, Math.min(1, titleScore * 0.9 + artistBonus));
}

/**
 * Wählt die passendste Aufnahme anhand des titel-gewichteten Scores.
 * @param {ReturnType<typeof parseRecordingSearch>} recordings
 * @param {string} artist
 * @param {string} title
 * @returns {object | null}
 */
export function pickBestRecording(recordings, artist, title) {
  let best = null;
  let bestScore = 0;
  for (const recording of recordings) {
    const score = recordingConfidence(recording, artist, title);
    if (score > bestScore) {
      bestScore = score;
      best = recording;
    }
  }
  return best ? { ...best, confidence: bestScore } : null;
}

/**
 * Liest den ersten Label-Namen aus einem Release (`inc=labels`).
 * @param {{ 'label-info'?: any[] }} data
 * @returns {string | null}
 */
export function extractLabelFromRelease(data) {
  const info = Array.isArray(data?.['label-info']) ? data['label-info'] : [];
  for (const entry of info) {
    const name = (entry?.label?.name ?? '').trim();
    if (name) return name;
  }
  return null;
}

/**
 * Erzeugt einen einfachen Rate-Limiter (Mindestabstand zwischen Aufrufen).
 * @param {number} minIntervalMs
 * @returns {() => Promise<void>}
 */
export function createRateLimiter(minIntervalMs) {
  let last = 0;
  return async () => {
    const now = Date.now();
    const wait = last + minIntervalMs - now;
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
    last = Date.now();
  };
}

async function fetchJson(fetchImpl, url) {
  const response = await fetchImpl(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
  if (!response.ok) throw new Error(`MusicBrainz HTTP ${response.status}`);
  return response.json();
}

/**
 * Entfernt ungültige Label-Namen aus einem Ergebnis (auch aus gecachten Werten,
 * die mit älteren, weniger strengen Filtern entstanden sind).
 * @param {any} result
 * @returns {any}
 */
function sanitizeResult(result) {
  if (!result || !cleanLabel(result.label)) return null;
  return result;
}

/**
 * Sucht das Label eines Tracks online über MusicBrainz.
 * @param {{ artist?: string, title?: string }} track
 * @param {{
 *   fetchImpl?: typeof fetch,
 *   cache?: { get: (key: string) => any, set: (key: string, value: any) => void },
 *   rateLimit?: () => Promise<void>,
 * }} [options]
 * @returns {Promise<{ label: string, confidence: number, matchedName: string, source: 'musicbrainz' } | null>}
 */
export async function lookupLabelOnline(track, options = {}) {
  const { fetchImpl = globalThis.fetch, cache, rateLimit } = options;
  const artist = (track?.artist ?? '').trim();
  const title = (track?.title ?? '').trim();
  const query = buildQuery(artist, title);
  if (!query) return null;

  const cacheKey = `musicbrainz:${query.toLowerCase()}`;
  if (cache) {
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return sanitizeResult(cached);
  }

  let best;
  try {
    if (rateLimit) await rateLimit();
    const searchUrl = `${MUSICBRAINZ_API}/recording?query=${encodeURIComponent(query)}&fmt=json&limit=5`;
    const searchData = await fetchJson(fetchImpl, searchUrl);
    best = pickBestRecording(parseRecordingSearch(searchData), artist, title);
  } catch {
    return null;
  }
  if (!best?.releaseId) {
    if (cache) cache.set(cacheKey, null);
    return null;
  }

  let label = null;
  try {
    if (rateLimit) await rateLimit();
    const releaseUrl = `${MUSICBRAINZ_API}/release/${best.releaseId}?inc=labels&fmt=json`;
    label = cleanLabel(extractLabelFromRelease(await fetchJson(fetchImpl, releaseUrl)) || '');
  } catch {
    return null;
  }

  const result = label
    ? { label, confidence: best.confidence, matchedName: [best.artistName, best.title].filter(Boolean).join(' - '), source: 'musicbrainz' }
    : null;
  if (cache) cache.set(cacheKey, result);
  return sanitizeResult(result);
}
