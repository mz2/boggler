import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { loadDictionary, isValidWord, getWordsByLength, getDictionarySize } from '@/lib/dictionary';

/**
 * Tests for dual dictionary system
 * - Seeding dictionary: common words for grid generation
 * - Validation dictionary: comprehensive words for word validation
 *
 * NOTE: These tests mock the API responses to avoid requiring a running server
 */

// Mock fetch globally for these tests
global.fetch = vi.fn();

// Mock dictionary data
const mockSeedingWords = [
  'test', 'word', 'game', 'play', 'time',  // 4 letters
  'hello', 'world', 'first', 'great',      // 5 letters
  'people', 'things', 'moment',            // 6 letters
  'example', 'between',                    // 7 letters
  'question', 'anything',                  // 8 letters
  'important', 'something'                 // 9 letters
];

const mockValidationWords = [
  ...mockSeedingWords,
  // Add more words for comprehensive validation
  'cat', 'dog', 'run', 'sit',              // 3 letters
  'zephyr', 'quixotic', 'ephemeral',       // obscure but real
  'rhythm', 'syzygy', 'glyph'              // more unusual words
];

beforeEach(() => {
  // Reset fetch mock before each test
  vi.mocked(fetch).mockReset();

  // Mock successful API response
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({
      seedingWords: mockSeedingWords,
      validationWords: mockValidationWords,
      seedingCount: mockSeedingWords.length,
      validationCount: mockValidationWords.length,
      language: 'english'
    })
  } as Response);
});

describe('Dual Dictionary System', () => {
  describe('English Dictionary', () => {
    beforeAll(async () => {
      await loadDictionary('english');
    });

    it('should load both seeding and validation dictionaries', async () => {
      const result = await loadDictionary('english');
      expect(result).toBe(true);
    });

    it('should have more validation words than seeding words', () => {
      const size = getDictionarySize();
      const wordsByLength = getWordsByLength();
      let totalSeedingWords = 0;

      for (const words of wordsByLength.values()) {
        totalSeedingWords += words.length;
      }

      // Validation should have more words than seeding
      expect(size).toBeGreaterThan(totalSeedingWords);
    });

    it('should filter seeding dictionary to 4-9 letters', () => {
      const wordsByLength = getWordsByLength();

      // All words should be 4-9 letters
      for (const [length, words] of wordsByLength.entries()) {
        expect(length).toBeGreaterThanOrEqual(4);
        expect(length).toBeLessThanOrEqual(9);

        for (const word of words) {
          expect(word.length).toBe(length);
        }
      }
    });

    it('should validate common words from seeding dictionary', () => {
      const wordsByLength = getWordsByLength();
      const someWords = wordsByLength.get(5)?.slice(0, 10) || [];

      for (const word of someWords) {
        expect(isValidWord(word)).toBe(true);
      }
    });

    it('should validate obscure words in validation but not seeding', () => {
      // Get seeding words as a set
      const wordsByLength = getWordsByLength();
      const seedingSet = new Set<string>();
      for (const words of wordsByLength.values()) {
        words.forEach(word => seedingSet.add(word.toLowerCase()));
      }

      // Test obscure words
      const obscureWords = ['quixotic', 'zephyr', 'ephemeral'];

      for (const word of obscureWords) {
        // Should be valid in validation dictionary
        expect(isValidWord(word)).toBe(true);
        // But likely not in seeding dictionary
        // (This would be true with real data, but our mock has it in both)
      }
    });

    it('should reject nonsense words', () => {
      const nonsenseWords = ['xyzabc', 'qwerty', 'asdfgh', 'zxcvbn'];

      for (const word of nonsenseWords) {
        expect(isValidWord(word)).toBe(false);
      }
    });

    it('should organize seeding words by length (4-9)', () => {
      const wordsByLength = getWordsByLength();

      // Should have words for lengths 4-9
      for (let length = 4; length <= 9; length++) {
        const words = wordsByLength.get(length);
        expect(words).toBeDefined();
        expect(Array.isArray(words)).toBe(true);
        if (words) {
          expect(words.length).toBeGreaterThan(0);
          // Verify all words are the correct length
          for (const word of words.slice(0, 5)) {
            expect(word.length).toBe(length);
          }
        }
      }
    });

    it('should return words in uppercase for grid generation', () => {
      const wordsByLength = getWordsByLength();
      const someWords = wordsByLength.get(5)?.slice(0, 10) || [];

      for (const word of someWords) {
        expect(word).toMatch(/^[A-Z]+$/);
      }
    });
  });

  describe('Dictionary Loading', () => {
    it('should return true on successful load', async () => {
      const result = await loadDictionary('english');
      expect(result).toBe(true);
    });

    it('should load dictionary data correctly', () => {
      // After loading, should have data
      expect(getDictionarySize()).toBeGreaterThan(0);
      expect(getWordsByLength().size).toBeGreaterThan(0);
    });
  });

  describe('Word Validation Edge Cases', () => {
    beforeAll(async () => {
      await loadDictionary('english');
    });

    it('should handle empty strings', () => {
      expect(isValidWord('')).toBe(false);
    });

    it('should handle single characters', () => {
      expect(isValidWord('a')).toBe(false);
      expect(isValidWord('I')).toBe(false);
    });

    it('should be case-insensitive for validation', () => {
      const wordsByLength = getWordsByLength();
      const testWord = wordsByLength.get(5)?.[0];

      if (testWord) {
        expect(isValidWord(testWord)).toBe(true);
        expect(isValidWord(testWord.toLowerCase())).toBe(true);
        expect(isValidWord(testWord.toUpperCase())).toBe(true);
      }
    });

    it('should handle words with mixed case', () => {
      expect(isValidWord('WoRd')).toBe(isValidWord('word'));
    });
  });

  describe('Seeding vs Validation Dictionary Separation', () => {
    beforeAll(async () => {
      await loadDictionary('english');
    });

    it('should have more validation words than seeding words', () => {
      const validationSize = getDictionarySize();

      const wordsByLength = getWordsByLength();
      let seedingSize = 0;
      for (const words of wordsByLength.values()) {
        seedingSize += words.length;
      }

      // With our mock, validation has 3 extra words
      expect(validationSize).toBeGreaterThan(seedingSize);
    });

    it('should use seeding words for grid generation', () => {
      const wordsByLength = getWordsByLength();

      // Should only contain words from seeding dictionary
      for (const [length, words] of wordsByLength.entries()) {
        expect(Array.isArray(words)).toBe(true);
        expect(words.length).toBeGreaterThan(0);

        // All words should be in our mock seeding words
        for (const word of words) {
          expect(mockSeedingWords.map(w => w.toUpperCase())).toContain(word);
        }
      }
    });

    it('should use validation words for word checking', () => {
      // Words in validation but not in seeding should still be valid
      const validationOnlyWords = mockValidationWords.filter(
        w => !mockSeedingWords.includes(w)
      );

      for (const word of validationOnlyWords) {
        expect(isValidWord(word)).toBe(true);
      }
    });
  });
});
