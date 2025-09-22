export class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    try {
      await this.ensureAudioContext();
      
      if (!this.audioContext || !this.gainNode) return;

      const oscillator = this.audioContext.createOscillator();
      const envelope = this.audioContext.createGain();

      oscillator.connect(envelope);
      envelope.connect(this.gainNode);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      // Create envelope for smooth sound
      envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
      envelope.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play tone:', error);
    }
  }

  async playWorkPhaseSound() {
    // Strong, attention-grabbing sound for work phase
    await this.playTone(800, 0.2);
    setTimeout(() => this.playTone(800, 0.2), 250);
  }

  async playRestPhaseSound() {
    // Gentle, calming sound for rest phase
    await this.playTone(400, 0.3);
  }

  async playLongRestSound() {
    // Distinctive sequence for long rest
    await this.playTone(600, 0.15);
    setTimeout(() => this.playTone(500, 0.15), 200);
    setTimeout(() => this.playTone(400, 0.3), 400);
  }

  async playStartSound() {
    await this.playTone(500, 0.1);
  }

  async playPauseSound() {
    await this.playTone(300, 0.2);
  }

  async playCompletionSound() {
    // Celebratory completion sound
    await this.playTone(523, 0.2); // C
    setTimeout(() => this.playTone(659, 0.2), 250); // E
    setTimeout(() => this.playTone(784, 0.4), 500); // G
  }
}

export const audioManager = new AudioManager();
