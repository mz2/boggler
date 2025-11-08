'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/hooks/useGameStore';
import { GameSettings } from '@/components/GameControls/GameSettings';
import { loadDictionary } from '@/lib/dictionary';
import type { Language } from '@/types/game';

export default function Home() {
  const router = useRouter();
  const { startNewGame } = useGameStore();
  const [selectedGridSize, setSelectedGridSize] = useState(9);
  const [selectedDuration, setSelectedDuration] = useState(180);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');

  // Load dictionary and settings from localStorage on mount
  useEffect(() => {
    // Load saved settings from localStorage
    const savedGridSize = localStorage.getItem('boggler_gridSize');
    const savedDuration = localStorage.getItem('boggler_timerDuration');
    const savedLanguage = localStorage.getItem('boggler_language') as Language | null;

    if (savedGridSize) {
      setSelectedGridSize(parseInt(savedGridSize, 10));
    }
    if (savedDuration) {
      setSelectedDuration(parseInt(savedDuration, 10));
    }
    if (savedLanguage && (savedLanguage === 'english' || savedLanguage === 'finnish')) {
      setSelectedLanguage(savedLanguage);
    }

    // Load dictionary for the selected language
    loadDictionary(savedLanguage || 'english').then(() => {
      console.log(`Dictionary loaded: ${savedLanguage || 'english'}`);
    });
  }, []);

  const handleNewGame = () => {
    startNewGame(selectedGridSize, selectedDuration, selectedLanguage);
    router.push(`/game/${selectedLanguage}/${selectedGridSize}/${selectedDuration}`);
  };

  const handleSettingsChange = (settings: { gridSize: number; timerDuration: number; language: Language }) => {
    setSelectedGridSize(settings.gridSize);
    setSelectedDuration(settings.timerDuration);
    setSelectedLanguage(settings.language);

    // Save to localStorage
    localStorage.setItem('boggler_gridSize', settings.gridSize.toString());
    localStorage.setItem('boggler_timerDuration', settings.timerDuration.toString());
    localStorage.setItem('boggler_language', settings.language);

    // Load the new dictionary when language changes
    if (settings.language !== selectedLanguage) {
      loadDictionary(settings.language).then(() => {
        console.log(`Dictionary loaded: ${settings.language}`);
      });
    }
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
        language={selectedLanguage}
        onChange={handleSettingsChange}
      />

      <button onClick={handleNewGame} className="btn btn-primary mt-6">
        New Game
      </button>
    </div>
  );
}
