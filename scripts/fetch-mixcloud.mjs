import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'src/data/mixcloud-data.json');
const TIMESTAMP_FILE = path.join(ROOT_DIR, 'node_modules/.mixcloud-fetch');

const MIN_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

function shouldFetch(force = false) {
  if (force) return true;
  
  if (!fs.existsSync(TIMESTAMP_FILE)) return true;
  
  const lastFetch = parseInt(fs.readFileSync(TIMESTAMP_FILE, 'utf-8'));
  const now = Date.now();
  
  return (now - lastFetch) > MIN_INTERVAL_MS;
}

function updateTimestamp() {
  fs.writeFileSync(TIMESTAMP_FILE, Date.now().toString());
}

async function fetchMixcloud(force = false) {
  if (!shouldFetch(force)) {
    console.log('⏭️  Skipping Mixcloud fetch (less than 24h since last fetch)');
    return;
  }
  
  console.log('Fetching latest mixes from Mixcloud...');
  try {
    const response = await fetch('https://api.mixcloud.com/holger-kampffmeyer/cloudcasts/?limit=100');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format from Mixcloud API');
    }

    const mixes = data.data.map(mix => ({
      title: mix.name,
      key: mix.key,
      url: mix.url,
      created_time: mix.created_time,
      src: `https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(mix.key)}`
    }));

    const result = {
      lastUpdated: new Date().toISOString(),
      mixes: mixes
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(result, null, 2));
    console.log(`✅ Successfully fetched ${mixes.length} mixes and updated src/data/mixcloud-data.json`);
    updateTimestamp();

  } catch (error) {
    console.error('❌ Error fetching Mixcloud data:', error.message);
  }
}

// Parse args: --force or -f
const force = process.argv.includes('--force') || process.argv.includes('-f');
fetchMixcloud(force);
