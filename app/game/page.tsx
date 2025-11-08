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
  const { session, submitSelection, cancelSelection, currentSelection, startNewGame } = useGameStore();
  const { timeRemaining, isWarning } = useTimer();

  // Handler for starting a new game
  const handleNewGame = async () => {
    try {
      await startNewGame();
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  // Redirect to home if no session
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Enter to submit word
      if (event.key === 'Enter' && currentSelection && currentSelection.positions.length >= 4) {
        event.preventDefault();
        submitSelection();
      }
      // ESC to cancel selection
      else if (event.key === 'Escape' && currentSelection) {
        event.preventDefault();
        cancelSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSelection, submitSelection, cancelSelection]);

  // Show loading or redirect while waiting
  if (!session) {
    return null;
  }

  // Show game over screen
  if (session.gameState === 'gameover') {
    return <GameOver score={session.score} foundWords={session.foundWords} grid={session.grid} onNewGame={handleNewGame} />;
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
          disabled={!currentSelection || currentSelection.positions.length < 4}
          title="Submit word (Enter) | Cancel selection (ESC)"
        >
          Submit
        </button>
      </div>

      {/* Grid */}
      <Grid grid={session.grid} />

      {/* Found words */}
      <WordList words={session.foundWords} />
    </div>
  );
}
