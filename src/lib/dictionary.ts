/**
 * Dictionary loading and validation (client-side)
 * Fetches dictionary from API endpoint
 * Uses two separate dictionaries:
 * - Seeding: Common words for grid generation (5,000 words)
 * - Validation: Comprehensive dictionary for word validation (100,000+ words)
 */

// Supported languages
export type Language = 'english' | 'finnish';

// In-memory dictionaries
let validationSet: Set<string> | null = null;
let seedingWords: string[] | null = null;
let currentLanguage: Language | null = null;

/**
 * Load dictionaries from API for a specific language
 * Fetches both seeding and validation word lists
 */
export async function loadDictionary(language: Language = 'english'): Promise<boolean> {
  try {
    // Only reload if language changed or not loaded yet
    if (validationSet && seedingWords && currentLanguage === language) {
      return true;
    }

    const response = await fetch(`/api/dictionary?language=${language}&type=both`);
    if (!response.ok) {
      throw new Error('Failed to fetch dictionary');
    }

    const data = await response.json();

    // Store validation dictionary as Set for O(1) lookup
    validationSet = new Set(data.validationWords);

    // Store seeding words as array (used for grid generation)
    seedingWords = data.seedingWords;

    currentLanguage = language;

    console.log(`Dictionary loaded for ${language}: ${data.seedingCount} seeding words, ${data.validationCount} validation words`);

    return true;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return false;
  }
}

/**
 * Check if a word is valid (exists in validation dictionary)
 * Words are normalized to lowercase for comparison
 * Uses the comprehensive dictionary for validation
 */
export function isValidWord(word: string): boolean {
  if (!validationSet) {
    throw new Error('Dictionary not loaded. Call loadDictionary() first.');
  }

  if (!word || word.length === 0) {
    return false;
  }

  // Normalize to lowercase and check against comprehensive dictionary
  return validationSet.has(word.toLowerCase());
}

/**
 * Get validation dictionary size (number of words)
 */
export function getDictionarySize(): number {
  if (!validationSet) {
    return 0;
  }
  return validationSet.size;
}

/**
 * Get seeding words organized by length
 * Used for grid generation to seed guaranteed findable words
 * Uses only common words for better gameplay
 */
export function getWordsByLength(): Map<number, string[]> {
  if (!seedingWords) {
    throw new Error('Dictionary not loaded. Call loadDictionary() first.');
  }

  const wordsByLength = new Map<number, string[]>();

  // Organize seeding words by length (4-9 letters for grid seeding)
  for (const word of seedingWords) {
    const upperWord = word.toUpperCase();
    const length = upperWord.length;

    if (length >= 4 && length <= 9) {
      if (!wordsByLength.has(length)) {
        wordsByLength.set(length, []);
      }
      wordsByLength.get(length)!.push(upperWord);
    }
  }

  return wordsByLength;
}
