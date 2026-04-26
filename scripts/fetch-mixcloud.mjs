import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const SIMPLE_DATA_PATH = path.join(ROOT_DIR, 'src/data/mixcloud-data.json');
const BLOG_DATA_PATH = path.join(ROOT_DIR, 'src/data/blog-posts.json');
const TRACKLISTS_DIR = path.join(ROOT_DIR, 'src/data/tracklists');
const PUBLIC_TRACKLISTS_DIR = path.join(ROOT_DIR, 'public/tracklists');
const MAPPING_PATH = path.join(ROOT_DIR, 'src/data/genre-use-case-mapping.json');
const TIMESTAMP_FILE = path.join(ROOT_DIR, 'node_modules/.mixcloud-fetch');

const MIN_INTERVAL_MS = 24 * 60 * 60 * 1000;

function shouldFetch(force = false) {
  if (force) return true;
  if (!fs.existsSync(TIMESTAMP_FILE)) return true;
  const lastFetch = parseInt(fs.readFileSync(TIMESTAMP_FILE, 'utf-8'));
  return (Date.now() - lastFetch) > MIN_INTERVAL_MS;
}

function updateTimestamp() {
  fs.writeFileSync(TIMESTAMP_FILE, Date.now().toString());
}

let TAG_TO_USECASE = {};

function loadMappings() {
  try {
    const data = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
    TAG_TO_USECASE = {};
    for (const entry of data.mappings) {
      for (const genre of entry.genres.map(g => g.toLowerCase())) {
        TAG_TO_USECASE[genre] = entry.useCases;
      }
    }
  } catch (e) {
    console.warn('Could not load genre-use-case-mapping.json:', e);
  }
}

function extractMixNumber(title) {
  const match = title.match(/(\d{3})/);
  return match ? parseInt(match[1], 10) : null;
}

function findTracklistFile(mixNumber) {
  if (!fs.existsSync(TRACKLISTS_DIR)) return null;
  const pattern = new RegExp(`(?:Mix[-#\\s]?|Techno\\s*|Partymix.*)${mixNumber}`, 'i');
  for (const file of fs.readdirSync(TRACKLISTS_DIR)) {
    if (pattern.test(file) && file.toLowerCase().includes('tracklist')) {
      return path.join(TRACKLISTS_DIR, file);
    }
  }
  return null;
}

function findHeroImage(mixNumber) {
  if (!mixNumber || !fs.existsSync(PUBLIC_TRACKLISTS_DIR)) return null;
  const pattern = new RegExp(`(?:Mix[-#\\s]?|Techno\\s*|Partymix.*)${mixNumber}`, 'i');
  for (const file of fs.readdirSync(PUBLIC_TRACKLISTS_DIR)) {
    if (pattern.test(file) && file.toLowerCase().endsWith('.webp')) {
      return `/tracklists/${file}`;
    }
  }
  return null;
}

function parseTracklist(filePath) {
  if (!filePath) return [];
  try {
    return fs.readFileSync(filePath, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().replace(/^\d+\.\s*/, '').replace(/\s*\d{2}:\d{2}:\d{2}\s*$/, ''));
  } catch {
    return [];
  }
}

function deriveUseCases(tags) {
  const useCases = new Set();
  for (const tag of tags) {
    const mapped = TAG_TO_USECASE[tag.name.toLowerCase()];
    if (mapped) mapped.forEach(u => useCases.add(u));
  }
  return Array.from(useCases);
}

async function fetchMixDetails(key) {
  try {
    const res = await fetch(`https://api.mixcloud.com${key}?metadata=1`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

async function fetchMixcloud(force = false) {
  if (!shouldFetch(force)) {
    console.log('⏭️  Skipping Mixcloud fetch (less than 24h since last fetch)');
    return;
  }

  console.log('Fetching latest mixes from Mixcloud...');
  loadMappings();

  try {
    const res = await fetch('https://api.mixcloud.com/holger-kampffmeyer/cloudcasts/?limit=100');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data?.length) throw new Error('No data from Mixcloud');

    const mixes = data.data.map(mix => ({
      title: mix.name,
      key: mix.key,
      url: mix.url,
      created_time: mix.created_time,
      src: `https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(mix.key)}`
    }));

    fs.writeFileSync(SIMPLE_DATA_PATH, JSON.stringify({ lastUpdated: new Date().toISOString(), mixes }, null, 2));
    console.log(`✅ Updated mixcloud-data.json (${mixes.length} mixes)`);

    console.log('Processing blog posts with tracklists...');
    const posts = [];
    let i = 0;
    for (const mix of data.data) {
      const apiData = await fetchMixDetails(mix.key);
      const mixNumber = extractMixNumber(mix.name);
      const tracklistFile = mixNumber ? findTracklistFile(mixNumber) : null;
      const tracklist = tracklistFile ? parseTracklist(tracklistFile) : [];
      const heroImage = mixNumber ? findHeroImage(mixNumber) : null;
      const useCases = deriveUseCases(mix.tags || []);

      posts.push({
        number: mixNumber,
        title: mix.name,
        key: mix.key,
        url: mix.url,
        created_time: mix.created_time,
        src: `https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(mix.key)}`,
        description: apiData?.description || '',
        picture: mix.pictures?.['640wx640h'] || '',
        audio_length: mix.audio_length,
        tags: (mix.tags || []).map(t => t.name),
        useCases,
        tracklist,
        hasTracklist: tracklist.length > 0,
        heroImage
      });

      if (tracklistFile) console.log(`  ✅ Tracklist for Mix#${mixNumber}`);
      if (heroImage) console.log(`  ✅ Hero for Mix#${mixNumber}`);
      if (++i % 10 === 0) console.log(`  ... ${i}/${data.data.length}`);
    }

    fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify({ lastUpdated: new Date().toISOString(), posts }, null, 2));
    console.log(`\n✅ Updated blog-posts.json (${posts.length} posts, ${posts.filter(p => p.hasTracklist).length} with tracklists)`);
    updateTimestamp();

  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

const force = process.argv.includes('--force') || process.argv.includes('-f');
fetchMixcloud(force);