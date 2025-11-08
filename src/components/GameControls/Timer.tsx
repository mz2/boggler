/**
 * Timer component - displays remaining time with warning state
 */

interface TimerProps {
  timeRemaining: number; // seconds
  isWarning: boolean;
}

export function Timer({ timeRemaining, isWarning }: TimerProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer ${isWarning ? 'warning' : ''}`}>
      {formatTime(timeRemaining)}
    </div>
  );
}
