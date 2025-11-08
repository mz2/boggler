/**
 * WordList component - displays list of found words
 */

import type { FoundWord } from '@/types/game';
import { WordItem } from './WordItem';

interface WordListProps {
  words: FoundWord[];
}

export function WordList({ words }: WordListProps) {
  if (words.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-3 text-center">Found Words</h2>
      <div className="word-list">
        {words.map((word) => (
          <WordItem key={word.id} text={word.text} score={word.score} />
        ))}
      </div>
    </div>
  );
}
