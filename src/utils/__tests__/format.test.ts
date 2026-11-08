import { describe, it, expect } from 'vitest';
import { formatDate, formatDuration, toIsoDuration } from '../format';

describe('formatDate', () => {
  it('formats ISO date string to German locale', () => {
    expect(formatDate('2024-01-15')).toBe('15.01.2024');
    expect(formatDate('2024-12-31')).toBe('31.12.2024');
  });

  it('handles full ISO datetime', () => {
    expect(formatDate('2024-01-15T12:30:00Z')).toBe('15.01.2024');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null as any)).toBe('');
    expect(formatDate(undefined as any)).toBe('');
  });

  it('handles invalid date gracefully', () => {
    expect(formatDate('not-a-date')).toBe('Invalid Date');
  });
});

describe('formatDuration', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(3660)).toBe('61:00');
    expect(formatDuration(0)).toBe('0:00');
  });

  it('pads seconds to two digits', () => {
    expect(formatDuration(61)).toBe('1:01');
    expect(formatDuration(69)).toBe('1:09');
  });
});

describe('toIsoDuration', () => {
  it('converts seconds to ISO 8601 duration', () => {
    expect(toIsoDuration(60)).toBe('PT1M0S');
    expect(toIsoDuration(125)).toBe('PT2M5S');
    expect(toIsoDuration(3660)).toBe('PT61M0S');
    expect(toIsoDuration(0)).toBe('PT0M0S');
  });

  it('handles minutes and seconds correctly', () => {
    expect(toIsoDuration(90)).toBe('PT1M30S');
    expect(toIsoDuration(3600)).toBe('PT60M0S');
  });
});