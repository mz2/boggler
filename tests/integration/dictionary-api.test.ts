import { describe, it, expect } from 'vitest';

/**
 * Tests for dictionary API endpoint
 * Tests the dual dictionary system at the API level
 */

const API_BASE = 'http://localhost:3000';

describe('Dictionary API', () => {
  describe('GET /api/dictionary', () => {
    it('should return both dictionaries by default', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english`);
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty('seedingWords');
      expect(data).toHaveProperty('validationWords');
      expect(data).toHaveProperty('seedingCount');
      expect(data).toHaveProperty('validationCount');
      expect(data.language).toBe('english');
    });

    it('should return only seeding dictionary when type=seeding', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=seeding`);
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty('seedingWords');
      expect(data).toHaveProperty('seedingCount');
      expect(data).not.toHaveProperty('validationWords');
      expect(data.language).toBe('english');
    });

    it('should return only validation dictionary when type=validation', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=validation`);
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty('validationWords');
      expect(data).toHaveProperty('validationCount');
      expect(data).not.toHaveProperty('seedingWords');
      expect(data.language).toBe('english');
    });

    it('should have different sizes for seeding vs validation', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=both`);
      const data = await response.json();

      // Validation should be much larger than seeding
      expect(data.validationCount).toBeGreaterThan(data.seedingCount * 10);

      // Seeding should be around 5,000 words
      expect(data.seedingCount).toBeGreaterThan(3000);
      expect(data.seedingCount).toBeLessThan(6000);

      // Validation should be 100k+ words
      expect(data.validationCount).toBeGreaterThan(100000);
    });

    it('should support Finnish language', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=finnish&type=both`);
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.language).toBe('finnish');
      expect(data).toHaveProperty('seedingWords');
      expect(data).toHaveProperty('validationWords');
      expect(data.seedingCount).toBeGreaterThan(0);
      // Finnish validation currently uses same source (TODO: upgrade to comprehensive dict)
      expect(data.validationCount).toBeGreaterThan(data.seedingCount);
    });

    it('should reject unsupported languages', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=spanish`);
      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Unsupported language');
    });

    it('should default to English if no language specified', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary`);
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.language).toBe('english');
    });

    it('should filter seeding words to 4-9 letters', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=seeding`);
      const data = await response.json();

      // Check a sample of words
      const sampleSize = Math.min(100, data.seedingWords.length);
      for (let i = 0; i < sampleSize; i++) {
        const word = data.seedingWords[i];
        expect(word.length).toBeGreaterThanOrEqual(4);
        expect(word.length).toBeLessThanOrEqual(9);
      }
    });

    it('should return words in lowercase', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=both`);
      const data = await response.json();

      // Check seeding words
      const seedingSample = data.seedingWords.slice(0, 10);
      for (const word of seedingSample) {
        expect(word).toBe(word.toLowerCase());
      }

      // Check validation words
      const validationSample = data.validationWords.slice(0, 10);
      for (const word of validationSample) {
        expect(word).toBe(word.toLowerCase());
      }
    });

    it('should cache dictionaries across requests', async () => {
      // Make multiple requests to verify caching works
      const response1 = await fetch(`${API_BASE}/api/dictionary?language=english&type=both`);
      const data1 = await response1.json();

      const response2 = await fetch(`${API_BASE}/api/dictionary?language=english&type=both`);
      const data2 = await response2.json();

      // Cached data should be identical
      expect(data2.seedingCount).toBe(data1.seedingCount);
      expect(data2.validationCount).toBe(data1.validationCount);
      expect(response2.ok).toBe(true);
    });

    it('should have all seeding words present in validation dictionary', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=both`);
      const data = await response.json();

      const validationSet = new Set(data.validationWords);

      // Check a sample of seeding words
      const sampleSize = Math.min(100, data.seedingWords.length);
      for (let i = 0; i < sampleSize; i++) {
        const seedingWord = data.seedingWords[i];
        expect(validationSet.has(seedingWord)).toBe(true);
      }
    });
  });

  describe('Dictionary Quality', () => {
    it('seeding dictionary should contain common English words', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=seeding`);
      const data = await response.json();

      const seedingSet = new Set(data.seedingWords);

      // These should definitely be in a common words dictionary
      const commonWords = ['time', 'people', 'year', 'work', 'first', 'world'];

      for (const word of commonWords) {
        expect(seedingSet.has(word)).toBe(true);
      }
    });

    it('validation dictionary should contain obscure but real words', async () => {
      const response = await fetch(`${API_BASE}/api/dictionary?language=english&type=validation`);
      const data = await response.json();

      const validationSet = new Set(data.validationWords);

      // These are real words but not commonly used
      const obscureWords = ['zephyr', 'quixotic'];

      let foundAtLeastOne = false;
      for (const word of obscureWords) {
        if (validationSet.has(word)) {
          foundAtLeastOne = true;
        }
      }

      expect(foundAtLeastOne).toBe(true);
    });
  });
});
