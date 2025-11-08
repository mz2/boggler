/**
 * Audio feedback utilities
 * Provides sound effects for game events
 */

/**
 * Play success sound (happy pling) when word is accepted
 */
export function playSuccessSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Happy pling: ascending notes
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.warn('Failed to play success sound:', error);
  }
}

/**
 * Play error sound (sad trombone) when word is rejected
 */
export function playErrorSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Sad trombone: descending notes
    oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
    oscillator.frequency.setValueAtTime(369.99, audioContext.currentTime + 0.15); // F#4
    oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.3); // F4
    oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.5); // D4

    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.7);
  } catch (error) {
    console.warn('Failed to play error sound:', error);
  }
}
