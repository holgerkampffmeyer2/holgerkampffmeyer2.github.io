import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZipArchive } from 'archiver';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public/files');

const ASSETS = [
  {
    source: path.join(PUBLIC_DIR, 'img/djhulk_logo.svg'),
    dest: 'dj-hulk-logo.svg',
  },
  {
    source: path.join(PUBLIC_DIR, 'img/djhulk_logo.png'),
    dest: 'dj-hulk-logo.png',
  },
  {
    source: path.join(PUBLIC_DIR, 'img/press/dj-hulk-card.png'),
    dest: 'dj-hulk-promo-card.png',
  },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const zipPath = path.join(OUTPUT_DIR, 'dj-hulk-press-kit.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✓ Press Kit ZIP created: public/files/dj-hulk-press-kit.zip (${archive.pointer()} bytes)`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  for (const asset of ASSETS) {
    if (fs.existsSync(asset.source)) {
      archive.file(asset.source, { name: asset.dest });
      console.log(`  + ${asset.dest}`);
    } else {
      console.warn(`  ⚠ Missing: ${asset.source}`);
    }
  }

  const pressBioDe = `DJ Hulk – Electronic Music aus Stuttgart

DJ Hulk ist das Electronic-Music-Projekt von Holger Kampffmeyer aus Stuttgart. Er spielt House, Tech House, Techno und Drum n Bass in Clubs, auf Festivals und bei Firmenevents. Er ist Mitgründer von ToMaTe Stuttgart n.e.V. und des EM3F Festivals sowie Resident DJ bei 365 FM Radio und CouchRadio.`;

  const pressBioEn = `DJ Hulk – Electronic Music from Stuttgart

DJ Hulk is the electronic music project of Holger Kampffmeyer from Stuttgart. He plays House, Tech House, Techno and Drum n Bass in clubs, at festivals and corporate events. He is co-founder of ToMaTe Stuttgart n.e.V. and the EM3F festival, and resident DJ at 365 FM Radio and CouchRadio.`;

  archive.append(pressBioDe, { name: 'press-bio-de.txt' });
  archive.append(pressBioEn, { name: 'press-bio-en.txt' });

  await archive.finalize();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});