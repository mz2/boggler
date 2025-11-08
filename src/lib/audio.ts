/**
 * Audio feedback utilities
 * Provides sound effects for game events
 */

/**
 * Play success sound (happy pling) when word is accepted
 */
export function playSuccessSound(wordLength?: number): void {
  // Use celebration sound for 5+ letter words
  if (wordLength && wordLength >= 5) {
    playCelebrationSound();
    return;
  }

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
 * Play celebration sound (fanfare) for 5+ letter words
 */
export function playCelebrationSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create multiple oscillators for a richer sound
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const osc3 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Triumphant fanfare: ascending major chord progression
    // C major chord (C-E-G)
    osc1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    osc2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
    osc3.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5

    // Move to G major chord (G-B-D)
    osc1.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.15); // G5
    osc2.frequency.setValueAtTime(987.77, audioContext.currentTime + 0.15); // B5
    osc3.frequency.setValueAtTime(1174.66, audioContext.currentTime + 0.15); // D6

    // Finish with high C major (C-E-G)
    osc1.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
    osc2.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.3); // E6
    osc3.frequency.setValueAtTime(1567.98, audioContext.currentTime + 0.3); // G6

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc3.type = 'triangle';

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

    osc1.start(audioContext.currentTime);
    osc2.start(audioContext.currentTime);
    osc3.start(audioContext.currentTime);

    osc1.stop(audioContext.currentTime + 0.6);
    osc2.stop(audioContext.currentTime + 0.6);
    osc3.stop(audioContext.currentTime + 0.6);
  } catch (error) {
    console.warn('Failed to play celebration sound:', error);
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
