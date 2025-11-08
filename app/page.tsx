'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { useTimer } from '@/hooks/useTimer';
import { Grid } from '@/components/Grid/Grid';
import { Timer } from '@/components/GameControls/Timer';
import { ScoreBoard } from '@/components/GameControls/ScoreBoard';
import { GameSettings } from '@/components/GameControls/GameSettings';
import { WordList } from '@/components/WordList/WordList';
import { GameOver } from '@/components/GameOver/GameOver';
import { loadDictionary } from '@/lib/dictionary';

export default function Home() {
  const { session, startNewGame, submitSelection, cancelSelection, currentSelection } =
    useGameStore();
  const { timeRemaining, isWarning } = useTimer();
  const [selectedGridSize, setSelectedGridSize] = useState(9);
  const [selectedDuration, setSelectedDuration] = useState(180);

  // Load dictionary on mount
  useEffect(() => {
    loadDictionary().then(() => {
      console.log('Dictionary loaded');
    });
  }, []);

  const handleNewGame = () => {
    startNewGame(selectedGridSize, selectedDuration);
  };

  const handleSettingsChange = (settings: { gridSize: number; timerDuration: number }) => {
    setSelectedGridSize(settings.gridSize);
    setSelectedDuration(settings.timerDuration);
  };

  // Show game over screen
  if (session && session.gameState === 'gameover') {
    return <GameOver score={session.score} foundWords={session.foundWords} onNewGame={handleNewGame} />;
  }

  if (!session) {
    return (
      <div className="game-container">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Find as many words as you can by connecting adjacent letters!
        </p>

        <GameSettings
          gridSize={selectedGridSize}
          timerDuration={selectedDuration}
          onChange={handleSettingsChange}
        />

        <button onClick={handleNewGame} className="btn btn-primary mt-6">
          New Game
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Timer */}
      <Timer timeRemaining={timeRemaining} isWarning={isWarning} />

      {/* Score display */}
      <ScoreBoard score={session.score} wordCount={session.foundWords.length} />

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
      <WordList words={session.foundWords} />

      {/* New game button with settings */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="scale-90">
          <GameSettings
            gridSize={selectedGridSize}
            timerDuration={selectedDuration}
            onChange={handleSettingsChange}
          />
        </div>
        <button onClick={handleNewGame} className="btn btn-secondary">
          New Game
        </button>
      </div>
    </div>
  );
}
