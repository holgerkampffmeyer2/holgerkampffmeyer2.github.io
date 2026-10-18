/**
 * Übernimmt die reviewten Vorschläge aus `label-research.json` in die
 * Label-Registry `src/data/labels.json`.
 *
 * Label-Namen werden normalisiert und dedupliziert (gleicher Name → gleiche ID),
 * IDs als Slug vergeben. Anschließend wird die Registry konsistenz-validiert;
 * bei Problemen wird nichts geschrieben (außer `--force`).
 *
 * Markiert mit `--urls <label-urls.json>` werden stattdessen nur die
 * recherchierten Label-Websites in die Registry übernommen (Track-Zuordnungen
 * bleiben unverändert).
 *
 * Verwendung:
 *   node scripts/label-apply.mjs --dry-run
 *   node scripts/label-apply.mjs
 *   node scripts/label-apply.mjs --urls label-urls.json --dry-run
 *   node scripts/label-apply.mjs --urls label-urls.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateLabelRegistry } from '../src/utils/track-labels.js';
import { slugify, findLabelId, uniqueId, applyUrlSuggestions, urlSuggestionsFromArtifact } from './lib/label-apply.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const DEFAULTS = {
  in: path.join(ROOT_DIR, 'label-research.json'),
  urls: path.join(ROOT_DIR, 'label-urls.json'),
  registry: path.join(ROOT_DIR, 'src/data/labels.json'),
};

function parseArgs(argv) {
  const options = { ...DEFAULTS, dryRun: false, overwrite: false, force: false, urlsMode: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') { options.dryRun = true; continue; }
    if (arg === '--overwrite') { options.overwrite = true; continue; }
    if (arg === '--force') { options.force = true; continue; }
    if (arg === '--in') { options.in = path.resolve(argv[++i]); continue; }
    if (arg === '--urls') { options.urls = path.resolve(argv[++i]); options.urlsMode = true; continue; }
    if (arg === '--registry') { options.registry = path.resolve(argv[++i]); continue; }
  }
  return options;
}

function applyUrls(registry, urlFile, options) {
  const artifact = JSON.parse(fs.readFileSync(urlFile, 'utf-8'));
  const suggestions = urlSuggestionsFromArtifact(artifact);
  const { updated, skipped } = applyUrlSuggestions(registry, suggestions, options);

  console.log(`URL-Vorschläge: ${suggestions.length}`);
  console.log(`Aktualisierte URLs: ${updated}`);
  console.log(`Übersprungen (bereits gesetzt): ${skipped}`);
  return updated;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const registry = JSON.parse(fs.readFileSync(options.registry, 'utf-8'));
  registry.labels ??= {};
  registry.tracks ??= {};

  if (options.urlsMode) {
    if (!fs.existsSync(options.urls)) {
      console.error(`URL-Vorschlags-Datei nicht gefunden: ${options.urls}\nZuerst 'node scripts/label-urls.mjs' ausführen.`);
      process.exit(1);
    }
    applyUrls(registry, options.urls, options);
    finish(registry, options);
    return;
  }

  if (!fs.existsSync(options.in)) {
    console.error(`Vorschlags-Datei nicht gefunden: ${options.in}\nZuerst 'node scripts/label-research.mjs' ausführen.`);
    process.exit(1);
  }

  const research = JSON.parse(fs.readFileSync(options.in, 'utf-8'));

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

  console.log(`Vorschläge: ${suggestions.length}`);
  console.log(`Neue Labels: ${addedLabels.length}`);
  console.log(`Neue Track-Zuordnungen: ${addedTracks.length}`);
  console.log(`Übersprungen (bereits gesetzt): ${skipped.length}`);
  if (addedLabels.length) console.log('  ' + addedLabels.slice(0, 10).join(', ') + (addedLabels.length > 10 ? ' …' : ''));

  finish(registry, options);
}

function finish(registry, options) {
  const issues = validateLabelRegistry(registry);
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
