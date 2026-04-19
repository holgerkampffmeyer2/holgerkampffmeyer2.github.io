import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DEFAULT_IMG_DIRS = ['./img', './public/img', './public/assets'];
const TRACKLIST_DIRS = ['./tracklists', './public/tracklists'];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: null,
    width: 1920,
    quality: 80,
    recursive: false,
    includeTracklists: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-w' || arg === '--width') {
      options.width = parseInt(args[++i], 10) || 1920;
    } else if (arg === '-q' || arg === '--quality') {
      options.quality = parseInt(args[++i], 10) || 80;
    } else if (arg === '-r' || arg === '--recursive') {
      options.recursive = true;
    } else if (arg === '-t' || arg === '--tracklists') {
      options.includeTracklists = true;
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node create-webp.mjs [options] [input]

Options:
  -w, --width <px>      Resize width (default: 1920)
  -q, --quality <num>   WebP quality 1-100 (default: 80)
  -r, --recursive      Process directories recursively
  -t, --tracklists     Also process tracklists/ directories
  -h, --help          Show this help

Examples:
  node create-webp.mjs                          # Convert all default dirs
  node create-webp.mjs tracklists/Mix177.png       # Single file
  node create-webp.mjs -t                         # Include tracklists dirs
  node create-webp.mjs -t -w 1280 tracklists/   # Tracklists dir with width 1280`);
}

async function processFile(filePath, options) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return false;

  const baseName = path.basename(filePath);
  if (baseName.includes('icons') || baseName === '5stars.png') return false;

  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');

  if (fs.existsSync(webpPath)) {
    console.log(`  ⏭️  Skipping (exists): ${baseName}`);
    return false;
  }

  try {
    const pipeline = sharp(filePath);
    
    if (options.width > 0) {
      pipeline.resize(options.width, null, { withoutEnlargement: true });
    }
    
    await pipeline
      .webp({ quality: options.quality })
      .toFile(webpPath);

    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const saved = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(`  ✓ ${baseName} → ${path.basename(webpPath)} (${saved}% smaller)`);
    return true;
  } catch (err) {
    console.error(`  ✗ Error: ${baseName} - ${err.message}`);
    return false;
  }
}

async function processDir(dirPath, options, recursive = false) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return 0;
  }

  let converted = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory() && recursive) {
      converted += await processDir(fullPath, options, recursive);
    } else if (entry.isFile()) {
      const processed = await processFile(fullPath, options);
      if (processed) converted++;
    }
  }

  return converted;
}

async function main() {
  const options = parseArgs();
  let totalConverted = 0;

  if (options.input) {
    const inputPath = options.input;

    if (fs.existsSync(inputPath)) {
      const stat = fs.statSync(inputPath);
      if (stat.isDirectory()) {
        console.log(`Processing directory: ${inputPath}`);
        totalConverted += await processDir(inputPath, options, options.recursive);
      } else {
        console.log(`Processing single file: ${inputPath}`);
        await processFile(inputPath, options);
        totalConverted++;
      }
    } else {
      console.error(`File not found: ${inputPath}`);
      process.exit(1);
    }
  } else {
    let dirs = [...DEFAULT_IMG_DIRS];

    if (options.includeTracklists) {
      dirs = dirs.concat(TRACKLIST_DIRS);
    }

    for (const imgDir of dirs) {
      if (!fs.existsSync(imgDir)) continue;

      const files = fs.readdirSync(imgDir);
      let dirConverted = 0;

      for (const file of files) {
        const filePath = path.join(imgDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
          const processed = await processFile(filePath, options);
          if (processed) dirConverted++;
        } else if (stat.isDirectory() && options.recursive) {
          dirConverted += await processDir(filePath, options, true);
        }
      }

      if (dirConverted > 0) {
        console.log(`[${imgDir}] ${dirConverted} files converted`);
        totalConverted += dirConverted;
      }
    }
  }

  console.log(`\n✅ Total: ${totalConverted} WebP images created`);
}

main();