import { describe, it, expect } from 'vitest';
import { generateGrid, getCellAt, areAdjacent } from '@/lib/grid';
import type { Grid, Position } from '@/types/game';

describe('generateGrid', () => {
  it('should generate a 4x4 grid', async () => {
    const grid = await generateGrid(4);
    expect(grid.size).toBe(4);
    expect(grid.cells.length).toBe(4);
    expect(grid.cells[0].length).toBe(4);
  });

  it('should generate a 9x9 grid', async () => {
    const grid = await generateGrid(9);
    expect(grid.size).toBe(9);
    expect(grid.cells.length).toBe(9);
    expect(grid.cells[0].length).toBe(9);
  });

  it('should generate a 16x16 grid', async () => {
    const grid = await generateGrid(16);
    expect(grid.size).toBe(16);
    expect(grid.cells.length).toBe(16);
    expect(grid.cells[0].length).toBe(16);
  });

  it('should generate cells with uppercase letters A-Z', async () => {
    const grid = await generateGrid(4);
    for (let row = 0; row < grid.size; row++) {
      for (let col = 0; col < grid.size; col++) {
        const cell = grid.cells[row][col];
        expect(cell.letter).toMatch(/^[A-Z]$/);
        expect(cell.row).toBe(row);
        expect(cell.col).toBe(col);
      }
    }
  });

  it('should use letter frequency weighting', async () => {
    // Generate multiple grids and verify common letters appear more often
    const letterCounts: Record<string, number> = {};
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      const grid = await generateGrid(9);
      for (let row = 0; row < grid.size; row++) {
        for (let col = 0; col < grid.size; col++) {
          const letter = grid.cells[row][col].letter;
          letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }
      }
    }

    // E, A, T should appear more than Q, Z, X
    const commonLetters = ['E', 'A', 'T'];
    const rareLetters = ['Q', 'Z', 'X'];

    const commonCount = commonLetters.reduce((sum, l) => sum + (letterCounts[l] || 0), 0);
    const rareCount = rareLetters.reduce((sum, l) => sum + (letterCounts[l] || 0), 0);

    expect(commonCount).toBeGreaterThan(rareCount);
  });
});

describe('getCellAt', () => {
  it('should return correct cell at position', async () => {
    const grid = await generateGrid(4);
    const cell = getCellAt(grid, { row: 2, col: 3 });
    expect(cell.row).toBe(2);
    expect(cell.col).toBe(3);
  });

  it('should throw error for invalid position', async () => {
    const grid = await generateGrid(4);
    expect(() => getCellAt(grid, { row: 4, col: 0 })).toThrow();
    expect(() => getCellAt(grid, { row: -1, col: 0 })).toThrow();
    expect(() => getCellAt(grid, { row: 0, col: 5 })).toThrow();
  });
});

describe('areAdjacent', () => {
  it('should return true for horizontally adjacent cells', () => {
    expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true);
    expect(areAdjacent({ row: 0, col: 1 }, { row: 0, col: 0 })).toBe(true);
  });

  it('should return true for vertically adjacent cells', () => {
    expect(areAdjacent({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(true);
    expect(areAdjacent({ row: 1, col: 0 }, { row: 0, col: 0 })).toBe(true);
  });

  it('should return true for diagonally adjacent cells', () => {
    expect(areAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(true);
    expect(areAdjacent({ row: 1, col: 1 }, { row: 0, col: 0 })).toBe(true);
    expect(areAdjacent({ row: 0, col: 1 }, { row: 1, col: 0 })).toBe(true);
  });

  it('should return false for non-adjacent cells', () => {
    expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 2 })).toBe(false);
    expect(areAdjacent({ row: 0, col: 0 }, { row: 2, col: 0 })).toBe(false);
    expect(areAdjacent({ row: 0, col: 0 }, { row: 2, col: 2 })).toBe(false);
  });

  it('should return false for same cell', () => {
    expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(false);
  });
});
