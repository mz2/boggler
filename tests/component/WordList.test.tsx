/**
 * Component tests for WordList
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordList } from '@/components/WordList/WordList';
import type { FoundWord } from '@/types/game';

describe('WordList Component', () => {
  const mockWords: FoundWord[] = [
    { id: '1', text: 'CAT', positions: [], score: 1, timestamp: new Date(), playerId: null },
    { id: '2', text: 'DOG', positions: [], score: 1, timestamp: new Date(), playerId: null },
    { id: '3', text: 'HOUSE', positions: [], score: 3, timestamp: new Date(), playerId: null },
  ];

  it('should display all found words', () => {
    render(<WordList words={mockWords} />);
    expect(screen.getByText(/CAT/)).toBeInTheDocument();
    expect(screen.getByText(/DOG/)).toBeInTheDocument();
    expect(screen.getByText(/HOUSE/)).toBeInTheDocument();
  });

  it('should display word scores', () => {
    render(<WordList words={mockWords} />);
    expect(screen.getByText(/CAT \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/HOUSE \(3\)/)).toBeInTheDocument();
  });

  it('should handle empty word list', () => {
    const { container } = render(<WordList words={[]} />);
    // Should not render when empty
    expect(container.querySelector('.word-list')).not.toBeInTheDocument();
  });

  it('should display heading when words exist', () => {
    render(<WordList words={mockWords} />);
    expect(screen.getByText(/found words/i)).toBeInTheDocument();
  });

  it('should not display heading when no words', () => {
    render(<WordList words={[]} />);
    expect(screen.queryByText(/found words/i)).not.toBeInTheDocument();
  });

  it('should handle single word', () => {
    const singleWord: FoundWord[] = [
      { id: '1', text: 'CAT', positions: [], score: 1, timestamp: new Date(), playerId: null },
    ];
    render(<WordList words={singleWord} />);
    expect(screen.getByText(/CAT \(1\)/)).toBeInTheDocument();
  });

  it('should use word-list class', () => {
    const { container } = render(<WordList words={mockWords} />);
    expect(container.querySelector('.word-list')).toBeInTheDocument();
  });
});
