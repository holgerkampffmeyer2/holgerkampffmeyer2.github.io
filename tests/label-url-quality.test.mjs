import { describe, it, expect } from 'vitest';

import { extractText, analyzeContent } from '../scripts/lib/label-quality.mjs';

const FILLER = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '.repeat(10);

function page({ title = 'Label', description = '', body = '' } = {}) {
  return `<!doctype html><html><head><title>${title}</title>${
    description ? `<meta name="description" content="${description}">` : ''
  }</head><body>${body}</body></html>`;
}

describe('extractText', () => {
  it('strips tags and normalizes whitespace to lowercase', () => {
    expect(extractText('<p>Hello   <b>World</b></p>')).toBe('hello world');
  });

  it('removes script and style content, including tags with whitespace', () => {
    const html = '<p>visible</p><script >var x = "record label";</script ><style>.a{}</style >';
    expect(extractText(html)).toBe('visible');
  });

  it('does not leak keywords that only exist inside scripts', () => {
    expect(extractText('<script>const k = "record label music";</script>')).toBe('');
  });
});

describe('analyzeContent', () => {
  it('flags domain parking as suspicious even with music keywords', () => {
    const html = page({
      title: 'Label Records Music',
      body: `<p>${FILLER}</p><p>This domain is for sale. Contact us.</p>`,
    });
    const result = analyzeContent('https://x.example', html, 'https://x.example');
    expect(result.verdict).toBe('suspicious');
    expect(result.foundNegative).toContain('this domain is for sale');
  });

  it('verdicts likely-label for music keywords plus substantial text', () => {
    const html = page({
      title: 'Underground Music Label',
      body: `<p>${FILLER} Records vinyl releases artists catalog discography.</p>`,
    });
    const result = analyzeContent('https://x.example', html, 'https://x.example');
    expect(result.verdict).toBe('likely-label');
    expect(result.musicScore).toBeGreaterThanOrEqual(3);
    expect(result.textLength).toBeGreaterThan(500);
  });

  it('verdicts thin-content for pages without substantial text', () => {
    const html = page({ body: '<p>Music label</p>' });
    expect(analyzeContent('https://x.example', html, 'https://x.example').verdict).toBe('thin-content');
  });

  it('ignores keywords that only appear inside script blocks', () => {
    const html = page({ title: 'Plain', body: `<p>${FILLER}</p><script>var t = "record label music";</script>` });
    const result = analyzeContent('https://x.example', html, 'https://x.example');
    expect(result.musicScore).toBe(0);
    expect(result.verdict).toBe('unclear');
  });

  it('reports the final url and truncated title', () => {
    const html = page({ title: 'X'.repeat(200) });
    const result = analyzeContent('https://x.example', html, 'https://x.example/final');
    expect(result.finalUrl).toBe('https://x.example/final');
    expect(result.title).toHaveLength(120);
  });
});
