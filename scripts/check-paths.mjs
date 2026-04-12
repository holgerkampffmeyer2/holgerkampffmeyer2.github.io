import fs from 'fs';
import path from 'path';

function checkPathsForSpaces(dir, extensions = ['.json']) {
  let errors = [];
  
  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        walk(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        if (extensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          
          lines.forEach((line, i) => {
            const matches = line.match(/"([^"]*\.(webp|jpg|jpeg|png|gif|ico|svg)[^"]*)"/g);
            if (matches) {
              matches.forEach(m => {
                const src = m.slice(1, -1);
                if (src.includes(' ') && !src.includes('%')) {
                  const lineNum = i + 1;
                  errors.push(`${fullPath}:${lineNum} - Path with space: ${src}`);
                }
              });
            }
          });
        }
      }
    }
  }
  
  walk(dir);
  return errors;
}

const dirs = ['src/data', 'public/tracklists', 'public/img'];
const allErrors = [];

for (const dir of dirs) {
  if (fs.existsSync(dir)) {
    const errors = checkPathsForSpaces(dir);
    allErrors.push(...errors);
  }
}

if (allErrors.length > 0) {
  console.error('❌ Paths with spaces found:');
  allErrors.forEach(e => console.error(`  ${e}`));
  process.exit(1);
} else {
  console.log('✅ No paths with spaces found');
}