/**
 * Word validation and path checking
 */

import type { Grid, Position } from '@/types/game';
import { areAdjacent, getCellAt } from './grid';
import { isValidWord } from './dictionary';
import { MIN_WORD_LENGTH } from '@/constants/config';

export interface ValidationResult {
  isValid: boolean;
  word?: string;
  error?: string;
}

/**
 * Check if a path of positions is valid (all positions are adjacent)
 * Note: Positions CAN repeat (path crossing allowed per spec)
 */
export function isValidPath(positions: Position[]): boolean {
  if (positions.length === 0) {
    return false;
  }

  if (positions.length === 1) {
    return true;
  }

  // Check that each consecutive pair is adjacent
  for (let i = 0; i < positions.length - 1; i++) {
    if (!areAdjacent(positions[i], positions[i + 1])) {
      return false;
    }
  }

  return true;
}

/**
 * Validate a word submission
 * Checks: path validity, word length, dictionary, duplicates
 */
export function validateWordSubmission(
  grid: Grid,
  positions: Position[],
  foundWords: string[]
): ValidationResult {
  // Check minimum length
  if (positions.length < MIN_WORD_LENGTH) {
    return {
      isValid: false,
      error: `Word must be at least ${MIN_WORD_LENGTH} letters`,
    };
  }

  // Check path validity (all adjacent)
  if (!isValidPath(positions)) {
    return {
      isValid: false,
      error: 'Letters must be adjacent',
    };
  }

  // Build word from positions
  let word = '';
  try {
    for (const position of positions) {
      const cell = getCellAt(grid, position);
      word += cell.letter;
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid position in path',
    };
  }

  // Check for duplicates
  if (foundWords.includes(word)) {
    return {
      isValid: false,
      error: 'Word already found',
      word,
    };
  }

  // Check dictionary
  if (!isValidWord(word)) {
    return {
      isValid: false,
      error: 'Word not in dictionary',
      word,
    };
  }

  return {
    isValid: true,
    word,
  };
}

/**
 * Check if grid has minimum viable number of words
 * This is a heuristic check - implementation can be enhanced
 */
export function hasMinimumViableWords(grid: Grid): boolean {
  // For now, just return true
  // A full implementation would:
  // 1. Run a search algorithm to find all possible words
  // 2. Check if count meets minimum threshold
  // This is optimization for grid generation to ensure playability
  return true;
}
