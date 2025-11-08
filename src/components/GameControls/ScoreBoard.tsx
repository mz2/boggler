/**
 * ScoreBoard component - displays current score and word count
 */

interface ScoreBoardProps {
  score: number;
  wordCount: number;
}

export function ScoreBoard({ score, wordCount }: ScoreBoardProps) {
  return (
    <div className="text-4xl tabular-nums text-gray-900 dark:text-gray-100">
      <span className="font-bold">🏆 {score}</span>
    </div>
  );
}
