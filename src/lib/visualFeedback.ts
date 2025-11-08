/**
 * Visual feedback utilities
 * Provides screen flash effects for game events
 */

import type { Position } from '@/types/game';

/**
 * Flash the screen with red color for errors
 * Creates a full-screen overlay that fades out
 */
export function flashScreenError(): void {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9998'; // Below confetti (9999) but above everything else
  overlay.style.transition = 'opacity 0.8s ease-out';
  overlay.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'; // red-500 with 30% opacity
  overlay.style.opacity = '1';

  document.body.appendChild(overlay);

  // Start fade out immediately
  requestAnimationFrame(() => {
    overlay.style.opacity = '0';
  });

  // Remove after animation completes
  setTimeout(() => {
    document.body.removeChild(overlay);
  }, 800);
}

/**
 * Highlight grid cells with blue color for successful word
 * Animates the specific cells that were part of the accepted word
 */
export function highlightCells(positions: Position[]): void {
  positions.forEach((pos) => {
    const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
    if (cell instanceof HTMLElement) {
      // Add success class
      cell.classList.add('cell-success');

      // Remove after animation completes
      setTimeout(() => {
        cell.classList.remove('cell-success');
      }, 1000);
    }
  });
}
