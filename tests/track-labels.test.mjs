import { describe, it, expect } from 'vitest';

import {
  normalizeTrack,
  buildTrackLabels,
  validateLabelRegistry,
} from '../src/utils/track-labels.js';

const registry = {
  labels: {
    defected: { name: 'Defected', url: 'https://defected.com' },
    toolroom: { name: 'Toolroom', url: 'https://toolroomrecords.com' },
    unknown: { name: 'Unknown Label', url: '' },
  },
  tracks: {
    'Basement Jaxx - Fly Life': 'defected',
    'Mark Knight - Man With The Red Face,': 'toolroom',
    'Mystery Act - Untitled': 'unknown',
  },
};

describe('normalizeTrack', () => {
  it('trims, lowercases and collapses whitespace', () => {
    expect(normalizeTrack('  Basement   Jaxx  -  Fly Life  ')).toBe('basement jaxx - fly life');
  });

  it('strips a trailing comma', () => {
    expect(normalizeTrack('Mark Knight - Man With The Red Face,')).toBe('mark knight - man with the red face');
  });

  it('returns an empty string for falsy input', () => {
    expect(normalizeTrack('')).toBe('');
    expect(normalizeTrack(undefined)).toBe('');
  });
});

describe('buildTrackLabels', () => {
  const trackLabels = buildTrackLabels(registry);

  it('resolves a known track to its label and website via the label id', () => {
    expect(trackLabels.get('Basement Jaxx - Fly Life')).toEqual({
      id: 'defected',
      name: 'Defected',
      url: 'https://defected.com',
    });
  });

  it('matches despite case and trailing-comma differences', () => {
    expect(trackLabels.get('mark knight - man with the red face')).toEqual({
      id: 'toolroom',
      name: 'Toolroom',
      url: 'https://toolroomrecords.com',
    });
  });

  it('returns a label without URL when none is registered', () => {
    expect(trackLabels.get('Mystery Act - Untitled')).toEqual({
      id: 'unknown',
      name: 'Unknown Label',
      url: null,
    });
  });

  it('returns null for unknown tracks', () => {
    expect(trackLabels.get('Nobody - Nothing')).toBeNull();
  });

  it('ignores tracks referencing a non-existent label id', () => {
    const dangling = buildTrackLabels({
      labels: {},
      tracks: { 'Some - Track': 'missing' },
    });
    expect(dangling.get('Some - Track')).toBeNull();
  });

  it('reports whether any track has a label', () => {
    expect(trackLabels.hasAny(['Nobody - Nothing', 'Basement Jaxx - Fly Life'])).toBe(true);
    expect(trackLabels.hasAny(['Nobody - Nothing'])).toBe(false);
    expect(trackLabels.hasAny([])).toBe(false);
  });

  it('handles an empty or missing registry', () => {
    const empty = buildTrackLabels({});
    expect(empty.get('Basement Jaxx - Fly Life')).toBeNull();
    expect(empty.hasAny(['Basement Jaxx - Fly Life'])).toBe(false);
    expect(buildTrackLabels().hasAny(['anything'])).toBe(false);
  });
});

describe('validateLabelRegistry', () => {
  it('accepts a consistent registry', () => {
    expect(validateLabelRegistry(registry)).toEqual([]);
  });

  it('flags tracks with a missing label id', () => {
    const issues = validateLabelRegistry({ labels: {}, tracks: { 'A - B': '' } });
    expect(issues).toContain('tracks["A - B"]: Label-ID fehlt');
  });

  it('flags tracks referencing an unknown label id', () => {
    const issues = validateLabelRegistry({ labels: {}, tracks: { 'A - B': 'ghost' } });
    expect(issues).toContain('tracks["A - B"]: unbekannte Label-ID "ghost"');
  });

  it('flags a label without a name', () => {
    const issues = validateLabelRegistry({ labels: { x: { url: 'https://x.example' } }, tracks: {} });
    expect(issues).toContain('labels["x"]: "name" fehlt');
  });

  it('flags a non-http url', () => {
    const issues = validateLabelRegistry({ labels: { x: { name: 'X', url: 'ftp://x.example' } }, tracks: {} });
    expect(issues).toContain('labels["x"]: "url" ist keine http(s)-URL');
  });
});
