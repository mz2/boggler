# Implementation Plan: Boggler

**Branch**: `001-word-grid-game` | **Date**: 2025-11-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-word-grid-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build Boggler, a time-limited word-finding game with an N x N letter grid (default 9x9) where players connect adjacent letters to form words. The game uses a countdown timer, Fibonacci-based scoring, and supports multiple grid sizes and timer durations. Implemented as a client-side web application using Next.js/React for fast, responsive gameplay with no backend requirements.

## Technical Context

**Language/Version**: TypeScript 5.9 with Next.js 16+ (App Router)
**Primary Dependencies**: React 19.2+, Next.js 16+, Tailwind CSS for styling, Liveblocks (future multiplayer)
**Storage**: Client-side (localStorage for preferences) + Liveblocks storage (future collaborative state)
**Testing**: Jest + React Testing Library (unit/component), Playwright (e2e)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - modern versions)
**Project Type**: Web application (single-page, starting client-side only, future collaborative multiplayer)
**Performance Goals**: <100ms word validation, <16ms frame time for smooth animations, <2s initial load
**Constraints**: Client-side first (no custom backend), offline-capable for single-player, <5MB initial bundle
**Scale/Scope**: Single-player MVP → multiplayer game, ~10 React components, English dictionary (~50-100k words), grid sizes 4x4 to 16x16
**Future Architecture**: Liveblocks.io for real-time collaborative multiplayer (shared grid, competitive scoring, simultaneous word finding)

**Dictionary Source**: npm package `word-list` (370k+ words, ~500KB gzipped, MIT licensed) - see [research.md](./research.md#1-dictionary-source-decision)
**State Management**: Zustand (<1KB) with future Liveblocks middleware for multiplayer - see [research.md](./research.md#2-state-management-decision)
**Touch/Mouse Interaction**: Custom Pointer Events API implementation (0KB, 60fps) - see [research.md](./research.md#3-touchmouse-interaction-decision)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Test-Driven Development (TDD) Gate

**Status**: ✅ READY TO PROCEED

**Requirements**:
- [ ] Logic tests for pure functions (scoring, grid generation, word validation, adjacency checking)
- [ ] Component tests for React components (Grid, Timer, ScoreBoard, WordList, GameOver)
- [ ] End-to-end tests for critical user journeys (start game, find words, timer expiration)

**Compliance Plan**:
1. **Phase 2 (Tasks)**: All tasks MUST include test tasks BEFORE implementation tasks
2. **Test Organization**: Follow constitution structure:
   - `tests/unit/` - Pure function tests (game logic, scoring, validation)
   - `tests/component/` - React component tests
   - `tests/e2e/` - Playwright end-to-end tests
3. **Test-First Workflow**: Each implementation task MUST be preceded by a test task
4. **Naming Convention**: `[ComponentName].test.ts` or `[functionName].test.ts`

**No violations** - This is a greenfield project following TDD from the start.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/                          # Next.js 14 App Router
├── page.tsx                  # Main game page (default route)
├── layout.tsx                # Root layout with metadata
└── globals.css               # Global styles + Tailwind

src/
├── components/               # React components
│   ├── Grid/
│   │   ├── Grid.tsx
│   │   ├── GridCell.tsx
│   │   └── LetterSelection.tsx
│   ├── GameControls/
│   │   ├── Timer.tsx
│   │   ├── ScoreBoard.tsx
│   │   └── GameSettings.tsx
│   ├── WordList/
│   │   ├── WordList.tsx
│   │   └── WordItem.tsx
│   └── GameOver/
│       └── GameOver.tsx
├── lib/                      # Pure functions and game logic
│   ├── grid.ts               # Grid generation, letter distribution
│   ├── validation.ts         # Word validation, adjacency checking
│   ├── scoring.ts            # Fibonacci scoring calculation
│   ├── dictionary.ts         # Dictionary loading and lookup
│   └── gameState.ts          # Game state management helpers
├── hooks/                    # Custom React hooks
│   ├── useGameState.ts       # Game state hook
│   ├── useTimer.ts           # Countdown timer hook
│   └── useWordSelection.ts   # Word selection interaction hook
├── types/                    # TypeScript type definitions
│   └── game.ts               # Game entities (Grid, Word, GameSession, etc.)
└── constants/
    └── config.ts             # Grid sizes, timer durations, etc.

tests/
├── unit/                     # Pure function tests
│   ├── grid.test.ts
│   ├── validation.test.ts
│   ├── scoring.test.ts
│   └── dictionary.test.ts
├── component/                # React component tests
│   ├── Grid.test.tsx
│   ├── Timer.test.tsx
│   ├── ScoreBoard.test.tsx
│   └── GameOver.test.tsx
└── e2e/                      # Playwright end-to-end tests
    ├── gameplay.spec.ts
    └── timer-expiration.spec.ts

public/
└── dictionary/               # Dictionary data files
    └── words.json            # Or bundled with app if embedded
```

**Structure Decision**: Next.js 16 App Router structure with client-side only implementation. All game logic lives in `src/lib/` as pure functions (testable), React components in `src/components/` (composable), and custom hooks in `src/hooks/` for state management. Tests follow the three-tier structure mandated by the constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - this project follows TDD from the start and has no complexity that needs justification.
