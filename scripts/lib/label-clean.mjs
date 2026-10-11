/**
 * Gemeinsame Bereinigung von Label-Namen aus allen Quellen (CUE-Tags,
 * Dateiname/Titel, MusicBrainz). Filtert Promo-/Hosting-Dienste, generische
 * Platzhalter sowie Klammermerkmale, die Mix-Qualifier, Genre oder Codes sind.
 */

const SERVICE_LABEL_RE = /inflyte|promo-?cloud|label-?engine|labelengine|dashgo|bandcamp|soundcloud|apple music|apple digital|promotion|promos?\b/i;
const QUALIFIER_RE = /\b(remix|rmx|re-?work|re-?edit|edit|bootleg|vip|mashup|dub|extended|original|instrumental|acapella|acappella|vocal|radio|clean|explicit|premiere|free ?download|promo|unreleased|out now|preview|snippet|exclusive|version|remaster(ed)?|mix|djs?)\b/i;
const GENRE_RE = /\b(house|techno|disco|afro|deep|tech|trance|garage|ukg|hip ?hop|dance|electronic|bass|funk|soul|jackin|edm)\b/i;
const CODE_RE = /^[a-z]{2,3}(\s?\d{1,4})?$/i;
const NUMERIC_RE = /^[\d\s./:#-]+$/;
const GENERIC_RE = /^(white ?label|unknown|untitled|various( artists)?|album only|independent|self-?released|no label|n\/a|tba)$/i;

/**
 * Bereinigt einen Label-Namen beliebiger Quelle.
 * @param {string} value
 * @returns {string} bereinigter Name oder leeren String bei Reject
 */
export function cleanLabel(value) {
  if (!value) return '';
  let label = String(value)
    .replace(/^[([{"'\s]+/, '')
    .replace(/[)\]}"'\s]+$/, '')
    .replace(/\s*\([^()]*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = [...new Set(label.split(/\s*,\s*/).filter(Boolean))];
  if (parts.length) label = parts.join(', ');
  if (!label || label.length < 2 || label.length > 60) return '';
  if (/^https?:\/\//i.test(label)) return '';
  if (SERVICE_LABEL_RE.test(label)) return '';
  if (GENERIC_RE.test(label)) return '';
  return label;
}

/**
 * Bereinigt einen Label-Namen zusätzlich für Klammerinhalte
 * (Filtert Mix-Qualifier, Genre, Ländercodes, Zahlen).
 * @param {string} value
 * @returns {string}
 */
export function cleanBracketLabel(value) {
  const label = cleanLabel(value);
  if (!label) return '';
  if (QUALIFIER_RE.test(label) || GENRE_RE.test(label)) return '';
  if (CODE_RE.test(label) || NUMERIC_RE.test(label) || GENERIC_RE.test(label)) return '';
  return label;
}

/**
 * Extrahiert einen Label-Kandidaten aus eckigen Klammern eines Texts.
 * @param {string} text
 * @returns {string}
 */
export function extractBracketLabel(text) {
  if (!text) return '';
  const matches = String(text).match(/\[([^\]]+)\]/g) ?? [];
  for (const raw of matches) {
    const label = cleanBracketLabel(raw.slice(1, -1));
    if (label) return label;
  }
  return '';
}