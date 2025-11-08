/**
 * Custom hook for word selection using click-to-build interaction
 * Click adjacent cells to build a word, click non-adjacent to clear
 */

import { useCallback } from 'react';
import type { Position } from '@/types/game';
import { useGameStore } from './useGameStore';
import { areAdjacent } from '@/lib/grid';

export function useWordSelection() {
  const { startSelection, extendSelection, removeLastFromSelection, cancelSelection, currentSelection } = useGameStore();

  const handleCellClick = useCallback(
    (position: Position, letter: string) => {
      // If no current selection, start a new one
      if (!currentSelection || currentSelection.positions.length === 0) {
        startSelection(position, letter);
        return;
      }

      // Check if this cell is already in the selection
      const alreadySelected = currentSelection.positions.some(
        (pos) => pos.row === position.row && pos.col === position.col
      );

      if (alreadySelected) {
        // If clicking the last cell, remove it (erase operation)
        const lastPos = currentSelection.positions[currentSelection.positions.length - 1];
        if (lastPos.row === position.row && lastPos.col === position.col) {
          removeLastFromSelection();
          return;
        }
        // If clicking any other cell in the selection, clear and start fresh
        cancelSelection();
        startSelection(position, letter);
        return;
      }

      // Check if adjacent to the last selected cell
      const lastPos = currentSelection.positions[currentSelection.positions.length - 1];
      if (areAdjacent(lastPos, position)) {
        // Adjacent - extend the selection
        extendSelection(position, letter);
      } else {
        // Not adjacent - just clear the selection (don't start a new one)
        // User needs to tap again to start selecting from this cell
        cancelSelection();
      }
    },
    [currentSelection, startSelection, extendSelection, removeLastFromSelection, cancelSelection]
  );

  return {
    handleCellClick,
  };
}
