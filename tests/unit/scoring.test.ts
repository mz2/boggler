import { describe, it, expect } from 'vitest';
import { calculateScore } from '@/lib/scoring';

describe('calculateScore', () => {
  it('should return 0 for words shorter than 3 letters', () => {
    expect(calculateScore('')).toBe(0);
    expect(calculateScore('A')).toBe(0);
    expect(calculateScore('AB')).toBe(0);
  });

  it('should calculate correct scores for 3-letter words', () => {
    expect(calculateScore('CAT')).toBe(1);
    expect(calculateScore('DOG')).toBe(1);
  });

  it('should calculate correct scores for 4-letter words', () => {
    expect(calculateScore('WORD')).toBe(2);
    expect(calculateScore('TEST')).toBe(2);
  });

  it('should calculate correct scores for 5-letter words', () => {
    expect(calculateScore('HOUSE')).toBe(4);
  });

  it('should calculate correct scores for 6-letter words', () => {
    expect(calculateScore('CASTLE')).toBe(8);
  });

  it('should calculate correct scores for 7-letter words', () => {
    expect(calculateScore('READING')).toBe(16);
  });

  it('should calculate correct scores for 8-letter words', () => {
    expect(calculateScore('BUILDING')).toBe(32);
  });

  it('should calculate correct scores for 9-letter words', () => {
    expect(calculateScore('WANDERING')).toBe(64);
  });

  it('should handle lowercase words', () => {
    expect(calculateScore('cat')).toBe(1);
    expect(calculateScore('word')).toBe(2);
  });

  it('should follow exponential sequence: 2^(wordLength - 3)', () => {
    // 3 letters: 2^0 = 1
    expect(calculateScore('ABC')).toBe(1);
    // 4 letters: 2^1 = 2
    expect(calculateScore('ABCD')).toBe(2);
    // 5 letters: 2^2 = 4
    expect(calculateScore('ABCDE')).toBe(4);
    // 6 letters: 2^3 = 8
    expect(calculateScore('ABCDEF')).toBe(8);
    // 7 letters: 2^4 = 16
    expect(calculateScore('ABCDEFG')).toBe(16);
  });
});
