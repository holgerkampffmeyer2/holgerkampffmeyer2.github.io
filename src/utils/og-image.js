/**
 * Naming-Konvention der gebrandeten OG-Bilder (1200x630 JPEG) fuer Mix-Seiten.
 *
 * Wird von der Mix-Seite (`src/pages/dj/mixes/[number].astro`), dem Generator
 * (`scripts/generate-mix-og.mjs`) und dem Test (`tests/og-images.test.mjs`)
 * geteilt, damit Seiten, Assets und Test nicht auseinanderlaufen.
 *
 * Bewusst nur JPEG: WebP wird von einem Teil der Social-Crawler nicht
 * gerendert, deshalb ist das JPEG die einzige Variante fuer og:image.
 */

/**
 * Pfad des gebrandeten OG-Bildes eines Mixes.
 * @param {string} slug
 * @returns {string}
 */
export function brandedOgImagePath(slug) {
  return `/og/mix-${slug}.jpg`;
}

/**
 * Dateiname des gebrandeten OG-Bildes eines Mixes.
 * @param {string} slug
 * @returns {string}
 */
export function brandedOgImageFile(slug) {
  return `mix-${slug}.jpg`;
}
