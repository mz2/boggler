/**
 * Grid generation and utility functions
 */

import type { Grid, GridCell, Position } from '@/types/game';
import { LETTER_FREQUENCIES } from '@/constants/config';

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
 * Generate a new grid of specified size with weighted letter frequency
 */
export function generateGrid(size: number): Grid {
  const cells: GridCell[][] = [];

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
