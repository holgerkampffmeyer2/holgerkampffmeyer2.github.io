import { describe, it, expect } from 'vitest';
import { getMixDisplay } from '../src/utils/mix-display.js';

describe('getMixDisplay', () => {
  describe('mix number extraction', () => {
    it('extracts mix number from slug with "mix" prefix', () => {
      expect(getMixDisplay('/dj/mixes/mix-123-some-title', 'Title')).toEqual({
        mixNum: '123',
        label: expect.stringMatching(/^Mix#123/)
      });
    });

    it('extracts mix number from slug with "mx" prefix', () => {
      expect(getMixDisplay('/dj/mixes/mx456-another-title', 'Title')).toEqual({
        mixNum: '456',
        label: expect.stringMatching(/^Mix#456/)
      });
    });

    it('extracts mix number from title with #', () => {
      expect(getMixDisplay('/dj/mixes/some-slug', 'Mix #789 Title')).toEqual({
        mixNum: '789',
        label: expect.stringMatching(/^Mix#789/)
      });
    });

    it('returns null mixNum when no number found', () => {
      expect(getMixDisplay('/dj/mixes/no-number-here', 'No Number Here')).toEqual({
        mixNum: null,
        label: expect.any(String)
      });
    });

    it('ignores date stamps in slug (e.g., 26092026)', () => {
      const result = getMixDisplay('/dj/mixes/turtle-friends-mix-serie-dj-hulk-26092026', 'Turtle Friends Mix Serie DJ Hulk');
      expect(result.mixNum).toBeNull();
    });
  });

  describe('label generation', () => {
    it('generates readable label from slug', () => {
      const result = getMixDisplay('/dj/mixes/mix-100-deep-house-vibes', 'Deep House Vibes');
      expect(result.mixNum).toBe('100');
      expect(result.label).toContain('Mix#100');
    });

    it('removes "dj-hulk" prefix from slug', () => {
      const result = getMixDisplay('/dj/mixes/dj-hulk-mix-50-tech-house', 'Tech House');
      expect(result.label).not.toContain('Dj Hulk');
    });

    it('removes "by dj hulk" from slug', () => {
      const result = getMixDisplay('/dj/mixes/great-mix-by-dj-hulk', 'Great Mix');
      expect(result.label).not.toContain('By Dj Hulk');
    });

    it('capitalizes words in readable part', () => {
      const result = getMixDisplay('/dj/mixes/mix-10-deep-tech-house', 'Deep Tech House');
      expect(result.label).toContain('Deep Tech House');
    });

    it('falls back to title when slug processing yields empty', () => {
      const result = getMixDisplay('/dj/mixes/mix-99-', 'Fallback Title');
      expect(result.label).toContain('Fallback Title');
    });

    it('truncates long labels with ellipsis', () => {
      const longSlug = 'mix-1-very-very-very-very-very-long-title-with-many-words';
      const result = getMixDisplay(`/dj/mixes/${longSlug}`, 'Long Title');
      expect(result.label.length).toBeLessThanOrEqual(31); // 30 + 1 for ellipsis
      expect(result.label).toContain('…');
    });
  });

  describe('edge cases', () => {
    it('handles empty title', () => {
      const result = getMixDisplay('/dj/mixes/mix-1', '');
      expect(result.mixNum).toBe('1');
    });

    it('handles slug with only mix number', () => {
      const result = getMixDisplay('/dj/mixes/mix-200', 'Mix 200');
      expect(result.mixNum).toBe('200');
    });
  });
});