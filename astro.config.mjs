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
  '/dj/': '/djhulk-electronic-music'
  }
});
