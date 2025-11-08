# Quickstart Guide: Boggler

**Feature**: Boggler
**Date**: 2025-11-08
**Purpose**: Step-by-step guide for setting up and running Boggler

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Code editor (VS Code recommended)
- Git

---

## Setup Instructions

### 1. Initialize Next.js Project

```bash
# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest boggler --typescript --tailwind --app --no-src-dir

cd boggler
```

**Options selected**:
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ App Router
- ❌ src/ directory (we'll create our own structure)
- ✅ Import alias (@/*)

### 2. Install Dependencies

```bash
# Core dependencies
npm install zustand uuid word-list

# Development dependencies
npm install -D @types/uuid

# Testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom @playwright/test

# Future multiplayer (optional, Phase 2+)
# npm install @liveblocks/client @liveblocks/zustand
```

### 3. Create Project Structure

```bash
# Create source directories
mkdir -p src/{components/{Grid,GameControls,WordList,GameOver},lib,hooks,types,constants}
mkdir -p tests/{unit,component,e2e}
mkdir -p public/dictionary

# Create initial files
touch src/types/game.ts
touch src/constants/config.ts
touch src/lib/{grid,validation,scoring,dictionary,gameState}.ts
touch src/hooks/{useGameStore,useTimer,useWordSelection}.ts
```

### 4. Verify Dictionary Package

The `word-list` package is already installed and ready to use. No additional setup needed.

```bash
# Verify installation
npm list word-list
```

The package provides 370k+ English words. Dictionary will be loaded at runtime via:
```typescript
import words from 'word-list';
// words is a file path to the word list
```

### 5. Configure TypeScript

**tsconfig.json** (ensure paths are set):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/types/*": ["./src/types/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

### 6. Configure Jest

**jest.config.js**:
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/component/**/*.test.tsx',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**jest.setup.js**:
```javascript
import '@testing-library/jest-dom';
```

### 7. Configure Playwright

```bash
npx playwright install
```

**playwright.config.ts**:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

---

## Development Workflow

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Tests

```bash
# Unit tests
npm test

# Component tests
npm test -- tests/component

# E2E tests
npx playwright test

# Watch mode
npm test -- --watch
```

### Build for Production

```bash
npm run build
npm start
```

---

## Implementation Order (TDD)

Follow this order to ensure Test-Driven Development:

### Phase 1: Pure Functions (src/lib/)

**1. Fibonacci Scoring**
```bash
# 1. Write test
touch tests/unit/scoring.test.ts
# 2. Run test (fails - red)
npm test scoring
# 3. Implement
# Edit src/lib/scoring.ts
# 4. Run test (passes - green)
# 5. Refactor
```

**2. Grid Generation**
```bash
# Repeat TDD cycle for grid.ts
tests/unit/grid.test.ts -> src/lib/grid.ts
```

**3. Word Validation**
```bash
# Repeat TDD cycle for validation.ts
tests/unit/validation.test.ts -> src/lib/validation.ts
```

**4. Dictionary Loading**
```bash
# Repeat TDD cycle for dictionary.ts
tests/unit/dictionary.test.ts -> src/lib/dictionary.ts
```

**5. Game State Helpers**
```bash
# Repeat TDD cycle for gameState.ts
tests/unit/gameState.test.ts -> src/lib/gameState.ts
```

### Phase 2: Zustand Store

```bash
# Test store actions
tests/unit/gameStore.test.ts -> src/hooks/useGameStore.ts
```

### Phase 3: React Components

**For each component**:
1. Write component test
2. Run test (fails)
3. Implement component
4. Run test (passes)
5. Refactor

**Component order** (by user story priority):
1. Grid components (US1)
2. Timer component (US2)
3. ScoreBoard component (US3)
4. WordList component (US3)
5. GameSettings component (US4)
6. GameOver component (US2)

### Phase 4: End-to-End Tests

```bash
# Test critical user journeys
tests/e2e/gameplay.spec.ts - Full game flow
tests/e2e/timer-expiration.spec.ts - Timer countdown and game over
```

---

## Verification Checklist

After setup, verify the following:

- [ ] `npm run dev` starts without errors
- [ ] TypeScript compilation successful
- [ ] Tailwind CSS loads correctly
- [ ] Dictionary JSON file exists and loads
- [ ] Jest runs (even with 0 tests)
- [ ] Playwright installed and configured
- [ ] All directories created per structure
- [ ] Import aliases (@/*) resolve correctly

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main game page component |
| `src/types/game.ts` | All TypeScript interfaces |
| `src/hooks/useGameStore.ts` | Zustand store |
| `src/lib/grid.ts` | Grid generation logic |
| `src/lib/validation.ts` | Word validation and adjacency |
| `src/lib/scoring.ts` | Fibonacci score calculation |
| `src/lib/dictionary.ts` | Dictionary loading from word-list package |
| `src/constants/config.ts` | Grid sizes, timer durations, etc. |

---

## Troubleshooting

### Dictionary loading slow
- word-list package is optimized and loads efficiently
- Expected bundle size: ~500KB gzipped
- Loads once on app initialization

### Tests failing with import errors
- Verify `jest.config.js` moduleNameMapper paths
- Ensure `@/` alias configured in both `tsconfig.json` and Jest

### Playwright can't connect
- Ensure dev server is running on port 3000
- Check `playwright.config.ts` baseURL matches

### TypeScript errors in components
- Ensure `src/types/game.ts` is complete
- Check all interfaces exported
- Verify import paths use `@/types/game`

---

## Next Steps

After setup:
1. Run `/speckit.tasks` to generate implementation tasks
2. Follow TDD workflow for each task
3. Commit after each passing test
4. Deploy MVP to Vercel/Netlify when User Stories 1-2 complete

---

## Future: Liveblocks Integration (Phase 2+)

When adding multiplayer:

```bash
# Install Liveblocks
npm install @liveblocks/client @liveblocks/react @liveblocks/zustand

# Create Liveblocks config
# Get API key from liveblocks.io dashboard
# Add to .env.local: NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...

# Wrap Zustand store with Liveblocks middleware
# See research.md for implementation details
```

---

## Support

- Technical decisions: See [research.md](./research.md)
- Data model: See [data-model.md](./data-model.md)
- Store API: See [contracts/store-api.md](./contracts/store-api.md)
- Feature spec: See [spec.md](./spec.md)
