#!/usr/bin/env node
/**
 * Smoke test for the built site in dist/.
 * Fails when astro build succeeded but the deployable output is broken or empty.
 * Usage: node scripts/smoke-dist.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.join(process.cwd(), 'dist');

const FILES = [
  'index.html',
  'rss.xml',
  'urllist.txt',
  'robots.txt',
  'sitemap-index.xml',
  'djhulk-electronic-music/index.html',
  'dj/mixes-weekly/index.html',
  'dj/mixes-blog-archive/index.html',
  'links/index.html',
  'vermietung/index.html',
];

const MIN_BYTES = 50;

function checkFile(relative) {
  const full = path.join(DIST_DIR, relative);
  if (!fs.existsSync(full)) {
    return { relative, ok: false, reason: 'fehlt' };
  }
  const size = fs.statSync(full).size;
  if (size < MIN_BYTES) {
    return { relative, ok: false, reason: `nur ${size} Bytes` };
  }
  return { relative, ok: true, size };
}

function checkHtml(relative) {
  const full = path.join(DIST_DIR, relative);
  if (!fs.existsSync(full)) return { ok: false, reason: 'fehlt' };
  const html = fs.readFileSync(full, 'utf-8');
  if (!/<title>/i.test(html)) return { ok: false, reason: 'kein <title>' };
  if (!/<html[^>]+lang=/i.test(html)) return { ok: false, reason: 'kein lang-Attribut' };
  return { ok: true };
}

const failures = [];

console.log('Smoke-Test dist/\n');

for (const relative of FILES) {
  const result = checkFile(relative);
  if (result.ok) {
    console.log(`  ✓ ${relative} (${result.size} B)`);
  } else {
    console.log(`  ✗ ${relative} — ${result.reason}`);
    failures.push(relative);
  }
}

console.log('');

for (const relative of FILES.filter((f) => f.endsWith('.html'))) {
  const result = checkHtml(relative);
  if (!result.ok) {
    console.log(`  ✗ ${relative} — ${result.reason}`);
    failures.push(`${relative} (${result.reason})`);
  }
}

// RSS und urllist muessen Inhalt haben, nicht nur existieren
const rss = checkFile('rss.xml');
if (rss.ok) {
  const rssItems = (fs.readFileSync(path.join(DIST_DIR, 'rss.xml'), 'utf-8').match(/<item>/g) || []).length;
  if (rssItems === 0) {
    console.log('  ✗ rss.xml — keine <item>');
    failures.push('rss.xml leer');
  } else {
    console.log(`  ✓ rss.xml enthält ${rssItems} Items`);
  }
}

const urlList = checkFile('urllist.txt');
if (urlList.ok) {
  const urlCount = fs
    .readFileSync(path.join(DIST_DIR, 'urllist.txt'), 'utf-8')
    .split('\n')
    .filter(Boolean).length;
  if (urlCount === 0) {
    console.log('  ✗ urllist.txt — keine URLs');
    failures.push('urllist.txt leer');
  } else {
    console.log(`  ✓ urllist.txt enthält ${urlCount} URLs`);
  }
}

const pageCount = fs
  .readdirSync(DIST_DIR, { withFileTypes: true })
  .length;

console.log('');

if (failures.length > 0) {
  console.error(`Smoke-Test FEHLGESCHLAGEN (${failures.length} Probleme):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Smoke-Test bestanden (${FILES.length} Dateien, ${pageCount} Top-Level-Einträge in dist/).`);