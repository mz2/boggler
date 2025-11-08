/**
 * Game state helper functions
 */

import type { GameSession, Grid, FoundWord, GameState, Position, Language } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';
import { calculateScore } from './scoring';
import { DEFAULT_GRID_SIZE, DEFAULT_TIMER_DURATION } from '@/constants/config';

export interface CreateSessionOptions {
  gridSize?: number;
  timerDuration?: number;
  language?: Language;
  grid: Grid;
}

/**
 * Create a new game session
 */
export function createNewSession(options: CreateSessionOptions): GameSession {
  const { gridSize = DEFAULT_GRID_SIZE, timerDuration = DEFAULT_TIMER_DURATION, language = 'english', grid } = options;

  return {
    id: uuidv4(),
    grid,
    gridSize,
    timerDuration,
    timeRemaining: timerDuration,
    score: 0,
    foundWords: [],
    gameState: 'setup',
    language,
    createdAt: new Date(),
    endedAt: null,
  };
}

/**
 * Add a found word to the session
 */
export function addFoundWord(
  session: GameSession,
  wordText: string,
  positions: readonly Position[]
): GameSession {
  const foundWord: FoundWord = {
    id: uuidv4(),
    text: wordText,
    positions,
    score: calculateScore(wordText),
    timestamp: new Date(),
    playerId: null,
  };

  return {
    ...session,
    foundWords: [...session.foundWords, foundWord],
    score: session.score + foundWord.score,
  };
}

/**
 * Validate state transition
 */
export function validateTransition(current: GameState, next: GameState): boolean {
  const validTransitions: Record<GameState, GameState[]> = {
    setup: ['playing'],
    playing: ['paused', 'gameover'],
    paused: ['playing', 'gameover'],
    gameover: ['setup'], // Can restart
  };

  return validTransitions[current].includes(next);
}
