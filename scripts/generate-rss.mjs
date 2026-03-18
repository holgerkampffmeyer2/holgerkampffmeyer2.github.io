import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const site = 'https://holger-kampffmeyer.de';

const pageMeta = {
  '/': { title: 'DJ Hulk - Startseite', description: 'DJ Hulk - Musikanlagen, Lichttechnik, Verleih Stuttgart' },
  '/djhulk-electronic-music': { title: 'DJ Hulk - Electronic Music', description: 'DJ Hulk - DJ für elektronische Musik aus Stuttgart' },
  '/dj/mixes': { title: 'DJ Hulk - Mixes', description: 'Wöchentliche House und Tech House Mixes von DJ Hulk' },
  '/dj/videos': { title: 'DJ Hulk - Videos', description: 'Event-Aufnahmen und Videos von DJ Hulk' },
  '/dj/em3f': { title: 'DJ Hulk - Event Fotos', description: 'Fotos von Events und Festivals' },
  '/vermietung': { title: 'Eventtechnik Vermietung', description: 'Partytechnik mieten in Stuttgart' },
  '/vermietung/partypaket-stuttgart': { title: 'Partypaket Stuttgart', description: 'Komplettpaket für bis zu 50 Personen - Sound, Licht, DJ-Equipment mieten' },
  '/vermietung/veranstaltungspaket-stuttgart': { title: 'Veranstaltungspaket Stuttgart', description: 'Komplettpaket für bis zu 150 Personen - Profi-Equipment mieten' },
  '/vermietung/djpaket-fildern': { title: 'DJ-Paket Fildern', description: 'DJ-Paket mit LD Maui, Moving Heads, LED PAR für bis zu 150 Personen' },
  '/vermietung/ld-maui-28g3': { title: 'LD Maui 28 G3 mieten', description: 'Line Array Party-Soundsystem mit 2x 10" Subwoofer und 8x 3.5" Topteil' },
  '/vermietung/jbl-partybox-300-320': { title: 'JBL Partybox 300/320 mieten', description: 'Kompaktes JBL Partybox Set für Indoor-Events' },
  '/vermietung/partylicht-moving-head': { title: 'Partylicht & Moving Head mieten', description: 'LED Moving Head Spot + Partylicht Set für Dynamic Lightshows' },
  '/vermietung/led-bossfx-nebelmaschine': { title: 'LED BossFX & Nebelmaschine mieten', description: 'LED BossFX-2 Pro + AF-150 Nebelmaschine für Atmosphäre' },
  '/vermietung/kls-laser-bar': { title: 'Eurolite KLS Laser Bar mieten', description: 'Kompaktes LED Bar System mit Laser-Effekten für Partys' },
  '/work': { title: 'DJ Hulk - Work', description: 'DJ Hulk - Work und Projekte' },
};

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssDate(dateStr) {
  const date = new Date(dateStr);
  const dayName = dayNames[date.getUTCDay()];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const monthName = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${dayName}, ${day} ${monthName} ${year} 00:00:00 GMT`;
}

function getGitDateForFile(filePath) {
  try {
    const result = execSync(
      `git log -1 --format="%ai" -- "${filePath}"`,
      { cwd: path.join(__dirname, '..'), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    if (!result) {
      console.warn(`⚠️ No git history for ${filePath}, using mtime`);
      return null;
    }
    return result.split(' ')[0];
  } catch (e) {
    console.warn(`⚠️ Git command failed for ${filePath}: ${e.message}`);
    return null;
  }
}

function getFileMtime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function generateRss() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const mixcloudDataPath = path.join(__dirname, '../src/data/mixcloud-data.json');
  const outputPath = path.join(__dirname, '../public/rss.xml');

  const items = [];

  const excludePages = ['impressum', 'links'];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.astro')) {
        const relativePath = path.relative(pagesDir, fullPath);
        const htmlPath = '/' + relativePath.replace(/\.astro$/, '.html').replace(/\\/g, '/').replace('/index.html', '/');
        const pageKey = htmlPath.replace('.html', '');
        
        const shouldExclude = excludePages.some(ex => htmlPath.includes(ex));
        if (shouldExclude) continue;

        const gitDate = getGitDateForFile(fullPath);
        const pubDate = gitDate || getFileMtime(fullPath);
        const meta = pageMeta[pageKey];
        
        if (meta) {
          items.push({
            id: htmlPath,
            title: meta.title,
            link: htmlPath,
            description: meta.description,
            pubDate: pubDate,
            isPage: true
          });
        }
      }
    }
  }

  walkDir(pagesDir);

  try {
    const mixcloudData = JSON.parse(fs.readFileSync(mixcloudDataPath, 'utf-8'));
    const mixes = mixcloudData.mixes || [];
    
    for (const mix of mixes.slice(0, 10)) {
      items.push({
        id: `mix-${mix.key}`,
        title: mix.title,
        link: '/dj/mixes',
        description: `Neuer Mix auf Mixcloud: ${mix.title}`,
        pubDate: mix.created_time.split('T')[0],
        isMix: true
      });
    }
  } catch (e) {
    console.warn('⚠️ Could not read mixcloud data:', e.message);
  }

  items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const today = new Date();
  const lastBuildDate = formatRssDate(today);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DJ Hulk - Neueste Updates</title>
    <link>${site}</link>
    <description>Neueste Mixes, Videos und Seiten-Updates von DJ Hulk aus Stuttgart.</description>
    <language>de</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
`;

  for (const item of items) {
    const pubDate = formatRssDate(item.pubDate);
    const category = item.isMix ? '[Mix]' : '[Seite]';
    xml += `    <item>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <title>${escapeXml(category + ' ' + item.title)}</title>
      <link>${site}${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }

  xml += `  </channel>
</rss>
`;

  fs.writeFileSync(outputPath, xml);
  console.log(`✅ RSS feed generated at public/rss.xml with ${items.length} items`);
}

generateRss();
