// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  vite: {
    // @ts-ignore - Type mismatch between Astro's bundled Vite and the project's Vite version
    plugins: [tailwindcss()]
  },
  site: 'https://holger-kampffmeyer.de',
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  redirects: {
  '/dj/': '/djhulk-electronic-music',
  '/vermietung/djpaket-fildern/': 'https://soundundlicht-stuttgart.de/vermietung/djpaket-fildern/',
  '/vermietung/jbl-partybox-300-320/': 'https://soundundlicht-stuttgart.de/vermietung/jbl-partybox-300-320/',
  '/vermietung/kls-laser-bar/': 'https://soundundlicht-stuttgart.de/vermietung/kls-laser-bar/',
  '/vermietung/ld-maui-28g3/': 'https://soundundlicht-stuttgart.de/vermietung/ld-maui-28g3/',
  '/vermietung/led-bossfx-nebelmaschine/': 'https://soundundlicht-stuttgart.de/vermietung/led-bossfx-nebelmaschine/',
  '/vermietung/partylicht-moving-head/': 'https://soundundlicht-stuttgart.de/vermietung/partylicht-moving-head/',
  '/vermietung/partypaket-stuttgart/': 'https://soundundlicht-stuttgart.de/vermietung/partypaket-stuttgart/',
  '/vermietung/veranstaltungspaket-stuttgart/': 'https://soundundlicht-stuttgart.de/vermietung/veranstaltungspaket-stuttgart/'
  }
});
