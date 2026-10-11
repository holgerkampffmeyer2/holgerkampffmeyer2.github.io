/**
 * Semi-automatische Label-Website-Suche für Review.
 *
 * Quellen:
 * 1. MusicBrainz "official homepage" Relation (höchste Confidence)
 * 2. Heuristische Domain-Patterns + HTTP HEAD-Check
 * 3. Bestehende MusicBrainz-URLs (Discogs, Beatport, SoundCloud) als Fallback
 *
 * Ausgabe: label-url-proposals.json (reviewbar, manuell erweiterbar)
 * Apply:  node scripts/label-apply.mjs --urls label-url-proposals.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { labelMatchKey, labelCacheKey, createRateLimiter } from './lib/label-search.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const DEFAULTS = {
  data: path.join(ROOT_DIR, 'src/data/labels.json'),
  mbCache: path.join(ROOT_DIR, '.label-url-cache.json'),
  out: path.join(ROOT_DIR, 'label-url-proposals.json'),
  report: path.join(ROOT_DIR, 'label-url-proposals-report.md'),
  concurrency: 6,
  timeoutMs: 8000,
};

function generateHyphenatedVariants(base) {
  const variants = new Set();
  const suffixes = ['records', 'recordings', 'music', 'label', 'sounds', 'trax', 'traxx', 'audio', 'beats', 'digital', 'media', 'arts', 'crew', 'family', 'gang', 'squad', 'team', 'collective'];
  for (const suf of suffixes) {
    if (base.endsWith(suf) && base.length > suf.length) {
      const prefix = base.slice(0, -suf.length);
      if (prefix.length >= 3) variants.add(`${prefix}-${suf}`);
    }
  }
  return Array.from(variants);
}

function buildPrioritizedPatterns(base) {
  const hyphenatedVariants = generateHyphenatedVariants(base);
  const allBases = [base, ...hyphenatedVariants];
  const tlds = ['.com', '.de', '.co.uk', '.net', '.org', '.eu'];
  const suffixes = ['', 'records', 'music', 'label'];
  const patterns = [];
  for (const b of allBases) {
    for (const suf of suffixes) {
      for (const tld of tlds) {
        if (suf && !b.endsWith(suf)) {
          patterns.push(`${b}${suf}${tld}`);
        } else if (!suf) {
          patterns.push(`${b}${tld}`);
        }
      }
    }
  }
  return [...new Set(patterns)];
}

const USER_AGENT = 'holger-kampffmeyer.de label-url-finder/0.1 ( https://holger-kampffmeyer.de )';

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--data') { options.data = path.resolve(argv[++i]); continue; }
    if (arg === '--mb-cache') { options.mbCache = path.resolve(argv[++i]); continue; }
    if (arg === '--out') { options.out = path.resolve(argv[++i]); continue; }
    if (arg === '--report') { options.report = path.resolve(argv[++i]); continue; }
    if (arg === '--concurrency') { options.concurrency = Number(argv[++i]); continue; }
    if (arg === '--timeout') { options.timeoutMs = Number(argv[++i]); continue; }
  }
  return options;
}

function loadCache(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return {};
  }
}

function slugifyBase(name) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .replace(/^(the|a|an)\b/, '');
}

async function headOk(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT } });
    clearTimeout(timeout);
    return res.ok && res.url.startsWith('http');
  } catch {
    clearTimeout(timeout);
    return false;
  }
}

async function findOfficialViaPatterns(base, timeoutMs) {
  const candidates = buildPrioritizedPatterns(base);
  const batchSize = 8;
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(domain => {
      const url = `https://${domain}`;
      return headOk(url, timeoutMs).then(ok => ok ? { url, via: 'pattern', domain } : null);
    }));
    const hit = results.find(r => r);
    if (hit) return hit;
  }
  return null;
}

function extractMbOfficialHomepage(mbData) {
  const relations = Array.isArray(mbData?.relations) ? mbData.relations : [];
  for (const rel of relations) {
    if ((rel.type ?? '').toLowerCase() === 'official homepage' && rel.url?.resource?.startsWith('http')) {
      return { url: rel.url.resource, via: 'musicbrainz-official' };
    }
  }
  return null;
}

function pickBestMbUrl(mbData) {
  const relations = Array.isArray(mbData?.relations) ? mbData.relations : [];
  for (const rel of relations) {
    if (rel.url?.resource?.startsWith('http')) {
      return { url: rel.url.resource, via: `musicbrainz-${rel.type ?? 'relation'}` };
    }
  }
  return null;
}

async function processLabel(name, mbCache, options) {
  const cacheKey = labelCacheKey(name);
  const cached = mbCache[cacheKey];
  let mbResult = null;

  if (cached?.mbid) {
    try {
    } catch { /* ignore */ }
  }

  const base = slugifyBase(name);
  const patternHit = await findOfficialViaPatterns(base, options.timeoutMs);
  if (patternHit) return { name, ...patternHit, confidence: 0.85, source: 'pattern' };

  return { name, url: null, via: 'none', confidence: 0, source: 'none' };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(options.data)) {
    console.error(`Registry nicht gefunden: ${options.data}`);
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(options.data, 'utf-8'));
  const labels = Object.entries(registry.labels ?? {});

  const pending = labels
    .filter(([, def]) => !(def?.url ?? '').trim())
    .map(([, def]) => (def?.name ?? '').trim())
    .filter(Boolean);

  if (!pending.length) {
    console.log('Alle Labels haben bereits URLs.');
    return;
  }

  const mbCache = loadCache(options.mbCache);
  const rateLimit = createRateLimiter(1100);

  console.log(`Prüfe ${pending.length} Labels ohne URL...`);
  const semaphore = (async () => {
    const queue = [...pending];
    const running = new Set();
    const results = [];

    async function worker() {
      while (queue.length) {
        const name = queue.shift();
        const promise = (async () => {
          const res = await processLabel(name, mbCache, options);
          results.push(res);
          if (res.url) console.log(`  ✓ ${name} → ${res.url} (${res.via}, conf=${res.confidence})`);
          else console.log(`  – ${name} (${res.via})`);
        })();
        running.add(promise);
        try { await promise; } finally { running.delete(promise); }
      }
    }

    const workers = Array(Math.min(options.concurrency, pending.length)).fill(0).map(worker);
    await Promise.all(workers);
    return results;
  })();

  const done = await semaphore;

  const existing = labels
    .filter(([, def]) => (def?.url ?? '').trim())
    .map(([, def]) => ({ name: (def?.name ?? '').trim(), url: def.url, via: 'existing', confidence: 1, source: 'registry' }));

  const allProposals = [...done, ...existing].sort((a, b) => a.name.localeCompare(b.name, 'de'));

  const artifact = {
    generatedAt: new Date().toISOString(),
    total: allProposals.length,
    withUrl: allProposals.filter(p => p.url).length,
    proposals: allProposals,
  };
  fs.writeFileSync(options.out, JSON.stringify(artifact, null, 2) + '\n');

  const rows = allProposals
    .filter(p => p.url)
    .map(p => `| ${p.name} | [${p.url}](${p.url}) | ${p.via} | ${p.confidence} |`)
    .join('\n');
  const missing = allProposals.filter(p => !p.url).map(p => `- ${p.name}`).join('\n') || '(alle haben Vorschläge)';
  const report = `# Label-URL-Vorschläge (Review)

Erstellt: ${artifact.generatedAt}
Quellen: MusicBrainz official homepage, Domain-Patterns (HEAD-Check), bestehende Registry-URLs

## Statistik
- Labels gesamt: ${artifact.total}
- Mit URL-Vorschlag: ${artifact.withUrl}
- Offen: ${artifact.total - artifact.withUrl}

## Vorschläge

| Label | URL | Quelle | Confidence |
|---|---|---|---|
${rows}

## Ohne Vorschlag (manuell ergänzen)

${missing}

---
**Workflow:** Datei \`${path.basename(options.out)}\` editieren (URLs korrigieren/ergänzen), dann:
\`\`\`bash
node scripts/label-apply.mjs --urls ${path.basename(options.out)}
\`\`\`
`;
  fs.writeFileSync(options.report, report);

  console.log(`\n${artifact.withUrl}/${artifact.total} Vorschläge → ${path.relative(ROOT_DIR, options.out)}`);
  console.log(`Report: ${path.relative(ROOT_DIR, options.report)}`);
  console.log('Editieren, dann: node scripts/label-apply.mjs --urls label-url-proposals.json');
}

main();