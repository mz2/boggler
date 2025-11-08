# Research: Boggler

**Feature**: Boggler
**Date**: 2025-11-08
**Purpose**: Resolve technical unknowns from implementation plan

## Overview

This document resolves the three NEEDS CLARIFICATION items from the technical context:
1. Dictionary source for word validation
2. State management approach (with future Liveblocks compatibility)
3. Touch/mouse interaction implementation for grid selection

---

## 1. Dictionary Source Decision

### Decision
**Use npm package `word-list` with full 370k+ word dictionary**

### Rationale

**Option Evaluated**: npm package vs Embedded JSON vs Web API

**Why npm Package (word-list)**:
1. **Performance Critical**: Word validation must be <100ms (spec SC-002). npm package provides <1ms O(1) lookups via Set, while Web APIs add 100-500ms network latency - unacceptable for real-time gameplay
2. **Offline Requirement**: Spec requires game works offline after initial load. Web APIs require internet connection
3. **Bundle Size NOT a Concern**: User confirmed bundle size increase is acceptable. Full 370k dictionary = ~500KB gzipped, well within <5MB bundle constraint and provides comprehensive word coverage
4. **No Rate Limiting**: Gameplay generates many validation requests. Free APIs limit to 1,000-100,000 requests/day, easily exceeded
5. **Comprehensive Coverage**: 370k+ words means players can find obscure/advanced words, better gameplay experience
6. **Maintained Package**: `word-list` by sindresorhus is actively maintained, MIT licensed, well-tested
7. **No Manual Curation Needed**: Pre-built, optimized, ready to use

**Implementation Details**:
- Package: `word-list` (npm install word-list)
- Source: 370k+ English words, actively maintained
- Import: `import words from 'word-list';` (returns file path) or direct array import
- Lookup: Convert to Set on app load: `const wordSet = new Set(words)`
- Tree-shakeable: Next.js will optimize bundle automatically
- License: MIT (compatible with commercial use)

**Performance Metrics**:
- Lookup speed: <1ms per word (O(1) Set lookup)
- Memory: ~5-8MB in RAM for 370k words
- Bundle impact: +500KB gzipped (acceptable per user)
- Load time: One-time on app initialization
- Coverage: 370k+ words vs 50-100k filtered = better player experience

### Alternatives Considered

**Web API** (dictionaryapi.dev, Datamuse):
- ❌ Rejected: 100-500ms latency breaks real-time validation requirement
- ❌ Rejected: Requires internet (violates offline capability)
- ❌ Rejected: Rate limiting risk with high gameplay volume

**Embedded JSON with filtered list**:
- ⚠️ Partial consideration: Smaller bundle (~400KB) but only 50-100k words
- ⚠️ Requires manual curation and maintenance
- ❌ Rejected: Unnecessary complexity, limited word coverage, bundle size not a concern

---

## 2. State Management Decision

### Decision
**Use Zustand with Liveblocks middleware for future multiplayer**

### Rationale

**Critical Context**: App will become collaborative multiplayer using Liveblocks.io

**Why Zustand**:
1. **Liveblocks Compatibility**: Zustand has official Liveblocks middleware (`@liveblocks/zustand`) for seamless sync
2. **Performance**: Game has frequent updates (timer every 100-1000ms, letter selection). Zustand's fine-grained subscriptions prevent cascading re-renders - only affected components update
3. **Migration Path**: Start with local Zustand store, wrap with Liveblocks middleware when adding multiplayer. Zero refactoring needed
4. **Bundle Size**: <1KB, negligible overhead
5. **Testing**: Stores are simple functions, no provider wrapping needed in tests

**Liveblocks Integration**:
```typescript
// Single-player (Phase 1)
import { create } from 'zustand';

// Future multiplayer (Phase 2+)
import { createClient } from '@liveblocks/client';
import { liveblocks } from '@liveblocks/zustand';

const client = createClient({ publicApiKey: '...' });

export const useGameStore = create(
  liveblocks(
    (set) => ({ /* state */ }),
    { client, storageMapping: { /* sync config */ } }
  )
);
```

**State Structure**:
- **Local state** (not synced): Timer state, current letter selection, UI preferences
- **Synced state** (future Liveblocks): Grid, found words per player, scores, game settings

**Performance for Game Requirements**:
- Timer ticking (every 100-1000ms): Only Timer component re-renders
- Letter selection: Only Grid and selection overlay re-render
- Score updates: Only ScoreBoard re-renders
- Found words: Only WordList re-renders

### Alternatives Considered

**React Context API**:
- ❌ Rejected: Every timer update would re-render entire component tree
- ❌ Rejected: No official Liveblocks integration
- ❌ Rejected: Requires refactoring all consumers to switch to Liveblocks

**Local State with Prop Drilling**:
- ❌ Rejected: Unmaintainable for 10+ components
- ❌ Rejected: No path to Liveblocks integration
- ❌ Rejected: State spread across components prevents clean multiplayer sync

**Redux / Redux Toolkit**:
- ⚠️ Considered: Liveblocks supports Redux
- ❌ Rejected: Heavy boilerplate vs Zustand
- ❌ Rejected: Larger bundle size (~5-10KB vs <1KB)

---

## 3. Touch/Mouse Interaction Decision

### Decision
**Custom implementation using Pointer Events API**

### Rationale

**Why Custom Pointer Events**:
1. **Performance Critical**: Spec requires <16ms frame time (60fps) for smooth animations. Custom implementation provides maximum control and zero library overhead
2. **Grid-Specific Use Case**: Drag-to-select on grid cells is specialized. Libraries (react-dnd, dnd-kit) are designed for general drag-and-drop, not grid cell traversal
3. **Zero Bundle Impact**: Native browser API adds 0KB vs 7-37KB for libraries
4. **Touch/Mouse Unified**: Pointer Events API natively unifies touch, mouse, and pen input. Single event handler for all input types
5. **Privacy for Competitive Play**: Custom implementation keeps selection state local (not broadcast to opponents)
6. **Code Complexity**: Only ~100-150 lines for robust implementation - not significant overhead

**Implementation Components**:
1. **usePointerDrag hook**: Manages pointer lifecycle (down, move, up)
2. **Hit detection**: Use `document.elementFromPoint(x, y)` to find grid cell under pointer
3. **Adjacency checking**: Validate new cell is adjacent to previous selection (crossing allowed per edge case)
4. **Visual feedback**: Separate render layer for selection highlight (optimized with refs)
5. **CSS**: `touch-action: none` prevents browser defaults

**Performance Strategy**:
- Use refs to track selection state (avoid re-renders during drag)
- `requestAnimationFrame` for visual updates (smooth 60fps)
- Pointer capture for robust tracking across elements
- Optimized adjacency algorithm (O(1) lookup)

**Code Pattern**:
```typescript
const usePointerDrag = (onCellEnter: (row: number, col: number) => void) => {
  const isDragging = useRef(false);

  const handlePointerDown = (e: PointerEvent) => {
    isDragging.current = true;
    e.target.setPointerCapture(e.pointerId);
    // Start selection
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging.current) return;
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    const cell = elem?.closest('[data-cell]');
    if (cell) {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      onCellEnter(row, col); // Check adjacency, update selection
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    // Finalize word
  };

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
```

### Alternatives Considered

**@use-gesture/react** (~7KB):
- ⚠️ Good library with unified gesture API
- ❌ Rejected: Custom code is only ~100 lines, library doesn't add enough value
- ❌ Rejected: +7KB for functionality we can implement natively

**dnd-kit** (~10KB):
- ⚠️ Modern, performant drag-and-drop library
- ❌ Rejected: Designed for sortable lists and draggable items, not grid cell selection
- ❌ Rejected: Adds complexity for use case that doesn't match library's design

**react-dnd** (~37KB):
- ❌ Rejected: Heavy bundle size
- ❌ Rejected: Touch support has known bugs
- ❌ Rejected: Not designed for grid cell interactions

**Interact.js** (~30KB):
- ❌ Rejected: Large bundle for features we don't need (inertia, resizing)
- ❌ Rejected: Not React-optimized

---

## Liveblocks Architecture Considerations

### Future Multiplayer Features

**Competitive Mode** (likely Phase 2):
- Shared grid (all players see same letters)
- Individual word finding (each player finds their own words)
- Real-time score tracking (leaderboard updates)
- Timer synchronized across all players

**Liveblocks State Sync Strategy**:
```typescript
// Synced via Liveblocks Storage (persisted)
- Grid state (shared, read-only after generation)
- Timer (shared, authoritative)
- Player scores (per-player, synced)
- Found words (per-player lists, hidden until submitted)

// Local via Liveblocks Presence (ephemeral, visible to others)
- Player cursor position (optional, for UI presence indication)
- Player online/active status
- Player name/color

// Pure local (not synced, private to each player)
- Current letter selection (HIDDEN - competitive gameplay)
- UI preferences
- Animation states
```

**Note**: Current selection is deliberately NOT synced via Presence because this is competitive gameplay - showing opponent's current word selection would give unfair advantage.

**Migration Path**:
1. **Phase 1** (Current): Build single-player with Zustand
2. **Phase 2**: Add Liveblocks client and wrap Zustand with middleware
3. **Phase 2**: Add room creation and joining UI
4. **Phase 2**: Implement presence for showing other players' selections
5. **Phase 2**: Sync storage for shared game state

**No Architecture Changes Needed**: The decision to use Zustand now is fully compatible with Liveblocks later.

---

## Summary of Decisions

| Decision | Choice | Bundle Impact | Rationale |
|----------|--------|---------------|-----------|
| Dictionary | npm `word-list` | +500KB | 370k words, maintained, performance (<1ms), offline |
| State Management | Zustand | <1KB | Liveblocks compatible, performance, testability |
| Interaction | Custom Pointer Events | 0KB | Grid-specific, 60fps, full control for multiplayer |

**Total Bundle Impact**: ~501KB (well within <5MB constraint, bundle size not a concern per user)

**All decisions support**:
- ✅ Single-player MVP (Phase 1)
- ✅ Future Liveblocks multiplayer (Phase 2+)
- ✅ Performance requirements (SC-001 through SC-009)
- ✅ TDD compliance (pure functions, testable components)
