import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../src/data/mixcloud-data.json');
const RSS_DATA_PATH = path.join(__dirname, '../src/data/rss-data.json');

async function fetchMixcloud() {
  console.log('Fetching latest mixes from Mixcloud...');
  try {
    const response = await fetch('https://api.mixcloud.com/holger-kampffmeyer/cloudcasts/?limit=16');
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
      src: `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(mix.key)}`
    }));

    const result = {
      lastUpdated: new Date().toISOString(),
      mixes: mixes
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(result, null, 2));
    console.log(`✅ Successfully fetched ${mixes.length} mixes and updated src/data/mixcloud-data.json`);

    // Proactively update RSS data if there's a new mix
    if (mixes.length > 0) {
      updateRssData(mixes[0]);
    }

  } catch (error) {
    console.error('❌ Error fetching Mixcloud data:', error.message);
    // We don't exit with error to avoid breaking the build if the API is down
  }
}

function updateRssData(latestMix) {
  try {
    const rssData = JSON.parse(fs.readFileSync(RSS_DATA_PATH, 'utf-8'));
    
    // Find the mix entry in RSS
    const mixIndex = rssData.items.findIndex(item => item.id === 'djhulk-mix-weekly');
    
    if (mixIndex !== -1) {
      const currentEntry = rssData.items[mixIndex];
      const newPubDate = latestMix.created_time.split('T')[0];
      
      if (currentEntry.title !== latestMix.title || currentEntry.pubDate !== newPubDate) {
        console.log('Updating RSS data with latest mix...');
        rssData.items[mixIndex].title = latestMix.title;
        rssData.items[mixIndex].pubDate = newPubDate;
        rssData.items[mixIndex].description = `Neuer Mix auf Mixcloud: ${latestMix.title}`;
        
        fs.writeFileSync(RSS_DATA_PATH, JSON.stringify(rssData, null, 2));
        console.log('✅ RSS data updated.');
      }
    }
  } catch (error) {
    console.error('⚠️ Could not update RSS data:', error.message);
  }
}

fetchMixcloud();
