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
  'dj/labels/index.html',
  'links/index.html',
  'vermietung/index.html',
];

const MIN_BYTES = 50;

const REDIRECT_STUBS = {
  'vermietung/index.html': 'https://soundundlicht-stuttgart.de/vermietung',
};

const NAV_EXCLUDED_PAGES = new Set([...Object.keys(REDIRECT_STUBS), 'links/index.html']);

const NOINDEX_LABEL_PAGES = ['dj/labels/nothing-hurt/index.html'];
const INDEXED_LABEL_PAGES = ['dj/labels/ministry-of-sound/index.html'];
const THIN_LABEL_LINK_SOURCES = ['dj/mixes-weekly/index.html', 'dj/labels/index.html'];
const LABEL_OVERVIEW_PAGE = 'dj/labels/index.html';

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

function checkRedirectStub(relative, target) {
  const full = path.join(DIST_DIR, relative);
  if (!fs.existsSync(full)) return { ok: false, reason: 'fehlt' };
  const html = fs.readFileSync(full, 'utf-8');
  if (!html.includes('http-equiv="refresh"') || !html.includes(`content="0;url=${target}"`)) {
    return { ok: false, reason: 'kein Redirect-Stub' };
  }
  if (!html.includes('name="robots" content="noindex"')) return { ok: false, reason: 'Stub nicht noindex' };
  if (!html.includes(`rel="canonical" href="${target}"`)) return { ok: false, reason: 'falsches canonical' };
  return { ok: true };
}

function checkNoIndex(relative, expected) {
  const full = path.join(DIST_DIR, relative);
  if (!fs.existsSync(full)) return { ok: false, reason: 'fehlt' };
  const html = fs.readFileSync(full, 'utf-8');
  const isNoIndex = html.includes('name="robots" content="noindex, nofollow"');
  if (isNoIndex !== expected) return { ok: false, reason: expected ? 'fehlt noindex' : 'unerwartet noindex' };
  return { ok: true };
}

function checkNoThinLabelLink(relative) {
  const full = path.join(DIST_DIR, relative);
  if (!fs.existsSync(full)) return { ok: false, reason: 'fehlt' };
  const html = fs.readFileSync(full, 'utf-8');
  if (html.includes('/dj/labels/nothing-hurt')) return { ok: false, reason: 'verlinkt dünnes Label' };
  return { ok: true };
}

function checkLabelOverview(relative) {
  const full = path.join(DIST_DIR, relative);
  if (!fs.existsSync(full)) return { ok: false, reason: 'fehlt' };
  const html = fs.readFileSync(full, 'utf-8');
  const required = [
    'id="label-search"',
    'id="label-min-tracks"',
    'id="label-rows"',
    'data-label-toggle',
    'data-label-details-row',
    'id="label-overview-data"',
    'aria-label="Seitennavigation"',
  ];
  const missing = required.filter((token) => !html.includes(token));
  if (missing.length) return { ok: false, reason: `fehlt: ${missing.join(', ')}` };
  if (!/rel="canonical" href="[^"]*\/dj\/labels"/.test(html)) {
    return { ok: false, reason: 'falsches canonical' };
  }
  if (html.includes('Knowledge Magazine')) return { ok: false, reason: 'Knowledge Magazine vorhanden' };
  if (html.includes('href="/dj/labels/nothing-hurt"')) return { ok: false, reason: 'dünnes Label verlinkt' };
  return { ok: true };
}

function checkNavLink(relative) {
  const full = path.join(DIST_DIR, relative);
  if (!fs.existsSync(full)) return { ok: false, reason: 'fehlt' };
  const html = fs.readFileSync(full, 'utf-8');
  if (!html.includes('href="/dj/labels"')) return { ok: false, reason: 'kein Labels-Link im Menü' };
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

for (const relative of NOINDEX_LABEL_PAGES) {
  const result = checkNoIndex(relative, true);
  if (!result.ok) {
    console.log(`  ✗ ${relative} — ${result.reason}`);
    failures.push(`${relative} (${result.reason})`);
  }
}

for (const relative of INDEXED_LABEL_PAGES) {
  const result = checkNoIndex(relative, false);
  if (!result.ok) {
    console.log(`  ✗ ${relative} — ${result.reason}`);
    failures.push(`${relative} (${result.reason})`);
  }
}

for (const relative of THIN_LABEL_LINK_SOURCES) {
  const result = checkNoThinLabelLink(relative);
  if (!result.ok) {
    console.log(`  ✗ ${relative} — ${result.reason}`);
    failures.push(`${relative} (${result.reason})`);
  }
}

const overviewResult = checkLabelOverview(LABEL_OVERVIEW_PAGE);
if (!overviewResult.ok) {
  console.log(`  ✗ ${LABEL_OVERVIEW_PAGE} — ${overviewResult.reason}`);
  failures.push(`${LABEL_OVERVIEW_PAGE} (${overviewResult.reason})`);
}

for (const relative of FILES.filter((file) => file.endsWith('/index.html') && !NAV_EXCLUDED_PAGES.has(file))) {
  const result = checkNavLink(relative);
  if (!result.ok) {
    console.log(`  ✗ ${relative} — ${result.reason}`);
    failures.push(`${relative} (${result.reason})`);
  }
}

console.log('');

for (const relative of FILES.filter((f) => f.endsWith('.html'))) {
  const result = relative in REDIRECT_STUBS
    ? checkRedirectStub(relative, REDIRECT_STUBS[relative])
    : checkHtml(relative);
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