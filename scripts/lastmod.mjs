import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const CACHE_PATH = path.join(ROOT_DIR, '.lastmod-cache.json');
const BLOG_DATA_PATH = path.join(ROOT_DIR, 'src/data/blog-posts.json');
const CONCURRENCY = 32;

let cache = null;

function collectSourceFiles() {
  const files = new Set();
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.add(full.slice(ROOT_DIR.length + 1));
    }
  }
  walk(path.join(ROOT_DIR, 'src/pages'));
  return [...files];
}

function gitDateForFile(file) {
  return new Promise(resolve => {
    execFile(
      'git',
      ['log', '-1', '--format=%cI', '--', file],
      { cwd: ROOT_DIR, maxBuffer: 1024 * 1024 },
      (err, stdout) => resolve(err || !stdout.trim() ? null : stdout.trim())
    );
  });
}

async function buildCache() {
  const files = collectSourceFiles();
  const result = {};
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    const dates = await Promise.all(chunk.map(gitDateForFile));
    chunk.forEach((file, j) => {
      if (dates[j]) result[file] = dates[j].slice(0, 10);
    });
  }
  return result;
}

async function writeCache(data) {
  await fs.promises.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await fs.promises.writeFile(CACHE_PATH, JSON.stringify(data, null, 2));
}

function getLastModifiedCache(pathOverride) {
  const cachePath = pathOverride || CACHE_PATH;
  if (!pathOverride && cache) return cache;
  if (fs.existsSync(cachePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      if (!pathOverride) cache = data;
      return data;
    } catch {
      // corrupt — treated as missing
    }
  }
  return null;
}

function lastModifiedFor(srcFiles, mapOverride) {
  const map = mapOverride || getLastModifiedCache() || {};
  let latest = null;
  for (const file of srcFiles) {
    const date = map[file];
    if (date && (!latest || date > latest)) latest = date;
  }
  return latest;
}

function resolveSourceFiles(pagePath) {
  const trim = pagePath.replace(/^\/|\/$/g, '');
  if (!trim) return ['src/pages/index.astro'];
  if (trim.startsWith('dj/mixes/')) return null;
  return [`src/pages/${trim}.astro`];
}

function getMixDate(slug) {
  try {
    const data = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf-8'));
    const post = (data.posts || []).find(p => p.slug === slug);
    if (post && post.created_time) return post.created_time.split('T')[0];
  } catch {
    // ignore
  }
  return null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = await buildCache();
  await writeCache(data);
  console.log(`✅ lastmod cache written to .lastmod-cache.json with ${Object.keys(data).length} files`);
}

export { buildCache, getLastModifiedCache, getMixDate, lastModifiedFor, resolveSourceFiles, writeCache };
