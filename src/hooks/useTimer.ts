/**
 * Custom hook for countdown timer
 */

import { useEffect } from 'react';
import { useGameStore } from './useGameStore';

const WARNING_THRESHOLD = 10; // seconds

export function useTimer() {
  const { session } = useGameStore();

  useEffect(() => {
    if (!session || session.gameState !== 'playing') {
      return;
    }

    const interval = setInterval(() => {
      const store = useGameStore.getState();
      const currentSession = store.session;

      if (!currentSession || currentSession.gameState !== 'playing') {
        clearInterval(interval);
        return;
      }

      if (currentSession.timeRemaining <= 0) {
        clearInterval(interval);
        store.endGame();
        return;
      }

      // Tick the timer
      store.tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.gameState, session?.id]);

  const isWarning = session ? session.timeRemaining <= WARNING_THRESHOLD : false;

  return {
    timeRemaining: session?.timeRemaining ?? 0,
    isWarning,
  };
}
