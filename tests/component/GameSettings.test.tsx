/**
 * Component tests for GameSettings
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameSettings } from '@/components/GameControls/GameSettings';

describe('GameSettings Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display grid size dropdown', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    expect(screen.getByLabelText(/grid size/i)).toBeInTheDocument();
  });

  it('should display timer duration dropdown', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    expect(screen.getByLabelText(/timer/i)).toBeInTheDocument();
  });

  it('should display current grid size selection', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    const select = screen.getByLabelText(/grid size/i) as HTMLSelectElement;
    expect(select.value).toBe('9');
  });

  it('should display current timer duration selection', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    const select = screen.getByLabelText(/timer/i) as HTMLSelectElement;
    expect(select.value).toBe('180');
  });

  it('should call onChange when grid size changes', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    const select = screen.getByLabelText(/grid size/i);
    fireEvent.change(select, { target: { value: '4' } });
    expect(mockOnChange).toHaveBeenCalledWith({ gridSize: 4, timerDuration: 180 });
  });

  it('should call onChange when timer duration changes', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    const select = screen.getByLabelText(/timer/i);
    fireEvent.change(select, { target: { value: '60' } });
    expect(mockOnChange).toHaveBeenCalledWith({ gridSize: 9, timerDuration: 60 });
  });

  it('should have all grid size options (4x4, 9x9, 16x16)', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    expect(screen.getByText('4×4')).toBeInTheDocument();
    expect(screen.getByText('9×9')).toBeInTheDocument();
    expect(screen.getByText('16×16')).toBeInTheDocument();
  });

  it('should have all timer duration options', () => {
    render(<GameSettings gridSize={9} timerDuration={180} onChange={mockOnChange} />);
    expect(screen.getByText(/30 seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/1 minute/i)).toBeInTheDocument();
    expect(screen.getByText(/3 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/5 minutes/i)).toBeInTheDocument();
  });
});
