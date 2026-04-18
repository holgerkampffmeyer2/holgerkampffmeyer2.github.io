import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function getExistingUrls(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function findMixPages() {
  const mixesDir = path.join(DIST_DIR, 'dj', 'mixes');
  if (!fs.existsSync(mixesDir)) return [];
  
  const files = fs.readdirSync(mixesDir);
  const baseUrl = 'https://holger-kampffmeyer.de';
  
  return files
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => `${baseUrl}/dj/mixes/${f.replace('.html', '')}`)
    .sort();
}

function updateSitemap() {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  let existingUrls = getExistingUrls(sitemapPath);
  const mixUrls = findMixPages();
  const today = new Date().toISOString().split('T')[0];
  
  // Remove mix URLs from existing that we'll re-add
  existingUrls = existingUrls.filter(url => !url.includes('/dj/mixes/'));
  
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
  
  for (const url of existingUrls) {
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
  console.log(`✅ Updated sitemap.xml with ${mixUrls.length} mix pages`);
}

function updateUrllist() {
  const urllistPath = path.join(PUBLIC_DIR, 'urllist.txt');
  const baseUrl = 'https://holger-kampffmeyer.de';
  
  // Get static pages from sitemap (without mix pages)
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  let staticUrls = getExistingUrls(sitemapPath).filter(url => !url.includes('/dj/mixes/'));
  
  // Get all mix pages sorted by number descending
  const mixUrls = findMixPages().sort((a, b) => {
    const numA = parseInt(a.split('/').pop());
    const numB = parseInt(b.split('/').pop());
    return numB - numA;
  });
  
  // Combine: base + static pages + all mix pages
  const urls = [baseUrl, ...staticUrls, ...mixUrls];
  
  fs.writeFileSync(urllistPath, urls.join('\n') + '\n');
  console.log(`✅ Updated urllist.txt with ${urls.length} URLs`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSitemap();
  updateUrllist();
}

export { updateSitemap, updateUrllist };