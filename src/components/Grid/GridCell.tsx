'use client';

import type { GridCell as GridCellType } from '@/types/game';

interface GridCellProps {
  cell: GridCellType;
  isSelected: boolean;
  isFound: boolean;
  onClick: () => void;
}

export function GridCell({ cell, isSelected, isFound, onClick }: GridCellProps) {
  return (
    <div
      className={`grid-cell ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}`}
      onClick={onClick}
      data-row={cell.row}
      data-col={cell.col}
    >
      {cell.letter}
    </div>
  );
}
