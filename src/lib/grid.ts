/**
 * Grid generation and utility functions
 */

import type { Grid, GridCell, Position } from '@/types/game';
import { LETTER_FREQUENCIES } from '@/constants/config';
import wordListPath from 'word-list';
import { readFileSync } from 'fs';

/**
 * Generate a random letter using weighted frequency distribution
 */
function getRandomLetter(): string {
  const letters = Object.keys(LETTER_FREQUENCIES);
  const weights = Object.values(LETTER_FREQUENCIES);

  // Calculate total weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Select letter based on cumulative weights
  for (let i = 0; i < letters.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return letters[i];
    }
  }

  // Fallback (should never reach here)
  return letters[0];
}

/**
 * Load and cache dictionary words by length
 */
let dictionaryByLength: Map<number, string[]> | null = null;

function loadDictionaryByLength(): Map<number, string[]> {
  if (dictionaryByLength) return dictionaryByLength;

  try {
    const content = readFileSync(wordListPath, 'utf-8');
    const words = content
      .split('\n')
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length >= 3 && word.length <= 9);

    dictionaryByLength = new Map();
    for (let length = 3; length <= 9; length++) {
      dictionaryByLength.set(length, words.filter((w) => w.length === length));
    }

    return dictionaryByLength;
  } catch (error) {
    console.error('Failed to load dictionary for grid generation:', error);
    // Fallback to hardcoded words
    dictionaryByLength = new Map([
      [3, ['CAT', 'DOG', 'RUN', 'SIT', 'EAT', 'HOT', 'BIG', 'NEW', 'OLD', 'RED']],
      [4, ['WORD', 'TIME', 'LOOK', 'MAKE', 'COME', 'LOVE', 'PLAY', 'READ', 'TALK', 'WORK']],
      [5, ['THINK', 'SPEAK', 'HOUSE', 'WATER', 'PLANT', 'POINT', 'WORLD', 'BUILD', 'LEARN', 'WRITE']],
      [6, ['PERSON', 'CHANGE', 'SYSTEM', 'FOLLOW', 'PARENT', 'NUMBER', 'LETTER', 'SIMPLE', 'LISTEN', 'CREATE']],
      [7, ['PROBLEM', 'COMPANY', 'PROVIDE', 'PROGRAM', 'COUNTRY', 'MORNING', 'NOTHING', 'PICTURE', 'THROUGH', 'ANOTHER']],
      [8, ['QUESTION', 'CHILDREN', 'REMEMBER', 'TOGETHER', 'INTEREST', 'ALTHOUGH', 'CONTINUE', 'CONSIDER', 'STRAIGHT', 'BUSINESS']],
      [9, ['SOMETHING', 'DIFFERENT', 'IMPORTANT', 'COMMUNITY', 'EDUCATION', 'CHARACTER', 'POLITICAL', 'SOMETIMES', 'DIFFICULT', 'EXPERIENCE']],
    ]);
    return dictionaryByLength;
  }
}

/**
 * Try to place a word in the grid starting from a position
 */
function tryPlaceWord(cells: GridCell[][], word: string, startRow: number, startCol: number, size: number): boolean {
  if (startRow >= size || startCol >= size) return false;

  // Try different directions: horizontal, vertical, diagonal
  const directions = [
    { dr: 0, dc: 1 },   // horizontal right
    { dr: 1, dc: 0 },   // vertical down
    { dr: 1, dc: 1 },   // diagonal down-right
    { dr: 1, dc: -1 },  // diagonal down-left
  ];

  for (const { dr, dc } of directions) {
    let canPlace = true;
    const positions: Position[] = [];

    // Check if word fits in this direction
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dr;
      const col = startCol + i * dc;

      if (row < 0 || row >= size || col < 0 || col >= size) {
        canPlace = false;
        break;
      }

      positions.push({ row, col });
    }

    // Place the word if it fits
    if (canPlace) {
      for (let i = 0; i < word.length; i++) {
        cells[positions[i].row][positions[i].col].letter = word[i];
      }
      return true;
    }
  }

  return false;
}

/**
 * Generate a new grid of specified size with guaranteed words
 * Seeds words of length 3-9 in decreasing frequency
 */
export function generateGrid(size: number): Grid {
  const cells: GridCell[][] = [];

  // Initialize grid with random letters
  for (let row = 0; row < size; row++) {
    cells[row] = [];
    for (let col = 0; col < size; col++) {
      cells[row][col] = {
        row,
        col,
        letter: getRandomLetter(),
      };
    }
  }

  // Determine how many words to seed based on grid size
  const wordCounts: Record<number, number> = {
    3: Math.ceil(size / 2),      // More 3-letter words
    4: Math.ceil(size / 2),
    5: Math.ceil(size / 3),
    6: Math.ceil(size / 3),
    7: Math.max(1, Math.floor(size / 4)),
    8: Math.max(1, Math.floor(size / 5)),
    9: Math.max(1, Math.floor(size / 6)),  // Fewer 9-letter words
  };

  // Load dictionary words
  const dictionary = loadDictionaryByLength();

  // Seed words into the grid (longer words first for better placement)
  for (let length = 9; length >= 3; length--) {
    const wordsToPlace = wordCounts[length];
    const wordPool = dictionary.get(length) || [];

    if (wordPool.length === 0) continue;

    for (let i = 0; i < wordsToPlace; i++) {
      // Pick a random word from the dictionary for this length
      const word = wordPool[Math.floor(Math.random() * wordPool.length)];

      // Try to place it at a random position
      const maxAttempts = 10;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);

        if (tryPlaceWord(cells, word, startRow, startCol, size)) {
          break; // Successfully placed
        }
      }
    }
  }

  return {
    size,
    cells,
  };
}

/**
 * Get cell at specific position
 * Throws error if position is out of bounds
 */
export function getCellAt(grid: Grid, position: Position): GridCell {
  const { row, col } = position;

  if (row < 0 || row >= grid.size || col < 0 || col >= grid.size) {
    throw new Error(`Position (${row}, ${col}) is out of bounds for grid size ${grid.size}`);
  }

  return grid.cells[row][col];
}

/**
 * Check if two positions are adjacent (horizontally, vertically, or diagonally)
 */
export function areAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);

  // Same cell
  if (rowDiff === 0 && colDiff === 0) {
    return false;
  }

  // Adjacent if both differences are <= 1
  return rowDiff <= 1 && colDiff <= 1;
}
