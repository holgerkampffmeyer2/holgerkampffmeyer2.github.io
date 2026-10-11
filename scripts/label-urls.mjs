/**
 * Label-Websites für die Registry `src/data/labels.json` recherchieren.
 *
 * Liest alle Labels ohne URL aus der Registry und sucht die zugehörige
 * Website über die MusicBrainz-Label-Entity (Label-Index + `inc=url-rels`).
 * Ergebnisse landen – wie bei der Label-Vorschlagsrecherche – zuerst als
 * reviewbares Artefakt in `label-urls.json`; übernommen wird erst durch
 * `node scripts/label-apply.mjs --urls label-urls.json`.
 *
 * Verwendung:
 *   node scripts/label-urls.mjs
 *   node scripts/label-urls.mjs --limit 10
 *   node scripts/label-urls.mjs --force   # auch trotz vorhandener URL neu
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { lookupLabelUrl, createRateLimiter } from './lib/label-search.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const DEFAULTS = {
  data: path.join(ROOT_DIR, 'src/data/labels.json'),
  out: path.join(ROOT_DIR, 'label-urls.json'),
  report: path.join(ROOT_DIR, 'label-urls-report.md'),
  cache: path.join(ROOT_DIR, '.label-url-cache.json'),
};

function parseArgs(argv) {
  const options = { ...DEFAULTS, limit: Infinity, force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--force') { options.force = true; continue; }
    if (arg === '--data') { options.data = path.resolve(argv[++i]); continue; }
    if (arg === '--out') { options.out = path.resolve(argv[++i]); continue; }
    if (arg === '--report') { options.report = path.resolve(argv[++i]); continue; }
    if (arg === '--cache') { options.cache = path.resolve(argv[++i]); continue; }
    if (arg === '--limit') { options.limit = Number(argv[++i]); continue; }
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

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(options.data)) {
    console.error(`Registry nicht gefunden: ${options.data}`);
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(options.data, 'utf-8'));
  const labels = Object.entries(registry.labels ?? {});
  const names = labels
    .filter(([, def]) => options.force || !(def?.url ?? '').trim())
    .map(([, def]) => (def?.name ?? '').trim())
    .filter(Boolean);

  if (!names.length) {
    console.log('Keine Labels ohne URL – nichts zu tun.');
    return;
  }

  const cache = loadCache(options.cache);
  const cacheStore = {
    get: key => cache[key],
    set: (key, value) => { cache[key] = value; },
  };
  const rateLimit = createRateLimiter(1000);

  const picked = names.slice(0, options.limit);
  const suggestions = [];
  const unresolved = [];

  console.log(`Labels ohne URL: ${names.length}${picked.length < names.length ? ` (limit ${picked.length})` : ''}`);
  for (let i = 0; i < picked.length; i++) {
    const name = picked[i];
    const result = await lookupLabelUrl(name, { fetchImpl: globalThis.fetch, cache: cacheStore, rateLimit });
    const labelDef = labels.find(([, def]) => (def?.name ?? '').trim() === name);
    const id = labelDef?.[0] ?? '';
    if (result) {
      suggestions.push(result);
      console.log(`  ✓ ${name} → ${result.url} (${result.via})`);
    } else if (id) {
      unresolved.push(name);
      console.log(`  – ${name} (keine URL bei MusicBrainz)`);
    }
    if ((i + 1) % 25 === 0) {
      fs.writeFileSync(options.cache, JSON.stringify(cache, null, 2) + '\n');
    }
  }

  fs.writeFileSync(options.cache, JSON.stringify(cache, null, 2) + '\n');

  const artifact = {
    generatedAt: new Date().toISOString(),
    total: picked.length,
    resolved: suggestions.length,
    unresolved,
    suggestions,
  };
  fs.writeFileSync(options.out, JSON.stringify(artifact, null, 2) + '\n');

  const rows = suggestions
    .map(suggestion => `| ${suggestion.name} | [${suggestion.url}](${suggestion.url}) | ${suggestion.via} |`)
    .join('\n');
  const unresolvedLines = unresolved.length ? unresolved.map(name => `- ${name}`).join('\n') : '(keine)';
  const report = `# Label-URL-Recherche

Erstellt am ${new Date().toISOString()}
Quelle: MusicBrainz Label-Entity (Label-Index + \`inc=url-rels\`)

## Statistik

- Labels geprüft: ${picked.length}
- Mit URL gefunden: ${suggestions.length}
- Offen: ${unresolved.length}

## Vorschläge

| Label | URL | Quelle |
|---|---|---|
${rows}

## Nicht gefunden

${unresolvedLines}
`;
  fs.writeFileSync(options.report, report);

  console.log(`\nVorschläge: ${suggestions.length} → ${path.relative(ROOT_DIR, options.out)}`);
  console.log(`Report: ${path.relative(ROOT_DIR, options.report)}`);
  console.log(`Offen: ${unresolved.length}`);
  console.log('Zum Übernehmen: node scripts/label-apply.mjs --urls label-urls.json');
}

await main();