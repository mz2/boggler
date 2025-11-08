'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import type { Language } from '@/types/game';

function GamePageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const debugParam = searchParams.get('debug');

  // Redirect to the new URL structure with seed parameter
  useEffect(() => {
    const language = (params.language as Language) || 'english';
    const gridSizeParam = params.gridSize as string;
    const timerParam = params.timerDuration as string;
    const debugQuery = debugParam ? `?debug=${debugParam}` : '';

    // Generate a random seed for the redirect
    const seed = Math.floor(Date.now() * Math.random()) % 2147483647;
    router.push(`/game/${language}/${gridSizeParam}/${timerParam}/${seed}${debugQuery}`);
  }, [router, params, debugParam]);

  return (
    <div className="game-container">
      <p>Redirecting...</p>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="game-container">Loading...</div>}>
      <GamePageContent />
    </Suspense>
  );
}
