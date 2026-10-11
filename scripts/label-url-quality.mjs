/**
 * Quality-Check für Label-URLs: prüft ob die Seite tatsächlich ein Musik-Label ist.
 * Holt HTML (GET, folgt Redirects), prüft Titel/Meta/Visible-Text auf Musik-Indikatoren.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const DEFAULTS = {
  data: path.join(ROOT_DIR, 'src/data/labels.json'),
  out: path.join(ROOT_DIR, 'label-url-quality-report.json'),
  report: path.join(ROOT_DIR, 'label-url-quality-report.md'),
  concurrency: 8,
  timeoutMs: 10000,
};

const MUSIC_KEYWORDS = [
  'record', 'label', 'music', 'records', 'recording', 'release', 'artist',
  'vinyl', 'digital', 'streaming', 'beatport', 'bandcamp', 'soundcloud',
  'spotify', 'apple music', 'distribution', 'publishing', 'royalties',
  'demo', 'submit', 'contact', 'booking', 'management', 'events',
  'shop', 'store', 'merch', 'news', 'blog', 'bio', 'about us',
  'imprint', 'sublabel', 'catalog', 'discography', 'releases',
];

const NEGATIVE_KEYWORDS = [
  'domain for sale', 'buy this domain', 'parked', 'godaddy', 'sedo',
  'afternic', 'hugedomains', 'namecheap', 'premium domain',
  'make an offer', 'inquire about', 'domain marketplace',
  'this domain is for sale', 'expired domain', 'coming soon',
  'under construction', 'default web site', 'nginx', 'apache2',
  'iis windows server', 'test page', 'placeholder',
  'real estate', 'immobilien', 'finanz', 'insurance', 'versicherung',
  'lawyer', 'anwalt', 'dentist', 'zahnarzt', 'restaurant',
  'hotel', 'travel', 'reise',
];

const USER_AGENT = 'holger-kampffmeyer.de label-url-quality/0.1 ( https://holger-kampffmeyer.de )';

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--data') { options.data = path.resolve(argv[++i]); continue; }
    if (arg === '--out') { options.out = path.resolve(argv[++i]); continue; }
    if (arg === '--report') { options.report = path.resolve(argv[++i]); continue; }
    if (arg === '--concurrency') { options.concurrency = Number(argv[++i]); continue; }
    if (arg === '--timeout') { options.timeoutMs = Number(argv[++i]); continue; }
    if (arg === '--limit') { options.limit = Number(argv[++i]); continue; }
  }
  return options;
}

function extractText(html) {
  // Entfernt Scripts/Styles, normalisiert Whitespace
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function analyzeContent(url, html, finalUrl) {
  const text = extractText(html);
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].toLowerCase() : '';
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1].toLowerCase() : '';

  const searchText = `${title} ${description} ${text.slice(0, 5000)}`;

  let musicScore = 0;
  let negativeScore = 0;
  const foundMusic = [];
  const foundNegative = [];

  for (const kw of MUSIC_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(searchText)) {
      musicScore++;
      foundMusic.push(kw);
    }
  }
  for (const kw of NEGATIVE_KEYWORDS) {
    if (searchText.includes(kw.toLowerCase())) {
      negativeScore++;
      foundNegative.push(kw);
    }
  }

  // Heuristik: kurze Seiten mit wenig Text sind verdächtig
  const textLength = text.length;
  const hasSubstantialContent = textLength > 500;

  let verdict = 'unknown';
  if (negativeScore > 0) verdict = 'suspicious';
  else if (musicScore >= 3 && hasSubstantialContent) verdict = 'likely-label';
  else if (musicScore >= 1 && hasSubstantialContent) verdict = 'possible';
  else if (!hasSubstantialContent) verdict = 'thin-content';
  else verdict = 'unclear';

  return {
    url,
    finalUrl,
    verdict,
    musicScore,
    negativeScore,
    foundMusic: [...new Set(foundMusic)].slice(0, 10),
    foundNegative,
    textLength,
    title: title.slice(0, 120),
  };
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    });
    clearTimeout(timeout);
    const html = await res.text();
    return { ok: res.ok, status: res.status, html, finalUrl: res.url };
  } catch (e) {
    clearTimeout(timeout);
    return { ok: false, error: String(e), html: '', finalUrl: url };
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(options.data)) {
    console.error(`Registry nicht gefunden: ${options.data}`);
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(options.data, 'utf-8'));
  const labels = Object.entries(registry.labels ?? {});

  const toCheck = labels
    .filter(([, def]) => def?.url?.startsWith('http'))
    .map(([id, def]) => ({ id, name: def.name, url: def.url }))
    .slice(0, options.limit || Infinity);

  if (!toCheck.length) {
    console.log('Keine URLs zum Prüfen.');
    return;
  }

  console.log(`Prüfe ${toCheck.length} URLs (concurrency ${options.concurrency})...`);

  const queue = [...toCheck];
  const running = new Set();
  const results = [];

  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      const promise = (async () => {
        const { ok, status, html, finalUrl, error } = await fetchWithTimeout(item.url, options.timeoutMs);
        if (!ok || error) {
          results.push({ ...item, verdict: 'fetch-failed', error: error || `HTTP ${status}`, finalUrl: item.url, foundMusic: [], foundNegative: [] });
          console.log(`  ✗ ${item.name} → ${item.url} (${error || `HTTP ${status}`})`);
          return;
        }
        const analysis = analyzeContent(item.url, html, finalUrl);
        results.push({ ...item, ...analysis });
        const icon = analysis.verdict === 'likely-label' ? '✓' : analysis.verdict === 'suspicious' ? '⚠' : '?';
        console.log(`  ${icon} ${item.name} → ${finalUrl} [${analysis.verdict}, music=${analysis.musicScore}, neg=${analysis.negativeScore}]`);
      })();
      running.add(promise);
      try { await promise; } finally { running.delete(promise); }
    }
  }

  const workers = Array(Math.min(options.concurrency, queue.length)).fill(0).map(worker);
  await Promise.all(workers);

  // Zusammenfassung
  const byVerdict = {};
  for (const r of results) byVerdict[r.verdict] = (byVerdict[r.verdict] || 0) + 1;

  const artifact = {
    generatedAt: new Date().toISOString(),
    totalChecked: results.length,
    summary: byVerdict,
    results,
  };
  fs.writeFileSync(options.out, JSON.stringify(artifact, null, 2) + '\n');

  // Report
  const rows = results
    .sort((a, b) => a.name.localeCompare(b.name, 'de'))
    .map(r => `| ${r.name} | [${r.finalUrl || r.url}](${r.finalUrl || r.url}) | ${r.verdict} | ${r.musicScore} | ${r.negativeScore} | ${r.foundMusic.join(', ') || '-'} | ${r.foundNegative.join(', ') || '-'} |`)
    .join('\n');

  const report = `# Label-URL Quality Report

Erstellt: ${artifact.generatedAt}
Geprüft: ${artifact.totalChecked} URLs

## Zusammenfassung

${Object.entries(byVerdict).map(([k, v]) => `- **${k}**: ${v}`).join('\n')}

**Legende:**
- ✓ **likely-label**: ≥3 Musik-Keywords + substanzieller Inhalt
- ? **possible**: 1-2 Musik-Keywords + Inhalt
- ⚠ **suspicious**: Negative Keywords gefunden (Domain-Parking, Verkauf, etc.)
- **thin-content**: Seite existiert aber wenig Text (<500 Zeichen)
- **fetch-failed**: Netzwerkfehler / Timeout / HTTP Error
- **unclear**: Keine klaren Signale

## Details

| Label | URL | Verdict | Music | Neg | Gefundene Musik-Keywords | Negative Hits |
|---|---|---|---|---|---|---|
${rows}

---

**Nächste Schritte:**
1. **suspicious / thin-content / unclear** manuell prüfen
2. Falsche URLs in \`label-url-proposals.json\` korrigieren/entfernen
3. \`node scripts/label-apply.mjs --urls label-url-proposals.json\` erneut
`;

  fs.writeFileSync(options.report, report);

  console.log(`\nFertig: ${results.length} geprüft`);
  console.log(`Verteilung: ${Object.entries(byVerdict).map(([k,v])=>`${k}=${v}`).join(', ')}`);
  console.log(`Report: ${path.relative(ROOT_DIR, options.report)}`);
  console.log(`JSON: ${path.relative(ROOT_DIR, options.out)}`);
}

main();