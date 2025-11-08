'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameStore } from '@/hooks/useGameStore';
import { useTimer } from '@/hooks/useTimer';
import { Grid } from '@/components/Grid/Grid';
import { Timer } from '@/components/GameControls/Timer';
import { ScoreBoard } from '@/components/GameControls/ScoreBoard';
import { WordList } from '@/components/WordList/WordList';
import { GameOver } from '@/components/GameOver/GameOver';

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debugMode = searchParams.get('debug') === 'true';
  const { session, submitSelection, cancelSelection, currentSelection, startNewGame } = useGameStore();
  const { timeRemaining, isWarning } = useTimer();
  const isCreatingGame = useRef(false);

  // Handler for starting a new game
  const handleNewGame = async () => {
    try {
      isCreatingGame.current = true;
      await startNewGame();
      isCreatingGame.current = false;
    } catch (error) {
      console.error('Failed to start new game:', error);
      isCreatingGame.current = false;
    }
  };

  // Redirect to home if no session (unless debug mode or creating a new game)
  useEffect(() => {
    if (!session && !isCreatingGame.current) {
      if (debugMode) {
        // Auto-start a game in debug mode
        handleNewGame();
      } else {
        router.push('/');
      }
    }
  }, [session, router, debugMode]);

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
      {/* Grid */}
      <div className="w-full max-w-[600px]">
        {/* Score, Timer, and Submit button */}
        <div className="grid grid-cols-3 items-center w-full gap-4 mb-4">
          <div className="justify-self-start">
            <ScoreBoard score={session.score} wordCount={session.foundWords.length} />
          </div>

          <div className="justify-self-center">
            <Timer timeRemaining={timeRemaining} isWarning={isWarning} />
          </div>

          <div className="justify-self-end">
            <button
              onClick={() => submitSelection()}
              className="btn btn-primary"
              disabled={!currentSelection || currentSelection.positions.length < 4}
              title="Submit word (Enter) | Cancel selection (ESC)"
            >
              Submit
            </button>
          </div>
        </div>

        <Grid grid={session.grid} debugMode={debugMode} />
      </div>

      {/* Found words */}
      <WordList words={session.foundWords} />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="game-container">Loading...</div>}>
      <GamePageContent />
    </Suspense>
  );
}
