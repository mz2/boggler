'use client';

import type { Grid as GridType } from '@/types/game';
import { GridCell } from './GridCell';
import { useWordSelection } from '@/hooks/useWordSelection';
import { useGameStore } from '@/hooks/useGameStore';

interface GridProps {
  grid: GridType;
}

export function Grid({ grid }: GridProps) {
  const { currentSelection, session } = useGameStore();
  const { handleCellClick } = useWordSelection();

  const isPositionSelected = (row: number, col: number): boolean => {
    if (!currentSelection) return false;
    return currentSelection.positions.some((pos) => pos.row === row && pos.col === col);
  };

  const isPositionInFoundWord = (row: number, col: number): boolean => {
    if (!session) return false;
    return session.foundWords.some((word) =>
      word.positions.some((pos) => pos.row === row && pos.col === col)
    );
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${grid.size}, minmax(0, 1fr))`,
    gap: '0.25rem',
    aspectRatio: '1',
    maxWidth: grid.size === 16 ? '600px' : grid.size === 9 ? '500px' : '400px',
  };

  return (
    <div className="grid-container">
      <div style={{ position: 'relative' }}>
        <div style={gridStyle}>
          {grid.cells.map((row, rowIndex) =>
            row.map((cell) => (
              <GridCell
                key={`${cell.row}-${cell.col}`}
                cell={cell}
                isSelected={isPositionSelected(cell.row, cell.col)}
                isFound={isPositionInFoundWord(cell.row, cell.col)}
                onClick={() => handleCellClick({ row: cell.row, col: cell.col }, cell.letter)}
              />
            ))
          )}
        </div>

        {/* Path visualization overlay */}
        {currentSelection && currentSelection.positions.length > 1 && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            viewBox={`0 0 ${grid.size} ${grid.size}`}
          >
            {/* Draw lines between positions */}
            {currentSelection.positions.map((pos, index) => {
              if (index === 0) return null;
              const prevPos = currentSelection.positions[index - 1];
              return (
                <line
                  key={`line-${index}`}
                  x1={prevPos.col + 0.5}
                  y1={prevPos.row + 0.5}
                  x2={pos.col + 0.5}
                  y2={pos.row + 0.5}
                  stroke="#3b82f6"
                  strokeWidth="0.15"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Draw dots at each position */}
            {currentSelection.positions.map((pos, index) => (
              <circle
                key={`dot-${index}`}
                cx={pos.col + 0.5}
                cy={pos.row + 0.5}
                r="0.2"
                fill="#3b82f6"
              />
            ))}
          </svg>
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
