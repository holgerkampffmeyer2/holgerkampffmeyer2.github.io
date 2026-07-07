import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const site = 'https://holger-kampffmeyer.de';

const PAGES = [
  { path: '/',                     title: 'DJ Hulk - Electronic Music DJ aus Stuttgart',                               pubDate: '2026-01-01' },
  { path: '/djhulk-electronic-music/', title: 'DJ Hulk - Electronic Music DJ Stuttgart',                                pubDate: '2026-01-01' },
  { path: '/dj/mixes-weekly/',     title: 'Weekly DJ Mixes - DJ Hulk - House, Tech House, Deep House',                 pubDate: '2026-01-01' },
  { path: '/dj/mixes-blog-archive/', title: 'Mix Archive - DJ Hulk Weekly DJ Mixes',                                   pubDate: '2026-01-01' },
  { path: '/dj/videos/',           title: 'Videos - DJ Hulk - YouTube Videos und Event-Aufnahmen',                     pubDate: '2026-01-01' },
  { path: '/dj/em3f/',             title: 'EM3F Electronic Music Family and Friends Festival Stuttgart',                pubDate: '2026-06-01' },
  { path: '/work/',                title: 'Holger Kampffmeyer - Director DevOps, AI & Platform Engineering',            pubDate: '2026-01-01' },
  { path: '/links/',               title: 'DJ Hulk | Alle wichtigen Social-Media-Links & Kontakt',                      pubDate: '2026-01-01' },
];

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
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = dayNames[date.getUTCDay()];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const monthName = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${dayName}, ${day} ${monthName} ${year} 00:00:00 GMT`;
}

function generateRss() {
  const items = [];

  for (const page of PAGES) {
    items.push({
      path: page.path,
      title: page.title,
      description: '',
      pubDate: page.pubDate,
      isMix: false,
    });
  }

  const blogDataPath = path.join(ROOT_DIR, 'src/data/blog-posts.json');
  try {
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf-8'));
    const posts = blogData.posts || [];
    for (const post of posts) {
      items.push({
        path: `/dj/mixes/${post.slug}/`,
        title: post.title,
        description: post.description || '',
        pubDate: post.created_time.split('T')[0],
        isMix: true,
      });
    }
  } catch (e) {
    console.warn('⚠️ Could not read blog-posts.json:', e.message);
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
    const link = `${site}${item.path}`;
    xml += `    <item>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <title>${escapeXml(category + ' ' + item.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }

  xml += `  </channel>
</rss>
`;

  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'rss.xml'), xml);
    console.log(`✅ RSS feed generated at dist/rss.xml with ${items.length} items`);
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), xml);
  console.log(`   → synced to public/rss.xml`);
}

export { escapeXml, formatRssDate };

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  generateRss();
}
