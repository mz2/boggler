/**
 * GameOver component - displays final score, found words, and grid with highlights
 */

import type { FoundWord, Grid } from '@/types/game';

interface GameOverProps {
  score: number;
  foundWords: FoundWord[];
  grid: Grid;
}

export function GameOver({ score, foundWords, grid }: GameOverProps) {
  // Get all positions that were part of found words
  const foundPositions = new Set(
    foundWords.flatMap((word) => word.positions.map((pos) => `${pos.row},${pos.col}`))
  );

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
    <div className="game-over-container">
      <h1 className="text-5xl font-bold mb-6">Game Over!</h1>

      <div className="mb-8">
        <div className="text-6xl font-bold text-blue-600 mb-2">{score}</div>
        <div className="text-xl text-gray-600">
          {foundWords.length} {foundWords.length === 1 ? 'word' : 'words'} found
        </div>
      </div>

      {/* Grid with highlighted found words */}
      <div className="grid-container mb-8">
        <div style={gridStyle}>
          {grid.cells.map((row) =>
            row.map((cell) => {
              const posKey = `${cell.row},${cell.col}`;
              const isFound = foundPositions.has(posKey);
              return (
                <div
                  key={`${cell.row}-${cell.col}`}
                  className={`grid-cell ${isFound ? 'found' : ''}`}
                  data-row={cell.row}
                  data-col={cell.col}
                >
                  {cell.letter}
                </div>
              );
            })
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

      <div className="text-gray-500 text-sm mt-8">
        Refresh the page to play again
      </div>
    </div>
  );
}
