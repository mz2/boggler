# Data Model: Boggler

**Feature**: Boggler
**Date**: 2025-11-08
**Input**: Entities from [spec.md](./spec.md)

## Overview

This document defines the core data entities for Boggler. All entities are TypeScript types/interfaces located in `src/types/game.ts`. The model supports both single-player (Phase 1) and future multiplayer via Liveblocks (Phase 2+).

---

## Core Entities

### GameSession

Represents a single playthrough of the game.

**Fields**:
- `id`: string - Unique session identifier (UUID)
- `grid`: Grid - The letter grid for this session
- `gridSize`: number - Dimension of the grid (4, 9, or 16)
- `timerDuration`: number - Initial timer duration in seconds (60, 180, or 300)
- `timeRemaining`: number - Current remaining time in seconds
- `score`: number - Current total score
- `foundWords`: FoundWord[] - Array of words found in this session
- `gameState`: GameState - Current state enum: 'setup' | 'playing' | 'paused' | 'gameover'
- `createdAt`: Date - Session start timestamp
- `endedAt`: Date | null - Session end timestamp (null if active)

**Relationships**:
- Contains one Grid
- Contains multiple FoundWords
- Future: Contains multiple Players (multiplayer)

**State Transitions**:
1. 'setup' → 'playing' (when game starts)
2. 'playing' → 'paused' (user pauses)
3. 'paused' → 'playing' (user resumes)
4. 'playing' → 'gameover' (timer reaches 0 or user quits)

**Validation Rules**:
- gridSize must be 4, 9, or 16
- timerDuration must be 60, 180, or 300
- timeRemaining must be >= 0 and <= timerDuration
- score must be >= 0
- foundWords cannot contain duplicates (by word text)
- gameState transitions must follow valid flow

---

### Grid

An N x N array of letters.

**Fields**:
- `size`: number - Grid dimension (4x4, 9x9, or 16x16)
- `cells`: GridCell[][] - 2D array of cells

**Relationships**:
- Contains multiple GridCells
- Belongs to one GameSession

**Generation Rules** (from spec assumptions):
- Letters weighted by frequency (E, A, T more common than Q, Z, X)
- Must ensure minimum viable word count (implementation detail)
- Grid remains constant throughout session

---

### GridCell

A single cell in the grid.

**Fields**:
- `row`: number - Row index (0-based)
- `col`: number - Column index (0-based)
- `letter`: string - Single uppercase letter (A-Z)

**Relationships**:
- Belongs to one Grid
- Referenced by LetterSelections and FoundWords

**Validation Rules**:
- row must be >= 0 and < grid.size
- col must be >= 0 and < grid.size
- letter must be single character A-Z

**Adjacency Rule**:
Two cells are adjacent if:
- Horizontal: abs(row1 - row2) === 0 && abs(col1 - col2) === 1
- Vertical: abs(row1 - row2) === 1 && abs(col1 - col2) === 0
- Diagonal: abs(row1 - row2) === 1 && abs(col1 - col2) === 1

---

### LetterSelection

The current active path of letters being traced.

**Fields**:
- `positions`: Position[] - Ordered array of grid positions
- `wordText`: string - Concatenated letters forming the current word
- `isValid`: boolean - Whether the selection forms a valid path (no self-crossing, all adjacent)

**Type Definitions**:
```typescript
type Position = {
  row: number;
  col: number;
};
```

**Relationships**:
- References multiple GridCells (via positions)
- Ephemeral - exists only during active selection
- Future: Stays LOCAL in multiplayer (not synced - competitive gameplay requires privacy)

**Validation Rules**:
- positions array must not be empty during active selection
- Each consecutive position pair must be adjacent
- Positions CAN appear multiple times (path crossing allowed per spec edge case)
- Minimum length: 1 position (during drag), 3 positions for submission

---

### FoundWord

A successfully validated word tracked by its grid positions (source of truth).

**Design Philosophy**:
- Both `text` and `positions` are stored for different purposes:
  - `text`: Quick access for display, scoring, and duplicate checking
  - `positions`: Source of truth for location - enables visual highlighting, path validation, multiplayer visualization
- Both marked readonly to prevent mutation after creation

**Fields**:
- `id`: string - Unique identifier (UUID)
- `text`: string (readonly) - The word (uppercase) - stored for performance/convenience
- `positions`: Position[] (readonly) - Grid coordinates forming this word (source of truth for location)
- `score`: number - Points earned (Fibonacci sequence)
- `timestamp`: Date - When the word was found
- `playerId`: string | null - Player who found it (null for single-player, used in multiplayer)

**Note**: Both `text` and `positions` are stored. `text` for quick access/display, `positions` for grid visualization and validation.

**Relationships**:
- Belongs to one GameSession
- Future: Belongs to one Player (multiplayer)

**Validation Rules** (from spec FR-003, FR-007, FR-010 + edge cases):
- text must be valid English word (dictionary check)
- text length must be >= 3 (min word length per edge case)
- positions must form valid adjacent path (crossing allowed)
- text must be unique within session (no duplicates)
- Only counts when submitted before timer expires (incomplete words ignored)
- score must match Fibonacci calculation:
  - 3 letters = 1 point
  - 4 letters = 2 points
  - 5 letters = 3 points
  - 6 letters = 5 points
  - 7 letters = 8 points
  - 8 letters = 13 points
  - 9 letters = 21 points
  - Formula: F(n) where n = wordLength - 2

---

### GameTimer

Countdown timer state.

**Fields**:
- `duration`: number - Initial duration in seconds
- `remaining`: number - Seconds remaining
- `isRunning`: boolean - Whether timer is actively counting
- `warningThreshold`: number - Seconds at which warning appears (10)
- `isWarning`: boolean - Whether warning state is active

**Relationships**:
- Belongs to one GameSession

**Validation Rules** (from spec FR-013, FR-014, FR-018):
- remaining must be >= 0 and <= duration
- duration must be 60, 180, or 300
- warningThreshold = 10 seconds
- isWarning = true when remaining <= warningThreshold
- isRunning = false when gameState !== 'playing'

**State Management**:
- Decrements every 1000ms when isRunning = true
- Triggers game over when remaining = 0
- Pauses when gameState = 'paused'

---

## Future Multiplayer Entities (Phase 2+)

### Player

Represents a participant in a multiplayer game.

**Fields** (tentative):
- `id`: string - Unique player identifier
- `name`: string - Display name
- `color`: string - Assigned color for UI differentiation
- `score`: number - Individual score
- `foundWords`: FoundWord[] - Words found by this player
- `currentSelection`: LetterSelection | null - Active selection (synced via Presence)

**Liveblocks Sync Strategy**:
- **Storage** (persisted, synced): score, foundWords (after submission)
- **Presence** (ephemeral, visible): online status, player name/color, cursor position (optional)
- **Local only** (private): currentSelection (NOT synced - competitive play requires privacy)

---

## TypeScript Type Definitions

Location: `src/types/game.ts`

```typescript
// Enums
export type GameState = 'setup' | 'playing' | 'paused' | 'gameover';
export type GridSize = 4 | 9 | 16;
export type TimerDuration = 60 | 180 | 300;

// Position
export interface Position {
  row: number;
  col: number;
}

// Grid Cell
export interface GridCell {
  row: number;
  col: number;
  letter: string; // A-Z
}

// Grid
export interface Grid {
  size: GridSize;
  cells: GridCell[][];
}

// Letter Selection
export interface LetterSelection {
  positions: Position[];
  wordText: string;
  isValid: boolean;
}

// Found Word
export interface FoundWord {
  id: string;
  readonly text: string; // The word (uppercase)
  readonly positions: Position[]; // Grid coordinates for this word
  score: number;
  timestamp: Date;
  playerId: string | null; // null for single-player
}

// Game Timer
export interface GameTimer {
  duration: TimerDuration;
  remaining: number;
  isRunning: boolean;
  warningThreshold: number; // always 10
  isWarning: boolean;
}

// Game Session
export interface GameSession {
  id: string;
  grid: Grid;
  gridSize: GridSize;
  timerDuration: TimerDuration;
  timeRemaining: number;
  score: number;
  foundWords: FoundWord[];
  gameState: GameState;
  createdAt: Date;
  endedAt: Date | null;
}

// Settings
export interface GameSettings {
  gridSize: GridSize;
  timerDuration: TimerDuration;
}
```

---

## Pure Functions (src/lib/)

These functions operate on the data model:

### src/lib/grid.ts
- `generateGrid(size: GridSize): Grid` - Creates weighted random grid
- `getCellAt(grid: Grid, pos: Position): GridCell | null`
- `areAdjacent(pos1: Position, pos2: Position): boolean`

### src/lib/validation.ts
- `isValidPath(positions: Position[]): boolean` - Checks adjacency (crossing allowed)
- `isValidWord(word: string, dictionary: Set<string>): boolean`
- `validateWordSubmission(selection: LetterSelection, foundWords: FoundWord[], dictionary: Set<string>): ValidationResult`
- `hasMinimumViableWords(grid: Grid, dictionary: Set<string>, minCount: number): boolean` - Ensures grid has enough valid words

### src/lib/scoring.ts
- `calculateScore(wordLength: number): number` - Fibonacci sequence
- `fibonacci(n: number): number` - Fibonacci number generator

### src/lib/gameState.ts
- `createNewSession(settings: GameSettings): GameSession`
- `addFoundWord(session: GameSession, word: FoundWord): GameSession`
- `updateTimer(session: GameSession, deltaSeconds: number): GameSession`
- `endGame(session: GameSession): GameSession`

### src/lib/wordHelpers.ts
- `getWordText(positions: Position[], grid: Grid): string` - Extract word from positions
- `getWordAtPositions(positions: Position[], grid: Grid): { text: string, letters: string[] }`
- `highlightWordOnGrid(grid: Grid, positions: Position[]): GridCell[]` - Get cells for highlighting
- `findWordsAtCell(grid: Grid, row: number, col: number, foundWords: FoundWord[]): FoundWord[]` - Find all words using a specific cell

**Usage Example**:
```typescript
// Component displays found words
const WordList = ({ grid, foundWords }) => {
  return foundWords.map(word => {
    const cells = highlightWordOnGrid(grid, word.positions); // Get cells for highlighting

    return (
      <div
        onClick={() => highlightOnGrid(cells)} // Visual feedback
      >
        {word.text} - {word.score}pts
      </div>
    );
  });
};

// Multiplayer: Show where opponent found their words (AFTER submission)
const OpponentWords = ({ grid, opponentWords }) => {
  return opponentWords.map(word => {
    const positions = word.positions; // Already have coordinates
    // Only shows SUBMITTED words, not current selection (competitive play)
    return <GridOverlay positions={positions} color="blue" opacity={0.3} />;
  });
};
```

---

## Validation Summary

| Entity | Key Validations |
|--------|----------------|
| GameSession | State transitions, timer bounds, unique found words |
| Grid | Size constraints (4/9/16), weighted letter distribution |
| GridCell | Position bounds, single letter A-Z |
| LetterSelection | Adjacency (crossing allowed), min 3 for submission |
| FoundWord | Dictionary validation, Fibonacci scoring, uniqueness |
| GameTimer | Duration options (60/180/300s), warning at 10s |

All validations are testable via unit tests in `tests/unit/`.
