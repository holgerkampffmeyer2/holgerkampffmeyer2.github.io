/**
 * Label-Recherche: erzeugt belegte Label-Vorschläge für alle Tracklisten.
 *
 * Offline-first: Label-Hinweise aus den Quelldatei-Tags der Rekordbox-CUEs
 * (`publisher`/Album-`[Label]`/Promo-comment), danach iTunes als Fallback.
 * Ergebnis ist ein reviewbares Artefakt (`label-research.json`) + Report;
 * `src/data/labels.json` bleibt unverändert.
 *
 * Verwendung:
 *   DJ_CUE_DIR="/mnt/c/.../DJ Hulk" node scripts/label-research.mjs
 *   node scripts/label-research.mjs --cue-dir "..." --offline --limit 50
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isNonTrack, readCueDir, readTags, extractLabelFromTags } from './lib/cue.mjs';
import { cueEntryLabel, trackMatchScore } from './lib/track-match.mjs';
import { createRateLimiter, lookupLabelOnline } from './lib/label-lookup.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const DEFAULTS = {
  data: path.join(ROOT_DIR, 'src/data/blog-posts.json'),
  out: path.join(ROOT_DIR, 'label-research.json'),
  report: path.join(ROOT_DIR, 'label-research-report.md'),
  tagCache: path.join(ROOT_DIR, '.label-tag-cache.json'),
  lookupCache: path.join(ROOT_DIR, '.label-lookup-cache.json'),
  matchThreshold: 0.82,
  lookupThreshold: 0.8,
  minIntervalMs: 1100,
};

function parseArgs(argv) {
  const options = { ...DEFAULTS, offline: false, limit: Infinity };
  const flags = {
    '--cue-dir': v => { options.cueDir = v; },
    '--data': v => { options.data = path.resolve(v); },
    '--out': v => { options.out = path.resolve(v); },
    '--report': v => { options.report = path.resolve(v); },
    '--match-threshold': v => { options.matchThreshold = Number(v); },
    '--lookup-threshold': v => { options.lookupThreshold = Number(v); },
    '--limit': v => { options.limit = Number(v); },
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--offline') { options.offline = true; continue; }
    if (flags[arg]) { flags[arg](argv[++i]); }
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

function saveCache(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function splitArtistTitle(track) {
  const idx = track.indexOf(' - ');
  if (idx > 0) return { artist: track.slice(0, idx).trim(), title: track.slice(idx + 3).trim() };
  return { artist: '', title: track.trim() };
}

function collectUniqueTracks(posts, limit) {
  const seen = new Set();
  const tracks = [];
  for (const post of posts) {
    for (const track of post.tracklist ?? []) {
      if (typeof track !== 'string') continue;
      const key = track.trim();
      if (!key || key.startsWith('#') || seen.has(key)) continue;
      seen.add(key);
      tracks.push(key);
      if (tracks.length >= limit) return tracks;
    }
  }
  return tracks;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const cueDir = options.cueDir || process.env.LABEL_CUE_DIR || process.env.DJ_CUE_DIR;

  const data = JSON.parse(fs.readFileSync(options.data, 'utf-8'));
  const posts = Array.isArray(data) ? data : data.posts ?? [];
  const tracks = collectUniqueTracks(posts, options.limit);
  if (!tracks.length) {
    console.error('Keine Tracklisten-Einträge gefunden in', options.data);
    process.exit(1);
  }
  console.log(`Tracklisten-Einträge (eindeutig): ${tracks.length}`);

  let pool = [];
  if (cueDir) {
    if (!fs.existsSync(cueDir) || !fs.statSync(cueDir).isDirectory()) {
      console.error(`CUE-Verzeichnis nicht gefunden: ${cueDir}`);
      process.exit(1);
    }
    const entries = readCueDir(cueDir);
    console.log(`CUE-Einträge gelesen: ${entries.length}`);

    const tagCache = loadCache(options.tagCache);
    const uniqueFiles = [...new Set(entries.map(entry => entry.fsPath).filter(Boolean))];
    let probed = 0;
    for (const file of uniqueFiles) {
      if (!(file in tagCache)) {
        tagCache[file] = await readTags(file);
        probed++;
        if (probed % 100 === 0) console.log(`  Tags gelesen: ${probed}`);
      }
    }
    saveCache(options.tagCache, tagCache);

    let withLabel = 0;
    for (const entry of entries) {
      if (isNonTrack(entry)) continue;
      const tags = entry.fsPath ? tagCache[entry.fsPath] : null;
      const found = extractLabelFromTags(tags, { title: entry.title, file: entry.file });
      if (!found) continue;
      withLabel++;
      pool.push({ label: entry, found });
    }
    console.log(`CUE-Einträge mit Label-Hinweis (offline): ${withLabel}/${entries.length}`);
  } else {
    console.warn('Kein CUE-Verzeichnis angegeben (--cue-dir oder LABEL_CUE_DIR) – nur Online-Recherche.');
  }

  const suggestions = [];
  const unresolved = [];

  for (const track of tracks) {
    let best = null;
    for (const candidate of pool) {
      const score = trackMatchScore(track, cueEntryLabel(candidate.label));
      if (!best || score > best.score) best = { score, ...candidate };
    }
    if (best && best.score >= options.matchThreshold) {
      suggestions.push({
        track,
        label: best.found.label,
        source: best.found.source,
        confidence: Number(best.score.toFixed(3)),
        matchedFile: best.label.fsPath,
      });
    } else {
      unresolved.push(track);
    }
  }

  console.log(`Offline zugeordnet: ${suggestions.length}/${tracks.length}`);

  let onlineCount = 0;
  if (!options.offline && unresolved.length) {
    const lookupCache = loadCache(options.lookupCache);
    const cache = {
      get: key => lookupCache[key],
      set: (key, value) => { lookupCache[key] = value; },
    };
    const rateLimit = createRateLimiter(options.minIntervalMs);

    // Run-Memo: gleicher `artist|title`-Schlüssel wird nur einmal aufgelöst
    // (Cache-Wiederverwendung über Läufe hinweg übernimmt lookupCache).
    const memo = new Map();
    const resolve = async track => {
      const { artist, title } = splitArtistTitle(track);
      const key = `${artist.toLowerCase()}|${title.toLowerCase()}`;
      if (!memo.has(key)) {
        memo.set(key, await lookupLabelOnline({ artist, title }, { cache, rateLimit }));
      }
      return memo.get(key);
    };

    const stillUnresolved = [];
    let sinceSave = 0;
    for (const track of unresolved) {
      const result = await resolve(track);
      if (result && result.confidence >= options.lookupThreshold) {
        suggestions.push({
          track,
          label: result.label,
          source: result.source,
          confidence: Number(result.confidence.toFixed(3)),
          matchedFile: result.matchedName,
        });
        onlineCount++;
        if (onlineCount % 25 === 0) console.log(`  online gefunden: ${onlineCount}`);
      } else {
        stillUnresolved.push(track);
      }
      if (++sinceSave >= 25) {
        saveCache(options.lookupCache, lookupCache);
        sinceSave = 0;
      }
    }
    saveCache(options.lookupCache, lookupCache);
    unresolved.length = 0;
    unresolved.push(...stillUnresolved);
    console.log(`Online zugeordnet: ${onlineCount}/${unresolved.length + onlineCount} (Cache: ${memo.size} Abfragen)`);
  }

  suggestions.sort((a, b) => a.track.localeCompare(b.track, 'de'));
  const output = {
    generatedAt: new Date().toISOString(),
    cueDir: cueDir ?? null,
    matchThreshold: options.matchThreshold,
    stats: {
      uniqueTracks: tracks.length,
      offline: suggestions.length - onlineCount,
      online: onlineCount,
      unresolved: unresolved.length,
    },
    suggestions,
    unresolved,
  };
  fs.writeFileSync(options.out, JSON.stringify(output, null, 2));

  const report = [
    '# Label-Recherche',
    '',
    `Erzeugt: ${output.generatedAt}`,
    `CUE-Verzeichnis: ${cueDir ?? '—'}`,
    '',
    `- Tracklisten-Einträge: ${tracks.length}`,
    `- Offline (CUE-Tags): ${output.stats.offline}`,
    `- Online (iTunes): ${output.stats.online}`,
    `- Offen: ${output.stats.unresolved}`,
    '',
  ];
  if (unresolved.length) {
    report.push('## Ohne Label', '', ...unresolved.map(track => `- ${track}`), '');
  }
  fs.writeFileSync(options.report, report.join('\n'));

  console.log(`\nVorschläge: ${suggestions.length} → ${path.relative(ROOT_DIR, options.out)}`);
  console.log(`Report: ${path.relative(ROOT_DIR, options.report)}`);
  console.log(`Offen: ${unresolved.length}`);
  console.log('Zum Übernehmen: node scripts/label-apply.mjs');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
