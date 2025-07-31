import { describe, it, expect } from 'vitest';

// Dummy function to test
const isDateInRange = (date: Date, start: Date, end: Date) => {
  return date >= start && date <= end;
};

describe('Date Range Logic', () => {
  it('should return true if the date is within the range', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const date = new Date('2024-01-15');
    expect(isDateInRange(date, start, end)).toBe(true);
  });

  it('should return false if the date is outside the range', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const date = new Date('2024-02-15');
    expect(isDateInRange(date, start, end)).toBe(false);
  });

  it('should be inclusive of the start and end dates', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    expect(isDateInRange(start, start, end)).toBe(true);
    expect(isDateInRange(end, start, end)).toBe(true);
  });
});
