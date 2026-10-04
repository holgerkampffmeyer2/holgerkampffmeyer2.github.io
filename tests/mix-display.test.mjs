import { describe, it, expect } from 'vitest';

import { getMixDisplay } from '../src/utils/mix-display.js';

describe('getMixDisplay', () => {
  it('reads the mix number from the slug', () => {
    const result = getMixDisplay(
      '/holger-kampffmeyer/dj-hulk-mix199-bass-tech-minimal-g-house/',
      'DJ Hulk - Mix199 | Bass / Tech / Minimal / G - House'
    );
    expect(result.mixNum).toBe('199');
    expect(result.label).toBe('Mix#199 – Bass Tech Minimal G…');
  });

  it('reads the mix number from a hash in the title', () => {
    const result = getMixDisplay(
      '/holger-kampffmeyer/dj-hulk-mix-197-deep-house/',
      'DJ Hulk Mix#197 | Deep House'
    );
    expect(result.mixNum).toBe('197');
  });

  it('does not treat a date stamp in the slug as a mix number', () => {
    const result = getMixDisplay(
      '/365fmradio/turtle-friends-mix-serie-dj-hulk-26092026/',
      'Turtle Friends Mix Serie / DJ Hulk (26.09.2026)'
    );
    expect(result.mixNum).toBeNull();
    expect(result.label).not.toMatch(/26092026/);
  });

  it('falls back to the truncated title for mixes without a number', () => {
    const result = getMixDisplay(
      '/365fmradio/turtle-friends-mix-serie-dj-hulk-26092026/',
      'Turtle Friends Mix Serie / DJ Hulk (26.09.2026)'
    );
    expect(result.label.length).toBeLessThanOrEqual(30);
    expect(result.label.endsWith('…')).toBe(true);
  });
});
