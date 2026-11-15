import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMixDisplay } from '../src/utils/mix-display.js';
import { brandedOgImageFile } from '../src/utils/og-image.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const BLOG_DATA = path.join(ROOT_DIR, 'src/data/blog-posts.json');
const OUT_DIR = path.join(ROOT_DIR, 'public/og');

fs.mkdirSync(OUT_DIR, { recursive: true });

const blogData = JSON.parse(fs.readFileSync(BLOG_DATA, 'utf-8'));
const posts = blogData.posts.filter(p => p.hasTracklist);
const FORCE = process.argv.includes('--force');

async function generateMixOG() {
  console.log(`Generating OG images for ${posts.length} mixes...`);

  for (const post of posts) {
    const title = post.title || post.slug;
    const curDisplay = getMixDisplay(post.key, title);
    const prefix = curDisplay.mixNum ? `Mix#${curDisplay.mixNum}` : '';

    const topLabels = getTopLabels(post.tracklist || []);
    const date = formatDate(post.created_time);
    const subtitle = [prefix, date].filter(Boolean).join(' · ');

    const variant = {
      file: brandedOgImageFile(post.slug),
      eyebrow: 'DJ HULK · STUTTGART',
      title,
      subtitle,
      labels: topLabels,
      url: `holger-kampffmeyer.de/dj/mixes/${post.slug}`,
    };

    const overlay = buildOverlay(variant);
    const sourceImage = findSourceImage(post);
    const out = path.join(OUT_DIR, variant.file);

    if (fs.existsSync(out) && !FORCE) {
      console.log(`• ${path.relative(ROOT_DIR, out)} (exists)`);
      continue;
    }

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
  if (!dateStr || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function findSourceImage(post) {
  const ROOT_DIR = path.join(__dirname, '..');
  if (post.heroImage) {
    const relative = decodeURIComponent(post.heroImage).replace(/^\//, '');
    const fullPath = path.join(ROOT_DIR, 'public', relative);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return path.join(ROOT_DIR, 'src/assets/img/booking/dj-hulk-neon.webp');
}

function buildOverlay(variant) {
  const titleLines = wrapText(variant.title, 34, 2);
  const titleTop = 160;
  const titleLineHeight = 58;
  const titleBottom = titleTop + (titleLines.length - 1) * titleLineHeight;

  const subtitleY = titleBottom + 62;
  const labelsHeaderY = subtitleY + 52;
  const labelsTop = labelsHeaderY + 30;
  const labelStep = 29;

  const labelsHtml = variant.labels.map((label, i) =>
    '<text x="70" y="' + (labelsTop + i * labelStep) + '" fill="#22d3ee" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="600">• ' + escapeXml(label) + '</text>'
  ).join('\n    ');

  const titleHtml = titleLines.map((line, i) =>
    '<text x="66" y="' + (titleTop + i * titleLineHeight) + '" fill="#ffffff" font-family="DejaVu Sans, sans-serif" font-size="52" font-weight="700" letter-spacing="-1">' + escapeXml(line) + '</text>'
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
    <text x="70" y="82" fill="#f97316" font-family="DejaVu Sans, sans-serif" font-size="24" font-weight="700" letter-spacing="6">${escapeXml(variant.eyebrow)}</text>
    ${titleHtml}
    <text x="70" y="${subtitleY}" fill="#22d3ee" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="600" letter-spacing="3">${escapeXml(variant.subtitle)}</text>
    ${variant.labels.length > 0 ? `
    <text x="70" y="${labelsHeaderY}" fill="#a1a1aa" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="500">LABELS IN THIS MIX</text>
    ${labelsHtml}
    ` : ''}
    <line x1="70" y1="478" x2="560" y2="478" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
    <text x="70" y="523" fill="#ffffff" font-family="DejaVu Sans, sans-serif" font-size="30" font-weight="700">DJ HULK</text>
    <text x="70" y="556" fill="#a1a1aa" font-family="DejaVu Sans, sans-serif" font-size="19">Holger Kampffmeyer · House / Tech House / Techno / DnB</text>
    <text x="70" y="599" fill="#f97316" font-family="DejaVu Sans, sans-serif" font-size="21" font-weight="700">${escapeXml(variant.url)}</text>
  </svg>`;
}

function wrapText(text, maxChars, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && current) lines.push(current);

  if (lines.length === maxLines) {
    let last = lines[maxLines - 1];
    const consumed = lines.join(' ').length;
    if (consumed < String(text || '').length) {
      last = last.length > maxChars - 1 ? `${last.slice(0, maxChars - 1)}…` : `${last}…`;
      lines[maxLines - 1] = last;
    }
  }

  return lines.length ? lines : [''];
}

function escapeXml(str) {
  const amp = String.fromCharCode(38);
  const entities = {
    '&': amp + 'amp;',
    '<': amp + 'lt;',
    '>': amp + 'gt;',
    '"': amp + 'quot;',
    "'": amp + 'apos;',
  };
  return String(str).replace(/[&<>"']/g, (c) => entities[c]);
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
