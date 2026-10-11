/**
 * Text-Werkzeuge für den toleranten Abgleich von Tracklisten-Einträgen gegen
 * CUE-Einträge und für die Aufbereitung von Suchanfragen.
 *
 * Die Normalisierung von `trackMatchKey` ist bewusst strenger als
 * `normalizeTrack` aus `src/utils/track-labels.js` (zusätzlich: Akzente, `&`,
 * Interpunktion), weil hier verschiedene Schreibweisen zusammengeführt werden
 * müssen. Für den Registry-Abgleich bleibt `normalizeTrack` maßgeblich.
 */

const BRACKET_RE = /[([{][^()[\]{}]*[)\]}]/g;

/**
 * Entfernt alle Klammer-Qualifier (rund/eckig/geschweift), auch verschachtelt.
 * @param {string} str
 * @returns {string}
 */
export function stripAllBracketed(str) {
  if (!str) return '';
  let prev;
  let out = String(str);
  do {
    prev = out;
    out = out.replace(BRACKET_RE, ' ');
  } while (out !== prev);
  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Normalisiert einen Track-String für den Registry-Abgleich (identisch zu
 * `src/utils/track-labels.js`): trailing komma, Whitespace, lowercase.
 * @param {string} track
 * @returns {string}
 */
export function normalizeTrack(track) {
  if (!track) return '';
  return String(track)
    .replace(/,\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Stärkere Normalisierung für Fuzzy-Vergleiche: Akzente, `&`, Interpunktion.
 * @param {string} str
 * @returns {string}
 */
export function trackMatchKey(str) {
  if (!str) return '';
  return normalizeTrack(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Entfernt Klammer-Qualifier für die Online-Suche.
 * @param {string} str
 * @returns {string}
 */
export function cleanTitleForSearch(str) {
  return stripAllBracketed(str);
}

/**
 * Liefert den Remix-/Edit-/Mix-Hinweis aus Klammern, falls vorhanden.
 * @param {string} str
 * @returns {string}
 */
export function extractRemixHandle(str) {
  if (!str) return '';
  const matches = String(str).match(BRACKET_RE);
  if (!matches) return '';
  for (const m of matches) {
    const inner = m.replace(/[(){}\[\]]/g, ' ').trim();
    if (/\b(remix|edit|mix|vip|bootleg|rework|dub|extended)\b/i.test(inner)) {
      return inner;
    }
  }
  return '';
}

function bigrams(str) {
  const out = [];
  for (let i = 0; i < str.length - 1; i++) out.push(str.slice(i, i + 2));
  return out;
}

function diceCoefficient(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;
  const ba = bigrams(a);
  const bb = bigrams(b);
  const counts = new Map();
  for (const g of ba) counts.set(g, (counts.get(g) ?? 0) + 1);
  let overlap = 0;
  for (const g of bb) {
    const n = counts.get(g) ?? 0;
    if (n > 0) {
      overlap++;
      counts.set(g, n - 1);
    }
  }
  return (2 * overlap) / (ba.length + bb.length);
}

function tokenDice(a, b) {
  const ta = new Set(a.split(' ').filter(Boolean));
  const tb = new Set(b.split(' ').filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return (2 * overlap) / (ta.size + tb.size);
}

/**
 * Ähnlichkeit zweier bereits normalisierter Strings (0..1).
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function similarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short.length >= 4 && long.includes(short)) return 0.9;
  return Math.max(diceCoefficient(a, b), tokenDice(a, b));
}

/**
 * Erzeugt Vergleichsvarianten eines Track-Strings: voll, ohne Klammern und
 * jeweils der Teil nach dem ersten "` - `" (Titel-Anteil). Deckt u. a.
 * "Artist - Artist - Titel" und "Titel - Artist" ab.
 * @param {string} str
 * @returns {string[]}
 */
export function trackVariants(str) {
  const out = new Set();
  const add = value => {
    const key = trackMatchKey(value);
    if (key) out.add(key);
  };
  add(str);
  const stripped = stripAllBracketed(str);
  add(stripped);
  for (const source of [String(str ?? ''), stripped]) {
    const idx = source.indexOf(' - ');
    if (idx > 0) add(source.slice(idx + 3));
  }
  return [...out];
}

/**
 * Bestes Ähnlichkeitsmaß zwischen zwei Track-Strings (0..1).
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function trackMatchScore(a, b) {
  const av = trackVariants(a);
  const bv = trackVariants(b);
  let best = 0;
  for (const x of av) {
    for (const y of bv) {
      const score = similarity(x, y);
      if (score > best) best = score;
    }
  }
  return best;
}

/**
 * Baut einen Vergleichsstring aus einem CUE-Eintrag.
 * @param {{ performer?: string, title?: string }} entry
 * @returns {string}
 */
export function cueEntryLabel(entry) {
  const performer = (entry?.performer ?? '').trim();
  const title = (entry?.title ?? '').trim();
  if (performer && title) return `${performer} - ${title}`;
  return title || performer;
}
