/**
 * Scoring logic for Boggler using exponential scoring (powers of 2)
 * Score = 2^(wordLength - 3)
 * 3 letters = 1pt, 4 letters = 2pts, 5 letters = 4pts, 6 letters = 8pts, etc.
 */

/**
 * Calculate score for a word based on its length
 * Uses exponential scoring: 2^(length - 3)
 * - length 3 -> 2^0 = 1
 * - length 4 -> 2^1 = 2
 * - length 5 -> 2^2 = 4
 * - length 6 -> 2^3 = 8
 * - length 7 -> 2^4 = 16
 * - length 8 -> 2^5 = 32
 * - length 9 -> 2^6 = 64
 */
export function calculateScore(word: string): number {
  const length = word.length;

  // Words shorter than 3 letters get 0 points
  if (length < 3) {
    return 0;
  }

  // Calculate exponential score: 2^(length - 3)
  // This gives us the sequence: 1, 2, 4, 8, 16, 32, 64...
  return Math.pow(2, length - 3);
}
