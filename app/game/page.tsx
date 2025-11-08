'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/hooks/useGameStore';
import { useTimer } from '@/hooks/useTimer';
import { Grid } from '@/components/Grid/Grid';
import { Timer } from '@/components/GameControls/Timer';
import { ScoreBoard } from '@/components/GameControls/ScoreBoard';
import { WordList } from '@/components/WordList/WordList';
import { GameOver } from '@/components/GameOver/GameOver';

export default function GamePage() {
  const router = useRouter();
  const { session, submitSelection, currentSelection } = useGameStore();
  const { timeRemaining, isWarning } = useTimer();

  // Redirect to home if no session
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);

  // Handle Enter key to submit
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && currentSelection && currentSelection.positions.length >= 3) {
        event.preventDefault();
        submitSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSelection, submitSelection]);

  const handleNewGame = () => {
    router.push('/');
  };

  // Show loading or redirect while waiting
  if (!session) {
    return null;
  }

  // Show game over screen
  if (session.gameState === 'gameover') {
    return <GameOver score={session.score} foundWords={session.foundWords} onNewGame={handleNewGame} />;
  }

  return (
    <div className="game-container">
      {/* Score, Timer, and Submit button */}
      <div className="flex justify-between items-center w-full max-w-2xl gap-6">
        <div className="flex items-center gap-6">
          <ScoreBoard score={session.score} wordCount={session.foundWords.length} />
          <Timer timeRemaining={timeRemaining} isWarning={isWarning} />
        </div>

        <button
          onClick={() => submitSelection()}
          className="btn btn-primary"
          disabled={!currentSelection || currentSelection.positions.length < 3}
          title="Submit word (Enter)"
        >
          Submit
        </button>
      </div>

      {/* Grid */}
      <Grid grid={session.grid} />

      {/* Found words */}
      <WordList words={session.foundWords} />

      {/* New game button */}
      <button onClick={handleNewGame} className="btn btn-secondary mt-4">
        New Game
      </button>
    </div>
  );
}
