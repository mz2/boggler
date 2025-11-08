/**
 * Core types for Boggler game
 */

// Basic position type
export interface Position {
  row: number;
  col: number;
}

// Grid cell entity
export interface GridCell {
  row: number;
  col: number;
  letter: string; // Single uppercase letter A-Z
}

// Grid entity
export interface Grid {
  size: number; // 4, 9, or 16
  cells: GridCell[][]; // 2D array of cells
}

// Letter selection (ephemeral, active during drag)
export interface LetterSelection {
  positions: Position[]; // Ordered array of positions
  wordText: string; // Concatenated letters
  isValid: boolean; // Whether path is valid (adjacent)
}

// Found word (persisted)
export interface FoundWord {
  readonly id: string; // UUID
  readonly text: string; // The word (uppercase)
  readonly positions: readonly Position[]; // Grid coordinates
  score: number; // Points earned (Fibonacci)
  timestamp: Date; // When found
  playerId: string | null; // For multiplayer
}

// Game timer
export interface GameTimer {
  duration: number; // Initial duration in seconds
  remaining: number; // Seconds remaining
  isRunning: boolean; // Whether actively counting
  warningThreshold: number; // Seconds for warning (10)
  isWarning: boolean; // Whether in warning state
}

// Game state enum
export type GameState = 'setup' | 'playing' | 'paused' | 'gameover';

// Grid size options
export type GridSize = 4 | 9 | 16;

// Timer duration options (in seconds)
export type TimerDuration = 60 | 180 | 300;

// Game settings
export interface GameSettings {
  gridSize: GridSize;
  timerDuration: TimerDuration;
}

// Complete game session
export interface GameSession {
  id: string; // UUID
  grid: Grid;
  gridSize: number;
  timerDuration: number;
  timeRemaining: number;
  score: number;
  foundWords: FoundWord[];
  gameState: GameState;
  createdAt: Date;
  endedAt: Date | null;
}
