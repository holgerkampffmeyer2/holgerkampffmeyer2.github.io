import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function findStaticPages() {
  const baseUrl = 'https://holger-kampffmeyer.de';
  const pages = [];
  
  // Find all HTML files in dist/ except mix pages
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.html')) {
        // Skip root index.html (added separately below)
        if (fullPath === path.join(DIST_DIR, 'index.html')) continue;
        const relativePath = path.relative(DIST_DIR, fullPath).replace('.html', '').replace(/\/index$/, '').replace(/\\/g, '/');
        // Exclude Google verification files and other non-pages
        if (!relativePath.startsWith('dj/mixes/') && !relativePath.includes('googlehostedservice')) {
          pages.push(`${baseUrl}/${relativePath}`);
        }
      }
    }
  }
  
  walkDir(DIST_DIR);
  // Add root URL
  pages.unshift(baseUrl);
  return pages.sort();
}

function findMixPages() {
  const mixesDir = path.join(DIST_DIR, 'dj', 'mixes');
  if (!fs.existsSync(mixesDir)) return [];
  
  const baseUrl = 'https://holger-kampffmeyer.de';
  const pages = [];
  
  function walkMixDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkMixDir(fullPath);
      } else if (item.endsWith('.html') && item !== 'index.html') {
        // Direct .html file (format: 'file')
        const relativePath = path.relative(mixesDir, fullPath).replace('.html', '');
        pages.push(`${baseUrl}/dj/mixes/${relativePath}`);
      } else if (item === 'index.html' && dir !== mixesDir) {
        // index.html in subdirectory (format: 'directory')
        const mixNum = path.basename(dir);
        pages.push(`${baseUrl}/dj/mixes/${mixNum}`);
      }
    }
  }
  
  walkMixDir(mixesDir);
  return pages.sort();
}

function updateSitemap(staticUrls, mixUrls) {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  const today = new Date().toISOString().split('T')[0];
  
  if (mixUrls.length === 0) {
    console.log('No mix pages found in dist/');
    return;
  }
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;
  
  for (const url of staticUrls) {
    sitemap += `
<url>
  <loc>${url}</loc>
  <lastmod>${today}</lastmod>
  <priority>0.80</priority>
</url>`;
  }
  
  // Sort mix URLs by number (descending - newest first)
  const sortedMixUrls = [...mixUrls].sort((a, b) => {
    const numA = parseInt(a.split('/').pop());
    const numB = parseInt(b.split('/').pop());
    return numB - numA;
  });
  
  // Find the newest mix number for dynamic priority
  const newestMixNum = sortedMixUrls.length > 0 ? parseInt(sortedMixUrls[0].split('/').pop()) : 0;
  
  for (const url of sortedMixUrls) {
    const num = parseInt(url.split('/').pop());
    // Newest mixes (top 3) get higher priority
    const priority = (newestMixNum - num) <= 2 ? '0.90' : '0.80';
    sitemap += `
<url>
  <loc>${url}</loc>
  <lastmod>${today}</lastmod>
  <priority>${priority}</priority>
</url>`;
  }
  
  sitemap += `
</urlset>`;
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Updated sitemap.xml with ${staticUrls.length} static + ${mixUrls.length} mix pages`);
}

function updateUrllist(staticUrls, mixUrls) {
  const urllistPath = path.join(PUBLIC_DIR, 'urllist.txt');
  const baseUrl = 'https://holger-kampffmeyer.de';
  
  // Get all mix pages sorted by number descending
  const sortedMixUrls = [...mixUrls].sort((a, b) => {
    const numA = parseInt(a.split('/').pop());
    const numB = parseInt(b.split('/').pop());
    return numB - numA;
  });
  
  // Combine: base + static pages + all mix pages
  const urls = [`${baseUrl}/`, ...staticUrls, ...sortedMixUrls];
  
  fs.writeFileSync(urllistPath, urls.join('\n') + '\n');
  console.log(`✅ Updated urllist.txt with ${urls.length} URLs`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const staticUrls = findStaticPages();
  const mixUrls = findMixPages();
  updateSitemap(staticUrls, mixUrls);
  updateUrllist(staticUrls, mixUrls);
}

export { updateSitemap, updateUrllist };