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
  const { handlePointerDown, handlePointerEnter, handlePointerUp, handlePointerCancel } =
    useWordSelection();

  const isPositionSelected = (row: number, col: number): boolean => {
    if (!currentSelection) return false;
    return currentSelection.positions.some((pos) => pos.row === row && pos.col === col);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))`,
    gap: '0.25rem',
    aspectRatio: '1',
    maxWidth: grid.size === 16 ? '600px' : grid.size === 9 ? '500px' : '400px',
  };

  return (
    <div
      className="grid-container"
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
    >
      <div style={gridStyle}>
        {grid.cells.map((row, rowIndex) =>
          row.map((cell) => (
            <GridCell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              isSelected={isPositionSelected(cell.row, cell.col)}
              isFound={false} // TODO: Implement found word highlighting
              onPointerDown={() => handlePointerDown({ row: cell.row, col: cell.col }, cell.letter)}
              onPointerEnter={() => handlePointerEnter({ row: cell.row, col: cell.col }, cell.letter)}
            />
          ))
        )}
      </div>

      {/* Current selection display */}
      {currentSelection && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold text-blue-600">{currentSelection.wordText}</p>
        </div>
      )}
    </div>
  );
}
