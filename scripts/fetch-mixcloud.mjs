import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../src/data/mixcloud-data.json');

async function fetchMixcloud() {
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

  } catch (error) {
    console.error('❌ Error fetching Mixcloud data:', error.message);
  }
}

fetchMixcloud();
