/**
 * Web Audio API synthesizer for Edge Trader Sanctuary
 * Generates ambient soundscapes and gentle meditation chimes in real-time.
 * 100% offline, zero external audio asset dependencies, zero network requests.
 */

export type SoundscapeType = 'bowl' | 'ocean' | 'rain' | 'forest' | 'brown' | 'alpha' | 'silence';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private lfoNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentType: SoundscapeType | null = null;
  private volume: number = 0.5;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentType(): SoundscapeType | null {
    return this.currentType;
  }

  /**
   * Play a gentle meditation transition chime (Crystal Singing Bowl tone at 432 Hz)
   */
  public playChime(freq: number = 432): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);

      const chimeVol = this.volume * 0.45;
      chimeGain.gain.setValueAtTime(0, ctx.currentTime);
      chimeGain.gain.linearRampToValueAtTime(chimeVol, ctx.currentTime + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

      osc.connect(chimeGain);
      overtone.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      osc.start();
      overtone.start();
      osc.stop(ctx.currentTime + 3.1);
      overtone.stop(ctx.currentTime + 3.1);
    } catch {
      // AudioContext not supported or allowed
    }
  }

  /**
   * Start an ambient soundscape
   */
  public startSoundscape(type: SoundscapeType): void {
    if (type === 'silence') {
      this.stop();
      this.isPlaying = true;
      this.currentType = 'silence';
      return;
    }

    try {
      const ctx = this.getAudioContext();
      this.stop();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.3);
      masterGain.connect(ctx.destination);
      this.gainNode = masterGain;

      if (type === 'brown') {
        // Deep warm brown noise (calming frequency for focus & emotional centering)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        this.currentSource = whiteNoise;
      } else if (type === 'ocean') {
        // Ocean waves: filtered noise modulated with gentle 0.12 Hz swell
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.04 * white) / 1.04;
          lastOut = output[i];
          output[i] *= 2.8;
        }

        const surfSource = ctx.createBufferSource();
        surfSource.buffer = noiseBuffer;
        surfSource.loop = true;

        const waveFilter = ctx.createBiquadFilter();
        waveFilter.type = 'bandpass';
        waveFilter.frequency.setValueAtTime(450, ctx.currentTime);
        waveFilter.Q.setValueAtTime(1.0, ctx.currentTime);

        // LFO for surf wave swell
        const waveGain = ctx.createGain();
        waveGain.gain.setValueAtTime(0.4, ctx.currentTime);

        const swellLfo = ctx.createOscillator();
        const swellGain = ctx.createGain();
        swellLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec per wave
        swellGain.gain.setValueAtTime(0.3, ctx.currentTime);

        swellLfo.connect(swellGain);
        swellGain.connect(waveGain.gain);
        swellLfo.start();
        this.lfoNode = swellLfo;

        surfSource.connect(waveFilter);
        waveFilter.connect(waveGain);
        waveGain.connect(masterGain);
        surfSource.start();
        this.currentSource = surfSource;
      } else if (type === 'rain') {
        // Filtered pink noise / gentle rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'lowpass';
        bandpass.frequency.setValueAtTime(850, ctx.currentTime);

        rainSource.connect(bandpass);
        bandpass.connect(masterGain);
        rainSource.start();
        this.currentSource = rainSource;
      } else if (type === 'forest') {
        // Quiet forest / soft breeze
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.03 * white) / 1.03;
          lastOut = output[i];
          output[i] *= 2.0;
        }

        const windSource = ctx.createBufferSource();
        windSource.buffer = noiseBuffer;
        windSource.loop = true;

        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.setValueAtTime(500, ctx.currentTime);
        windFilter.Q.setValueAtTime(0.7, ctx.currentTime);

        windSource.connect(windFilter);
        windFilter.connect(masterGain);
        windSource.start();
        this.currentSource = windSource;
      } else if (type === 'bowl') {
        // Ambient Singing Bowl resonance at 432 Hz with warm gentle harmonics
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const bowlGain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(432, ctx.currentTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(432 * 1.5, ctx.currentTime); // 648 Hz fifth

        // Gentle vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
        lfo.connect(osc1.frequency);
        lfo.start();
        this.lfoNode = lfo;

        bowlGain.gain.setValueAtTime(0.25, ctx.currentTime);

        osc1.connect(bowlGain);
        osc2.connect(bowlGain);
        bowlGain.connect(masterGain);

        osc1.start();
        osc2.start();
        this.currentSource = osc1;
      } else if (type === 'alpha') {
        const leftOsc = ctx.createOscillator();
        const rightOsc = ctx.createOscillator();
        leftOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(200, ctx.currentTime);
        rightOsc.type = 'sine';
        rightOsc.frequency.setValueAtTime(210, ctx.currentTime);

        const leftGain = ctx.createGain();
        leftGain.gain.setValueAtTime(0.2, ctx.currentTime);
        leftOsc.connect(leftGain);
        leftGain.connect(masterGain);
        rightOsc.connect(leftGain);

        leftOsc.start();
        rightOsc.start();
        this.currentSource = leftOsc;
      }

      this.isPlaying = true;
      this.currentType = type;
    } catch (err) {
      console.warn('Unable to play soundscape:', err);
    }
  }

  public pause(): void {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
      } catch {
        // Ignore
      }
    }
    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch {
        // Ignore
      }
    }
    this.isPlaying = false;
  }

  public resume(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch {
        // Ignore
      }
    }
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
      } catch {
        // Ignore
      }
    }
    this.isPlaying = true;
  }

  public stop(): void {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
      } catch {
        // Context might be closed
      }
    }
    if (this.lfoNode) {
      try {
        (this.lfoNode as OscillatorNode).stop();
      } catch {
        // Already stopped
      }
      this.lfoNode = null;
    }
    if (this.currentSource) {
      try {
        (this.currentSource as AudioScheduledSourceNode).stop();
      } catch {
        // Already stopped
      }
      this.currentSource = null;
    }
    this.isPlaying = false;
    this.currentType = null;
  }
}

export const soundscapeEngine = new SoundscapeEngine();
