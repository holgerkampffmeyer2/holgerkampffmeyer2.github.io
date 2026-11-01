import { describe, it, expect } from 'vitest';
import { buildMailto, buildShareLinks, buildWhatsAppMessage } from '../src/utils/share.ts';

const input = {
  url: 'https://holger-kampffmeyer.de/booking',
  title: 'DJ Hulk Booking',
  text: 'Booking & EPK für DJ Hulk',
  hashtags: 'DJHulk,TechHouse',
};

describe('buildShareLinks', () => {
  it('encodes the URL for every share target', () => {
    const links = buildShareLinks(input);
    const encoded = encodeURIComponent(input.url);

    expect(links.facebook).toContain(encoded);
    expect(links.linkedin).toContain(encoded);
    expect(links.x).toContain(encoded);
    expect(links.whatsapp).toContain(encodeURIComponent(`${input.text} ${input.url}`));
  });

  it('adds hashtags to the X intent', () => {
    const links = buildShareLinks(input);
    expect(links.x).toContain(`hashtags=${encodeURIComponent(input.hashtags)}`);
  });

  it('creates a mailto link with subject and body', () => {
    const links = buildShareLinks(input);
    expect(links.email).toContain(`subject=${encodeURIComponent(input.title)}`);
    expect(links.email).toContain(encodeURIComponent(`${input.text} ${input.url}`));
  });

  it('works without hashtags', () => {
    const links = buildShareLinks({ ...input, hashtags: undefined });
    expect(links.x).not.toContain('hashtags=');
  });
});

describe('buildMailto', () => {
  it('encodes recipient, subject and body', () => {
    const link = buildMailto({
      to: 'holger.kampffmeyer+dj@gmail.com',
      subject: 'Booking-Anfrage: Event am Datum',
      body: 'Hallo Holger,\n\nbitte buchen.',
    });

    expect(link.startsWith('mailto:holger.kampffmeyer+dj@gmail.com?')).toBe(true);
    expect(link).toContain('subject=Booking-Anfrage%3A%20Event%20am%20Datum');
    expect(link).toContain('body=Hallo%20Holger%2C%0A%0Abitte%20buchen.');
  });
});

describe('buildWhatsAppMessage', () => {
  it('normalizes the phone number and encodes the text', () => {
    const link = buildWhatsAppMessage('+49 171 1467491', 'Hallo Holger');
    expect(link).toBe('https://wa.me/491711467491?text=Hallo%20Holger');
  });
});
