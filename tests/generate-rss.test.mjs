import { describe, it, expect } from 'vitest';
import { escapeXml, decodeHtmlEntities, formatRssDate, extractMeta } from '../scripts/generate-rss.mjs';

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

  describe('decodeHtmlEntities', () => {
    it('should leave text without entities unchanged', () => {
      expect(decodeHtmlEntities('Hello World')).toBe('Hello World');
    });

    it('should decode numeric entities', () => {
      expect(decodeHtmlEntities('&#38;')).toBe('&');
      expect(decodeHtmlEntities('&#60;')).toBe('<');
      expect(decodeHtmlEntities('&#62;')).toBe('>');
    });

    it('should decode &amp;', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&');
    });

    it('should decode multiple entities', () => {
      expect(decodeHtmlEntities('&#60;div&#62;&amp;&#60;/div&#62;')).toBe('<div>&</div>');
    });

    it('should handle empty string', () => {
      expect(decodeHtmlEntities('')).toBe('');
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

  describe('extractMeta', () => {
    it('should extract title and description from HTML', () => {
      const html = `<html><head>
        <title>DJ Hulk - Mixes</title>
        <meta name="description" content="Weekly DJ mixes by DJ Hulk">
      </head></html>`;
      const meta = extractMeta(html);
      expect(meta.title).toBe('DJ Hulk - Mixes');
      expect(meta.description).toBe('Weekly DJ mixes by DJ Hulk');
    });

    it('should decode HTML entities in title', () => {
      const html = `<html><head>
        <title>DJ Hulk &amp; Friends</title>
        <meta name="description" content="Mixes">
      </head></html>`;
      expect(extractMeta(html).title).toBe('DJ Hulk & Friends');
    });

    it('should decode numeric entities in description', () => {
      const html = `<html><head>
        <title>Test</title>
        <meta name="description" content="&#60;b&#62;bold&#60;/b&#62;">
      </head></html>`;
      expect(extractMeta(html).description).toBe('<b>bold</b>');
    });

    it('should return empty strings when no title or description', () => {
      const html = '<html><head></head></html>';
      const meta = extractMeta(html);
      expect(meta.title).toBe('');
      expect(meta.description).toBe('');
    });

    it('should return empty strings for empty input', () => {
      const meta = extractMeta('');
      expect(meta.title).toBe('');
      expect(meta.description).toBe('');
    });

    it('should trim whitespace from title', () => {
      const html = `<html><head>
        <title>  DJ Hulk  </title>
      </head></html>`;
      expect(extractMeta(html).title).toBe('DJ Hulk');
    });
  });
});
