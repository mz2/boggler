'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { useTimer } from '@/hooks/useTimer';
import { Grid } from '@/components/Grid/Grid';
import { Timer } from '@/components/GameControls/Timer';
import { GameOver } from '@/components/GameOver/GameOver';
import { loadDictionary } from '@/lib/dictionary';
import { TIMER_DURATIONS } from '@/constants/config';

export default function Home() {
  const { session, startNewGame, submitSelection, cancelSelection, currentSelection } =
    useGameStore();
  const { timeRemaining, isWarning } = useTimer();
  const [selectedDuration, setSelectedDuration] = useState(30);

  // Load dictionary on mount
  useEffect(() => {
    loadDictionary().then(() => {
      console.log('Dictionary loaded');
    });
  }, []);

  const handleNewGame = () => {
    startNewGame(undefined, selectedDuration);
  };

  // Show game over screen
  if (session && session.gameState === 'gameover') {
    return <GameOver score={session.score} foundWords={session.foundWords} onNewGame={handleNewGame} />;
  }

  if (!session) {
    return (
      <div className="game-container">
        <h1 className="text-4xl font-bold mb-4">Boggler</h1>
        <p className="text-lg text-gray-600 mb-8">
          Find as many words as you can by connecting adjacent letters!
        </p>

        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="timer-duration" className="text-lg font-medium">
            Timer:
          </label>
          <select
            id="timer-duration"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium focus:outline-none focus:border-blue-500"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>

        <button onClick={handleNewGame} className="btn btn-primary">
          New Game
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="text-3xl font-bold mb-2">Boggler</h1>

      {/* Timer */}
      <Timer timeRemaining={timeRemaining} isWarning={isWarning} />

      {/* Score display */}
      <div className="score-board">
        <div>
          <span className="text-gray-600">Score:</span>{' '}
          <span className="text-blue-600">{session.score}</span>
        </div>
        <div>
          <span className="text-gray-600">Words:</span>{' '}
          <span className="text-blue-600">{session.foundWords.length}</span>
        </div>
      </div>

      {/* Grid */}
      <Grid grid={session.grid} />

      {/* Submit/Clear buttons */}
      {currentSelection && currentSelection.positions.length >= 3 && (
        <div className="flex gap-3">
          <button
            onClick={() => submitSelection()}
            className="btn btn-primary"
          >
            Submit Word
          </button>
          <button
            onClick={() => cancelSelection()}
            className="btn btn-secondary"
          >
            Clear
          </button>
        </div>
      )}

      {/* Found words */}
      {session.foundWords.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-3 text-center">Found Words</h2>
          <div className="word-list">
            {session.foundWords.map((word) => (
              <span key={word.id} className="word-item">
                {word.text} ({word.score})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* New game button with timer selector */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="flex items-center gap-4">
          <label htmlFor="timer-duration-ingame" className="text-sm font-medium">
            Timer:
          </label>
          <select
            id="timer-duration-ingame"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
            className="px-3 py-1 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>
        <button onClick={handleNewGame} className="btn btn-secondary">
          New Game
        </button>
      </div>
    </div>
  );
}
