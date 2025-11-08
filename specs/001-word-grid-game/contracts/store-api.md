# Store API Contract: Zustand Game Store

**Feature**: Boggler
**Date**: 2025-11-08
**Purpose**: Define the Zustand store interface for game state management

## Overview

Since this is a client-side only application, the "API" is the Zustand store that manages game state. This contract defines all state properties and actions available to React components.

**Location**: `src/hooks/useGameStore.ts`

---

## Store State

### Game Session State

```typescript
interface GameStoreState {
  // Session
  sessionId: string | null;
  gameState: GameState; // 'setup' | 'playing' | 'paused' | 'gameover'
  createdAt: Date | null;
  endedAt: Date | null;

  // Grid
  grid: GridCell[][] | null;
  gridSize: GridSize; // 4 | 9 | 16

  // Timer
  timerDuration: TimerDuration; // 60 | 180 | 300
  timeRemaining: number;
  isTimerRunning: boolean;
  isTimerWarning: boolean; // true when timeRemaining <= 10

  // Score & Words
  score: number;
  foundWords: FoundWord[];

  // Current Selection (ephemeral)
  currentSelection: LetterSelection | null;

  // Settings
  settings: GameSettings;
}
```

---

## Store Actions

### Game Control Actions

#### `startNewGame()`
**Description**: Initializes a new game session with current settings

**Effects**:
- Generates new sessionId (UUID)
- Creates new grid based on settings.gridSize
- Resets timer to settings.timerDuration
- Sets gameState to 'playing'
- Starts timer countdown
- Clears score, foundWords, currentSelection
- Sets createdAt to current timestamp

**Returns**: void

**Invoked by**: User Story 1 (start game button)

---

#### `pauseGame()`
**Description**: Pauses the active game

**Preconditions**: gameState === 'playing'

**Effects**:
- Sets gameState to 'paused'
- Stops timer countdown (isTimerRunning = false)

**Returns**: void

**Invoked by**: Pause button (optional feature)

---

#### `resumeGame()`
**Description**: Resumes a paused game

**Preconditions**: gameState === 'paused'

**Effects**:
- Sets gameState to 'playing'
- Restarts timer countdown (isTimerRunning = true)

**Returns**: void

**Invoked by**: Resume button (optional feature)

---

#### `endGame()`
**Description**: Ends the game session (manual or timer expiration)

**Effects**:
- Sets gameState to 'gameover'
- Stops timer (isTimerRunning = false)
- Sets endedAt to current timestamp
- Clears currentSelection (incomplete words do not count per edge case)

**Returns**: void

**Invoked by**:
- Timer reaching 0 (automatic)
- User quitting early (manual)

---

### Selection Actions

#### `startSelection(position: Position)`
**Description**: Begins a new word selection

**Parameters**:
- `position`: { row: number, col: number } - Starting cell

**Preconditions**: gameState === 'playing'

**Effects**:
- Creates new currentSelection with single position
- Sets currentSelection.wordText to letter at position
- Sets currentSelection.isValid to true

**Returns**: void

**Invoked by**: User Story 1 (pointer down on grid cell)

---

#### `extendSelection(position: Position)`
**Description**: Adds a cell to current selection if adjacent

**Parameters**:
- `position`: { row: number, col: number } - Cell to add

**Preconditions**:
- currentSelection !== null
- gameState === 'playing'

**Effects**:
- If position is adjacent to last position:
  - Appends position to currentSelection.positions (even if already in path - crossing allowed)
  - Appends letter to currentSelection.wordText
  - Updates currentSelection.isValid based on adjacency only
- If position is not adjacent:
  - Rejects the addition (selection unchanged)

**Returns**: void

**Invoked by**: User Story 1 (pointer move over grid cells)

---

#### `submitSelection()`
**Description**: Validates and submits current selection as a word

**Preconditions**:
- currentSelection !== null
- currentSelection.wordText.length >= 3
- gameState === 'playing'

**Effects** (if valid word):
- Validates word against dictionary
- Checks word not already in foundWords
- If valid:
  - Calculates score using Fibonacci sequence
  - Creates FoundWord with id, text, positions, score, timestamp
  - Adds to foundWords array
  - Increments total score
  - Clears currentSelection
- If invalid:
  - Shows validation error (implementation detail)
  - Clears currentSelection

**Returns**: { success: boolean, word?: FoundWord, error?: string }

**Invoked by**: User Story 1 (pointer up, word selection complete)

---

#### `cancelSelection()`
**Description**: Cancels the current selection without submitting

**Effects**:
- Sets currentSelection to null

**Returns**: void

**Invoked by**: User canceling selection (ESC key, tap outside, etc.)

---

### Timer Actions

#### `tickTimer()`
**Description**: Decrements timer by 1 second (called by interval hook)

**Preconditions**: isTimerRunning === true

**Effects**:
- Decrements timeRemaining by 1
- If timeRemaining <= 10: sets isTimerWarning to true
- If timeRemaining === 0: calls endGame()

**Returns**: void

**Invoked by**: User Story 2 (useTimer hook, every 1000ms)

---

### Settings Actions

#### `updateSettings(settings: Partial<GameSettings>)`
**Description**: Updates game settings (grid size, timer duration)

**Parameters**:
- `settings`: { gridSize?: GridSize, timerDuration?: TimerDuration }

**Preconditions**: gameState === 'setup' or 'gameover'

**Effects**:
- Updates settings.gridSize and/or settings.timerDuration
- Persists to localStorage (optional)

**Returns**: void

**Invoked by**: User Story 4 (settings menu)

---

#### `resetSettings()`
**Description**: Resets settings to defaults

**Effects**:
- Sets settings.gridSize to 9
- Sets settings.timerDuration to 180
- Removes from localStorage

**Returns**: void

**Invoked by**: Reset button in settings

---

## Store Selectors (Recommended)

For optimal performance, components should use selectors to subscribe only to needed state:

```typescript
// Example usage in components
const gameState = useGameStore(state => state.gameState);
const timeRemaining = useGameStore(state => state.timeRemaining);
const score = useGameStore(state => state.score);
```

**Common Selectors**:
- `selectGameState`: (state) => state.gameState
- `selectTimer`: (state) => ({ remaining: state.timeRemaining, warning: state.isTimerWarning })
- `selectScore`: (state) => ({ score: state.score, wordCount: state.foundWords.length })
- `selectGrid`: (state) => state.grid
- `selectCurrentSelection`: (state) => state.currentSelection
- `selectFoundWords`: (state) => state.foundWords

---

## Future: Liveblocks Multiplayer API

When migrating to Liveblocks (Phase 2+), the store will be wrapped with `@liveblocks/zustand` middleware:

### Synced State (Liveblocks Storage)
- `grid` - Shared grid (generated by host)
- `players` - Map<playerId, PlayerState>
- `timerDuration`, `timeRemaining` - Synchronized timer
- Each player's `foundWords` and `score`

### Presence State (Ephemeral)
- `onlineStatus` - Whether player is active
- `playerInfo` - Name, color, avatar
- `cursor` - Player cursor position (optional for UI awareness)

**Note**: `currentSelection` is deliberately NOT in Presence - this is competitive gameplay where showing your in-progress word would give opponents an unfair advantage.

### Broadcast Events
- `wordFound` - Broadcast when player finds word (for animations)
- `gameEnded` - Timer expiration notification

---

## Validation Rules (Enforced in Store)

| Action | Validation |
|--------|------------|
| startSelection | gameState === 'playing' |
| extendSelection | Position adjacent (crossing allowed), gameState === 'playing' |
| submitSelection | wordText length >= 3, valid dictionary word, not duplicate, timer not expired |
| tickTimer | timeRemaining >= 0, trigger endGame at 0 (clears incomplete selection) |
| updateSettings | gameState in ['setup', 'gameover'], valid enum values |
| Grid generation | Must ensure minimum viable word count achievable |

---

## Error Handling

Store actions should handle errors gracefully:
- Invalid state transitions: silently ignore or log warning
- Dictionary lookup failures: treat as invalid word
- Timer expiration during selection: cancel selection, end game

---

## Testing Contract

All store actions must have unit tests:
- `tests/unit/gameStore.test.ts` - Test all actions and state transitions
- Mock dictionary for word validation tests
- Test timer countdown and warning threshold
- Test Fibonacci scoring calculation
- Test adjacency validation

Example test:
```typescript
describe('submitSelection', () => {
  it('should add valid word to foundWords and update score', () => {
    const store = createGameStore();
    store.getState().startNewGame();
    store.getState().startSelection({ row: 0, col: 0 });
    store.getState().extendSelection({ row: 0, col: 1 });
    store.getState().extendSelection({ row: 0, col: 2 });

    const result = store.getState().submitSelection();

    expect(result.success).toBe(true);
    expect(store.getState().foundWords).toHaveLength(1);
    expect(store.getState().score).toBeGreaterThan(0);
  });
});
```
