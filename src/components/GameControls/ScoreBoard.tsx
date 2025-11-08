/**
 * ScoreBoard component - displays current score and word count
 */

interface ScoreBoardProps {
  score: number;
  wordCount: number;
}

export function ScoreBoard({ score, wordCount }: ScoreBoardProps) {
  return (
    <div className="text-4xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
      Score: {score} ({wordCount} word{wordCount !== 1 ? 's' : ''})
    </div>
  );
}
