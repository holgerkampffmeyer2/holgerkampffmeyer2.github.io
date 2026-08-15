import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  buildCache,
  getLastModifiedCache,
  getMixDate,
  lastModifiedFor,
  resolveSourceFiles,
} from '../scripts/lastmod.mjs';

function tempCachePath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-test-'));
  return path.join(dir, '.lastmod-cache.json');
}

describe('scripts/lastmod.mjs', () => {
  describe('resolveSourceFiles', () => {
    it('maps the root page to index.astro', () => {
      expect(resolveSourceFiles('/')).toEqual(['src/pages/index.astro']);
    });

    it('maps nested dj pages to their astro file', () => {
      expect(resolveSourceFiles('/dj/mixes-weekly/')).toEqual(['src/pages/dj/mixes-weekly.astro']);
    });

    it('returns null for dynamic mix pages', () => {
      expect(resolveSourceFiles('/dj/mixes/some-mix-slug/')).toBeNull();
    });

    it('handles sitemap paths without trailing slash', () => {
      expect(resolveSourceFiles('/work')).toEqual(resolveSourceFiles('/work/'));
    });
  });

  describe('lastModifiedFor', () => {
    it('returns the newest date across all source files', () => {
      const map = { a: '2026-01-01', b: '2026-05-05', c: '2026-03-03' };
      expect(lastModifiedFor(['a', 'b', 'c'], map)).toBe('2026-05-05');
    });

    it('ignores files without an entry', () => {
      expect(lastModifiedFor(['a', 'x'], { a: '2026-02-02' })).toBe('2026-02-02');
    });

    it('returns null when no source file has a date', () => {
      expect(lastModifiedFor(['missing'], {})).toBeNull();
      expect(lastModifiedFor([], { a: '2026-01-01' })).toBeNull();
    });
  });

  describe('getMixDate', () => {
    it('returns the created date for a known mix slug', () => {
      const posts = JSON.parse(fs.readFileSync('src/data/blog-posts.json', 'utf-8')).posts;
      const post = posts[0];
      expect(getMixDate(post.slug)).toBe(post.created_time.split('T')[0]);
    });

    it('returns null for an unknown slug', () => {
      expect(getMixDate('no-such-mix-slug')).toBeNull();
    });
  });

  describe('getLastModifiedCache', () => {
    it('reads a valid cache file', () => {
      const cachePath = tempCachePath();
      fs.writeFileSync(cachePath, JSON.stringify({ 'src/pages/index.astro': '2026-01-01' }));
      expect(getLastModifiedCache(cachePath)).toEqual({ 'src/pages/index.astro': '2026-01-01' });
    });

    it('returns null when the cache file is missing', () => {
      expect(getLastModifiedCache(path.join(tempCachePath(), 'missing.json'))).toBeNull();
    });

    it('returns null when the cache file is corrupt', () => {
      const cachePath = tempCachePath();
      fs.writeFileSync(cachePath, '{ not valid json');
      expect(getLastModifiedCache(cachePath)).toBeNull();
    });
  });

  describe('buildCache', () => {
    it('produces last-modified dates for known source files', async () => {
      const data = await buildCache();
      expect(Object.keys(data).length).toBeGreaterThan(0);
      expect(data['src/pages/index.astro']).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(data['src/pages/work.astro']).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }, 20000);
  });
});
