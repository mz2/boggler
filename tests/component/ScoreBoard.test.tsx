/**
 * Component tests for ScoreBoard
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from '@/components/GameControls/ScoreBoard';

describe('ScoreBoard Component', () => {
  it('should display current score', () => {
    render(<ScoreBoard score={42} wordCount={5} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should display word count', () => {
    render(<ScoreBoard score={42} wordCount={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display zero score', () => {
    render(<ScoreBoard score={0} wordCount={0} />);
    const scoreElements = screen.getAllByText('0');
    expect(scoreElements.length).toBeGreaterThan(0);
  });

  it('should display score label', () => {
    render(<ScoreBoard score={42} wordCount={5} />);
    expect(screen.getByText(/score/i)).toBeInTheDocument();
  });

  it('should display words label', () => {
    render(<ScoreBoard score={42} wordCount={5} />);
    expect(screen.getByText(/words/i)).toBeInTheDocument();
  });

  it('should handle large score values', () => {
    render(<ScoreBoard score={999} wordCount={50} />);
    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should use score-board class', () => {
    const { container } = render(<ScoreBoard score={42} wordCount={5} />);
    expect(container.querySelector('.score-board')).toBeInTheDocument();
  });
});
