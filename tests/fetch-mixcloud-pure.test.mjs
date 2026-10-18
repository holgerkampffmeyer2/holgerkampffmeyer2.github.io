import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

// Import the pure functions from the module
import { 
  computeConfidence, 
  normalizeString,
  extractMixNumber,
  parseTracklistText,
  parseTracklist
} from '../scripts/fetch-mixcloud.mjs';

describe('fetch-mixcloud.mjs pure functions', () => {
  describe('computeConfidence', () => {
    it('should return 1.0 for exact mix number match', () => {
      expect(computeConfidence('My Mix 123 Tracklist.txt', 'Mix 123 Hero Image.webp')).toBe(1.0);
    });

    it('should return 1.0 for exact mix number match with mx prefix', () => {
      expect(computeConfidence('mx123_tracklist.txt', 'mx123_hero.webp')).toBe(1.0);
    });

    it('should return 1.0 for exact match with hash', () => {
      expect(computeConfidence('Track #123', 'Hero #123.webp')).toBe(1.0);
    });

    it('should return 1.0 for exact mix number match in free text', () => {
      expect(computeConfidence('Some Mix 456', 'Other Mix 456 Hero.webp')).toBe(1.0);
    });

    it('should return a value between 0 and 1 for partial match', () => {
      const confidence = computeConfidence('abcdef', 'abxyz');
      expect(confidence).toBeGreaterThan(0);
      expect(confidence).toBeLessThan(1);
    });

    it('should return 0 for no common substring', () => {
      expect(computeConfidence('abc', 'def')).toBe(0);
    });
  });

  describe('normalizeString', () => {
    it('should normalize a simple string', () => {
      expect(normalizeString('Hello World!')).toBe('hello world');
    });

    it('should normalize string with punctuation', () => {
      expect(normalizeString('Hello, World!')).toBe('hello world');
    });

    it('should normalize string with multiple spaces', () => {
      expect(normalizeString('Hello   World')).toBe('hello world');
    });

    it('should trim whitespace', () => {
      expect(normalizeString('  Hello World  ')).toBe('hello world');
    });
  });

  describe('extractMixNumber', () => {
    it('should extract mix number with mx prefix', () => {
      expect(extractMixNumber('mx178_something')).toBe('178');
      expect(extractMixNumber('Mix-178')).toBe('178');
    });

    it('should extract mix number with hash', () => {
      expect(extractMixNumber('#178')).toBe('178');
      expect(extractMixNumber('Track #178')).toBe('178');
    });

    it('should extract mix number from mix-prefixed strings (any digit count)', () => {
      expect(extractMixNumber('Mix1000')).toBe('1000');
      expect(extractMixNumber('Mix 1000')).toBe('1000');
      expect(extractMixNumber('mix-1000')).toBe('1000');
    });

    it('should NOT treat bare/standalone numbers as mix numbers', () => {
      expect(extractMixNumber('Some 178 Text')).toBeNull();
      expect(extractMixNumber('Year 2023')).toBeNull();
      expect(extractMixNumber('BigT B2B Hulk - Funky House Oct 2026')).toBeNull();
    });

    it('should NOT match "mix" inside words like Guestmix', () => {
      expect(extractMixNumber('Bill McGruddy x DJ Hulk - Selected Radio Guestmix')).toBeNull();
    });

    it('should return null for no match', () => {
      expect(extractMixNumber('No numbers here')).toBeNull();
      expect(extractMixNumber('ab12')).toBeNull(); // only 2 digits
    });
  });

  describe('parseTracklistText', () => {
    it('should parse a legacy plain tracklist (tracks only)', () => {
      const input = [
        'Evgeny Otto - You Hypnotized (Extended Mix) 00:00:00',
        'Antonator - Module (Extended Mix) 00:03:29',
        '',
        'ST - Vibin In September (Extended Mix) 00:06:48'
      ].join('\n');
      expect(parseTracklistText(input)).toEqual([
        'Evgeny Otto - You Hypnotized (Extended Mix)',
        'Antonator - Module (Extended Mix)',
        'ST - Vibin In September (Extended Mix)'
      ]);
    });

    it('should strip leading numbering and trailing timestamps', () => {
      expect(parseTracklistText('1. Artist - Track 00:12:34')).toEqual(['Artist - Track']);
      expect(parseTracklistText('Artist - Track')).toEqual(['Artist - Track']);
    });

    it('should drop preamble and TAGS epilogue when a TRACKLIST marker exists', () => {
      const input = [
        '# DJ Hulk Mix-200 - Latin Tech',
        '## Milestone mix number 200 ...',
        'If you enjoy, please fav, repost, comment!',
        '✨DJ Hulk ✨',
        '---',
        'TRACKLIST:',
        'Los de la Vega , Fosfora - La Joda 00:00:00',
        'Shermanology - Let\'s Go (Extended Mix) 00:03:04',
        '',
        'TAGS:',
        'Latin House, Tech House, House'
      ].join('\n');
      expect(parseTracklistText(input)).toEqual([
        'Los de la Vega , Fosfora - La Joda',
        "Shermanology - Let's Go (Extended Mix)"
      ]);
    });

    it('should keep everything after TRACKLIST when there is no TAGS marker', () => {
      const input = ['TRACKLIST:', 'A - B 00:00:00', 'C - D 00:01:00'].join('\n');
      expect(parseTracklistText(input)).toEqual(['A - B', 'C - D']);
    });

    it('should NOT truncate a legacy file that contains a TAGS line but no TRACKLIST marker', () => {
      const input = ['A - B 00:00:00', 'TAGS:', 'Latin House'].join('\n');
      expect(parseTracklistText(input)).toEqual(['A - B', 'TAGS:', 'Latin House']);
    });

    it('should be case-insensitive on markers and tolerate surrounding whitespace', () => {
      const input = ['  tracklist  ', 'A - B 00:00:00', 'tags'].join('\n');
      expect(parseTracklistText(input)).toEqual(['A - B']);
    });

    it('should return an empty array for empty input', () => {
      expect(parseTracklistText('')).toEqual([]);
      expect(parseTracklistText(null)).toEqual([]);
      expect(parseTracklistText(undefined)).toEqual([]);
    });
  });

  describe('parseTracklist (file based)', () => {
    it('should return an empty array for a missing file', () => {
      expect(parseTracklist('tracklists/does-not-exist-tracklist.txt')).toEqual([]);
      expect(parseTracklist(null)).toEqual([]);
    });

    it('should parse a real legacy b2b/guestmix tracklist without junk entries', () => {
      const candidates = [
        'tracklists/DJ Hulk b2B BigT-2026-07-11-tracklist.txt',
        'tracklists/Bill McGruddy x DJ Hulk - Selected Radio Guestmix-tracklist.txt'
      ];
      const file = candidates.find(f => fs.existsSync(f));
      if (!file) return; // fixtures not available in this checkout
      const tracks = parseTracklist(file);
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks.every(t => !/^(#|---|TRACKLIST:?$|TAGS:?$)/i.test(t))).toBe(true);
      expect(tracks.every(t => !/\d{2}:\d{2}:\d{2}$/.test(t))).toBe(true);
    });

    it('should parse the Mix 200 tracklist (preamble + epilogue) down to tracks only', () => {
      const file = 'tracklists/01 DJ Hulk - Mix 200 - Latin Tech-tracklist.txt';
      if (!fs.existsSync(file)) return;
      const tracks = parseTracklist(file);
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks.some(t => /TRACKLIST/i.test(t) || /TAGS/i.test(t) || t.startsWith('#'))).toBe(false);
    });
  });
});