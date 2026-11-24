import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

function collectFiles(dir, extensions) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath, extensions));
    } else if (extensions.some((extension) => entry.name.endsWith(extension))) {
      files.push(fullPath);
    }
  }

  return files;
}

const sourceFiles = collectFiles(SRC_DIR, ['.astro']);

describe('Heading-Struktur', () => {
  it('kein headingoffset in Dateien mit h1', () => {
    const offenders = sourceFiles.filter((file) => {
      const source = fs.readFileSync(file, 'utf8');
      return source.includes('<h1') && source.includes('headingoffset');
    });

    expect(offenders.map((file) => path.relative(ROOT_DIR, file))).toEqual([]);
  });

  it('Mix-Detail-Seite hat genau ein h1', () => {
    const source = fs.readFileSync(path.join(SRC_DIR, 'pages/dj/mixes/[number].astro'), 'utf8');
    const matches = source.match(/<h1\b/g) || [];

    expect(matches).toHaveLength(1);
  });

  it('Label-Seite hat genau ein h1', () => {
    const source = fs.readFileSync(path.join(SRC_DIR, 'pages/dj/labels/[label].astro'), 'utf8');
    const matches = source.match(/<h1\b/g) || [];

    expect(matches).toHaveLength(1);
  });

  it('Label-Übersicht hat genau ein h1', () => {
    const source = fs.readFileSync(path.join(SRC_DIR, 'pages/dj/labels/index.astro'), 'utf8');
    const matches = source.match(/<h1\b/g) || [];

    expect(matches).toHaveLength(1);
  });

  it('Mix-Detail-Seite startet mit h1 und nutzt h2 für Abschnitte', () => {
    const source = fs.readFileSync(path.join(SRC_DIR, 'pages/dj/mixes/[number].astro'), 'utf8');
    const headingOrder = [...source.matchAll(/<(h[1-6])\b/g)].map((match) => match[1]);

    expect(headingOrder[0]).toBe('h1');
    expect(headingOrder.filter((tag) => tag === 'h1')).toHaveLength(1);
  });
});
