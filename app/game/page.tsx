'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debugParam = searchParams.get('debug');

  // Redirect to the new URL structure with default settings
  useEffect(() => {
    const debugQuery = debugParam ? `?debug=${debugParam}` : '';
    // Generate a random seed for the redirect
    const seed = Math.floor(Date.now() * Math.random()) % 2147483647;
    router.push(`/game/english/9x9/180s/${seed}${debugQuery}`);
  }, [router, debugParam]);

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
