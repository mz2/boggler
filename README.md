# Boggler

A time-limited word-finding game where players connect adjacent letters on an N×N grid to form words. Race against the clock to find as many words as possible before time runs out!

## Game Features

- **Dynamic Letter Grid**: Play on 4×4, 9×9, or 16×16 grids
- **Time Challenge**: Configurable countdown timers (1, 3, or 5 minutes)
- **Fibonacci Scoring**: Longer words earn exponentially more points
- **370k+ Word Dictionary**: Comprehensive English word validation
- **Path Flexibility**: Letters can cross over themselves in your word paths
- **Future Multiplayer**: Designed for competitive multiplayer via Liveblocks

## How to Play

1. **Start a Game**: Choose your grid size and timer duration
2. **Find Words**: Click and drag (or tap and swipe) to connect adjacent letters
3. **Submit Words**: Release to submit - valid 3+ letter words earn points
4. **Beat the Clock**: Find as many words as you can before time expires!

### Scoring

Words are scored using the Fibonacci sequence based on length:
- 3 letters = 1 point
- 4 letters = 2 points
- 5 letters = 3 points
- 6 letters = 5 points
- 7 letters = 8 points
- 8 letters = 13 points
- 9+ letters = even more!

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5.x
- **UI**: React 19.2+ with Tailwind CSS
- **State Management**: Zustand (with future Liveblocks integration)
- **Dictionary**: word-list npm package (370k+ words)
- **Testing**: Jest, React Testing Library, Playwright
- **Future**: Liveblocks for real-time multiplayer

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd boggler

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

Boggler is optimized for deployment on Vercel. See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed setup instructions.

**Quick deploy:**

1. Push to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Deploy automatically!

The included GitHub Actions workflow will:
- Run tests, linting, and formatting checks
- Build the application
- Deploy to Vercel automatically on push to main

For CI/CD setup, you'll need to add three GitHub secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for step-by-step instructions.

## Testing

This project follows Test-Driven Development (TDD) principles.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run component tests
npm test -- tests/component

# Run end-to-end tests
npx playwright test
```

## Project Structure

```
boggler/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main game page
│   └── layout.tsx         # Root layout
├── src/
│   ├── components/        # React UI components
│   │   ├── Grid/         # Grid and cell components
│   │   ├── GameControls/ # Timer, score, settings
│   │   ├── WordList/     # Found words display
│   │   └── GameOver/     # End game screen
│   ├── lib/              # Pure functions (game logic)
│   │   ├── grid.ts       # Grid generation
│   │   ├── validation.ts # Word validation
│   │   ├── scoring.ts    # Fibonacci scoring
│   │   └── dictionary.ts # Dictionary loading
│   ├── hooks/            # Custom React hooks
│   │   ├── useGameStore.ts    # Zustand game state
│   │   ├── useTimer.ts        # Countdown timer
│   │   └── useWordSelection.ts # Drag selection
│   ├── types/            # TypeScript definitions
│   └── constants/        # Configuration
└── tests/
    ├── unit/             # Pure function tests
    ├── component/        # React component tests
    └── e2e/              # Playwright E2E tests
```

## Documentation

Detailed documentation is available in the `specs/001-word-grid-game/` directory:

- **[Feature Specification](specs/001-word-grid-game/spec.md)**: User stories, requirements, and success criteria
- **[Implementation Plan](specs/001-word-grid-game/plan.md)**: Technical architecture and design decisions
- **[Data Model](specs/001-word-grid-game/data-model.md)**: Entity definitions and relationships
- **[Research](specs/001-word-grid-game/research.md)**: Technology evaluation and decisions
- **[Quickstart Guide](specs/001-word-grid-game/quickstart.md)**: Step-by-step setup instructions
- **[Store API](specs/001-word-grid-game/contracts/store-api.md)**: Zustand store interface

## Design Principles

### Test-Driven Development

All code follows TDD methodology:
1. Write tests first (red)
2. Implement to pass (green)
3. Refactor with confidence

Tests are organized in three tiers:
- **Unit tests**: Pure functions (scoring, validation, grid generation)
- **Component tests**: React components (Grid, Timer, ScoreBoard)
- **E2E tests**: Critical user journeys (gameplay, timer expiration)

### State Management

- **Zustand store**: Lightweight, performant state management
- **Granular subscriptions**: Components only re-render when their data changes
- **Future-proof**: Designed for seamless Liveblocks multiplayer integration

### Performance

- Client-side only (no backend required)
- Offline-capable after initial load
- <100ms word validation
- 60fps smooth animations
- <5MB bundle size

## Future Features (Phase 2+)

### Competitive Multiplayer

- Real-time multiplayer via Liveblocks
- Shared grid, individual word finding
- Live score leaderboard
- Synchronized timer across all players
- **Private selections**: Opponents can't see your in-progress words (competitive fairness)

### Additional Features

- Daily challenges
- Word history and statistics
- Custom grid generation
- Difficulty modes
- Achievement system

## Contributing

This project follows a structured development workflow:

1. All changes must include tests
2. Follow TDD: tests before implementation
3. Commit after each passing test
4. Use `/speckit.tasks` to generate implementation tasks
5. Ensure constitution compliance (see `.specify/memory/constitution.md`)

## License

[Your License Here]

## Acknowledgments

- Dictionary: [word-list](https://github.com/sindresorhus/word-list) by Sindre Sorhus
- Inspired by classic word grid games
- Built with [Next.js](https://nextjs.org) and [React](https://react.dev)

---

**Branch**: `001-word-grid-game`
**Status**: In Development
**Version**: 0.1.0 (MVP)
