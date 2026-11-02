import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const BLOG_DATA = path.join(ROOT_DIR, 'src/data/blog-posts.json');
const OUT_DIR = path.join(ROOT_DIR, 'public/og');

fs.mkdirSync(OUT_DIR, { recursive: true });

const blogData = JSON.parse(fs.readFileSync(BLOG_DATA, 'utf-8'));
const posts = blogData.posts.filter(p => p.hasTracklist);

async function generateMixOG() {
  console.log(`Generating OG images for ${posts.length} mixes...`);

  for (const post of posts) {
    const curDisplay = getMixDisplay(post.key, post.title);
    const prefix = curDisplay.mixNum ? `Mix#${curDisplay.mixNum}` : '';
    
    const topLabels = getTopLabels(post.tracklist || []);
    
    const variant = {
      file: `mix-${post.slug}.jpg`,
      eyebrow: 'DJ HULK · STUTTGART',
      title: post.title,
      subtitle: prefix ? `${prefix} · ${formatDate(post.created_time)}` : formatDate(post.created_time),
      labels: topLabels,
      url: `holger-kampffmeyer.de/dj/mixes/${post.slug}`,
    };

    const overlay = buildOverlay(variant);
    if (post.slug.includes("mix192") || post.slug.includes("mix177") || post.slug.includes("mix164") || post.slug.includes("mix129")) {
        fs.writeFileSync(`/tmp/debug_overlay_${post.slug}.svg`, overlay);
    }
    const sourceImage = findSourceImage(post);
    const out = path.join(OUT_DIR, variant.file);
    
    try {
      await sharp(sourceImage)
        .resize(1200, 630, { fit: 'cover', position: 'centre' })
        .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(out);

      const meta = await sharp(out).metadata();
      console.log(`✓ ${path.relative(ROOT_DIR, out)} (${meta.width}×${meta.height})`);
    } catch (err) {
      console.error(`✗ Failed to generate ${variant.file}:`, err.message);
    }
  }
}

function getMixDisplay(key, title) {
  const keyMatch = key.match(/mix(\d+)/i);
  const titleMatch = title.match(/mix\s*(\d+)/i);
  const mixNum = keyMatch?.[1] || titleMatch?.[1] || null;
  
  let label = title;
  if (mixNum) {
    label = `Mix #${mixNum} - ${title.replace(/^.*mix\s*\d+\s*[-|]\s*/i, '').trim()}`;
  }
  
  return { mixNum, label };
}

function getTopLabels(tracklist) {
  if (!tracklist || tracklist.length === 0) return [];
  
  const labelsData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'src/data/labels.json'), 'utf-8'
  ));
  const trackLabels = buildTrackLabels(labelsData);
  
  const labelCounts = new Map();
  
  for (const track of tracklist) {
    const label = trackLabels.get(track);
    if (label) {
      const key = label.name;
      const existing = labelCounts.get(key) || { name: label.name, count: 0 };
      existing.count++;
      labelCounts.set(key, existing);
    }
  }
  
  return Array.from(labelCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map(l => l.name);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function findSourceImage(post) {
  const ROOT_DIR = path.join(__dirname, '..');
  if (post.heroImage) {
    const fullPath = path.join(ROOT_DIR, 'public', post.heroImage);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return path.join(ROOT_DIR, 'src/assets/img/booking/dj-hulk-neon.webp');
}

function buildOverlay(variant) {
  const labelsHtml = variant.labels.map((label, i) => 
    '<text x="70" y="' + (470 + i * 32) + '" fill="#22d3ee" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="600">• ' + escapeXml(label) + '</text>'
  ).join('\n    ');

  return `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dark" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#05050f" stop-opacity="0.96"/>
        <stop offset="55%" stop-color="#05050f" stop-opacity="0.82"/>
        <stop offset="100%" stop-color="#05050f" stop-opacity="0.18"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#05050f" stop-opacity="0"/>
        <stop offset="100%" stop-color="#05050f" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f97316"/>
        <stop offset="100%" stop-color="#22d3ee"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#dark)"/>
    <rect width="1200" height="630" fill="url(#bottom)"/>
    <rect x="0" y="0" width="10" height="630" fill="url(#accent)"/>
    <text x="70" y="105" fill="#f97316" font-family="DejaVu Sans, sans-serif" font-size="24" font-weight="700" letter-spacing="6">${escapeXml(variant.eyebrow)}</text>
    <text x="66" y="200" fill="#ffffff" font-family="DejaVu Sans, sans-serif" font-size="56" font-weight="700" letter-spacing="-1" style="max-width: 1050px;">${escapeXml(variant.title)}</text>
    <text x="70" y="280" fill="#22d3ee" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="600" letter-spacing="3">${escapeXml(variant.subtitle)}</text>
    ${variant.labels.length > 0 ? `
    <text x="70" y="340" fill="#a1a1aa" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="500">LABELS IN THIS MIX</text>
    ${labelsHtml}
    ` : ''}
    <line x1="70" y1="440" x2="560" y2="440" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
    <text x="70" y="495" fill="#ffffff" font-family="DejaVu Sans, sans-serif" font-size="28" font-weight="700">DJ HULK</text>
    <text x="70" y="530" fill="#a1a1aa" font-family="DejaVu Sans, sans-serif" font-size="20">Holger Kampffmeyer · House / Tech House / Techno / DnB</text>
    <text x="70" y="575" fill="#f97316" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700">${escapeXml(variant.url)}</text>
  </svg>`;
}

function escapeXml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&apos;' })[c]);
}

// Build track labels resolver
function buildTrackLabels(registry) {
  const labels = registry?.labels ?? {};
  const tracks = registry?.tracks ?? {};
  const index = new Map();

  function normalizeTrack(track) {
    if (!track) return '';
    return String(track)
      .replace(/,\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  for (const [track, id] of Object.entries(tracks)) {
    const key = normalizeTrack(track);
    const def = id ? labels[id] : null;
    if (!key || !def) continue;
    index.set(key, { id, name: def.name, url: def.url || null });
  }

  return {
    get(track) {
      return index.get(normalizeTrack(track)) ?? null;
    },
    hasAny(tracks) {
      return (tracks ?? []).some(track => index.has(normalizeTrack(track)));
    },
  };
}

generateMixOG().catch(console.error);
