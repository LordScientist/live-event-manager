/**
 * Codi Mascot Synthetic Web Audio Engine
 * Zero-dependency, 100% offline cat chirps, purrs, and robotic chimes
 * Inspired by friendly mascot companions
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export type CodiChirpMood =
  | 'idle'
  | 'happy'
  | 'wave'
  | 'celebrate'
  | 'thinking'
  | 'curious'
  | 'alert'
  | 'confused'
  | 'sleep';

/**
 * Play a cute synthesized melodic cat purr / kitten chirp for Codi
 */
export function playCodiChirp(mood: CodiChirpMood = 'happy'): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    switch (mood) {
      case 'celebrate': {
        // Joyful ascending arpeggio with sweet bell harmonics
        const notes = [1046.5, 1318.5, 1567.98, 2093.0];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + idx * 0.055;
          const noteEnd = noteStart + 0.14;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteStart);

          gain.gain.setValueAtTime(0.001, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteStart);
          osc.stop(noteEnd);
        });
        break;
      }

      case 'wave': {
        // Playful kitten chirp: 750Hz rising to 1350Hz then soft slide
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(1380, now + 0.09);
        osc.frequency.exponentialRampToValueAtTime(1020, now + 0.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'thinking': {
        // Curious rising mew: 620Hz -> 980Hz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.18);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'alert': {
        // High-tech alert double chirp: 960Hz -> 1440Hz
        [960, 1440].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const tStart = now + idx * 0.065;
          const tEnd = tStart + 0.08;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, tStart);
          gain.gain.setValueAtTime(0.001, tStart);
          gain.gain.exponentialRampToValueAtTime(0.13, tStart + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, tEnd);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(tStart);
          osc.stop(tEnd);
        });
        break;
      }

      case 'confused': {
        // Quizzical double chirp: 720Hz -> 540Hz -> 820Hz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(720, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(860, now + 0.18);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'sleep': {
        // Soft soothing rhythmic purr: low 110Hz with gentle pulse
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(85, now + 0.35);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }

      case 'happy':
      default: {
        // Sweet purring chirp: 880Hz -> 1560Hz -> 1320Hz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1560, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.18);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
    }
  } catch {
    // Graceful fallback for audio restrictions
  }
}
