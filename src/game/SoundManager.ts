export class SoundManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;

  init() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isEnabled = true;
    } catch (e) {
      console.warn("Audio Context failed to initialize", e);
      this.isEnabled = false;
    }
  }

  playFlap() {
    if (!this.isEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playScore() {
    if (!this.isEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Retro coin/point sound (two rapid beeps)
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.setTargetAtTime(0, this.ctx.currentTime + 0.1, 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playHit() {
    if (!this.isEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Retro hit sound (frequency drops rapidly)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}
