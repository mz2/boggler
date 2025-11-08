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
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
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

        {/* Path visualization overlay for found words */}
        {session && session.foundWords.length > 0 && (
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
            {session.foundWords.map((word, wordIndex) => (
              <g key={`word-${word.id}`}>
                {/* Draw lines between positions for this word */}
                {word.positions.map((pos, index) => {
                  if (index === 0) return null;
                  const prevPos = word.positions[index - 1];
                  return (
                    <line
                      key={`line-${wordIndex}-${index}`}
                      x1={prevPos.col + 0.5}
                      y1={prevPos.row + 0.5}
                      x2={pos.col + 0.5}
                      y2={pos.row + 0.5}
                      stroke="#93c5fd"
                      strokeWidth="0.1"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  );
                })}

                {/* Draw dots at each position for this word */}
                {word.positions.map((pos, index) => (
                  <circle
                    key={`dot-${wordIndex}-${index}`}
                    cx={pos.col + 0.5}
                    cy={pos.row + 0.5}
                    r="0.15"
                    fill="#93c5fd"
                    opacity="0.6"
                  />
                ))}
              </g>
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
