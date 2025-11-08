/**
 * Custom hook for word selection using Pointer Events API
 * Improved diagonal selection by tracking last position
 */

import { useState, useCallback, useRef } from 'react';
import type { Position } from '@/types/game';
import { useGameStore } from './useGameStore';

export function useWordSelection() {
  const [isSelecting, setIsSelecting] = useState(false);
  const lastPositionRef = useRef<Position | null>(null);
  const { startSelection, extendSelection, submitSelection, cancelSelection, currentSelection } =
    useGameStore();

  const handlePointerDown = useCallback(
    (position: Position, letter: string) => {
      setIsSelecting(true);
      lastPositionRef.current = position;
      startSelection(position, letter);
    },
    [startSelection]
  );

  const handlePointerEnter = useCallback(
    (position: Position, letter: string) => {
      if (!isSelecting) return;

      // Only extend if this is a different position than last
      const lastPos = lastPositionRef.current;
      if (lastPos && lastPos.row === position.row && lastPos.col === position.col) {
        return;
      }

      // Check if already in selection (prevent immediate backtracking)
      const alreadySelected = currentSelection?.positions.some(
        (pos) => pos.row === position.row && pos.col === position.col
      );

      if (alreadySelected) {
        // Allow re-selecting only if it's the previous position (for path crossing)
        const secondLast =
          currentSelection && currentSelection.positions.length >= 2
            ? currentSelection.positions[currentSelection.positions.length - 2]
            : null;

        if (
          secondLast &&
          secondLast.row === position.row &&
          secondLast.col === position.col &&
          currentSelection!.positions.length > 2
        ) {
          // Allow backtracking to previous position
          return;
        }
      }

      lastPositionRef.current = position;
      extendSelection(position, letter);
    },
    [isSelecting, extendSelection, currentSelection]
  );

  const handlePointerUp = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);
    lastPositionRef.current = null;

    // Submit the selection
    const result = submitSelection();
    if (!result.success) {
      console.log('Word validation failed:', result.message);
    }
  }, [isSelecting, submitSelection]);

  const handlePointerCancel = useCallback(() => {
    setIsSelecting(false);
    lastPositionRef.current = null;
    cancelSelection();
  }, [cancelSelection]);

  return {
    isSelecting,
    handlePointerDown,
    handlePointerEnter,
    handlePointerUp,
    handlePointerCancel,
  };
}
