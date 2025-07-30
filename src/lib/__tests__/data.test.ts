import { describe, it, expect } from 'vitest';
import { isBefore, startOfDay, parseISO } from 'date-fns';

describe('isBefore', () => {
  it('should return true if the first date is before the second date', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-02');
    expect(isBefore(date1, date2)).toBe(true);
  });

  it('should return false if the first date is after the second date', () => {
    const date1 = new Date('2024-01-02');
    const date2 = new Date('2024-01-01');
    expect(isBefore(date1, date2)).toBe(false);
  });

  it('should return false if the dates are the same', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-01');
    expect(isBefore(date1, date2)).toBe(false);
  });
});

describe('startOfDay', () => {
  it('should return the start of the day for a given date', () => {
    const date = new Date('2024-01-01T12:34:56.789Z');
    const start = startOfDay(date);
    expect(start.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('parseISO', () => {
    it('should correctly parse an ISO 8601 date string', () => {
        const isoString = '2023-01-15T00:00:00.000Z';
        const date = parseISO(isoString);
        expect(date).toBeInstanceOf(Date);
        expect(date.getUTCFullYear()).toBe(2023);
        expect(date.getUTCMonth()).toBe(0); // Month is 0-indexed
        expect(date.getUTCDate()).toBe(15);
    });

    it('should handle date-only ISO strings', () => {
        const isoString = '2023-02-20';
        const date = parseISO(isoString);
        expect(date).toBeInstanceOf(Date);
        expect(date.getUTCFullYear()).toBe(2023);
        expect(date.getUTCMonth()).toBe(1);
        expect(date.getUTCDate()).toBe(20);
    });
});
