/**
 * ScoreBoard component - displays current score and word count
 */

interface ScoreBoardProps {
  score: number;
  wordCount: number;
}

export function ScoreBoard({ score, wordCount }: ScoreBoardProps) {
  return (
    <div className="score-board">
      <div>
        <span className="text-gray-600">Score:</span>{' '}
        <span className="text-blue-600">{score}</span>
      </div>
      <div>
        <span className="text-gray-600">Words:</span>{' '}
        <span className="text-blue-600">{wordCount}</span>
      </div>
    </div>
  );
}
