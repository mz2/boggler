/**
 * Dictionary loading and validation using word-list package
 */

import wordListPath from 'word-list';
import * as fs from 'fs';

// In-memory dictionary set for fast lookups
let dictionarySet: Set<string> | null = null;

/**
 * Load dictionary from word-list package
 * Reads the word list file and stores words in a Set for O(1) lookup
 */
export async function loadDictionary(): Promise<boolean> {
  try {
    // Read the word list file
    const content = await fs.promises.readFile(wordListPath, 'utf-8');

    // Split into words and create Set
    const words = content.split('\n').filter((word) => word.trim().length > 0);
    dictionarySet = new Set(words.map((word) => word.toLowerCase()));

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
