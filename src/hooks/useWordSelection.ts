/**
 * Custom hook for word selection using Pointer Events API
 */

import { useState, useCallback } from 'react';
import type { Position } from '@/types/game';
import { useGameStore } from './useGameStore';

export function useWordSelection() {
  const [isSelecting, setIsSelecting] = useState(false);
  const { startSelection, extendSelection, submitSelection, cancelSelection } = useGameStore();

  const handlePointerDown = useCallback(
    (position: Position, letter: string) => {
      setIsSelecting(true);
      startSelection(position, letter);
    },
    [startSelection]
  );

  const handlePointerEnter = useCallback(
    (position: Position, letter: string) => {
      if (!isSelecting) return;
      extendSelection(position, letter);
    },
    [isSelecting, extendSelection]
  );

  const handlePointerUp = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);

    // Submit the selection
    const result = submitSelection();
    if (!result.success) {
      console.log('Word validation failed:', result.message);
    }
  }, [isSelecting, submitSelection]);

  const handlePointerCancel = useCallback(() => {
    setIsSelecting(false);
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
