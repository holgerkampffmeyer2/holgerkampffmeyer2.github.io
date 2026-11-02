import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const SOURCE = path.join(ROOT_DIR, 'src/assets/img/booking/dj-hulk-neon.webp');
const OUT_DIR = path.join(ROOT_DIR, 'public/og');

function escapeXml(str) {
  return str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "&apos;");
}

const variants = [
  {
    file: 'booking-dj-hulk-de.jpg',
    eyebrow: 'DJ HULK · STUTTGART',
    title: 'ELECTRONIC MUSIC\n& TECH HOUSE',
    subtitle: 'DJ BOOKING · EPK · TECH RIDER',
    url: 'holger-kampffmeyer.de/booking',
  },
  {
    file: 'booking-dj-hulk-en.jpg',
    eyebrow: 'DJ HULK · STUTTGART',
    title: 'ELECTRONIC MUSIC\n& TECH HOUSE',
    subtitle: 'DJ BOOKING · EPK · TECH RIDER',
    url: 'holger-kampffmeyer.de/en/booking',
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const variant of variants) {
  const overlay = `
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
    ${variant.title
      .split('\n')
      .map(
        (line, index) =>
          `<text x="66" y="${255 + index * 87}" fill="#ffffff" font-family="DejaVu Sans, sans-serif" font-size="78" font-weight="700" letter-spacing="-1">${escapeXml(line)}</text>`,
      )
      .join('\n    ')}
    <text x="70" y="408" fill="#22d3ee" font-family="DejaVu Sans, sans-serif" font-size="24" font-weight="700" letter-spacing="5">${escapeXml(variant.subtitle)}</text>
    <line x1="70" y1="455" x2="560" y2="455" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
    <text x="70" y="510" fill="#ffffff" font-family="DejaVu Sans, sans-serif" font-size="28" font-weight="700">DJ HULK</text>
    <text x="70" y="548" fill="#a1a1aa" font-family="DejaVu Sans, sans-serif" font-size="22">Holger Kampffmeyer · House / Tech House / Techno / DnB</text>
    <text x="70" y="592" fill="#f97316" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700">${escapeXml(variant.url)}</text>
  </svg>`;

  const out = path.join(OUT_DIR, variant.file);
  await sharp(SOURCE)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`✓ ${path.relative(ROOT_DIR, out)} (${meta.width}×${meta.height})`);
}
