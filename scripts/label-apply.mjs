/**
 * Übernimmt die reviewten Vorschläge aus `label-research.json` in die
 * Label-Registry `src/data/labels.json`.
 *
 * Label-Namen werden normalisiert und dedupliziert (gleicher Name → gleiche ID),
 * IDs als Slug vergeben. Anschließend wird die Registry konsistenz-validiert;
 * bei Problemen wird nichts geschrieben (außer `--force`).
 *
 * Verwendung:
 *   node scripts/label-apply.mjs --dry-run
 *   node scripts/label-apply.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateLabelRegistry } from '../src/utils/track-labels.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const DEFAULTS = {
  in: path.join(ROOT_DIR, 'label-research.json'),
  registry: path.join(ROOT_DIR, 'src/data/labels.json'),
};

function parseArgs(argv) {
  const options = { ...DEFAULTS, dryRun: false, overwrite: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') { options.dryRun = true; continue; }
    if (arg === '--overwrite') { options.overwrite = true; continue; }
    if (arg === '--force') { options.force = true; continue; }
    if (arg === '--in') { options.in = path.resolve(argv[++i]); continue; }
    if (arg === '--registry') { options.registry = path.resolve(argv[++i]); continue; }
  }
  return options;
}

function slugify(name) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'label';
}

function findLabelId(labels, name) {
  const target = name.trim().toLowerCase();
  for (const [id, def] of Object.entries(labels)) {
    if ((def?.name ?? '').trim().toLowerCase() === target) return id;
  }
  return null;
}

function uniqueId(labels, base) {
  let id = base;
  let suffix = 2;
  while (labels[id]) id = `${base}-${suffix++}`;
  return id;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(options.in)) {
    console.error(`Vorschlags-Datei nicht gefunden: ${options.in}\nZuerst 'node scripts/label-research.mjs' ausführen.`);
    process.exit(1);
  }

  const research = JSON.parse(fs.readFileSync(options.in, 'utf-8'));
  const registry = JSON.parse(fs.readFileSync(options.registry, 'utf-8'));
  registry.labels ??= {};
  registry.tracks ??= {};

  const suggestions = research.suggestions ?? [];
  const addedLabels = [];
  const addedTracks = [];
  const skipped = [];

  for (const suggestion of suggestions) {
    const track = (suggestion.track ?? '').trim();
    const name = (suggestion.label ?? '').trim();
    if (!track || !name) continue;

    if (registry.tracks[track] && !options.overwrite) {
      skipped.push(track);
      continue;
    }

    let id = findLabelId(registry.labels, name);
    if (!id) {
      id = uniqueId(registry.labels, slugify(name));
      registry.labels[id] = { name, url: '' };
      addedLabels.push(`${name} (${id})`);
    } else {
      const existing = registry.labels[id];
      const isAllCaps = value => value === value.toUpperCase() && /[A-ZÄÖÜ]/.test(value);
      if (existing && isAllCaps(existing.name) && !isAllCaps(name)) existing.name = name;
    }
    if (registry.tracks[track] !== id) {
      registry.tracks[track] = id;
      addedTracks.push(track);
    }
  }

  const issues = validateLabelRegistry(registry);

  console.log(`Vorschläge: ${suggestions.length}`);
  console.log(`Neue Labels: ${addedLabels.length}`);
  console.log(`Neue Track-Zuordnungen: ${addedTracks.length}`);
  console.log(`Übersprungen (bereits gesetzt): ${skipped.length}`);
  if (addedLabels.length) console.log('  ' + addedLabels.slice(0, 10).join(', ') + (addedLabels.length > 10 ? ' …' : ''));

  if (issues.length) {
    console.error(`\nValidierung meldet ${issues.length} Problem(e):`);
    for (const issue of issues.slice(0, 20)) console.error(`  - ${issue}`);
    if (!options.force) {
      console.error('\nNichts geschrieben (mit --force erzwingen).');
      process.exit(1);
    }
  }

  if (options.dryRun) {
    console.log('\n--dry-run: Registry unverändert.');
    return;
  }

  fs.writeFileSync(options.registry, JSON.stringify(registry, null, 2) + '\n');
  console.log(`\nGeschrieben: ${path.relative(ROOT_DIR, options.registry)}`);
}

main();
