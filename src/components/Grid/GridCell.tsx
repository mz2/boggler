'use client';

import type { GridCell as GridCellType } from '@/types/game';

interface GridCellProps {
  cell: GridCellType;
  isSelected: boolean;
  isFound: boolean;
  onPointerDown: () => void;
  onPointerEnter: () => void;
}

export function GridCell({
  cell,
  isSelected,
  isFound,
  onPointerDown,
  onPointerEnter,
}: GridCellProps) {
  return (
    <div
      className={`grid-cell ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}`}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      data-row={cell.row}
      data-col={cell.col}
    >
      {cell.letter}
    </div>
  );
}
