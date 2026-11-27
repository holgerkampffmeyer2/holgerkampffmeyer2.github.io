import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import blogData from '../src/data/blog-posts.json';
import labelsData from '../src/data/labels.json';
import {
  buildMixTitle,
  buildMixDescription,
  buildMixIntro,
  buildRelatedMixes,
} from '../src/utils/mix-seo.js';
import { labelSlug } from '../src/utils/label-slug.js';

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const mixPosts = blogData.posts.filter((post) => post.hasTracklist);

function labelsFor(post) {
  const counts = new Map();
  for (const track of post.tracklist || []) {
    const id = labelsData.tracks[track];
    if (!id) continue;
    const def = labelsData.labels[id];
    if (!def) continue;
    const current = counts.get(def.name) || { name: def.name, url: def.url || null, count: 0 };
    current.count += 1;
    counts.set(def.name, current);
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

const candidates = mixPosts.map((post) => ({ post, labels: labelsFor(post) }));

describe('mix SEO', () => {
  it('has mix posts to check', () => {
    expect(mixPosts.length).toBeGreaterThan(10);
  });

  describe.each(mixPosts.map((post) => [post.slug, post]))('%s', (_slug, post) => {
    const labels = labelsFor(post);

    it('builds a natural title without ellipsis', () => {
      const title = buildMixTitle(post, labels);
      expect(title).not.toContain('…');
      expect(title).not.toContain('...');
      expect(title.length).toBeLessThanOrEqual(68);
    });

    it('builds a title that names the mix and the artist', () => {
      const title = buildMixTitle(post, labels);
      expect(title).toContain('DJ Hulk');
      expect(title.length).toBeGreaterThan(5);
    });

    it('builds an own meta description within 140-160 characters', () => {
      const description = buildMixDescription(post, labels);
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description).not.toContain('…');
    });

    it('does not reuse the mixcloud description', () => {
      const description = buildMixDescription(post, labels);
      expect(description).not.toBe(post.description);
      expect(post.description?.startsWith(description.slice(0, 40))).toBe(false);
    });

    it('builds a unique intro of 3 to 5 sentences', () => {
      const intro = buildMixIntro(post, labels);
      expect(intro.length).toBeGreaterThanOrEqual(3);
      expect(intro.length).toBeLessThanOrEqual(5);
      for (const sentence of intro) {
        expect(sentence.length).toBeGreaterThan(20);
      }
    });

    it('does not copy the mixcloud text into the intro', () => {
      const intro = buildMixIntro(post, labels).join(' ');
      const mixcloudDescription = post.description?.trim();
      if (mixcloudDescription) expect(intro).not.toContain(mixcloudDescription);
      expect(intro).not.toContain('fav, repost');
    });

    it('suggests related mixes that exist', () => {
      const related = buildRelatedMixes(post, candidates, 3);
      expect(related.length).toBeGreaterThan(0);
      expect(related.length).toBeLessThanOrEqual(3);
      const slugs = new Set(mixPosts.map((entry) => entry.slug));
      for (const mix of related) {
        expect(slugs.has(mix.slug)).toBe(true);
        expect(mix.slug).not.toBe(post.slug);
        expect(mix.href).toBe(`/dj/mixes/${mix.slug}`);
      }
    });
  });

  it('keeps titles and descriptions unique across all mixes', () => {
    const titles = mixPosts.map((post) => buildMixTitle(post, labelsFor(post)));
    const descriptions = mixPosts.map((post) => buildMixDescription(post, labelsFor(post)));
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('uses stable label slugs without collisions', () => {
    const names = Object.values(labelsData.labels).map((label) => label.name);
    const slugs = names.map((name) => labelSlug(name));
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('creates a label page for every label used in a mix tracklist', () => {
    const used = new Set();
    for (const post of mixPosts) {
      for (const track of post.tracklist || []) {
        const id = labelsData.tracks[track];
        if (!id || !labelsData.labels[id]) continue;
        used.add(labelSlug(labelsData.labels[id].name));
      }
    }
    expect(used.size).toBeGreaterThan(100);
    expect(fs.existsSync(path.join(ROOT_DIR, 'src/pages/dj/labels/[label].astro'))).toBe(true);
  });

  it('uses distinct JSON-LD ids for label pages and matches mix references', () => {
    const source = fs.readFileSync(path.join(ROOT_DIR, 'src/pages/dj/labels/[label].astro'), 'utf8');
    expect(source).toContain("'@type': 'CollectionPage'");
    expect(source).toContain("'@type': 'Organization'");
    expect(source).toContain('#webpage');
    expect(source).toContain('#list');

    const builders = fs.readFileSync(path.join(ROOT_DIR, 'src/utils/schema-builders.ts'), 'utf8');
    expect(builders).toContain('`/dj/labels/${labelSlug(t.label.name)}`');
  });
});
