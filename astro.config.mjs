// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    // @ts-ignore - Type mismatch between Astro's bundled Vite and the project's Vite version
    plugins: [tailwindcss()]
  },
  site: 'https://holger-kampffmeyer.de',
  base: '/',
  output: 'static',
  build: {
    format: 'file'
  }
});
