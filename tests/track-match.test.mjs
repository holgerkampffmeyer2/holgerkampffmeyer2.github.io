import { describe, it, expect } from 'vitest';

import {
  stripAllBracketed,
  normalizeTrack,
  trackMatchKey,
  cleanTitleForSearch,
  extractRemixHandle,
  trackVariants,
  trackMatchScore,
  cueEntryLabel,
} from '../scripts/lib/track-match.mjs';

describe('stripAllBracketed', () => {
  it('removes round, square and curly qualifiers', () => {
    expect(stripAllBracketed('Song [Extended] (Original Mix) {Dub}')).toBe('Song');
  });

  it('removes nested qualifiers', () => {
    expect(stripAllBracketed('How You Feel (Original Mix (Extended))')).toBe('How You Feel');
  });

  it('returns an empty string for falsy input', () => {
    expect(stripAllBracketed('')).toBe('');
    expect(stripAllBracketed(undefined)).toBe('');
  });
});

describe('normalizeTrack', () => {
  it('trims, collapses whitespace and lowercases', () => {
    expect(normalizeTrack('  Basement   Jaxx  -  Fly Life ')).toBe('basement jaxx - fly life');
  });

  it('strips a trailing comma', () => {
    expect(normalizeTrack('Mark Knight - Man With The Red Face,')).toBe('mark knight - man with the red face');
  });
});

describe('trackMatchKey', () => {
  it('removes accents, ampersands and punctuation', () => {
    expect(trackMatchKey('André Vïla & Friends - Café')).toBe('andre vila and friends cafe');
  });
});

describe('cleanTitleForSearch', () => {
  it('drops bracket qualifiers for the search query', () => {
    expect(cleanTitleForSearch('Dua Lipa - Dont Start Now (Purple Disco Machine Remix) [Extended]'))
      .toBe('Dua Lipa - Dont Start Now');
  });
});

describe('extractRemixHandle', () => {
  it('returns the remix qualifier', () => {
    expect(extractRemixHandle('Jon Le Phunk - 67 Disco (D.P.V. Edit)')).toBe('D.P.V. Edit');
  });

  it('returns an empty string when no remix qualifier exists', () => {
    expect(extractRemixHandle('Chemars - Get Into The Music')).toBe('');
  });
});

describe('trackVariants', () => {
  it('includes the full string, the bracket-stripped form and the title part', () => {
    const variants = trackVariants('ANOTR, Leven Kali, Erik Bandt - How You Feel (Original Mix)');
    expect(variants).toContain('anotr leven kali erik bandt how you feel original mix');
    expect(variants).toContain('anotr leven kali erik bandt how you feel');
    expect(variants).toContain('how you feel');
  });
});

describe('trackMatchScore', () => {
  it('scores identical tracks as 1', () => {
    expect(trackMatchScore('Chemars - Get Into The Music', 'Chemars - Get Into The Music')).toBe(1);
  });

  it('matches despite a differing mix qualifier', () => {
    const score = trackMatchScore(
      'Lazy Susan - On My Mind (Extended Mix)',
      'Lazy Susan - On My Mind (Extended)',
    );
    expect(score).toBeGreaterThan(0.9);
  });

  it('matches when the title carries the artist', () => {
    const score = trackMatchScore(
      'ANOTR, Leven Kali, Erik Bandt - How You Feel (Original Mix)',
      'ANOTR - How You Feel',
    );
    expect(score).toBeGreaterThan(0.85);
  });

  it('matches a reversed "Title - Artist" order', () => {
    const score = trackMatchScore('On My Mind - Lazy Susan', 'Lazy Susan - On My Mind');
    expect(score).toBeGreaterThan(0.8);
  });

  it('scores unrelated tracks low', () => {
    expect(trackMatchScore('Baribal - High', 'Litchy & Smiley - Music is the Answer')).toBeLessThan(0.5);
  });
});

describe('cueEntryLabel', () => {
  it('joins performer and title', () => {
    expect(cueEntryLabel({ performer: 'Lazy Susan', title: 'On My Mind' })).toBe('Lazy Susan - On My Mind');
  });

  it('falls back to the title when the performer is empty', () => {
    expect(cueEntryLabel({ performer: '', title: 'Extra Medium - My Sound' })).toBe('Extra Medium - My Sound');
  });
});
