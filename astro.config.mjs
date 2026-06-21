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
  integrations: [sitemap({
    serialize(item) {
      const url = new URL(item.url);
      const path = decodeURIComponent(url.pathname);
      const now = new Date().toISOString();
      let priority = 0.5;
      let changefreq = 'monthly';
      if (path === '/') { priority = 1.0; changefreq = 'weekly'; }
      else if (path.startsWith('/dj/mixes') && path !== '/dj/mixes-all' && path !== '/dj/mixes-blog-archive') { priority = 0.8; changefreq = 'weekly'; }
      else if (path === '/djhulk-electronic-music') { priority = 0.8; changefreq = 'weekly'; }
      else if (path === '/work' || path === '/dj/videos' || path === '/dj/em3f') { priority = 0.6; }
      else if (path === '/links') { priority = 0.5; }
      else if (path === '/impressum' || path.startsWith('/vermietung')) { priority = 0.3; changefreq = 'yearly'; }
      return { ...item, changefreq, lastmod: now, priority };
    }
  })],
  redirects: {
  '/dj/': '/djhulk-electronic-music',
  '/vermietung.html': 'https://soundundlicht-stuttgart.de/vermietung/',
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
