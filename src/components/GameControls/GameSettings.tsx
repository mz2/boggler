/**
 * GameSettings component - dropdowns for grid size and timer duration
 */

interface GameSettingsProps {
  gridSize: number;
  timerDuration: number;
  onChange: (settings: { gridSize: number; timerDuration: number }) => void;
}

export function GameSettings({ gridSize, timerDuration, onChange }: GameSettingsProps) {
  const handleGridSizeChange = (newSize: number) => {
    onChange({ gridSize: newSize, timerDuration });
  };

  const handleTimerChange = (newDuration: number) => {
    onChange({ gridSize, timerDuration: newDuration });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Grid Size Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="grid-size" className="text-lg font-medium text-gray-900 dark:text-gray-100 w-24">
          Grid Size:
        </label>
        <select
          id="grid-size"
          value={gridSize}
          onChange={(e) => handleGridSizeChange(Number(e.target.value))}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium focus:outline-none focus:border-blue-500 bg-white text-gray-900"
        >
          <option value={4}>4×4</option>
          <option value={9}>9×9</option>
          <option value={16}>16×16</option>
        </select>
      </div>

      {/* Timer Duration Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="timer-duration" className="text-lg font-medium text-gray-900 dark:text-gray-100 w-24">
          Timer:
        </label>
        <select
          id="timer-duration"
          value={timerDuration}
          onChange={(e) => handleTimerChange(Number(e.target.value))}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium focus:outline-none focus:border-blue-500 bg-white text-gray-900"
        >
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={180}>3 minutes</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>
    </div>
  );
}
