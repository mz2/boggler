/**
 * Visual feedback utilities
 * Provides screen flash effects for game events
 */

/**
 * Flash the screen with a color (blue for success, red for error)
 * Creates a full-screen overlay that fades out
 */
export function flashScreen(type: 'success' | 'error'): void {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9998'; // Below confetti (9999) but above everything else
  overlay.style.transition = 'opacity 0.5s ease-out';

  // Set color based on type
  if (type === 'success') {
    overlay.style.backgroundColor = 'rgba(59, 130, 246, 0.3)'; // blue-500 with 30% opacity
  } else {
    overlay.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'; // red-500 with 30% opacity
  }

  overlay.style.opacity = '1';

  document.body.appendChild(overlay);

  // Start fade out immediately
  requestAnimationFrame(() => {
    overlay.style.opacity = '0';
  });

  // Remove after animation completes
  setTimeout(() => {
    document.body.removeChild(overlay);
  }, 500);
}
