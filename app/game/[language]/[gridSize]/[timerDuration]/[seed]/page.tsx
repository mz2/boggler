'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useGameStore } from '@/hooks/useGameStore';
import { useTimer } from '@/hooks/useTimer';
import { Grid } from '@/components/Grid/Grid';
import { Timer } from '@/components/GameControls/Timer';
import { ScoreBoard } from '@/components/GameControls/ScoreBoard';
import { WordList } from '@/components/WordList/WordList';
import { GameOver } from '@/components/GameOver/GameOver';
import type { Language } from '@/types/game';

function GamePageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const debugMode = searchParams.get('debug') === 'true';

  const language = (params.language as Language) || 'english';

  // Parse grid size from "NxN" format (e.g., "9x9" -> 9)
  const gridSizeParam = params.gridSize as string;
  const gridSizeMatch = gridSizeParam?.match(/^(\d+)x\1$/);
  const gridSize = gridSizeMatch ? parseInt(gridSizeMatch[1], 10) : 9;

  // Parse timer duration from "Ns" format (e.g., "180s" -> 180)
  const timerParam = params.timerDuration as string;
  const timerMatch = timerParam?.match(/^(\d+)s$/);
  const timerDuration = timerMatch ? parseInt(timerMatch[1], 10) : 180;

  // Parse seed from URL
  const seedParam = params.seed as string;
  const seed = seedParam ? parseInt(seedParam, 10) : undefined;

  const { session, submitSelection, cancelSelection, currentSelection, startNewGame } = useGameStore();
  const { timeRemaining, isWarning } = useTimer();
  const isCreatingGame = useRef(false);

  // Validate parameters
  useEffect(() => {
    const validLanguages: Language[] = ['english', 'finnish'];
    const validGridSizes = [4, 9, 16];
    const validTimerDurations = [30, 60, 180, 300];

    if (!validLanguages.includes(language) ||
        !validGridSizes.includes(gridSize) ||
        !validTimerDurations.includes(timerDuration) ||
        !gridSizeMatch ||
        !timerMatch ||
        seed === undefined ||
        isNaN(seed)) {
      // Generate a new seed for redirect
      const newSeed = Math.floor(Date.now() * Math.random()) % 2147483647;
      router.push(`/game/english/9x9/180s/${newSeed}`);
    }
  }, [language, gridSize, timerDuration, gridSizeMatch, timerMatch, seed, router]);

  // Handler for starting a new game
  const handleNewGame = async () => {
    try {
      isCreatingGame.current = true;
      await startNewGame(gridSize, timerDuration, language, seed);
      isCreatingGame.current = false;
    } catch (error) {
      console.error('Failed to start new game:', error);
      isCreatingGame.current = false;
    }
  };

  // Auto-start game if accessing URL directly (no session yet)
  useEffect(() => {
    if (!session && !isCreatingGame.current) {
      // Auto-start a game with URL parameters
      handleNewGame();
    }
  }, [session]);

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
