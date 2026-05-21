import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const SIMPLE_DATA_PATH = path.join(ROOT_DIR, 'src/data/mixcloud-data.json');
const BLOG_DATA_PATH = path.join(ROOT_DIR, 'src/data/blog-posts.json');
const TRACKLISTS_DIR = path.join(ROOT_DIR, 'tracklists');
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

/**
 * Convert PNGs to WebP in the given directory using the create-webp.mjs script.
 * @param {string} dirPath - Absolute path to the directory containing PNGs.
 */
async function convertPngsToWebp(dirPath) {
  console.log(`Converting PNGs to WebP in ${dirPath}...`);
  const args = [
    path.join(ROOT_DIR, 'scripts', 'create-webp.mjs'),
    dirPath
  ];
  const child = spawn('node', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (data) => { stdout += data; });
  child.stderr.on('data', (data) => { stderr += data; });
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`Conversion failed:`, stderr);
      process.exit(1);
    }
  });
  await new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

/**
 * Copy all .webp files from source directory to destination directory.
 * @param {string} srcDir - Source directory.
 * @param {string} destDir - Destination directory.
 */
function copyWebpFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Source directory not found: ${srcDir}`);
    return;
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const files = fs.readdirSync(srcDir);
  const webpFiles = files.filter(f => path.extname(f) === '.webp');
  console.log(`Copying ${webpFiles.length} WebP files from ${srcDir} to ${destDir}...`);
  for (const file of webpFiles) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
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

    // Fetch details for each mix
    console.log('Fetching details for each mix...');
    const detailsResults = await Promise.all(
      data.data.map(mix => fetchMixDetails(mix.key))
    );

    // Step 1: Convert PNGs to WebP in tracklists/
    await convertPngsToWebp(TRACKLISTS_DIR);

    // Step 2: Copy WebP files from tracklists/ to public/tracklists/
    copyWebpFiles(TRACKLISTS_DIR, PUBLIC_TRACKLISTS_DIR);

    // Step 3: Get tracklist files (.txt) and hero image files (.webp) from tracklists/ (now they are the source of truth)
    // Note: We use tracklists/ for both because we have converted and copied, but the pairing logic uses the files in tracklists/.
    const tracklistFiles = fs.existsSync(TRACKLISTS_DIR)
      ? fs.readdirSync(TRACKLISTS_DIR)
          .filter(file => file.toLowerCase().includes('tracklist') && file.toLowerCase().endsWith('.txt'))
          .map(file => ({
            file,
            path: path.join(TRACKLISTS_DIR, file),
            mtime: fs.statSync(path.join(TRACKLISTS_DIR, file)).mtime
          }))
          .sort((a, b) => b.mtime - a.mtime)
      : [];

    const heroImageFiles = fs.existsSync(TRACKLISTS_DIR)
      ? fs.readdirSync(TRACKLISTS_DIR)
          .filter(file => file.toLowerCase().endsWith('.webp'))
          .map(file => ({
            file,
            path: path.join(TRACKLISTS_DIR, file),
            mtime: fs.statSync(path.join(TRACKLISTS_DIR, file)).mtime
          }))
          .sort((a, b) => b.mtime - a.mtime)
      : [];

    // Step 4: Pair by index (after sorting by mtime descending)
    let tracklistIndex = 0;
    let heroImageIndex = 0;

    const posts = data.data.map((mix, i) => {
      const apiData = detailsResults[i];

      // Assign tracklist by index (newest tracklist to newest mix)
      let tracklist = [];
      let tracklistFile = null;
      if (tracklistIndex < tracklistFiles.length) {
        tracklistFile = tracklistFiles[tracklistIndex].path;
        tracklist = parseTracklist(tracklistFile);
        if (tracklist.length > 0) {
          console.log(`  ✅ Tracklist index ${tracklistIndex}`);
          tracklistIndex++;
        }
      }

      // Assign hero image by index (newest hero image to newest mix)
      let heroImage = null;
      if (heroImageIndex < heroImageFiles.length) {
        // Note: We are using the file from tracklists/ but we have copied it to public/tracklists/ so the path is correct.
        // We URL-encode the filename to handle spaces.
        const encodedFileName = encodeURIComponent(heroImageFiles[heroImageIndex].file);
        heroImage = `/tracklists/${encodedFileName}`;
        console.log(`  ✅ Hero image index ${heroImageIndex}`);
        heroImageIndex++;
      }

      const useCases = deriveUseCases(mix.tags || []);

      return {
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
      };
    });

    // Sort posts by created_time (newest first)
    posts.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

    // Add index field to each post based on sorted position
    // Use index as the mix number for routing purposes
    posts.forEach((post, index) => {
      post.index = index + 1; // 1-based index
      post.number = index + 1; // Use index as the number for routing
    });

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