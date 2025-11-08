'use client';

import type { Grid as GridType } from '@/types/game';
import { GridCell } from './GridCell';
import { useWordSelection } from '@/hooks/useWordSelection';
import { useGameStore } from '@/hooks/useGameStore';

interface GridProps {
  grid: GridType;
}

export function Grid({ grid }: GridProps) {
  const { currentSelection } = useGameStore();
  const { handleCellClick } = useWordSelection();

  const isPositionSelected = (row: number, col: number): boolean => {
    if (!currentSelection) return false;
    return currentSelection.positions.some((pos) => pos.row === row && pos.col === col);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${grid.size}, minmax(0, 1fr))`,
    gap: '0.25rem',
    aspectRatio: '1',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  };

  return (
    <div className="grid-container">
      <div style={gridStyle}>
        {grid.cells.map((row, rowIndex) =>
          row.map((cell) => (
            <GridCell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              isSelected={isPositionSelected(cell.row, cell.col)}
              isFound={false}
              onClick={() => handleCellClick({ row: cell.row, col: cell.col }, cell.letter)}
            />
          ))
        )}
      </div>

      {/* Current selection display - always reserve space */}
      <div className="mt-4 text-center min-h-[3rem] flex items-center justify-center">
        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {currentSelection?.wordText || '\u00A0'}
        </p>
      </div>
    </div>
  );
}
