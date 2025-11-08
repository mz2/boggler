/**
 * Grid generation and utility functions
 */

import type { Grid, GridCell, Position } from '@/types/game';
import { LETTER_FREQUENCIES } from '@/constants/config';
import { getWordsByLength, loadDictionary } from './dictionary';

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
 * Dictionary cache organized by word length
 * Loaded from the actual dictionary on first use
 */
let dictionaryByLength: Map<number, string[]> | null = null;

/**
 * Get dictionary words organized by length
 * Uses the same dictionary that validates words during gameplay
 */
async function getDictionaryByLength(): Promise<Map<number, string[]>> {
  if (dictionaryByLength) return dictionaryByLength;

  // Ensure dictionary is loaded
  const success = await loadDictionary();
  if (!success) {
    throw new Error('Failed to load dictionary for grid generation');
  }

  // Get words organized by length
  dictionaryByLength = getWordsByLength();

  if (dictionaryByLength.size === 0) {
    throw new Error('Dictionary loaded but contains no valid words (3-9 letters)');
  }

  return dictionaryByLength;
}

/**
 * Get all adjacent positions for a given position
 */
function getAdjacentPositions(pos: Position, size: number): Position[] {
  const adjacent: Position[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const row = pos.row + dr;
    const col = pos.col + dc;
    if (row >= 0 && row < size && col >= 0 && col < size) {
      adjacent.push({ row, col });
    }
  }

  return adjacent;
}

/**
 * Try to place a word in the grid starting from a position using zigzag pattern
 * Uses backtracking to explore all possible paths through adjacent cells
 */
function tryPlaceWord(cells: GridCell[][], word: string, startRow: number, startCol: number, size: number): boolean {
  if (startRow >= size || startCol >= size) return false;

  const path: Position[] = [];
  const used = new Set<string>();

  function backtrack(currentPos: Position, letterIndex: number): boolean {
    // Successfully placed entire word
    if (letterIndex === word.length) {
      return true;
    }

    // Mark current position as used
    const posKey = `${currentPos.row},${currentPos.col}`;
    used.add(posKey);
    path.push(currentPos);

    // Try all adjacent positions for the next letter
    const adjacentPositions = getAdjacentPositions(currentPos, size);

    // Shuffle adjacent positions for variety
    const shuffled = adjacentPositions.sort(() => Math.random() - 0.5);

    for (const nextPos of shuffled) {
      const nextPosKey = `${nextPos.row},${nextPos.col}`;

      // Skip if already used in this path
      if (used.has(nextPosKey)) continue;

      // Try placing the next letter here
      if (backtrack(nextPos, letterIndex + 1)) {
        return true;
      }
    }

    // Backtrack: remove current position from used set and path
    used.delete(posKey);
    path.pop();
    return false;
  }

  // Start the backtracking from the starting position
  const startPos = { row: startRow, col: startCol };
  if (backtrack(startPos, 1)) {
    // Place the word along the found path
    for (let i = 0; i < path.length; i++) {
      cells[path[i].row][path[i].col].letter = word[i];
    }
    return true;
  }

  return false;
}

/**
 * Generate a new grid of specified size with guaranteed words
 * Seeds words of length 3-9 in decreasing frequency
 */
export async function generateGrid(size: number): Promise<Grid> {
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
    3: Math.max(1, Math.floor(size / 4)),  // Fewer 3-letter words
    4: Math.ceil(size / 2),                // More 4-letter words
    5: Math.ceil(size / 2),                // More 5-letter words
    6: Math.ceil(size / 3),
    7: Math.max(1, Math.floor(size / 4)),
    8: Math.max(1, Math.floor(size / 5)),
    9: Math.max(1, Math.floor(size / 6)),  // Fewer 9-letter words
  };

  // Load dictionary words
  const dictionary = await getDictionaryByLength();

  // Seed words into the grid (longer words first for better placement)
  for (let length = 9; length >= 3; length--) {
    const wordsToPlace = wordCounts[length];
    const wordPool = dictionary.get(length) || [];

    if (wordPool.length === 0) {
      console.warn(`No ${length}-letter words available in dictionary`);
      continue;
    }

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
