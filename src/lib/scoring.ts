/**
 * Scoring logic for Boggler using Fibonacci sequence
 * Score = F(wordLength - 2) where F is Fibonacci
 * 3 letters = 1pt, 4 letters = 2pts, 5 letters = 3pts, etc.
 */

/**
 * Calculate Fibonacci number at position n
 * Standard Fibonacci: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)
 */
export function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

/**
 * Calculate score for a word based on its length
 * Uses adjusted Fibonacci for scoring: 3 letters=1pt, 4=2pts, 5=3pts, 6=5pts, 7=8pts
 * This maps to: F(wordLength - 1) where we use adjusted Fib: F(2)=1, F(3)=2, F(4)=3, F(5)=5
 * Or equivalently: F(wordLength - 2) + F(wordLength - 1) starting from length=3
 *
 * Actually the pattern is simpler: use standard Fib but map wordLength-1:
 * - length 3 -> F(2) = 1 ✓
 * - length 4 -> F(3) = 2 ✓
 * - length 5 -> F(4) = 3 ✓
 * - length 6 -> F(5) = 5 ✓
 * - length 7 -> F(6) = 8 ✓
 */
export function calculateScore(word: string): number {
  const length = word.length;

  // Words shorter than 3 letters get 0 points
  if (length < 3) {
    return 0;
  }

  // Calculate Fibonacci score: F(length - 1)
  // This gives us the sequence: 1, 2, 3, 5, 8, 13, 21...
  return fibonacci(length - 1);
}
