import { describe, it, expect } from 'vitest';
import { formatDate, formatDuration, toIsoDuration } from '../src/utils/format.ts';

describe('formatDate', () => {
  it('formats a valid ISO date string to German locale', () => {
    expect(formatDate('2024-03-15')).toBe('15.03.2024');
    expect(formatDate('2024-12-25')).toBe('25.12.2024');
  });

  it('returns empty string for falsy input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('handles invalid date strings gracefully', () => {
    expect(formatDate('invalid')).toBe('Invalid Date');
  });
});

describe('formatDuration', () => {
  it('formats seconds to mm:ss', () => {
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(61)).toBe('1:01');
    expect(formatDuration(119)).toBe('1:59');
    expect(formatDuration(120)).toBe('2:00');
    expect(formatDuration(3661)).toBe('61:01');
  });

  it('pads seconds with leading zero', () => {
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(3700)).toBe('61:40');
  });

  it('handles zero seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
  });
});

describe('toIsoDuration', () => {
  it('formats seconds to ISO 8601 duration PTnMnS', () => {
    expect(toIsoDuration(60)).toBe('PT1M0S');
    expect(toIsoDuration(61)).toBe('PT1M1S');
    expect(toIsoDuration(119)).toBe('PT1M59S');
    expect(toIsoDuration(120)).toBe('PT2M0S');
    expect(toIsoDuration(3661)).toBe('PT61M1S');
  });

  it('handles zero seconds', () => {
    expect(toIsoDuration(0)).toBe('PT0M0S');
  });
});