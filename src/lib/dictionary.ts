/**
 * Dictionary loading and validation (client-side)
 * Fetches dictionary from API endpoint
 */

// In-memory dictionary set for fast lookups
let dictionarySet: Set<string> | null = null;

/**
 * Load dictionary from API
 * Fetches the word list and stores words in a Set for O(1) lookup
 */
export async function loadDictionary(): Promise<boolean> {
  try {
    const response = await fetch('/api/dictionary');
    if (!response.ok) {
      throw new Error('Failed to fetch dictionary');
    }

    const data = await response.json();
    dictionarySet = new Set(data.words);

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
