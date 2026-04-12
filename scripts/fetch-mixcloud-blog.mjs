import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../src/data/blog-posts.json');
const TRACKLISTS_DIR = path.join(__dirname, '../src/data/tracklists');
const PUBLIC_TRACKLISTS_DIR = path.join(__dirname, '../public/tracklists');
const MAPPING_PATH = path.join(__dirname, '../src/data/genre-use-case-mapping.json');

let TAG_TO_USECASE = {};

function loadMappings() {
  try {
    const mappingData = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
    TAG_TO_USECASE = {};
    for (const entry of mappingData.mappings) {
      const genres = entry.genres.map(g => g.toLowerCase());
      const useCases = entry.useCases;
      for (const genre of genres) {
        TAG_TO_USECASE[genre] = useCases;
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
  if (!fs.existsSync(TRACKLISTS_DIR)) {
    return null;
  }
  
  const files = fs.readdirSync(TRACKLISTS_DIR);
  const pattern = new RegExp(`(?:Mix[#\\s]?|Techno\\s*|Partymix.*)${mixNumber}`, 'i');
  
  for (const file of files) {
    if (pattern.test(file) && file.toLowerCase().includes('tracklist')) {
      return path.join(TRACKLISTS_DIR, file);
    }
  }
  return null;
}

function findHeroImage(mixNumber) {
  if (!mixNumber || !fs.existsSync(PUBLIC_TRACKLISTS_DIR)) {
    return null;
  }
  
  const files = fs.readdirSync(PUBLIC_TRACKLISTS_DIR);
  const pattern = new RegExp(`(?:Mix[#\\s]?|Techno\\s*|Partymix.*)${mixNumber}`, 'i');
  
  for (const file of files) {
    if (pattern.test(file) && file.toLowerCase().endsWith('.webp')) {
      return `/tracklists/${file}`;
    }
  }
  return null;
}

function parseTracklist(filePath) {
  if (!filePath) return [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      line = line.trim();
      line = line.replace(/^\d+\.\s*/, '');
      line = line.replace(/\s*\d{2}:\d{2}:\d{2}\s*$/, '');
      return line;
    });
  } catch (e) {
    return [];
  }
}

function deriveUseCases(tags) {
  const useCases = new Set();
  
  for (const tag of tags) {
    const tagName = tag.name.toLowerCase();
    const mapped = TAG_TO_USECASE[tagName];
    if (mapped) {
      for (const useCase of mapped) {
        useCases.add(useCase);
      }
    }
  }
  
  return Array.from(useCases);
}

async function fetchMixDetails(key) {
  try {
    const response = await fetch(`https://api.mixcloud.com${key}?metadata=1`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    // Silently fail
  }
  return null;
}

async function fetchMixcloud() {
  console.log('Fetching latest mixes from Mixcloud for Music Blog...');
  
  try {
    const response = await fetch('https://api.mixcloud.com/holger-kampffmeyer/cloudcasts/?limit=10');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format from Mixcloud API');
    }

    const posts = [];
    let fetchedCount = 0;
    
    for (const mix of data.data) {
      const title = mix.name;
      const mixNumber = extractMixNumber(title);
      
      // Fetch detailed description from API
      let apiData = null;
      if (mix.key) {
        apiData = await fetchMixDetails(mix.key);
      }
      
      const description = apiData?.description || '';
      
      let tracklist = [];
      let tracklistFile = null;
      
      if (mixNumber) {
        tracklistFile = findTracklistFile(mixNumber);
        tracklist = parseTracklist(tracklistFile);
      }
      
      const heroImage = mixNumber ? findHeroImage(mixNumber) : null;
      const mixTags = mix.tags || [];
      const useCases = deriveUseCases(mixTags);
      
      const post = {
        number: mixNumber,
        title: title,
        key: mix.key,
        url: mix.url,
        created_time: mix.created_time,
        src: `https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(mix.key)}`,
        description: description,
        picture: (mix.pictures && mix.pictures['640wx640h']) || '',
        audio_length: mix.audio_length,
        tags: mixTags.map(t => t.name),
        useCases: useCases,
        tracklist: tracklist,
        hasTracklist: tracklist.length > 0,
        heroImage: heroImage
      };
      
      posts.push(post);
      
      if (tracklistFile) {
        console.log(`  ✅ Tracklist for Mix#${mixNumber}: ${path.basename(tracklistFile)}`);
      }
      if (heroImage) {
        console.log(`  ✅ Hero image for Mix#${mixNumber}: ${path.basename(heroImage)}`);
      }
      
      fetchedCount++;
      if (fetchedCount % 3 === 0) {
        console.log(`  ... fetched ${fetchedCount}/10 mixes`);
      }
    }

    const result = {
      lastUpdated: new Date().toISOString(),
      posts: posts
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(result, null, 2));
    console.log(`\n✅ Successfully fetched ${posts.length} blog posts`);
    console.log(`   Posts with tracklists: ${posts.filter(p => p.hasTracklist).length}`);
    console.log(`   Posts with hero images: ${posts.filter(p => p.heroImage).length}`);

  } catch (error) {
    console.error('❌ Error fetching Mixcloud data:', error.message);
    process.exit(1);
  }
}

loadMappings();
fetchMixcloud();