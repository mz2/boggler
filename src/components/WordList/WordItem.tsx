/**
 * WordItem component - displays a single found word with its score
 */

interface WordItemProps {
  text: string;
  score: number;
}

export function WordItem({ text, score }: WordItemProps) {
  return (
    <span className="word-item">
      {text} ({score})
    </span>
  );
}
