import fs from 'fs';
import path from 'path';

const dirs = ['./src', './public'];
const webpCache = new Map();

function buildWebpCache() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) return;

  const files = fs.readdirSync(publicDir, { recursive: true });
  for (const file of files) {
    if (typeof file !== 'string') continue;
    if (file.toLowerCase().endsWith('.webp')) {
      webpCache.set(file.toLowerCase().replace(/\.webp$/, ''), file);
    }
  }
}

function getWebpPath(imgPath) {
  const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
  const baseKey = cleanPath.replace(/\.(jpe?g|png)$/i, '').toLowerCase();

  const cached = webpCache.get(baseKey);
  if (cached) return '/' + cached;

  const webpPath = cleanPath.replace(/\.(jpe?g|png)$/i, '.webp');
  if (fs.existsSync(path.join(process.cwd(), 'public', webpPath))) {
    webpCache.set(baseKey, webpPath);
    return '/' + webpPath;
  }
  if (fs.existsSync(path.join(process.cwd(), webpPath))) {
    webpCache.set(baseKey, webpPath);
    return '/' + webpPath;
  }
  return null;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let count = 0;

  content = content.replace(/["']([^"']*\.jpe?g)["']/g, (match, imgPath) => {
    if (imgPath.includes('.webp')) return match;

    const webpPath = getWebpPath(imgPath);
    if (webpPath) {
      modified = true;
      count++;
      return `"${webpPath}"`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated ${filePath} (${count} refs)`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    if (typeof file !== 'string') continue;
    if (file.endsWith('.astro') || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.mjs')) {
      processFile(path.join(dir, file));
    }
  }
}

buildWebpCache();
for (const dir of dirs) walkDir(dir);
console.log('✅ Done');
