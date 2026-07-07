import { describe, it, expect } from 'vitest';
import { escapeXml, formatRssDate } from '../scripts/generate-rss.mjs';

describe('generate-rss.mjs pure functions', () => {
  describe('escapeXml', () => {
    it('should leave regular text unchanged', () => {
      expect(escapeXml('Hello World')).toBe('Hello World');
    });

    it('should escape ampersand', () => {
      expect(escapeXml('AT&T')).toBe('AT&amp;T');
    });

    it('should escape less-than', () => {
      expect(escapeXml('<tag>')).toBe('&lt;tag&gt;');
    });

    it('should escape greater-than', () => {
      expect(escapeXml('a > b')).toBe('a &gt; b');
    });

    it('should escape double quote', () => {
      expect(escapeXml('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('should escape single quote', () => {
      expect(escapeXml("it's")).toBe('it&apos;s');
    });

    it('should handle combined special chars', () => {
      expect(escapeXml('<title attr="val">Tom & Jerry\'s</title>'))
        .toBe('&lt;title attr=&quot;val&quot;&gt;Tom &amp; Jerry&apos;s&lt;/title&gt;');
    });

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('should not double-escape already escaped text', () => {
      expect(escapeXml('&amp;')).toBe('&amp;amp;');
    });
  });

  describe('formatRssDate', () => {
    it('should format an ISO date to RSS format', () => {
      const result = formatRssDate('2026-05-31T06:30:02Z');
      expect(result).toMatch(/^\w{3}, \d{2} \w{3} \d{4} 00:00:00 GMT$/);
      expect(result).toContain('May');
      expect(result).toContain('2026');
    });

    it('should pad single-digit day', () => {
      const result = formatRssDate('2026-01-05T12:00:00Z');
      const dayPart = result.split(', ')[1].split(' ')[0];
      expect(dayPart).toBe('05');
    });

    it('should use English month names', () => {
      expect(formatRssDate('2026-01-15T00:00:00Z')).toContain('Jan');
      expect(formatRssDate('2026-12-15T00:00:00Z')).toContain('Dec');
    });

    it('should handle date-only string', () => {
      const result = formatRssDate('2026-05-31');
      expect(result).toMatch(/^\w{3}, 31 May 2026 00:00:00 GMT$/);
    });
  });
});
