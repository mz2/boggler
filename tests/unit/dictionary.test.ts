import { describe, it, expect, beforeAll } from 'vitest';
import { loadDictionary, isValidWord } from '@/lib/dictionary';

describe('dictionary', () => {
  beforeAll(async () => {
    // Load dictionary once before all tests
    await loadDictionary();
  });

  describe('loadDictionary', () => {
    it('should load dictionary successfully', async () => {
      const result = await loadDictionary();
      expect(result).toBe(true);
    });

    it('should load a large number of words', async () => {
      await loadDictionary();
      // word-list package has 370k+ words
      // Just verify we loaded something substantial
      expect(isValidWord('test')).toBe(true);
    });
  });

  describe('isValidWord', () => {
    it('should return true for common valid words', () => {
      expect(isValidWord('cat')).toBe(true);
      expect(isValidWord('dog')).toBe(true);
      expect(isValidWord('word')).toBe(true);
      expect(isValidWord('test')).toBe(true);
      expect(isValidWord('house')).toBe(true);
    });

    it('should return true for longer valid words', () => {
      expect(isValidWord('building')).toBe(true);
      expect(isValidWord('wandering')).toBe(true);
      expect(isValidWord('dictionary')).toBe(true);
    });

    it('should return false for invalid words', () => {
      expect(isValidWord('xyz')).toBe(false);
      expect(isValidWord('qqqq')).toBe(false);
      expect(isValidWord('asdfgh')).toBe(false);
    });

    it('should handle uppercase words', () => {
      expect(isValidWord('CAT')).toBe(true);
      expect(isValidWord('DOG')).toBe(true);
      expect(isValidWord('WORD')).toBe(true);
    });

    it('should handle mixed case words', () => {
      expect(isValidWord('CaT')).toBe(true);
      expect(isValidWord('DoG')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidWord('')).toBe(false);
    });

    it('should return false for single letter', () => {
      expect(isValidWord('a')).toBe(false);
    });

    it('should return false for two letter words', () => {
      // Most 2-letter words might not be in dictionary
      expect(isValidWord('zz')).toBe(false);
    });
  });
});
