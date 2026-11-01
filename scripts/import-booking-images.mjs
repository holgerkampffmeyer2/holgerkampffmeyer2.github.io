import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const SOURCE_DIR = process.env.BOOKING_IMAGE_DIR || '/mnt/c/Users/holge/Pictures/mixcloud';
const ASSET_DIR = path.join(ROOT_DIR, 'src/assets/img/booking');
const PRESS_DIR = path.join(ROOT_DIR, 'public/img/press');

const images = [
  { source: 'DJ Hulk_6o3vm76o3vm76o3v.png', name: 'dj-hulk-neon', press: 'dj-hulk-neon.jpg' },
  { source: 'DJ Hulk_c6j4lwc6j4lwc6j4.png', name: 'dj-hulk-studio', press: 'dj-hulk-studio.jpg' },
  { source: 'DJ Hulk_sa6174sa6174sa61.png', name: 'dj-hulk-club', press: 'dj-hulk-club.jpg' },
  { source: 'DJ Hulk_y7e7rky7e7rky7e7.png', name: 'dj-hulk-light', press: 'dj-hulk-light.jpg' },
  { source: 'DSC_2316.jpg', name: 'dj-hulk-live-bw', press: 'dj-hulk-live-bw.jpg' },
  { source: 'IMG_6712.jpg', name: 'dj-hulk-live-crowd', press: 'dj-hulk-live-crowd.jpg' },
  { source: 'DJ Hulk - presskit_60h7p860h7p860h7.jpg', name: 'dj-hulk-presskit', press: 'dj-hulk-presskit.jpg' },
  { source: 'DJ Hulk Card.png', name: 'dj-hulk-card', press: 'dj-hulk-card.png' },
];

fs.mkdirSync(ASSET_DIR, { recursive: true });
fs.mkdirSync(PRESS_DIR, { recursive: true });

let failed = 0;

for (const image of images) {
  const sourcePath = path.join(SOURCE_DIR, image.source);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing source image: ${sourcePath}`);
    failed += 1;
    continue;
  }

  const assetPath = path.join(ASSET_DIR, `${image.name}.webp`);
  await sharp(sourcePath)
    .rotate()
    .resize(1600, null, { withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(assetPath);

  const pressPath = path.join(PRESS_DIR, image.press);
  if (path.extname(image.press).toLowerCase() === '.png') {
    await sharp(sourcePath)
      .rotate()
      .resize(2000, null, { withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(pressPath);
  } else {
    await sharp(sourcePath)
      .rotate()
      .resize(2200, null, { withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(pressPath);
  }

  console.log(`✓ ${image.source} → ${path.relative(ROOT_DIR, assetPath)} + ${path.relative(ROOT_DIR, pressPath)}`);
}

fs.writeFileSync(
  path.join(PRESS_DIR, 'CREDITS.txt'),
  [
    'DJ Hulk – Press Photos',
    '',
    'Live photo DSC_2316: Foto: Crossi0711 – https://www.instagram.com/crossi0711/',
    'Alle weiteren Bilder: DJ Hulk / Holger Kampffmeyer.',
    '',
    'Nutzung für redaktionelle Berichterstattung und Event-Promotion im Zusammenhang mit DJ Hulk.',
  ].join('\n'),
  'utf8',
);

if (failed > 0) {
  process.exitCode = 1;
}
