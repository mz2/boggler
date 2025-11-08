/**
 * GameOver component - displays final score, found words, and new game button
 */

import type { FoundWord } from '@/types/game';

interface GameOverProps {
  score: number;
  foundWords: FoundWord[];
  onNewGame: () => void;
}

export function GameOver({ score, foundWords, onNewGame }: GameOverProps) {
  return (
    <div className="game-over-container">
      <h1 className="text-5xl font-bold mb-6">Game Over!</h1>

      <div className="mb-8">
        <div className="text-6xl font-bold text-blue-600 mb-2">{score}</div>
        <div className="text-xl text-gray-600">
          {foundWords.length} {foundWords.length === 1 ? 'word' : 'words'} found
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

      <button onClick={onNewGame} className="btn btn-primary text-xl px-8 py-4">
        New Game
      </button>
    </div>
  );
}
