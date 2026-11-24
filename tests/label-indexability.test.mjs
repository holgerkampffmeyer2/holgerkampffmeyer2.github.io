import { describe, it, expect } from 'vitest';
import {
  MIN_LABEL_TRACKS,
  getThinLabelSlugs,
  isIndexableLabel,
} from '../src/utils/label-indexability.mjs';

describe('label indexability', () => {
  it('requires at least three tracks for indexable label pages', () => {
    expect(MIN_LABEL_TRACKS).toBe(3);
    expect(isIndexableLabel('Nothing Hurt')).toBe(false);
    expect(isIndexableLabel('Defected')).toBe(false);
    expect(isIndexableLabel('Ministry of Sound')).toBe(true);
  });

  it('returns the slugs of all thin labels', () => {
    const slugs = getThinLabelSlugs();
    expect(slugs).toContain('nothing-hurt');
    expect(slugs).not.toContain('ministry-of-sound');
  });
});
