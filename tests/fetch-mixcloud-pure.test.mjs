import { describe, it, expect } from 'vitest';

// Import the pure functions from the module
import { 
  computeConfidence, 
  normalizeString,
  extractMixNumber
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

    it('should return 1.0 for standalone number', () => {
      expect(computeConfidence('Some 456 Text', 'Other 456 Hero.webp')).toBe(1.0);
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

    it('should extract standalone 3+ digit number', () => {
      expect(extractMixNumber('Some 178 Text')).toBe('178');
      expect(extractMixNumber('Year 2023')).toBe('2023');
    });

    it('should NOT match "mix" inside words like Guestmix', () => {
      expect(extractMixNumber('Bill McGruddy x DJ Hulk - Selected Radio Guestmix')).toBeNull();
    });

    it('should return null for no match', () => {
      expect(extractMixNumber('No numbers here')).toBeNull();
      expect(extractMixNumber('ab12')).toBeNull(); // only 2 digits
    });
  });
});