import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import blogData from '../src/data/blog-posts.json';
import {
  brandedOgImageFile,
  brandedOgImagePath,
  labelsOverviewOgImageFile,
  labelsOverviewOgImagePath,
} from '../src/utils/og-image.js';

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const mixPosts = blogData.posts.filter((post) => post.hasTracklist);

describe('mix OG images', () => {
  it('has mix posts with tracklist to check', () => {
    expect(mixPosts.length).toBeGreaterThan(0);
  });

  it('exposes the branded image path per mix slug', () => {
    expect(brandedOgImagePath('dj-hulk-mix203')).toBe('/og/mix-dj-hulk-mix203.jpg');
    expect(brandedOgImageFile('dj-hulk-mix203')).toBe('mix-dj-hulk-mix203.jpg');
  });

  it('does not reference a webp og image anymore', () => {
    const ogRefs = mixPosts.flatMap((post) =>
      Object.values(post).filter((value) => typeof value === 'string' && value.startsWith('/og/'))
    );
    expect(ogRefs.filter((value) => value.endsWith('.webp'))).toEqual([]);
  });

  describe.each(mixPosts.map((post) => [post.slug, post]))('%s', (_slug, post) => {
    const ogImage = brandedOgImagePath(post.slug);
    const ogFile = path.join(PUBLIC_DIR, 'og', brandedOgImageFile(post.slug));

    it('has a branded OG image in public/og', () => {
      expect(fs.existsSync(ogFile)).toBe(true);
    });

    it('uses a format supported by social crawlers', () => {
      expect(ogImage).toMatch(/\.(jpg|jpeg|png)$/);
    });

    it('has the expected dimensions of 1200x630', async () => {
      const meta = await sharp(ogFile).metadata();
      expect(meta.width).toBe(1200);
      expect(meta.height).toBe(630);
    });
  });
});

describe('record labels overview OG image', () => {
  const ogImage = labelsOverviewOgImagePath();
  const ogFile = path.join(PUBLIC_DIR, 'og', labelsOverviewOgImageFile());

  it('exposes the branded image path', () => {
    expect(ogImage).toBe('/og/labels-overview.jpg');
    expect(labelsOverviewOgImageFile()).toBe('labels-overview.jpg');
  });

  it('has a branded OG image in public/og', () => {
    expect(fs.existsSync(ogFile)).toBe(true);
  });

  it('uses a format supported by social crawlers', () => {
    expect(ogImage).toMatch(/\.(jpg|jpeg|png)$/);
  });

  it('has the expected dimensions of 1200x630', async () => {
    const meta = await sharp(ogFile).metadata();
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
  });
});
