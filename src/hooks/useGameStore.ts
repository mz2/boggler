/**
 * Zustand game store for Boggler
 */

import { create } from 'zustand';
import type { GameSession, Position, LetterSelection } from '@/types/game';
import { generateGrid } from '@/lib/grid';
import { createNewSession, addFoundWord } from '@/lib/gameState';
import { validateWordSubmission } from '@/lib/validation';
import { DEFAULT_GRID_SIZE, DEFAULT_TIMER_DURATION } from '@/constants/config';

interface GameStore {
  // State
  session: GameSession | null;
  currentSelection: LetterSelection | null;

  // Actions
  startNewGame: (gridSize?: number, timerDuration?: number) => void;
  startSelection: (position: Position, letter: string) => void;
  extendSelection: (position: Position, letter: string) => void;
  removeLastFromSelection: () => void;
  submitSelection: () => { success: boolean; message: string };
  cancelSelection: () => void;
  tickTimer: () => void;
  endGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  session: null,
  currentSelection: null,

  startNewGame: (
    gridSize: number = DEFAULT_GRID_SIZE,
    timerDuration: number = DEFAULT_TIMER_DURATION
  ) => {
    const grid = generateGrid(gridSize);
    const session = createNewSession({ gridSize, timerDuration, grid });

    set({
      session: { ...session, gameState: 'playing' },
      currentSelection: null,
    });
  },

  startSelection: (position: Position, letter: string) => {
    set({
      currentSelection: {
        positions: [position],
        wordText: letter,
        isValid: true,
      },
    });
  },

  extendSelection: (position: Position, letter: string) => {
    const { currentSelection } = get();
    if (!currentSelection) return;

    // Check if already in selection (for path crossing)
    // Note: path crossing is ALLOWED per spec
    const newPositions = [...currentSelection.positions, position];
    const newWordText = currentSelection.wordText + letter;

    set({
      currentSelection: {
        positions: newPositions,
        wordText: newWordText,
        isValid: true, // Will be validated on submit
      },
    });
  },

  removeLastFromSelection: () => {
    const { currentSelection } = get();
    if (!currentSelection || currentSelection.positions.length === 0) return;

    // If only one position, clear the selection entirely
    if (currentSelection.positions.length === 1) {
      set({ currentSelection: null });
      return;
    }

    // Remove the last position and letter
    const newPositions = currentSelection.positions.slice(0, -1);
    const newWordText = currentSelection.wordText.slice(0, -1);

    set({
      currentSelection: {
        positions: newPositions,
        wordText: newWordText,
        isValid: true,
      },
    });
  },

  submitSelection: () => {
    const { session, currentSelection } = get();

    if (!session || !currentSelection) {
      return { success: false, message: 'No active game or selection' };
    }

    // Validate the word
    const result = validateWordSubmission(session.grid, currentSelection.positions, session.foundWords);

    if (!result.isValid) {
      set({ currentSelection: null });
      return { success: false, message: result.error || 'Invalid word' };
    }

    // Add word to session
    const updatedSession = addFoundWord(session, result.word!, currentSelection.positions);

    set({
      session: updatedSession,
      currentSelection: null,
    });

    return {
      success: true,
      message: `Found "${result.word}" for ${calculateScore(result.word!)} points!`,
    };
  },

  cancelSelection: () => {
    set({ currentSelection: null });
  },

  tickTimer: () => {
    const { session } = get();
    if (!session || session.gameState !== 'playing') return;

    const newTimeRemaining = Math.max(0, session.timeRemaining - 1);

    set({
      session: {
        ...session,
        timeRemaining: newTimeRemaining,
      },
    });
  },

  endGame: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        gameState: 'gameover',
        endedAt: new Date(),
        timeRemaining: 0,
      },
      currentSelection: null, // Clear any active selection
    });
  },
}));

// Helper to calculate score (re-export for convenience)
import { calculateScore } from '@/lib/scoring';
