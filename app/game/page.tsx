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
    router.push(`/game/english/9/180${debugQuery}`);
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
