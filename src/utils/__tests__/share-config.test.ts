import { describe, it, expect } from 'vitest';
import { shareConfig, getShareConfig, type ShareConfigPreset } from '../share-config';

describe('shareConfig', () => {
  it('has all required preset types', () => {
    expect(shareConfig).toHaveProperty('booking');
    expect(shareConfig).toHaveProperty('mixDetail');
    expect(shareConfig).toHaveProperty('generic');
  });

  it('each preset has de and en locales', () => {
    Object.values(shareConfig).forEach((preset) => {
      expect(preset).toHaveProperty('de');
      expect(preset).toHaveProperty('en');
    });
  });

  it('each locale has all 11 required label keys', () => {
    const requiredKeys: (keyof ShareConfigPreset)[] = [
      'nativeLabel',
      'whatsappLabel',
      'facebookLabel',
      'xLabel',
      'linkedinLabel',
      'emailLabel',
      'pinterestLabel',
      'redditLabel',
      'telegramLabel',
      'copyLabel',
      'copiedLabel',
    ];

    Object.values(shareConfig).forEach((preset) => {
      (Object.values(preset) as ShareConfigPreset[]).forEach((locale) => {
        requiredKeys.forEach((key) => {
          expect(locale).toHaveProperty(key);
          expect(typeof locale[key]).toBe('string');
          expect(locale[key].length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('German and English labels differ for at least some keys', () => {
    const de = shareConfig.booking.de;
    const en = shareConfig.booking.en;
    expect(de.nativeLabel).not.toBe(en.nativeLabel);
    expect(de.emailLabel).not.toBe(en.emailLabel);
    expect(de.copyLabel).not.toBe(en.copyLabel);
  });
});

describe('getShareConfig', () => {
  it('returns correct preset for booking/de', () => {
    const config = getShareConfig('booking', 'de');
    expect(config.nativeLabel).toBe('Teilen');
    expect(config.copyLabel).toBe('Link kopieren');
  });

  it('returns correct preset for booking/en', () => {
    const config = getShareConfig('booking', 'en');
    expect(config.nativeLabel).toBe('Share');
    expect(config.copyLabel).toBe('Copy link');
  });

  it('returns correct preset for mixDetail/de', () => {
    const config = getShareConfig('mixDetail', 'de');
    expect(config.nativeLabel).toBe('Teilen');
  });

  it('returns correct preset for mixDetail/en', () => {
    const config = getShareConfig('mixDetail', 'en');
    expect(config.nativeLabel).toBe('Share');
  });

  it('returns correct preset for generic/de', () => {
    const config = getShareConfig('generic', 'de');
    expect(config.nativeLabel).toBe('Teilen');
  });

  it('returns correct preset for generic/en', () => {
    const config = getShareConfig('generic', 'en');
    expect(config.nativeLabel).toBe('Share');
  });
});