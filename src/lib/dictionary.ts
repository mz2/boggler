/**
 * Dictionary loading and validation (client-side)
 * Fetches dictionary from API endpoint
 */

// Supported languages
export type Language = 'english' | 'finnish';

// In-memory dictionary set for fast lookups
let dictionarySet: Set<string> | null = null;
let currentLanguage: Language | null = null;

/**
 * Load dictionary from API for a specific language
 * Fetches the word list and stores words in a Set for O(1) lookup
 */
export async function loadDictionary(language: Language = 'english'): Promise<boolean> {
  try {
    // Only reload if language changed or not loaded yet
    if (dictionarySet && currentLanguage === language) {
      return true;
    }

    const response = await fetch(`/api/dictionary?language=${language}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dictionary');
    }

    const data = await response.json();
    dictionarySet = new Set(data.words);
    currentLanguage = language;

    return true;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return false;
  }
}

/**
 * Check if a word is valid (exists in dictionary)
 * Words are normalized to lowercase for comparison
 */
export function isValidWord(word: string): boolean {
  if (!dictionarySet) {
    throw new Error('Dictionary not loaded. Call loadDictionary() first.');
  }

  if (!word || word.length === 0) {
    return false;
  }

  // Normalize to lowercase and check
  return dictionarySet.has(word.toLowerCase());
}

/**
 * Get dictionary size (number of words)
 */
export function getDictionarySize(): number {
  if (!dictionarySet) {
    return 0;
  }
  return dictionarySet.size;
}

/**
 * Get words from dictionary organized by length
 * Used for grid generation to seed guaranteed findable words
 */
export function getWordsByLength(): Map<number, string[]> {
  if (!dictionarySet) {
    throw new Error('Dictionary not loaded. Call loadDictionary() first.');
  }

  const wordsByLength = new Map<number, string[]>();

  // Organize words by length (4-9 letters for grid seeding)
  for (const word of dictionarySet) {
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
