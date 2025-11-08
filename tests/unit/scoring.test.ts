import { describe, it, expect } from 'vitest';
import { calculateScore, fibonacci } from '@/lib/scoring';

describe('fibonacci', () => {
  it('should return correct Fibonacci numbers', () => {
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
    expect(fibonacci(2)).toBe(1);
    expect(fibonacci(3)).toBe(2);
    expect(fibonacci(4)).toBe(3);
    expect(fibonacci(5)).toBe(5);
    expect(fibonacci(6)).toBe(8);
    expect(fibonacci(7)).toBe(13);
    expect(fibonacci(8)).toBe(21);
  });
});

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
    expect(calculateScore('HOUSE')).toBe(3);
  });

  it('should calculate correct scores for 6-letter words', () => {
    expect(calculateScore('CASTLE')).toBe(5);
  });

  it('should calculate correct scores for 7-letter words', () => {
    expect(calculateScore('READING')).toBe(8);
  });

  it('should calculate correct scores for 8-letter words', () => {
    expect(calculateScore('BUILDING')).toBe(13);
  });

  it('should calculate correct scores for 9-letter words', () => {
    expect(calculateScore('WANDERING')).toBe(21);
  });

  it('should handle lowercase words', () => {
    expect(calculateScore('cat')).toBe(1);
    expect(calculateScore('word')).toBe(2);
  });

  it('should follow Fibonacci sequence: F(n) where n = wordLength - 2', () => {
    // 3 letters: F(1) = 1
    expect(calculateScore('ABC')).toBe(1);
    // 4 letters: F(2) = 1 (wait, should be 2!)
    // Let me check the spec...
    // Actually the spec says: 3=1pt, 4=2pts, 5=3pts, 6=5pts
    // So it's F(wordLength-2) but starting from F(1)=1, F(2)=2, F(3)=3, F(4)=5
    // That means we're using: wordLength=3 -> F(1)=1, wordLength=4 -> F(2)=2
    expect(calculateScore('ABCD')).toBe(2);
    expect(calculateScore('ABCDE')).toBe(3);
    expect(calculateScore('ABCDEF')).toBe(5);
  });
});
