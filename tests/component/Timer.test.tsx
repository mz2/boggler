/**
 * Component tests for Timer
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from '@/components/GameControls/Timer';

describe('Timer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display time in MM:SS format', () => {
    render(<Timer timeRemaining={125} isWarning={false} />);
    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('should display 0:00 when time is zero', () => {
    render(<Timer timeRemaining={0} isWarning={false} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('should pad single digit seconds with leading zero', () => {
    render(<Timer timeRemaining={65} isWarning={false} />);
    expect(screen.getByText('1:05')).toBeInTheDocument();
  });

  it('should apply warning class when isWarning is true', () => {
    const { container } = render(<Timer timeRemaining={10} isWarning={true} />);
    const timerElement = container.querySelector('.timer.warning');
    expect(timerElement).toBeInTheDocument();
  });

  it('should not apply warning class when isWarning is false', () => {
    const { container } = render(<Timer timeRemaining={60} isWarning={false} />);
    const timerElement = container.querySelector('.timer.warning');
    expect(timerElement).not.toBeInTheDocument();
  });

  it('should display correct time at 1 minute mark', () => {
    render(<Timer timeRemaining={60} isWarning={false} />);
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('should display correct time at 5 minute mark', () => {
    render(<Timer timeRemaining={300} isWarning={false} />);
    expect(screen.getByText('5:00')).toBeInTheDocument();
  });

  it('should handle large time values correctly', () => {
    render(<Timer timeRemaining={3661} isWarning={false} />);
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });
});
