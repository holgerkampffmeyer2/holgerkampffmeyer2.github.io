import fs from 'fs';
import path from 'path';

const dirs = ['./src', './public'];

function getWebPPath(imgPath) {
  const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
  const webpPath = cleanPath.replace(/\.jpe?g$/i, '.webp');
  
  if (fs.existsSync(path.join(process.cwd(), 'public', webpPath))) return '/' + webpPath;
  if (fs.existsSync(path.join(process.cwd(), webpPath))) return '/' + webpPath;
  return null;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let count = 0;
  
  content = content.replace(/["']([^"']*\.jpe?g)["']/g, (match, imgPath) => {
    if (imgPath.includes('.webp')) return match;
    
    const webpPath = getWebPPath(imgPath);
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

for (const dir of dirs) walkDir(dir);
console.log('✅ Done');
