import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT_DIR, 'src/data/social-stats.json');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const SOURCES = {
  instagram: {
    url: 'https://www.instagram.com/djhulk_de/?hl=de',
    profileUrl: 'https://www.instagram.com/djhulk_de/',
    handle: '@djhulk_de',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    parse: (html) => {
      const jsonMatch = html.match(/"edge_followed_by":\{"count":(\d+)/);
      if (jsonMatch) return Number(jsonMatch[1]);
      const textMatch = html.match(/([\d.,]+[KkMm]?)\s*(?:Follower|followers)/);
      return textMatch ? parseCount(textMatch[1]) : null;
    },
  },
  facebook: {
    url: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fholger.kampffmeyer&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId',
    profileUrl: 'https://www.facebook.com/holger.kampffmeyer/',
    handle: 'holger.kampffmeyer',
    parse: (html) => {
      const textMatch = html.match(/([\d.,]+[KkMm]?)\s*(?:Follower|followers|Gefällt mir|Likes)/i);
      return textMatch ? parseCount(textMatch[1]) : null;
    },
  },
  mixcloud: {
    url: 'https://api.mixcloud.com/holger-kampffmeyer/',
    profileUrl: 'https://www.mixcloud.com/holger-kampffmeyer/',
    handle: 'holger-kampffmeyer',
    parse: (text) => {
      const data = JSON.parse(text);
      return Number.isFinite(data.follower_count) ? data.follower_count : null;
    },
  },
};

export function parseCount(value) {
  const match = String(value).trim().match(/([\d.,]+)\s*([KkMm])?/);
  if (!match) return null;

  let number = match[1];
  const suffix = match[2]?.toLowerCase();

  if (suffix) {
    number = number.replace(/,/g, '.');
    const parsed = Number.parseFloat(number);
    if (!Number.isFinite(parsed)) return null;
    return Math.round(parsed * (suffix === 'k' ? 1_000 : 1_000_000));
  }

  const digits = number.replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
}

async function fetchText(url, userAgent = USER_AGENT) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function readCurrent() {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
  } catch {
    return { updatedAt: null, platforms: {} };
  }
}

async function main() {
  const strict = process.argv.includes('--strict');
  const current = readCurrent();
  const platforms = { ...current.platforms };
  const failures = [];
  let changed = false;

  for (const [key, source] of Object.entries(SOURCES)) {
    try {
      const text = await fetchText(source.url, source.userAgent);
      const count = source.parse(text);

      if (!Number.isFinite(count) || count <= 0) {
        throw new Error('could not parse follower count');
      }

      const previous = platforms[key]?.count;
      if (previous !== count) {
        changed = true;
      }

      platforms[key] = {
        count,
        url: source.profileUrl,
        handle: source.handle,
      };
      console.log(`✓ ${key}: ${count}`);
    } catch (error) {
      failures.push(`${key}: ${error.message}`);
      if (platforms[key]?.count) {
        console.warn(`⚠ ${key}: fetch failed, keeping ${platforms[key].count} (${error.message})`);
      } else {
        console.warn(`⚠ ${key}: fetch failed and no fallback available (${error.message})`);
      }
    }
  }

  if (changed || !current.updatedAt) {
    const output = {
      updatedAt: new Date().toISOString().slice(0, 10),
      platforms,
    };
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
    console.log(`Wrote ${path.relative(ROOT_DIR, OUTPUT_PATH)}`);
  } else {
    console.log('No changes, social stats left untouched');
  }

  if (failures.length && strict) {
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
