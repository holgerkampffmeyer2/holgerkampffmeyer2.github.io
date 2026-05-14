import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lhciDir = path.join(__dirname, '../.lighthouseci');

const manifestPath = path.join(lhciDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.log('⚠️ No Lighthouse CI manifest found at .lighthouseci/manifest.json');
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const reportFiles = manifest.filter(f => f.endsWith('.json'));

if (reportFiles.length === 0) {
  console.log('⚠️ No Lighthouse report JSON files found in manifest');
  process.exit(0);
}

console.log('## Lighthouse Ergebnisse');
console.log('');

for (const reportFile of reportFiles) {
  const reportPath = path.join(lhciDir, reportFile);
  if (!fs.existsSync(reportPath)) continue;

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  const url = report.finalDisplayedUrl || report.requestedUrl || 'unknown';
  const scores = report.categories;

  console.log(`### ${url}`);
  console.log('');
  console.log('| Kategorie | Score | Bewertung |');
  console.log('|-----------|-------|-----------|');
  for (const [key, cat] of Object.entries(scores)) {
    const score = Math.round(cat.score * 100);
    let rating;
    if (score >= 90) rating = '🟢';
    else if (score >= 75) rating = '🟡';
    else rating = '🔴';
    console.log(`| ${cat.title} | ${score} | ${rating} |`);
  }
  console.log('');
}
