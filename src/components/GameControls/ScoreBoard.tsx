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
      <span className="font-bold">Score: {score}</span>
      <span className="font-normal text-2xl ml-2">({wordCount} word{wordCount !== 1 ? 's' : ''})</span>
    </div>
  );
}
