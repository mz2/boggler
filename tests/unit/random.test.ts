import { describe, it, expect } from 'vitest';
import { SeededRandom, generateSeed } from '@/lib/random';

describe('SeededRandom', () => {
  it('should produce deterministic results with same seed', () => {
    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(12345);

    // Generate 10 numbers from each RNG
    const numbers1 = Array.from({ length: 10 }, () => rng1.next());
    const numbers2 = Array.from({ length: 10 }, () => rng2.next());

    // All numbers should be identical
    expect(numbers1).toEqual(numbers2);
  });

  it('should produce different results with different seeds', () => {
    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(67890);

    const numbers1 = Array.from({ length: 10 }, () => rng1.next());
    const numbers2 = Array.from({ length: 10 }, () => rng2.next());

    // Numbers should be different
    expect(numbers1).not.toEqual(numbers2);
  });

  it('should generate numbers between 0 and 1', () => {
    const rng = new SeededRandom(12345);

    for (let i = 0; i < 100; i++) {
      const num = rng.next();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(1);
    }
  });

  it('should generate integers in specified range', () => {
    const rng = new SeededRandom(12345);

    for (let i = 0; i < 100; i++) {
      const num = rng.nextInt(5, 10);
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThan(10);
      expect(Number.isInteger(num)).toBe(true);
    }
  });

  it('should shuffle arrays deterministically', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(12345);

    const shuffled1 = rng1.shuffle(array);
    const shuffled2 = rng2.shuffle(array);

    // Same seed should produce same shuffle
    expect(shuffled1).toEqual(shuffled2);

    // Shuffled array should contain same elements
    expect(shuffled1.sort()).toEqual(array.sort());
  });

  it('should shuffle arrays differently with different seeds', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(67890);

    const shuffled1 = rng1.shuffle(array);
    const shuffled2 = rng2.shuffle(array);

    // Different seeds should produce different shuffles (extremely likely)
    expect(shuffled1).not.toEqual(shuffled2);
  });

  it('should not modify original array when shuffling', () => {
    const array = [1, 2, 3, 4, 5];
    const original = [...array];
    const rng = new SeededRandom(12345);

    rng.shuffle(array);

    // Original array should be unchanged
    expect(array).toEqual(original);
  });

  it('should handle edge case seeds', () => {
    const rng1 = new SeededRandom(0);
    const rng2 = new SeededRandom(-1);
    const rng3 = new SeededRandom(2147483647);

    // Should not throw and should produce valid numbers
    expect(() => rng1.next()).not.toThrow();
    expect(() => rng2.next()).not.toThrow();
    expect(() => rng3.next()).not.toThrow();

    expect(rng1.next()).toBeGreaterThanOrEqual(0);
    expect(rng1.next()).toBeLessThan(1);
  });
});

describe('generateSeed', () => {
  it('should generate positive integers', () => {
    const seed1 = generateSeed();
    const seed2 = generateSeed();

    expect(Number.isInteger(seed1)).toBe(true);
    expect(Number.isInteger(seed2)).toBe(true);
    expect(seed1).toBeGreaterThan(0);
    expect(seed2).toBeGreaterThan(0);
  });

  it('should generate different seeds on subsequent calls', () => {
    const seed1 = generateSeed();
    const seed2 = generateSeed();

    // Very unlikely to be the same (but not impossible)
    // This test might occasionally fail due to randomness
    expect(seed1).not.toEqual(seed2);
  });

  it('should generate seeds within valid range', () => {
    for (let i = 0; i < 10; i++) {
      const seed = generateSeed();
      expect(seed).toBeLessThan(2147483647);
      expect(seed).toBeGreaterThanOrEqual(0);
    }
  });
});
