/**
 * Centralized DJ Person Schema for JSON-LD structured data.
 * Usage: import { getDjPersonSchema } from '../utils/dj-schema.js';
 */
export function getDjPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "DJ Hulk",
    "alternateName": "Holger Kampffmeyer",
    "jobTitle": "Electronic Music DJ",
    "description": "DJ Hulk ist ein elektronischer DJ aus Stuttgart, spezialisiert auf House, Tech House, Techno und Drum n Bass.",
    "url": "https://holger-kampffmeyer.de/djhulk-electronic-music/",
    "image": "https://holger-kampffmeyer.de/img/_81A4010.webp",
    "sameAs": [
      "https://www.mixcloud.com/holger-kampffmeyer/",
      "https://soundcloud.com/holger-kampffmeyer2",
      "https://open.spotify.com/user/11131869179",
      "https://www.youtube.com/@djhulk_de",
      "https://www.instagram.com/djhulk_de",
      "https://www.facebook.com/holger.kampffmeyer",
      "https://de.ra.co/dj/djhulk"
    ]
  };
}
