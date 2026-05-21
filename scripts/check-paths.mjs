import fs from 'fs';
import path from 'path';

function checkPathsForSpaces(dir, extensions = ['.json', '.astro', '.html']) {
  if (!fs.existsSync(dir)) return [];
  const errors = [];
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    if (typeof file !== 'string') continue;
    const ext = path.extname(file);
    if (!extensions.includes(ext)) continue;
    const fullPath = path.join(dir, file);
    if (!fs.statSync(fullPath).isFile()) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      // Skip lines that contain heroImage or tracklist fields in JSON
      // because we allow spaces in those values (they will be encoded when used in URLs)
      if (line.includes('"heroImage":') || line.includes('"tracklist":')) {
        return;
      }
      const matches = line.match(/"([^"]*\.(webp|jpg|jpeg|png|gif|ico|svg)[^"]*)"/g);
      if (matches) {
        for (const m of matches) {
          const src = m.slice(1, -1);
          if (src.includes(' ') && !src.includes('%')) {
            errors.push(`${fullPath}:${i + 1} - Path with space: ${src}`);
          }
        }
      }
    });
  }
  return errors;
}

const dirs = ['src/data', 'public/tracklists', 'public/img', 'src/pages'];
const allErrors = [];
for (const dir of dirs) {
  const errors = checkPathsForSpaces(dir);
  allErrors.push(...errors);
}
if (allErrors.length > 0) {
  console.error('❌ Paths with spaces found:');
  allErrors.forEach(e => console.error(`  ${e}`));
  process.exit(1);
} else {
  console.log('✅ No paths with spaces found');
}