/**
 * Sidecar-Lookup für Record-Labels in Tracklisten.
 *
 * Datenquelle ist `src/data/labels.json` mit der Struktur
 *   { "labels": { "<id>": { "name": "<Anzeigename>", "url": "<Website-URL>" } },
 *     "tracks": { "<Artist - Title>": "<id>" } }
 *
 * Labels werden über eine eindeutige, stabile `id` referenziert (nicht über den
 * Namen), damit Umbenennungen nur an einer Stelle nötig sind und zwei Labels mit
 * gleichem Anzeigenamen unterscheidbar bleiben. Die `id` ist ein beliebiger, frei
 * wählbarer Schlüssel (Slug wie "toolroom" oder fortlaufende Nummer "1").
 *
 * `tracklist` bleibt bewusst `string[]` (Kompatibilität mit Suche und Pipeline);
 * Labels werden erst zur Renderzeit über den Track-String nachgeschlagen.
 */

/**
 * Normalisiert einen Track-String für den Registry-Abgleich.
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
 * Prüft die Label-Registry auf Inkonsistenzen (hängt nicht vom Bauen ab).
 * @param {{ labels?: Record<string, { name?: string, url?: string }>, tracks?: Record<string, string> }} [registry]
 * @returns {string[]} Liste von Problemen; leer wenn alles konsistent ist.
 */
export function validateLabelRegistry(registry) {
  const issues = [];
  const labels = registry?.labels ?? {};
  const tracks = registry?.tracks ?? {};

  for (const [id, def] of Object.entries(labels)) {
    if (!def || !def.name) issues.push(`labels["${id}"]: "name" fehlt`);
    if (def?.url && !/^https?:\/\//i.test(def.url)) {
      issues.push(`labels["${id}"]: "url" ist keine http(s)-URL`);
    }
  }

  for (const [track, id] of Object.entries(tracks)) {
    if (!id) issues.push(`tracks["${track}"]: Label-ID fehlt`);
    else if (!labels[id]) issues.push(`tracks["${track}"]: unbekannte Label-ID "${id}"`);
  }

  return issues;
}

/**
 * Baut einen Resolver aus der Label-Registry.
 * @param {{ labels?: Record<string, { name?: string, url?: string }>, tracks?: Record<string, string> }} [registry]
 * @returns {{ get: (track: string) => { id: string, name: string, url: string | null } | null, hasAny: (tracks: string[]) => boolean }}
 */
export function buildTrackLabels(registry) {
  const labels = registry?.labels ?? {};
  const tracks = registry?.tracks ?? {};
  const index = new Map();

  for (const [track, id] of Object.entries(tracks)) {
    const key = normalizeTrack(track);
    const def = id ? labels[id] : null;
    if (!key || !def) continue;
    index.set(key, { id, name: def.name, url: def.url || null });
  }

  return {
    get(track) {
      return index.get(normalizeTrack(track)) ?? null;
    },
    hasAny(tracks) {
      return (tracks ?? []).some(track => index.has(normalizeTrack(track)));
    },
  };
}
