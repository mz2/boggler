# Tasks: Boggler

**Input**: Design documents from `/specs/001-word-grid-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution TDD requirements, tests are MANDATORY before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/` at repository root
- **Source code**: `src/` at repository root
- **Tests**: `tests/` at repository root
- Paths shown below use this structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 16 project with TypeScript, Tailwind CSS, and App Router
- [X] T002 Install core dependencies: zustand, uuid, word-list
- [X] T003 [P] Install testing dependencies: vitest, @vitejs/plugin-react, @testing-library/react, @testing-library/jest-dom, jsdom, @playwright/test, @types/uuid
- [X] T004 [P] Configure Vitest (vitest.config.ts and vitest.setup.ts) with React Testing Library
- [X] T005 [P] Configure Playwright (playwright.config.ts) for e2e tests
- [X] T006 [P] Configure TypeScript paths in tsconfig.json (@/* aliases)
- [X] T006a [P] Install ESLint and TypeScript ESLint dependencies: eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin, eslint-config-next
- [X] T006b [P] Create ESLint configuration (.eslintrc.json) with Next.js + TypeScript rules
- [X] T006c [P] Install Prettier and ESLint integration: prettier, eslint-config-prettier, eslint-plugin-prettier
- [X] T006d [P] Create Prettier configuration (.prettierrc) with project code style rules
- [X] T006e [P] Add lint and format scripts to package.json: "lint", "lint:fix", "format", "format:check"
- [X] T006f Create GitHub Actions CI workflow (.github/workflows/ci.yml) to run lint, format:check, test (Vitest), and Playwright tests on PRs and pushes to main
- [X] T007 Create directory structure: src/{components,lib,hooks,types,constants}, tests/{unit,component,e2e}

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 [P] Create TypeScript type definitions in src/types/game.ts (Position, GridCell, Grid, LetterSelection, FoundWord, GameSession, GameTimer, GameState, GridSize, TimerDuration, GameSettings)
- [ ] T009 [P] Define constants in src/constants/config.ts (GRID_SIZES, TIMER_DURATIONS, MIN_WORD_LENGTH, TIMER_WARNING_THRESHOLD, LETTER_FREQUENCIES)
- [ ] T010 Write tests for Fibonacci scoring in tests/unit/scoring.test.ts
- [ ] T011 Implement Fibonacci scoring logic in src/lib/scoring.ts (calculateScore, fibonacci functions)
- [ ] T012 Write tests for dictionary loading in tests/unit/dictionary.test.ts
- [ ] T013 Implement dictionary loading from word-list package in src/lib/dictionary.ts (loadDictionary, isValidWord functions)
- [ ] T014 Write tests for grid generation in tests/unit/grid.test.ts
- [ ] T015 Implement grid generation with letter frequency weighting in src/lib/grid.ts (generateGrid, getCellAt, areAdjacent functions)
- [ ] T016 Write tests for word validation in tests/unit/validation.test.ts
- [ ] T017 Implement word validation and adjacency checking in src/lib/validation.ts (isValidPath, validateWordSubmission, hasMinimumViableWords functions)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Start New Game and Find Basic Words (Priority: P1) 🎯 MVP

**Goal**: Enable players to start a game, see a grid, select adjacent letters, and submit words for validation

**Independent Test**: Launch game → see populated 9x9 grid → select "CAT" → receive confirmation and score

### Tests for User Story 1 (MANDATORY per constitution)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Write component test for Grid in tests/component/Grid.test.tsx (renders grid, displays letters, handles cell clicks)
- [ ] T019 [P] [US1] Write component test for GridCell in tests/component/GridCell.test.tsx (displays letter, shows selection state, emits events)
- [ ] T020 [P] [US1] Write component test for LetterSelection overlay in tests/component/LetterSelection.test.tsx (highlights selected path, updates during drag)

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create GridCell component in src/components/Grid/GridCell.tsx (displays single letter, selection highlighting)
- [ ] T022 [P] [US1] Create LetterSelection overlay component in src/components/Grid/LetterSelection.tsx (visual feedback for current selection)
- [ ] T023 [US1] Implement useWordSelection custom hook in src/hooks/useWordSelection.ts (Pointer Events API for drag-to-select, adjacency validation)
- [ ] T024 [US1] Create Grid component in src/components/Grid/Grid.tsx (renders GridCell components, integrates useWordSelection hook)
- [ ] T025 [US1] Implement game state helpers in src/lib/gameState.ts (createNewSession, addFoundWord, validateTransition functions)
- [ ] T026 [US1] Create Zustand game store in src/hooks/useGameStore.ts (startNewGame, startSelection, extendSelection, submitSelection, cancelSelection actions)
- [ ] T027 [US1] Create main game page in app/page.tsx (integrates Grid component with game store)
- [ ] T028 [US1] Add global styles and Tailwind configuration in app/globals.css

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - players can find words!

---

## Phase 4: User Story 2 - Time-Limited Game Session (Priority: P2)

**Goal**: Add countdown timer that ends the game when it reaches zero, with visual warnings

**Independent Test**: Start game → observe timer counting down → wait for expiration → see game-over screen with results

### Tests for User Story 2 (MANDATORY per constitution)

- [ ] T029 [P] [US2] Write component test for Timer in tests/component/Timer.test.tsx (displays time, shows warning state, triggers game end)
- [ ] T030 [P] [US2] Write component test for GameOver in tests/component/GameOver.test.tsx (displays final score, found words list, new game button)

### Implementation for User Story 2

- [ ] T031 [US2] Implement useTimer custom hook in src/hooks/useTimer.ts (countdown logic, warning threshold, game end trigger)
- [ ] T032 [P] [US2] Create Timer component in src/components/GameControls/Timer.tsx (displays remaining time, warning visual)
- [ ] T033 [P] [US2] Create GameOver component in src/components/GameOver/GameOver.tsx (final score screen, found words display, new game button)
- [ ] T034 [US2] Add timer state and actions to useGameStore (tickTimer, endGame actions)
- [ ] T035 [US2] Integrate Timer component in app/page.tsx
- [ ] T036 [US2] Integrate GameOver modal/screen in app/page.tsx (conditional render on gameState)

**Checkpoint**: At this point, User Stories 1 AND 2 both work - timed gameplay with game-over!

---

## Phase 5: User Story 3 - Track Score and Found Words (Priority: P3)

**Goal**: Display current score and list of found words during gameplay

**Independent Test**: Find multiple words → verify score increases → see words in list → attempt duplicate → rejected

### Tests for User Story 3 (MANDATORY per constitution)

- [ ] T037 [P] [US3] Write component test for ScoreBoard in tests/component/ScoreBoard.test.tsx (displays score, word count, updates on word found)
- [ ] T038 [P] [US3] Write component test for WordList in tests/component/WordList.test.tsx (displays found words, shows word scores, handles empty state)
- [ ] T039 [P] [US3] Write component test for WordItem in tests/component/WordItem.test.tsx (displays word text and score, highlights on hover)

### Implementation for User Story 3

- [ ] T040 [P] [US3] Create ScoreBoard component in src/components/GameControls/ScoreBoard.tsx (displays current score and word count)
- [ ] T041 [P] [US3] Create WordItem component in src/components/WordList/WordItem.tsx (displays single found word with score)
- [ ] T042 [US3] Create WordList component in src/components/WordList/WordList.tsx (renders list of found words using WordItem)
- [ ] T043 [US3] Integrate ScoreBoard component in app/page.tsx
- [ ] T044 [US3] Integrate WordList component in app/page.tsx
- [ ] T045 [US3] Implement word highlighting on grid in Grid component (show positions of found word on hover)

**Checkpoint**: All core gameplay complete - find words, track progress, timed challenge!

---

## Phase 6: User Story 4 - Customize Grid Size and Timer Duration (Priority: P4)

**Goal**: Allow players to configure grid size and timer duration before starting a game

**Independent Test**: Open settings → select 4x4 grid + 1 minute → start game → verify grid and timer match

### Tests for User Story 4 (MANDATORY per constitution)

- [ ] T046 [P] [US4] Write component test for GameSettings in tests/component/GameSettings.test.tsx (displays options, handles selection, validates choices)

### Implementation for User Story 4

- [ ] T047 [US4] Create GameSettings component in src/components/GameControls/GameSettings.tsx (dropdowns/buttons for grid size and timer duration)
- [ ] T048 [US4] Add settings state and actions to useGameStore (updateSettings, resetSettings actions)
- [ ] T049 [US4] Integrate GameSettings in app/page.tsx (show before game starts or in modal)
- [ ] T050 [US4] Update startNewGame action to use selected settings from store

**Checkpoint**: All user stories complete - full feature set!

---

## Phase 7: End-to-End Tests

**Purpose**: Validate critical user journeys work end-to-end

- [ ] T051 [P] Write e2e test for complete gameplay in tests/e2e/gameplay.spec.ts (start game, find multiple words, verify scoring)
- [ ] T052 [P] Write e2e test for timer expiration in tests/e2e/timer-expiration.spec.ts (start game, wait for timer, verify game-over)
- [ ] T053 [P] Write e2e test for settings in tests/e2e/settings.spec.ts (change grid size/timer, verify game respects settings)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T054 [P] Add loading states and error handling across components
- [ ] T055 [P] Improve responsive design for mobile and tablet layouts in app/globals.css
- [ ] T056 [P] Add animations for word validation feedback (success/error states)
- [ ] T057 [P] Add keyboard shortcuts (ESC to cancel selection, SPACE to pause, N for new game)
- [ ] T058 [P] Optimize performance: memoize expensive calculations, virtualize large grids
- [ ] T059 [P] Add localStorage persistence for settings (grid size, timer preference)
- [ ] T060 Validate against quickstart.md (run through setup steps, verify all works)
- [ ] T061 Run all tests and ensure 100% passing (unit, component, e2e)
- [ ] T062 Build production bundle and verify bundle size <5MB

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially (P1 → P2 → P3 → P4)
- **E2E Tests (Phase 7)**: Depends on User Stories 1-2 minimum (can run after MVP)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable

### Within Each User Story

**CRITICAL - TDD Workflow per Constitution**:
1. Tests MUST be written FIRST
2. Run tests - they MUST FAIL (red state)
3. Implement minimal code to make tests pass (green state)
4. Refactor with confidence (tests still passing)
5. Move to next task

**Task Ordering**:
- Tests before implementation (always)
- Pure functions/hooks before components
- Child components before parent components
- Components before integration into pages

### Parallel Opportunities

- All Setup tasks (Phase 1) can run in parallel after T001
- All Foundational test tasks (T010, T012, T014, T016) can run in parallel
- Once Foundational phase completes, ALL user stories can start in parallel (if team capacity allows)
- Within each story: All test tasks marked [P] can run in parallel
- E2E tests (Phase 7) can all run in parallel
- Polish tasks (Phase 8) can mostly run in parallel

---

## Parallel Example: User Story 1

```bash
# After Foundational phase, launch all US1 tests together:
Task T018: "Write component test for Grid in tests/component/Grid.test.tsx"
Task T019: "Write component test for GridCell in tests/component/GridCell.test.tsx"
Task T020: "Write component test for LetterSelection in tests/component/LetterSelection.test.tsx"

# After tests written, launch parallelizable implementation:
Task T021: "Create GridCell component in src/components/Grid/GridCell.tsx"
Task T022: "Create LetterSelection component in src/components/Grid/LetterSelection.tsx"

# Sequential (depend on hooks/previous components):
Task T023: "Implement useWordSelection hook" (depends on T017 validation)
Task T024: "Create Grid component" (depends on T021, T022, T023)
Task T025: "Implement gameState helpers" (depends on T017 validation)
Task T026: "Create Zustand store" (depends on T025)
Task T027: "Create main page" (depends on T024, T026)
Task T028: "Add global styles" (can happen anytime after T001)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup ✅
2. Complete Phase 2: Foundational ✅ (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 ✅ (Core gameplay - find words)
4. **STOP and VALIDATE**: Test US1 independently
5. Complete Phase 4: User Story 2 ✅ (Add timer and game-over)
6. **STOP and VALIDATE**: Test US1+US2 together
7. Deploy/demo MVP! 🎉

**MVP Scope**: Phases 1-4 only = ~36 tasks = fully playable timed word game

### Incremental Delivery (Full Feature Set)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Works! (find words)
3. Add User Story 2 → Test independently → Works! (timed gameplay)
4. **Deploy MVP** 🚀
5. Add User Story 3 → Test independently → Works! (score tracking)
6. Add User Story 4 → Test independently → Works! (customization)
7. Add E2E tests (Phase 7) → Full coverage
8. Add Polish (Phase 8) → Production ready
9. **Deploy Full Version** 🎉

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done (T001-T017 ✅):
   - Developer A: User Story 1 (T018-T028)
   - Developer B: User Story 2 (T029-T036)
   - Developer C: User Story 3 (T037-T045)
   - Developer D: User Story 4 (T046-T050)
3. Stories complete and integrate independently
4. Team runs E2E tests together (T051-T053)
5. Team tackles Polish tasks in parallel (T054-T062)

---

## Notes

- **[P] tasks** = different files, no dependencies, safe to parallelize
- **[Story] label** maps task to specific user story for traceability
- **TDD MANDATORY** per constitution: Tests FIRST, see them FAIL, implement, see them PASS
- **Each user story is independently completable and testable** - can deploy after any story
- **Test organization follows constitution**:
  - `tests/unit/` for pure functions (scoring, validation, grid, dictionary)
  - `tests/component/` for React components (all UI components)
  - `tests/e2e/` for user journeys (gameplay, timer-expiration, settings)
- **Commit after each task or logical group** (especially after each green test)
- **Stop at any checkpoint to validate** story independently
- **Avoid**: Skipping tests, implementing before testing, breaking TDD workflow

---

## Task Summary

**Total Tasks**: 68

**By Phase**:
- Phase 1 (Setup): 13 tasks
- Phase 2 (Foundational): 10 tasks
- Phase 3 (US1 - MVP Core): 11 tasks
- Phase 4 (US2 - Timer): 8 tasks
- Phase 5 (US3 - Scoring): 9 tasks
- Phase 6 (US4 - Settings): 4 tasks
- Phase 7 (E2E): 3 tasks
- Phase 8 (Polish): 10 tasks

**MVP Scope** (US1 + US2): 42 tasks
**Full Feature Set**: 68 tasks

**Parallel Opportunities**: 40 tasks marked [P] can run in parallel within their phase
**Sequential Critical Path**: 28 tasks must run sequentially

**Test Coverage**:
- Unit tests: 4 test files (scoring, dictionary, grid, validation)
- Component tests: 9 test files (all UI components)
- E2E tests: 3 test files (gameplay, timer, settings)
- **Total: 16 test files covering all functionality**
