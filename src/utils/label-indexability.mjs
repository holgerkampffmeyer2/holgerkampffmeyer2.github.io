import fs from 'node:fs';
import path from 'node:path';
import { labelSlug } from './label-slug.js';

export const MIN_LABEL_TRACKS = 3;

const projectRoot = process.cwd();
const labelsData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/labels.json'), 'utf8'));
const blogData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/blog-posts.json'), 'utf8'));

const trackToLabel = labelsData.tracks ?? {};
const labelDefs = labelsData.labels ?? {};

const trackCounts = new Map();

for (const post of (blogData.posts ?? []).filter((post) => post.hasTracklist)) {
  for (const track of post.tracklist ?? []) {
    const id = trackToLabel[track];
    if (!id || !labelDefs[id]) continue;
    const name = labelDefs[id].name;
    trackCounts.set(name, (trackCounts.get(name) ?? 0) + 1);
  }
}

export function isIndexableLabel(name) {
  return (trackCounts.get(name) ?? 0) >= MIN_LABEL_TRACKS;
}

export function getThinLabelSlugs() {
  return [...trackCounts.entries()]
    .filter(([, count]) => count < MIN_LABEL_TRACKS)
    .map(([name]) => labelSlug(name));
}
