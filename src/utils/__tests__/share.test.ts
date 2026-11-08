import { describe, it, expect } from 'vitest';
import { buildShareLinks, buildMailto, buildWhatsAppMessage } from '../share';

describe('buildShareLinks', () => {
  const input = {
    url: 'https://example.com/page',
    title: 'Test Title',
    text: 'Check this out',
    hashtags: 'test,demo',
  };

  it('returns all 8 share link types', () => {
    const links = buildShareLinks(input);
    expect(links).toHaveProperty('whatsapp');
    expect(links).toHaveProperty('facebook');
    expect(links).toHaveProperty('x');
    expect(links).toHaveProperty('linkedin');
    expect(links).toHaveProperty('email');
    expect(links).toHaveProperty('pinterest');
    expect(links).toHaveProperty('reddit');
    expect(links).toHaveProperty('telegram');
  });

  it('properly encodes URL in all links', () => {
    const links = buildShareLinks(input);
    const encodedUrl = encodeURIComponent('https://example.com/page');
    expect(links.whatsapp).toContain(encodedUrl);
    expect(links.facebook).toContain(encodedUrl);
    expect(links.x).toContain(encodedUrl);
    expect(links.linkedin).toContain(encodedUrl);
    expect(links.pinterest).toContain(encodedUrl);
    expect(links.reddit).toContain(encodedUrl);
    expect(links.telegram).toContain(encodedUrl);
  });

  it('includes text and URL in whatsapp', () => {
    const links = buildShareLinks(input);
    expect(links.whatsapp).toContain('Check%20this%20out');
    expect(links.whatsapp).toContain('https%3A%2F%2Fexample.com%2Fpage');
  });

  it('includes hashtags in X link', () => {
    const links = buildShareLinks(input);
    expect(links.x).toContain('hashtags=test%2Cdemo');
  });

  it('omits hashtags param when not provided', () => {
    const links = buildShareLinks({ ...input, hashtags: undefined });
    expect(links.x).not.toContain('hashtags=');
  });

  it('builds correct email mailto', () => {
    const links = buildShareLinks(input);
    expect(links.email).toBe('mailto:?subject=Test%20Title&body=Check%20this%20out%20https%3A%2F%2Fexample.com%2Fpage');
  });
});

describe('buildMailto', () => {
  it('builds mailto with subject and body', () => {
    const result = buildMailto({
      to: 'test@example.com',
      subject: 'Hello',
      body: 'World',
    });
    expect(result).toBe('mailto:test@example.com?subject=Hello&body=World');
  });

  it('encodes special characters', () => {
    const result = buildMailto({
      to: 'test@example.com',
      subject: 'Hello & Goodbye',
      body: 'Line 1\nLine 2',
    });
    expect(result).toContain('Hello%20%26%20Goodbye');
    expect(result).toContain('Line%201%0ALine%202');
  });
});

describe('buildWhatsAppMessage', () => {
  it('normalizes phone number and builds link', () => {
    const result = buildWhatsAppMessage('+49 171 1234567', 'Hello');
    expect(result).toBe('https://wa.me/491711234567?text=Hello');
  });

  it('removes all non-digit characters', () => {
    const result = buildWhatsAppMessage('+49 (0) 171 - 123 45 67', 'Test');
    expect(result).toBe('https://wa.me/491711234567?text=Test');
  });

  it('encodes message text', () => {
    const result = buildWhatsAppMessage('491711234567', 'Hello & World');
    expect(result).toContain('Hello%20%26%20World');
  });
});