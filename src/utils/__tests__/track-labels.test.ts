import { describe, it, expect } from 'vitest';
import { normalizeTrack, buildTrackLabels, validateLabelRegistry } from '../track-labels';

describe('normalizeTrack', () => {
  it('trims trailing comma and whitespace', () => {
    expect(normalizeTrack('Artist - Title ,')).toBe('artist - title');
    expect(normalizeTrack('Artist - Title , ')).toBe('artist - title');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeTrack('Artist  -  Title')).toBe('artist - title');
  });

  it('lowercases', () => {
    expect(normalizeTrack('ARTIST - TITLE')).toBe('artist - title');
  });

  it('handles empty string', () => {
    expect(normalizeTrack('')).toBe('');
    expect(normalizeTrack('   ')).toBe('');
  });

  it('handles null/undefined gracefully', () => {
    expect(normalizeTrack(null as any)).toBe('');
    expect(normalizeTrack(undefined as any)).toBe('');
  });
});

describe('buildTrackLabels', () => {
  const mockRegistry = {
    labels: {
      '1': { name: 'Toolroom', url: 'https://toolroom.com' },
      '2': { name: 'Defected', url: 'https://defected.com' },
    },
    tracks: {
      'Artist One - Track One': '1',
      'Artist Two - Track Two': '2',
    },
  };

  it('returns resolver with get and hasAny methods', () => {
    const resolver = buildTrackLabels(mockRegistry);
    expect(typeof resolver.get).toBe('function');
    expect(typeof resolver.hasAny).toBe('function');
  });

  it('get returns label for matching track', () => {
    const resolver = buildTrackLabels(mockRegistry);
    const result = resolver.get('Artist One - Track One');
    expect(result).toEqual({ id: '1', name: 'Toolroom', url: 'https://toolroom.com' });
  });

  it('get normalizes track before lookup', () => {
    const resolver = buildTrackLabels(mockRegistry);
    const result = resolver.get('Artist One - Track One ,');
    expect(result).toEqual({ id: '1', name: 'Toolroom', url: 'https://toolroom.com' });
  });

  it('get returns null for unknown track', () => {
    const resolver = buildTrackLabels(mockRegistry);
    const result = resolver.get('Unknown - Track');
    expect(result).toBeNull();
  });

  it('hasAny returns true when any track has label', () => {
    const resolver = buildTrackLabels(mockRegistry);
    expect(resolver.hasAny(['Artist One - Track One', 'Unknown - Track'])).toBe(true);
  });

  it('hasAny returns false when no tracks have labels', () => {
    const resolver = buildTrackLabels(mockRegistry);
    expect(resolver.hasAny(['Unknown - Track', 'Also Unknown'])).toBe(false);
  });

  it('handles empty registry', () => {
    const resolver = buildTrackLabels({});
    expect(resolver.get('Any - Track')).toBeNull();
    expect(resolver.hasAny(['Any - Track'])).toBe(false);
  });

  it('handles missing labels or tracks in registry', () => {
    const resolver = buildTrackLabels({ labels: {}, tracks: {} });
    expect(resolver.get('Any - Track')).toBeNull();
  });
});

describe('validateLabelRegistry', () => {
  it('returns empty array for valid registry', () => {
    const registry = {
      labels: {
        '1': { name: 'Toolroom', url: 'https://toolroom.com' },
      },
      tracks: {
        'Artist - Track': '1',
      },
    };
    expect(validateLabelRegistry(registry)).toEqual([]);
  });

  it('reports missing label name', () => {
    const registry = {
      labels: {
        '1': { url: 'https://toolroom.com' },
      },
      tracks: {},
    };
    const issues = validateLabelRegistry(registry);
    expect(issues).toContain('labels["1"]: "name" fehlt');
  });

  it('reports invalid URL', () => {
    const registry = {
      labels: {
        '1': { name: 'Toolroom', url: 'not-a-url' },
      },
      tracks: {},
    };
    const issues = validateLabelRegistry(registry);
    expect(issues.some((i) => i.includes('ist keine http(s)-URL'))).toBe(true);
  });

  it('reports missing track label ID', () => {
    const registry = {
      labels: {},
      tracks: {
        'Artist - Track': '',
      },
    };
    const issues = validateLabelRegistry(registry);
    expect(issues).toContain('tracks["Artist - Track"]: Label-ID fehlt');
  });

  it('reports unknown label ID in tracks', () => {
    const registry = {
      labels: {
        '1': { name: 'Toolroom' },
      },
      tracks: {
        'Artist - Track': '999',
      },
    };
    const issues = validateLabelRegistry(registry);
    expect(issues).toContain('tracks["Artist - Track"]: unbekannte Label-ID "999"');
  });

  it('handles empty registry', () => {
    expect(validateLabelRegistry({})).toEqual([]);
    expect(validateLabelRegistry(undefined as any)).toEqual([]);
  });
});