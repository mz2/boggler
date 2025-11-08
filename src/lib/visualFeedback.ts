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
 * Highlight grid cells with light blue color for successful word
 * Animates the specific cells that were part of the accepted word
 */
export function highlightCells(positions: Position[]): void {
  console.log('highlightCells called with positions:', positions);
  positions.forEach((pos) => {
    const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
    console.log(`Looking for cell at row=${pos.row}, col=${pos.col}`, cell);
    if (cell instanceof HTMLElement) {
      console.log('Adding cell-success class to cell:', cell);

      // Store original styles
      const originalBg = cell.style.backgroundColor;
      const originalBorder = cell.style.borderColor;
      const originalTransform = cell.style.transform;
      const originalTransition = cell.style.transition;

      // Add the class AND set inline styles as backup
      cell.classList.add('cell-success');

      // Set initial state with inline styles (these override most CSS)
      cell.style.backgroundColor = 'rgb(191, 219, 254)';
      cell.style.borderColor = 'rgb(96, 165, 250)';
      cell.style.transform = 'scale(1.1)';
      cell.style.transition = 'all 1s ease-out';

      // Animate to final state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cell.style.transform = 'scale(1)';
          cell.style.backgroundColor = 'rgb(255, 255, 255)';
          cell.style.borderColor = 'rgb(156, 163, 175)';
        });
      });

      // Clean up after animation completes
      setTimeout(() => {
        console.log('Removing cell-success class and resetting styles:', cell);
        cell.classList.remove('cell-success');
        cell.style.backgroundColor = originalBg;
        cell.style.borderColor = originalBorder;
        cell.style.transform = originalTransform;
        cell.style.transition = originalTransition;
      }, 1000);
    } else {
      console.warn('Cell not found or not an HTMLElement:', pos);
    }
  });
}
