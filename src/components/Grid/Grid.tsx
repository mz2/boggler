'use client';

import { useState } from 'react';
import type { Grid as GridType } from '@/types/game';
import { GridCell } from './GridCell';
import { useWordSelection } from '@/hooks/useWordSelection';
import { useGameStore } from '@/hooks/useGameStore';

interface GridProps {
  grid: GridType;
  debugMode?: boolean;
}

export function Grid({ grid, debugMode = false }: GridProps) {
  const { currentSelection } = useGameStore();
  const { handleCellClick } = useWordSelection();
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);

  // Color palette for debug mode - same as GameOver
  const pathColors = [
    '#dc2626', // red
    '#ea580c', // orange
    '#d97706', // amber
    '#059669', // emerald
    '#0891b2', // cyan
    '#4f46e5', // indigo
    '#9333ea', // purple
    '#db2777', // pink
  ];

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
      <div style={{ position: 'relative' }}>
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

        {/* Debug mode: Show hovered word path */}
        {debugMode && grid.seededWords && grid.seededWords.length > 0 && hoveredWordIndex !== null && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            viewBox={`0 0 ${grid.size * 100} ${grid.size * 100}`}
          >
            {(() => {
              const word = grid.seededWords[hoveredWordIndex];
              const color = pathColors[hoveredWordIndex % pathColors.length];
              return (
                <g>
                  {/* Draw lines connecting positions */}
                  {word.positions.map((pos, posIndex) => {
                    if (posIndex === word.positions.length - 1) return null;
                    const nextPos = word.positions[posIndex + 1];

                    const x1 = pos.col * 100 + 50;
                    const y1 = pos.row * 100 + 50;
                    const x2 = nextPos.col * 100 + 50;
                    const y2 = nextPos.row * 100 + 50;

                    return (
                      <line
                        key={posIndex}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    );
                  })}

                  {/* Draw dots at each position */}
                  {word.positions.map((pos, posIndex) => {
                    const x = pos.col * 100 + 50;
                    const y = pos.row * 100 + 50;

                    return (
                      <circle
                        key={posIndex}
                        cx={x}
                        cy={y}
                        r="8"
                        fill={color}
                        stroke="white"
                        strokeWidth="2"
                        opacity="0.9"
                      />
                    );
                  })}
                </g>
              );
            })()}
          </svg>
        )}
      </div>

      {/* Current selection display - always reserve space */}
      <div className="mt-4 text-center min-h-[3rem] flex items-center justify-center">
        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {currentSelection?.wordText || '\u00A0'}
        </p>
      </div>

      {/* Debug mode: Show seeded words list */}
      {debugMode && grid.seededWords && grid.seededWords.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Debug: Seeded Words - Hover to highlight
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {grid.seededWords.map((word, index) => {
              const color = pathColors[index % pathColors.length];
              const isHovered = hoveredWordIndex === index;
              return (
                <button
                  key={index}
                  onMouseEnter={() => setHoveredWordIndex(index)}
                  onMouseLeave={() => setHoveredWordIndex(null)}
                  className="px-3 py-1 rounded-full text-white text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: color,
                    opacity: isHovered ? 1 : 0.7,
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    cursor: 'pointer',
                  }}
                >
                  {word.text}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
