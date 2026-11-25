/**
 * Naming-Konvention der gebrandeten OG-Bilder (1200x630 JPEG) fuer Mix-Seiten
 * und die Record-Labels-Uebersicht.
 *
 * Wird von den Seiten (`src/pages/dj/mixes/[number].astro`,
 * `src/pages/dj/labels/index.astro`), dem Generator
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

/**
 * Pfad des gebrandeten OG-Bildes der Record-Labels-Uebersicht.
 * @returns {string}
 */
export function labelsOverviewOgImagePath() {
  return '/og/labels-overview.jpg';
}

/**
 * Dateiname des gebrandeten OG-Bildes der Record-Labels-Uebersicht.
 * @returns {string}
 */
export function labelsOverviewOgImageFile() {
  return 'labels-overview.jpg';
}
