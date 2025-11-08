/**
 * Component tests for WordItem
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordItem } from '@/components/WordList/WordItem';

describe('WordItem Component', () => {
  it('should display word text', () => {
    render(<WordItem text="CAT" score={1} />);
    expect(screen.getByText(/CAT/)).toBeInTheDocument();
  });

  it('should display word score in parentheses', () => {
    render(<WordItem text="HOUSE" score={3} />);
    expect(screen.getByText(/HOUSE \(3\)/)).toBeInTheDocument();
  });

  it('should handle single letter score', () => {
    render(<WordItem text="DOG" score={1} />);
    expect(screen.getByText(/\(1\)/)).toBeInTheDocument();
  });

  it('should handle large scores', () => {
    render(<WordItem text="EXTRAORDINARY" score={89} />);
    expect(screen.getByText(/\(89\)/)).toBeInTheDocument();
  });

  it('should use word-item class', () => {
    const { container } = render(<WordItem text="CAT" score={1} />);
    expect(container.querySelector('.word-item')).toBeInTheDocument();
  });

  it('should display multiple words correctly', () => {
    const { rerender } = render(<WordItem text="CAT" score={1} />);
    expect(screen.getByText(/CAT \(1\)/)).toBeInTheDocument();

    rerender(<WordItem text="HOUSE" score={3} />);
    expect(screen.getByText(/HOUSE \(3\)/)).toBeInTheDocument();
  });
});
