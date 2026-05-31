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

// Helper function to normalize strings for comparison
const normalizeString = (str) => 
  str.toLowerCase()
     .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
     .replace(/\s+/g, ' ')      // Collapse multiple spaces
     .trim();

// Helper function to extract mix number with improved patterns
const getMixNumberEnhanced = (str) => {
  // Try multiple patterns to capture mix numbers
  const patterns = [
    /(?:mx|mix)[^\d]*(\d+)/i,           // Original: mx178, Mix-178
    /#\s*(\d+)/,                        // With hash: #178
    /[^\d](\d{3,})(?=[^\d]|$)/          // Standalone 3+ digit numbers
  ];
  
  for (const pattern of patterns) {
    const match = str.toLowerCase().match(pattern);
    if (match) return match[1];
  }
  return null;
};

function shouldFetch(force = false) {
  if (force) return true;
  if (!fs.existsSync(TIMESTAMP_FILE)) return true;
  const lastFetch = parseInt(fs.readFileSync(TIMESTAMP_FILE, 'utf-8'));
  const elapsed = Date.now() - lastFetch;
  if (elapsed <= MIN_INTERVAL_MS) {
    const hoursAgo = Math.round(elapsed / 360000) / 10;
    console.log(`⏭️  Skipping Mixcloud fetch (data is ${hoursAgo}h old, <24h since last fetch)`);
  }
  return elapsed > MIN_INTERVAL_MS;
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

function computeConfidence(s, t) {
   // s: tracklistBasename (string)
   // t: hero image base name (string)
   // Try to match by mix number first
   const sNum = getMixNumberEnhanced(s);
   const tNum = getMixNumberEnhanced(t);
   if (sNum && tNum && sNum === tNum) {
     return 1.0; // exact match on mix number
   }
   // Fallback to longest common substring
   let maxLen = 0;
   for (let i = 0; i < s.length; i++) {
     for (let j = i + 1; j <= s.length; j++) {
       const substr = s.substring(i, j);
       if (t.includes(substr)) {
         if (substr.length > maxLen) {
           maxLen = substr.length;
         }
       }
     }
   }
   return maxLen / s.length;
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

    // Create an array of mixes with their details and created_time for sorting
    const mixesWithDetails = data.data.map((mix, i) => ({
      ...mix,
      apiData: detailsResults[i],
      index: i // keep original index if needed
    }));

    // Sort mixes by created_time (newest first)
    mixesWithDetails.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

    // Step 1: Convert PNGs to WebP in tracklists/
    await convertPngsToWebp(TRACKLISTS_DIR);

    // Step 2: Get tracklist files (.txt) from tracklists/
    const tracklistFiles = fs.existsSync(TRACKLISTS_DIR)
      ? fs.readdirSync(TRACKLISTS_DIR)
          .filter(file => file.toLowerCase().includes('tracklist') && file.toLowerCase().endsWith('.txt'))
          .map(file => ({
            file,
            path: path.join(TRACKLISTS_DIR, file),
            mtime: fs.statSync(path.join(TRACKLISTS_DIR, file)).mtime
          }))
          .sort((a, b) => b.mtime - a.mtime) // newest first
      : [];

    // Get hero image files (.webp) from tracklists/ (after conversion)
    const heroImageFiles = fs.existsSync(TRACKLISTS_DIR)
      ? fs.readdirSync(TRACKLISTS_DIR)
          .filter(file => file.toLowerCase().endsWith('.webp'))
          .map(file => ({
            file,
            path: path.join(TRACKLISTS_DIR, file),
            mtime: fs.statSync(path.join(TRACKLISTS_DIR, file)).mtime
          }))
          .sort((a, b) => b.mtime - a.mtime) // newest first
      : [];

    // Step 3: For each tracklist, find a matching hero image.
    // We want to pair each tracklist with its corresponding hero image.
    const tracklistHeroPairs = [];

     // Helper to extract mix number from a string (case-insensitive, allowing Mx or Mix, and any non-digit separators)
     // Using the enhanced version defined above
     const getMixNumber = getMixNumberEnhanced;

    for (const tracklistInfo of tracklistFiles) {
      const tracklistFilename = tracklistInfo.file;
      const tracklistMixNum = getMixNumber(tracklistFilename);
      let heroImageFile = null;
      let heroImagePath = null;
      let heroImageStat = null;
      let confidence = 0;

      if (tracklistMixNum) {
        // Try to find hero image with the same mix number
        for (const heroInfo of heroImageFiles) {
          const heroMixNum = getMixNumber(heroInfo.file);
          if (heroMixNum && heroMixNum === tracklistMixNum) {
            heroImageFile = heroInfo.file;
            heroImagePath = heroInfo.path;
            heroImageStat = heroInfo.mtime;
            confidence = 1.0;
            break; // take the first match (should be only one)
          }
        }
      }

      if (!heroImageFile) {
        // Fallback: match by basename (after removing -tracklist suffix and extension)
        let basename = tracklistFilename.replace(/-tracklist/gi, '').replace('.txt', '');
        // Look for hero image with the same basename and .webp extension
        const heroFileName = basename + '.webp';
        const heroPath = path.join(TRACKLISTS_DIR, heroFileName);
        if (fs.existsSync(heroPath)) {
          const heroStat = fs.statSync(heroPath);
          heroImageFile = heroFileName;
          heroImagePath = heroPath;
          heroImageStat = heroStat;
          confidence = 1.0;
        } else {
          // If still not found, we have a problem.
          console.error(`No matching hero image (webp) found for tracklist "${tracklistInfo.file}".`);
          process.exit(1);
       }
     }

     tracklistHeroPairs.push({
        tracklist: tracklistInfo,
        heroImage: {
          file: heroImageFile,
          path: heroImagePath,
          mtime: heroImageStat
        },
        confidence: confidence,
        tracklistMixNum: tracklistMixNum,
        heroImageMixNum: getMixNumber(heroImageFile)
      });
    }
    
    // Step 4: Sort the pairs by tracklist mtime (newest first) as per plan
    tracklistHeroPairs.sort((a, b) => b.tracklist.mtime - a.tracklist.mtime);
    
    // Log the pairs for debugging
    console.log('\n=== Tracklist-Hero Pairs (sorted by tracklist mtime, newest first) ===');
    tracklistHeroPairs.forEach((pair, index) => {
        console.log((index+1) + ': Tracklist: "' + pair.tracklist.file + '" (mix ' + (pair.tracklistMixNum || '?') + ') -> HeroImage: "' + pair.heroImage.file + '" (mix ' + (pair.heroImageMixNum || '?') + ') confidence=' + pair.confidence.toFixed(2));
    });

    // Step 5: Copy all WebP files from tracklists/ to public/tracklists/
    copyWebpFiles(TRACKLISTS_DIR, PUBLIC_TRACKLISTS_DIR);

    // Step 6: Enhanced matching - exact match by mix number first, then fuzzy fallback
    

    
    // Create maps for efficient lookup
    const pairMapByMixNumber = new Map();  // Exact match by mix number
    const pairList = [];                   // For fuzzy matching fallback
    
    for (const pair of tracklistHeroPairs) {
      // Index by mix number for exact matches
      const mixNum = pair.tracklistMixNum || pair.heroImageMixNum;
      if (mixNum) {
        pairMapByMixNumber.set(mixNum, pair);
      }
      // Keep list for fuzzy matching
      pairList.push(pair);
    }

    // Step 7: Map mixes to posts using enhanced matching
    const posts = mixesWithDetails.map((mixWithDetails) => {
      const mix = mixWithDetails;
      const apiData = mixWithDetails.apiData;
      
      // Try exact match by mix number first
      const mixNumber = getMixNumberEnhanced(mix.name || '') || getMixNumberEnhanced(mix.key || '');
      let pair = pairMapByMixNumber.get(mixNumber);
      
      // If no exact match found, use fuzzy matching as fallback
      if (!pair) {
        let bestConfidence = 0;
        let bestPair = null;
        
        // Normalize mix name for comparison
        const normalizedMixTitle = normalizeString(mix.name || '');
        
        // Find the pair with highest confidence using fuzzy matching
        for (const candidatePair of pairList) {
          // Get tracklist basename without -tracklist suffix and extension
          const tracklistBasename = candidatePair.tracklist.file
            .replace(/-tracklist/gi, '')
            .replace('.txt', '');
          
          // Debug: Ensure we have valid strings
          if (!tracklistBasename || typeof tracklistBasename !== 'string') {
            continue;
          }
          
          const normalizedTracklistBasename = normalizeString(tracklistBasename);
          // Debug: Ensure inputs to computeConfidence are strings
          if (typeof normalizedMixTitle !== 'string' || typeof normalizedTracklistBasename !== 'string') {
            continue;
          }
          const confidence = computeConfidence(normalizedMixTitle, normalizedTracklistBasename);
          
          if (confidence > bestConfidence) {
            bestConfidence = confidence;
            bestPair = candidatePair;
          }
        }
        
        // Use best match if confidence is above threshold
        if (bestConfidence >= 0.5) {
          pair = bestPair;
        } else if (mixNumber) {
          // Only warn if we had a mix number but poor fuzzy match
          console.warn(`Warning: Low confidence match (${bestConfidence.toFixed(2)}) for mix "${mix.name}"`);
        }
        // If no mix number and poor match, silently continue (will get null pair)
      }

      // Process the selected pair
      let tracklist = [];
      let heroImage = null;
      let hasTracklist = false;

      if (pair) {
        tracklist = parseTracklist(pair.tracklist.path);
        hasTracklist = tracklist.length > 0;
        const encodedFileName = encodeURIComponent(pair.heroImage.file);
        heroImage = `/tracklists/${encodedFileName}`;
      } else if (mixNumber) {
        // Log warning if we have a mix number but no matching pair
        console.warn(`Warning: No matching tracklist/hero pair found for mix number "${mixNumber}" (title: "${mix.name}")`);
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
        hasTracklist,
        heroImage
      };
    });

     // Add index field to each post based on sorted position (already sorted by created_time)
     // Use index as the mix number for routing purposes
     posts.forEach((post, index) => {
       post.index = index + 1; // 1-based index
     });

    fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify({ lastUpdated: new Date().toISOString(), posts }, null, 2));
    console.log(`\n✅ Updated blog-posts.json (${posts.length} posts, ${posts.filter(p => p.hasTracklist).length} with tracklists)`);
    updateTimestamp();

  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

export { 
  fetchMixcloud, 
  shouldFetch, 
  updateTimestamp, 
  loadMappings, 
  deriveUseCases, 
  computeConfidence, 
  parseTracklist, 
  convertPngsToWebp, 
  copyWebpFiles,
  normalizeString,
  getMixNumberEnhanced
};

// Only run the main function when the script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const force = process.argv.includes('--force') || process.argv.includes('-f');
  fetchMixcloud(force);
}