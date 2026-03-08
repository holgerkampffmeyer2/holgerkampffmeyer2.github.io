import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00+0100');
  const dayName = dayNames[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const time = '12:00:00';
  const offset = '+0100';
  return `${dayName}, ${day} ${monthName} ${year} ${time} ${offset}`;
}

function generateRss() {
  const dataPath = path.join(__dirname, '../src/data/rss-data.json');
  const outputPath = path.join(__dirname, '../public/rss.xml');
  
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  const lastBuildDate = formatRssDate(new Date().toISOString().split('T')[0]);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(data.title)}</title>
    <link>${data.site}</link>
    <description>${escapeXml(data.description)}</description>
    <language>de</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${data.site}/rss.xml" rel="self" type="application/rss+xml"/>
`;
  
  for (const item of data.items) {
    const pubDate = formatRssDate(item.pubDate);
    xml += `    <item>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <title>${escapeXml(item.title)}</title>
      <link>${data.site}${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  }
  
  xml += `  </channel>
</rss>
`;
  
  fs.writeFileSync(outputPath, xml);
  console.log('✅ RSS feed generated at public/rss.xml');
}

generateRss();
