import { describe, it, expect, vi } from 'vitest';

import {
  buildQuery,
  primaryArtist,
  parseRecordingSearch,
  pickBestRecording,
  recordingConfidence,
  extractLabelFromRelease,
  lookupLabelOnline,
} from '../scripts/lib/label-lookup.mjs';
import { cleanLabel } from '../scripts/lib/label-clean.mjs';

const SEARCH_RESPONSE = {
  recordings: [
    {
      title: 'You',
      'artist-credit': [{ name: 'Mark Knight' }],
      releases: [{ id: 'rel-1', title: 'Future 303' }],
    },
    {
      title: 'Unrelated Song',
      'artist-credit': [{ name: 'Someone Else' }],
      releases: [{ id: 'rel-2', title: 'Other' }],
    },
  ],
};

const RELEASE_RESPONSE = {
  'label-info': [
    { label: { name: 'Toolroom Longplayer' } },
    { label: { name: 'Toolroom' } },
  ],
};

function mockFetch() {
  return vi.fn(async url => {
    if (String(url).includes('/recording?')) return { ok: true, json: async () => SEARCH_RESPONSE };
    if (String(url).includes('/release/')) return { ok: true, json: async () => RELEASE_RESPONSE };
    return { ok: false, status: 404, json: async () => ({}) };
  });
}

describe('primaryArtist', () => {
  it('returns the first artist of a multi-artist string', () => {
    expect(primaryArtist('Armand Van Helden, Mark Knight, D. Ramirez')).toBe('Armand Van Helden');
    expect(primaryArtist('Joe & Jane')).toBe('Joe');
    expect(primaryArtist('Dan feat. Joe')).toBe('Dan');
  });
});

describe('buildQuery', () => {
  it('builds a recording+artist query with bracket-stripped title', () => {
    expect(buildQuery('Mark Knight', 'You (Extended Mix)')).toBe('recording:"You" AND artist:"Mark Knight"');
  });

  it('uses only the primary artist for the query', () => {
    expect(buildQuery('Armand Van Helden, Mark Knight', 'You')).toBe('recording:"You" AND artist:"Armand Van Helden"');
  });

  it('escapes embedded quotes', () => {
    expect(buildQuery('Dr. Ruth', 'Believe "In Yourself"')).toContain('recording:"Believe \\"In Yourself\\""');
  });
});

describe('parseRecordingSearch', () => {
  it('maps titles, artists and releases', () => {
    const result = parseRecordingSearch(SEARCH_RESPONSE);
    expect(result[0]).toMatchObject({ title: 'You', artistName: 'Mark Knight', releaseId: 'rel-1' });
  });

  it('handles a malformed response', () => {
    expect(parseRecordingSearch({})).toEqual([]);
    expect(parseRecordingSearch(null)).toEqual([]);
  });
});

describe('recordingConfidence', () => {
  it('scores an exact title match with artist overlap highest', () => {
    const score = recordingConfidence({ title: 'Higher When I Rise', artistName: 'La Fuente' }, 'La Fuente', 'Higher When I Rise (Extended)');
    expect(score).toBeGreaterThan(0.9);
  });

  it('punishes a wrong track despite an artist overlap', () => {
    const score = recordingConfidence({ title: "You Don't Know Me", artistName: 'Armand Van Helden' }, 'Armand Van Helden, Mark Knight, D. Ramirez', 'You (Extended Mix)');
    expect(score).toBeLessThan(0.8);
  });
});

describe('pickBestRecording', () => {
  it('returns the closest recording with a confidence', () => {
    const best = pickBestRecording(parseRecordingSearch(SEARCH_RESPONSE), 'Mark Knight', 'You');
    expect(best.releaseId).toBe('rel-1');
    expect(best.confidence).toBeGreaterThan(0.9);
  });

  it('returns null for an empty list', () => {
    expect(pickBestRecording([], 'a', 'b')).toBeNull();
  });
});

describe('extractLabelFromRelease', () => {
  it('returns the first label name', () => {
    expect(extractLabelFromRelease(RELEASE_RESPONSE)).toBe('Toolroom Longplayer');
  });

  it('returns null when no label is present', () => {
    expect(extractLabelFromRelease({ 'label-info': [] })).toBeNull();
    expect(extractLabelFromRelease({})).toBeNull();
  });
});

describe('cleanLabel', () => {
  it('rejects placeholders and distributor services', () => {
    expect(cleanLabel('[no label]')).toBe('');
    expect(cleanLabel('Apple Music')).toBe('');
    expect(cleanLabel('Delivered By Inflyte')).toBe('');
    expect(cleanLabel('Various')).toBe('');
  });

  it('keeps real labels and strips surrounding brackets', () => {
    expect(cleanLabel('[Toolroom Trax]')).toBe('Toolroom Trax');
  });
});

describe('lookupLabelOnline', () => {
  it('returns a label from MusicBrainz', async () => {
    const fetchImpl = mockFetch();
    const result = await lookupLabelOnline({ artist: 'Mark Knight', title: 'You' }, { fetchImpl });
    expect(result).toMatchObject({ label: 'Toolroom Longplayer', source: 'musicbrainz' });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('drops a release label that is only a placeholder', async () => {
    const fetchImpl = vi.fn(async url => {
      if (String(url).includes('/recording?')) return { ok: true, json: async () => SEARCH_RESPONSE };
      return { ok: true, json: async () => ({ 'label-info': [{ label: { name: '[no label]' } }] }) };
    });
    expect(await lookupLabelOnline({ artist: 'Mark Knight', title: 'You' }, { fetchImpl })).toBeNull();
  });

  it('uses the injected cache on a second call', async () => {
    const store = {};
    const cache = { get: key => store[key], set: (key, value) => { store[key] = value; } };
    const fetchImpl = mockFetch();
    await lookupLabelOnline({ artist: 'Mark Knight', title: 'You' }, { fetchImpl, cache });
    await lookupLabelOnline({ artist: 'Mark Knight', title: 'You' }, { fetchImpl, cache });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('sanitizes stale cached results without a network call', async () => {
    const store = {
      'musicbrainz:recording:"you" and artist:"mark knight"': { label: '[no label]', confidence: 1, matchedName: 'x', source: 'musicbrainz' },
    };
    const cache = { get: key => store[key], set: (key, value) => { store[key] = value; } };
    const fetchImpl = vi.fn();
    expect(await lookupLabelOnline({ artist: 'Mark Knight', title: 'You' }, { fetchImpl, cache })).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns null when the search finds no release', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({ recordings: [] }) }));
    expect(await lookupLabelOnline({ artist: 'A', title: 'B' }, { fetchImpl })).toBeNull();
  });

  it('returns null on a network error', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    expect(await lookupLabelOnline({ artist: 'A', title: 'B' }, { fetchImpl })).toBeNull();
  });

  it('returns null on a non-ok response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) });
    expect(await lookupLabelOnline({ artist: 'A', title: 'B' }, { fetchImpl })).toBeNull();
  });
});
