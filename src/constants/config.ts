import type { GridSize, TimerDuration } from '@/types/game';

/**
 * Configuration constants for Boggler
 */

// Available grid sizes
export const GRID_SIZES: GridSize[] = [4, 9, 16];

// Available timer durations (in seconds)
export const TIMER_DURATIONS: TimerDuration[] = [60, 180, 300];

// Minimum word length (3 letters)
export const MIN_WORD_LENGTH = 3;

// Timer warning threshold (10 seconds)
export const TIMER_WARNING_THRESHOLD = 10;

// Letter frequency distribution for grid generation
// Based on English letter frequency, adjusted for gameplay
export const LETTER_FREQUENCIES: Record<string, number> = {
  A: 8.2,
  B: 1.5,
  C: 2.8,
  D: 4.3,
  E: 12.7,
  F: 2.2,
  G: 2.0,
  H: 6.1,
  I: 7.0,
  J: 0.15,
  K: 0.77,
  L: 4.0,
  M: 2.4,
  N: 6.7,
  O: 7.5,
  P: 1.9,
  Q: 0.095,
  R: 6.0,
  S: 6.3,
  T: 9.1,
  U: 2.8,
  V: 0.98,
  W: 2.4,
  X: 0.15,
  Y: 2.0,
  Z: 0.074,
};

// Default grid size
export const DEFAULT_GRID_SIZE: GridSize = 9;

// Default timer duration (30 seconds for testing)
export const DEFAULT_TIMER_DURATION = 30;
