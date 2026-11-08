import { describe, it, expect } from 'vitest';
import { getMixDisplay } from '../mix-display';

describe('getMixDisplay', () => {
  it('extracts mix number from slug with mx prefix', () => {
    const result = getMixDisplay('dj-hulk-mx123-deep-house', 'DJ Hulk - Mix #123 - Deep House');
    expect(result.mixNum).toBe('123');
    expect(result.label).toContain('Mix#123');
  });

  it('extracts mix number from slug with mix prefix', () => {
    const result = getMixDisplay('dj-hulk-mix123-deep-house', 'DJ Hulk - Mix #123 - Deep House');
    expect(result.mixNum).toBe('123');
  });

  it('extracts mix number from title when not in slug', () => {
    const result = getMixDisplay('some-random-slug', 'DJ Hulk - Mix #456 - Deep House');
    expect(result.mixNum).toBe('456');
  });

  it('returns null mixNum when neither slug nor title have number', () => {
    const result = getMixDisplay('some-slug', 'Just a Title');
    expect(result.mixNum).toBeNull();
    expect(result.label).toBe('Just a Title');
  });

  it('cleans up slug for readable label', () => {
    const result = getMixDisplay('dj-hulk-mix123-deep-tech-house', 'DJ Hulk - Mix #123 - Deep Tech House');
    expect(result.label).toContain('Deep Tech House');
  });

  it('removes "by dj hulk" from slug', () => {
    const result = getMixDisplay('dj-hulk-mix123-deep-house-by-dj-hulk', 'DJ Hulk - Mix #123 - Deep House');
    expect(result.label).not.toContain('By');
    expect(result.label).not.toContain('Dj Hulk');
  });

  it('handles date-like numbers in slug (not mix number)', () => {
    const result = getMixDisplay('turtle-friends-mix-serie-dj-hulk-26092026', 'Turtle Friends Mix Serie');
    expect(result.mixNum).toBeNull();
  });

  it('truncates long labels', () => {
    const longTitle = 'A'.repeat(50);
    const result = getMixDisplay(`dj-hulk-mix1-${longTitle}`, `Mix #1 - ${longTitle}`);
    expect(result.label.length).toBeLessThanOrEqual(33); // 30 + '...'
    expect(result.label.endsWith('…')).toBe(true);
  });

  it('handles slug with special characters', () => {
    const result = getMixDisplay('dj-hulk-mix123-deep---house___tech', 'DJ Hulk - Mix #123 - Deep House Tech');
    expect(result.label).toContain('Deep House Tech');
  });

  it('handles title with "Mix #" prefix', () => {
    const result = getMixDisplay('random-slug', 'Mix #789 - Awesome Mix');
    expect(result.mixNum).toBe('789');
    expect(result.label).toContain('Mix#789');
  });
});