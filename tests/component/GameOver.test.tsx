/**
 * Component tests for GameOver
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameOver } from '@/components/GameOver/GameOver';

describe('GameOver Component', () => {
  const mockOnNewGame = vi.fn();

  const mockFoundWords = [
    { id: '1', text: 'CAT', positions: [], score: 1, timestamp: new Date(), playerId: null },
    { id: '2', text: 'DOG', positions: [], score: 1, timestamp: new Date(), playerId: null },
    { id: '3', text: 'HOUSE', positions: [], score: 3, timestamp: new Date(), playerId: null },
  ];

  it('should display final score', () => {
    render(<GameOver score={25} foundWords={mockFoundWords} onNewGame={mockOnNewGame} />);
    expect(screen.getByText(/25/)).toBeInTheDocument();
  });

  it('should display number of found words', () => {
    render(<GameOver score={25} foundWords={mockFoundWords} onNewGame={mockOnNewGame} />);
    expect(screen.getByText(/3 words found/)).toBeInTheDocument();
  });

  it('should display all found words', () => {
    render(<GameOver score={25} foundWords={mockFoundWords} onNewGame={mockOnNewGame} />);
    expect(screen.getByText(/CAT/)).toBeInTheDocument();
    expect(screen.getByText(/DOG/)).toBeInTheDocument();
    expect(screen.getByText(/HOUSE/)).toBeInTheDocument();
  });

  it('should display word scores', () => {
    render(<GameOver score={25} foundWords={mockFoundWords} onNewGame={mockOnNewGame} />);
    expect(screen.getByText(/CAT \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/HOUSE \(3\)/)).toBeInTheDocument();
  });

  it('should have a new game button', () => {
    render(<GameOver score={25} foundWords={mockFoundWords} onNewGame={mockOnNewGame} />);
    const button = screen.getByRole('button', { name: /new game/i });
    expect(button).toBeInTheDocument();
  });

  it('should call onNewGame when new game button is clicked', () => {
    render(<GameOver score={25} foundWords={mockFoundWords} onNewGame={mockOnNewGame} />);
    const button = screen.getByRole('button', { name: /new game/i });
    fireEvent.click(button);
    expect(mockOnNewGame).toHaveBeenCalledTimes(1);
  });

  it('should handle zero score', () => {
    render(<GameOver score={0} foundWords={[]} onNewGame={mockOnNewGame} />);
    expect(screen.getByText(/0 words found/)).toBeInTheDocument();
  });

  it('should handle empty found words list', () => {
    render(<GameOver score={0} foundWords={[]} onNewGame={mockOnNewGame} />);
    expect(screen.getByText(/0 words found/)).toBeInTheDocument();
  });

  it('should display Game Over heading', () => {
    render(<GameOver score={25} foundWords={mockFoundWords} onNewGame={mockOnNewGame} />);
    expect(screen.getByText(/game over/i)).toBeInTheDocument();
  });
});
