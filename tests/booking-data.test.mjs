import { describe, it, expect } from 'vitest';
import { bookingContent, bookingMailto } from '../src/data/booking.ts';

describe('bookingContent', () => {
  it('provides German and English content', () => {
    expect(Object.keys(bookingContent).sort()).toEqual(['de', 'en']);
  });

  it('uses the expected canonical paths', () => {
    expect(bookingContent.de.seo.path).toBe('/booking');
    expect(bookingContent.en.seo.path).toBe('/en/booking');
    expect(bookingContent.de.seo.alternatePath).toBe('/en/booking');
    expect(bookingContent.en.seo.alternatePath).toBe('/booking');
  });

  it('contains the required booking facts and rider groups', () => {
    for (const lang of ['de', 'en']) {
      const content = bookingContent[lang];
      expect(content.facts.length).toBeGreaterThanOrEqual(6);
      expect(content.rider.groups.length).toBeGreaterThanOrEqual(3);
      expect(content.rider.groups.flatMap((group) => group.items).join(' ')).toMatch(/CDJ/);
      expect(content.rider.groups.flatMap((group) => group.items).join(' ')).toMatch(/DDJ-1000/);
    }
  });

  it('lists press photos with downloads and the Crossi0711 credit', () => {
    for (const lang of ['de', 'en']) {
      const photos = bookingContent[lang].press.photos;
      expect(photos.length).toBeGreaterThanOrEqual(6);
      for (const photo of photos) {
        expect(photo.download.startsWith('/img/press/')).toBe(true);
      }
      const credited = photos.find((photo) => photo.key === 'liveBw');
      expect(credited?.creditUrl).toBe('https://www.instagram.com/crossi0711/');
    }
  });

  it('contains contact, PDF and sharing data', () => {
    for (const lang of ['de', 'en']) {
      const content = bookingContent[lang];
      expect(content.contact.email).toBe('holger.kampffmeyer+dj@gmail.com');
      expect(content.contact.whatsappHref.startsWith('https://wa.me/491711467491')).toBe(true);
      expect(content.press.pdfHref.endsWith(`-${lang}.pdf`)).toBe(true);
      expect(content.share.hashtags).toContain('DJHulk');
      expect(content.share.text.length).toBeGreaterThan(20);
    }
  });

  it('builds a localized booking mailto link', () => {
    const de = bookingMailto('de');
    const en = bookingMailto('en');
    expect(de).toContain('mailto:holger.kampffmeyer+dj@gmail.com');
    expect(de).toContain(encodeURIComponent(bookingContent.de.mail.subject));
    expect(en).toContain(encodeURIComponent(bookingContent.en.mail.subject));
    expect(de).not.toBe(en);
  });
});
