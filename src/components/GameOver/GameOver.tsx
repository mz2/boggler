/**
 * GameOver component - displays final score, found words, and grid with highlights
 */

import { useState } from 'react';
import type { FoundWord, Grid } from '@/types/game';

interface GameOverProps {
  score: number;
  foundWords: FoundWord[];
  grid: Grid;
  onNewGame: () => void;
}

export function GameOver({ score, foundWords, grid, onNewGame }: GameOverProps) {
  const [selectedMissedWordIndex, setSelectedMissedWordIndex] = useState<number | null>(null);
  // Get all positions that were part of found words
  const foundPositions = new Set(
    foundWords.flatMap((word) => word.positions.map((pos) => `${pos.row},${pos.col}`))
  );

  // Get unfound seeded words (those that were placed but not found)
  const foundWordTexts = new Set(foundWords.map((word) => word.text));
  const unfoundSeededWords = (grid.seededWords || []).filter(
    (seededWord) => !foundWordTexts.has(seededWord.text)
  );

  // Get positions for the selected missed word only
  const missedPositions = new Set<string>();
  if (selectedMissedWordIndex !== null && unfoundSeededWords[selectedMissedWordIndex]) {
    unfoundSeededWords[selectedMissedWordIndex].positions.forEach((pos) => {
      missedPositions.add(`${pos.row},${pos.col}`);
    });
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${grid.size}, minmax(0, 1fr))`,
    gap: '0.25rem',
    aspectRatio: '1',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  };

  // Color palette for different word paths
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

  return (
    <div className="game-over-container">
      <h1 className="text-5xl font-bold mb-6">Game Over!</h1>

      <div className="mb-8">
        <div className="text-6xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{score}</div>
        <div className="text-xl opacity-90">
          {foundWords.length} {foundWords.length === 1 ? 'word' : 'words'} found
        </div>
      </div>

      {/* Grid with highlighted found words */}
      <div className="grid-container mb-8">
        <div style={{ position: 'relative' }}>
          <div style={gridStyle}>
            {grid.cells.map((row) =>
              row.map((cell) => {
                const posKey = `${cell.row},${cell.col}`;
                const isFound = foundPositions.has(posKey);
                const isMissed = missedPositions.has(posKey);
                return (
                  <div
                    key={`${cell.row}-${cell.col}`}
                    className={`grid-cell ${isFound ? 'found' : ''} ${isMissed ? 'missed' : ''}`}
                    data-row={cell.row}
                    data-col={cell.col}
                  >
                    {cell.letter}
                  </div>
                );
              })
            )}
          </div>

          {/* SVG overlay for drawing paths */}
          {unfoundSeededWords.length > 0 && selectedMissedWordIndex !== null && (
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
                const word = unfoundSeededWords[selectedMissedWordIndex];
                const color = pathColors[selectedMissedWordIndex % pathColors.length];
                return (
                  <g>
                    {/* Draw lines connecting positions */}
                    {word.positions.map((pos, posIndex) => {
                      if (posIndex === word.positions.length - 1) return null;
                      const nextPos = word.positions[posIndex + 1];

                      // Calculate cell centers (accounting for gap)
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
      </div>

      {foundWords.length > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">Words Found</h2>
          <div className="word-list">
            {foundWords.map((word) => (
              <span key={word.id} className="word-item">
                {word.text} ({word.score})
              </span>
            ))}
          </div>
        </div>
      )}

      {unfoundSeededWords.length > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">Missed Words</h2>
          <div className="mb-2 text-sm opacity-90">
            (Click a word to see its path on the grid)
          </div>
          <div className="word-list">
            {unfoundSeededWords.map((word, index) => {
              const color = pathColors[index % pathColors.length];
              const isSelected = selectedMissedWordIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedMissedWordIndex(isSelected ? null : index)}
                  className="word-item"
                  style={{
                    backgroundColor: color,
                    cursor: 'pointer',
                    opacity: isSelected ? 1 : 0.7,
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    border: isSelected ? '3px solid white' : 'none',
                  }}
                >
                  {word.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={onNewGame} className="btn btn-primary mt-8">
        New Game
      </button>
    </div>
  );
}
