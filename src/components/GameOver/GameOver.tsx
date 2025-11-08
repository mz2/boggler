/**
 * GameOver component - displays final score, found words, and grid with highlights
 */

import type { FoundWord, Grid } from '@/types/game';

interface GameOverProps {
  score: number;
  foundWords: FoundWord[];
  grid: Grid;
  onNewGame: () => void;
}

export function GameOver({ score, foundWords, grid, onNewGame }: GameOverProps) {
  // Get all positions that were part of found words
  const foundPositions = new Set(
    foundWords.flatMap((word) => word.positions.map((pos) => `${pos.row},${pos.col}`))
  );

  // Get unfound seeded words (those that were placed but not found)
  const foundWordTexts = new Set(foundWords.map((word) => word.text));
  const unfoundSeededWords = (grid.seededWords || []).filter(
    (seededWord) => !foundWordTexts.has(seededWord.text)
  );

  // Get all positions that were part of unfound seeded words with their path indices
  const missedPositions = new Set(
    unfoundSeededWords.flatMap((word) => word.positions.map((pos) => `${pos.row},${pos.col}`))
  );

  // Create a map of position -> path number for unfound words
  const positionToPathNumber = new Map<string, number>();
  unfoundSeededWords.forEach((word) => {
    word.positions.forEach((pos, index) => {
      const posKey = `${pos.row},${pos.col}`;
      // If position is part of multiple unfound words, show the first one
      if (!positionToPathNumber.has(posKey)) {
        positionToPathNumber.set(posKey, index + 1);
      }
    });
  });

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
      <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">Game Over!</h1>

      <div className="mb-8">
        <div className="text-6xl font-bold text-blue-600 mb-2">{score}</div>
        <div className="text-xl text-gray-600 dark:text-gray-300">
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
              const isMissed = missedPositions.has(posKey);
              const pathNumber = positionToPathNumber.get(posKey);
              return (
                <div
                  key={`${cell.row}-${cell.col}`}
                  className={`grid-cell ${isFound ? 'found' : ''} ${isMissed ? 'missed' : ''}`}
                  data-row={cell.row}
                  data-col={cell.col}
                  style={{ position: 'relative' }}
                >
                  {cell.letter}
                  {isMissed && pathNumber && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#b45309',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {pathNumber}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {foundWords.length > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Words Found</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Missed Words</h2>
          <div className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
            (Yellow cells with numbers show the path)
          </div>
          <div className="word-list">
            {unfoundSeededWords.map((word, index) => (
              <span key={index} className="word-item" style={{ backgroundColor: '#eab308' }}>
                {word.text}
              </span>
            ))}
          </div>
        </div>
      )}

      <button onClick={onNewGame} className="btn btn-primary mt-8">
        New Game
      </button>
    </div>
  );
}
