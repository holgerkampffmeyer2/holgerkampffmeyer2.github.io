import { describe, it, expect } from 'vitest';
import { normalizeTrack, validateLabelRegistry, buildTrackLabels } from '../src/utils/track-labels.js';

describe('normalizeTrack', () => {
  it('trims trailing comma and whitespace', () => {
    expect(normalizeTrack('Artist - Title,')).toBe('artist - title');
    expect(normalizeTrack('Artist - Title , ')).toBe('artist - title');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeTrack('Artist   -   Title')).toBe('artist - title');
  });

  it('trims and lowercases', () => {
    expect(normalizeTrack('  ARTIST - TITLE  ')).toBe('artist - title');
  });

  it('handles empty and null input', () => {
    expect(normalizeTrack('')).toBe('');
    expect(normalizeTrack(null)).toBe('');
    expect(normalizeTrack(undefined)).toBe('');
  });
});

describe('validateLabelRegistry', () => {
  it('returns empty array for valid registry', () => {
    const registry = {
      labels: {
        'toolroom': { name: 'Toolroom Records', url: 'https://toolroomrecords.com' },
        'defected': { name: 'Defected Records', url: 'https://defected.com' }
      },
      tracks: {
        'artist - title': 'toolroom',
        'another - track': 'defected'
      }
    };
    expect(validateLabelRegistry(registry)).toEqual([]);
  });

  it('detects missing label name', () => {
    const registry = {
      labels: {
        'toolroom': { url: 'https://toolroomrecords.com' }
      },
      tracks: {}
    };
    const issues = validateLabelRegistry(registry);
    expect(issues).toContain('labels["toolroom"]: "name" fehlt');
  });

  it('detects invalid label URL', () => {
    const registry = {
      labels: {
        'toolroom': { name: 'Toolroom', url: 'not-a-url' }
      },
      tracks: {}
    };
    const issues = validateLabelRegistry(registry);
    expect(issues).toContain('labels["toolroom"]: "url" ist keine http(s)-URL');
  });

  it('detects missing track label ID', () => {
    const registry = {
      labels: { 'toolroom': { name: 'Toolroom', url: 'https://toolroom.com' } },
      tracks: { 'artist - title': '' }
    };
    const issues = validateLabelRegistry(registry);
    expect(issues).toContain('tracks["artist - title"]: Label-ID fehlt');
  });

  it('detects unknown label ID in tracks', () => {
    const registry = {
      labels: { 'toolroom': { name: 'Toolroom', url: 'https://toolroom.com' } },
      tracks: { 'artist - title': 'unknown-label' }
    };
    const issues = validateLabelRegistry(registry);
    expect(issues).toContain('tracks["artist - title"]: unbekannte Label-ID "unknown-label"');
  });

  it('handles empty registry', () => {
    expect(validateLabelRegistry({})).toEqual([]);
    expect(validateLabelRegistry(null)).toEqual([]);
  });
});

describe('buildTrackLabels', () => {
  const registry = {
    labels: {
      'toolroom': { name: 'Toolroom Records', url: 'https://toolroomrecords.com' },
      'defected': { name: 'Defected Records', url: 'https://defected.com' },
      'nourl': { name: 'No URL Label', url: '' }
    },
    tracks: {
      'mark knight - your love': 'toolroom',
      'david guetta - titanium': 'defected',
      'unknown artist - track': 'nonexistent',
      'no label - track': ''
    }
  };

  const resolver = buildTrackLabels(registry);

  describe('get', () => {
    it('returns label info for known track', () => {
      const result = resolver.get('Mark Knight - Your Love');
      expect(result).toEqual({
        id: 'toolroom',
        name: 'Toolroom Records',
        url: 'https://toolroomrecords.com'
      });
    });

    it('normalizes track name before lookup', () => {
      const result = resolver.get('  MARK KNIGHT - YOUR LOVE,  ');
      expect(result).toEqual({
        id: 'toolroom',
        name: 'Toolroom Records',
        url: 'https://toolroomrecords.com'
      });
    });

    it('returns null for unknown track', () => {
      expect(resolver.get('Unknown - Track')).toBeNull();
    });

    it('returns null for track with missing label ID', () => {
      expect(resolver.get('No Label - Track')).toBeNull();
    });

    it('returns null for track referencing unknown label ID', () => {
      expect(resolver.get('Unknown Artist - Track')).toBeNull();
    });

    it('handles label with empty URL', () => {
      const result = resolver.get('No Label - Track');
      // track with empty label ID returns null, not the nourl entry
      expect(result).toBeNull();
    });
  });

  describe('hasAny', () => {
    it('returns true when at least one track has a label', () => {
      expect(resolver.hasAny(['Mark Knight - Your Love', 'Unknown - Track'])).toBe(true);
    });

    it('returns false when no tracks have labels', () => {
      expect(resolver.hasAny(['Unknown - Track', 'Another - Unknown'])).toBe(false);
    });

    it('returns false for empty array', () => {
      expect(resolver.hasAny([])).toBe(false);
    });

    it('handles null/undefined input', () => {
      expect(resolver.hasAny(null)).toBe(false);
      expect(resolver.hasAny(undefined)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles empty registry', () => {
      const emptyResolver = buildTrackLabels({});
      expect(emptyResolver.get('Any - Track')).toBeNull();
      expect(emptyResolver.hasAny(['Any - Track'])).toBe(false);
    });

    it('handles null registry', () => {
      const nullResolver = buildTrackLabels(null);
      expect(nullResolver.get('Any - Track')).toBeNull();
    });
  });
});