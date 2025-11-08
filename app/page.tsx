'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/hooks/useGameStore';
import { GameSettings } from '@/components/GameControls/GameSettings';
import { loadDictionary } from '@/lib/dictionary';

export default function Home() {
  const router = useRouter();
  const { startNewGame } = useGameStore();
  const [selectedGridSize, setSelectedGridSize] = useState(9);
  const [selectedDuration, setSelectedDuration] = useState(180);

  // Load dictionary and settings from localStorage on mount
  useEffect(() => {
    loadDictionary().then(() => {
      console.log('Dictionary loaded');
    });

    // Load saved settings from localStorage
    const savedGridSize = localStorage.getItem('boggler_gridSize');
    const savedDuration = localStorage.getItem('boggler_timerDuration');

    if (savedGridSize) {
      setSelectedGridSize(parseInt(savedGridSize, 10));
    }
    if (savedDuration) {
      setSelectedDuration(parseInt(savedDuration, 10));
    }
  }, []);

  const handleNewGame = () => {
    startNewGame(selectedGridSize, selectedDuration);
    router.push('/game');
  };

  const handleSettingsChange = (settings: { gridSize: number; timerDuration: number }) => {
    setSelectedGridSize(settings.gridSize);
    setSelectedDuration(settings.timerDuration);

    // Save to localStorage
    localStorage.setItem('boggler_gridSize', settings.gridSize.toString());
    localStorage.setItem('boggler_timerDuration', settings.timerDuration.toString());
  };

  return (
    <div className="game-container">
      <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">Boggler</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Find as many words as you can by connecting adjacent letters!
      </p>

      <GameSettings
        gridSize={selectedGridSize}
        timerDuration={selectedDuration}
        onChange={handleSettingsChange}
      />

      <button onClick={handleNewGame} className="btn btn-primary mt-6">
        New Game
      </button>
    </div>
  );
}
