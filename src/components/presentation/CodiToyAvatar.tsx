import React, { useState, useEffect, useRef, useCallback } from 'react';
import codiIdle from '../../assets/codi/codi-idle.webp';
import codiWave from '../../assets/codi/codi-wave.webp';
import codiHappy from '../../assets/codi/codi-happy.webp';
import codiConfused from '../../assets/codi/codi-confused.webp';
import codiSleep from '../../assets/codi/codi-sleep.webp';
import codiCelebrate from '../../assets/codi/codi-celebrate.webp';
import { playCodiChirp, type CodiChirpMood } from '../../utils/codiAudio';
import './CodiToyAvatar.css';

export interface CodiToyAvatarProps {
  isWaving?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: CodiChirpMood;
  className?: string;
  title?: string;
  interactive?: boolean;
  showTooltip?: boolean;
}

const CODI_QUOTES = [
  "Purr... I'm Codi, your Live Connect companion!",
  "Zero blackouts guaranteed on our campus!",
  "Tip: Dynamic Island broadcasts room shifts in < 10s!",
  "Switch roles freely — Attendee, Speaker, or Volunteer!",
  "All venue routes & accessibility specs verified! Meow!",
  "Tap me anytime for live tips and event perks!"
];

const MOOD_ANIMATIONS: Record<CodiChirpMood, string> = {
  idle: codiIdle,
  wave: codiWave,
  happy: codiHappy,
  confused: codiConfused,
  curious: codiConfused,
  thinking: codiConfused,
  sleep: codiSleep,
  celebrate: codiCelebrate,
  alert: codiCelebrate
};

export const CodiToyAvatar: React.FC<CodiToyAvatarProps> = ({
  isWaving = false,
  onClick,
  size = 'md',
  mood: propMood,
  className = '',
  title = "Hi! I'm Codi the Cat, your Live Connect companion! Click me to interact!",
  interactive = true,
  showTooltip = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickMood, setClickMood] = useState<CodiChirpMood | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [isReacting, setIsReacting] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const speechTimerRef = useRef<number | null>(null);

  const activeMood: CodiChirpMood = clickMood || propMood || (isWaving ? 'wave' : 'idle');

  // Desktop pointer tracking for interactive cat tilt and glance
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current || e.pointerType !== 'mouse') return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 1.5)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 1.5)));

    setTilt({
      rotateX: -normY * 12,
      rotateY: normX * 14,
      scale: 1.05
    });
  }, [interactive]);

  const handlePointerLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  const handlePointerDown = useCallback(() => {
    if (!interactive) return;
    setTilt((prev) => ({ ...prev, scale: 0.94 }));
  }, [interactive]);

  const handlePointerUp = useCallback(() => {
    if (!interactive) return;
    setTilt((prev) => ({ ...prev, scale: 1.02 }));
  }, [interactive]);

  // Click interaction: audio chirp + celebration hop + personality speech tip
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;

    // Mobile tactile haptic vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Fallback silently if not supported
      }
    }

    setIsReacting(true);
    const nextMoods: CodiChirpMood[] = ['wave', 'happy', 'celebrate', 'curious', 'confused'];
    const nextMood = nextMoods[Math.floor(Math.random() * nextMoods.length)];
    setClickMood(nextMood);

    // Play synthesized cat chirp
    playCodiChirp(nextMood);

    // Cycle friendly companion tips
    if (showTooltip) {
      setActiveQuoteIndex((prev) => (prev + 1) % CODI_QUOTES.length);
      setShowSpeechBubble(true);
      if (speechTimerRef.current) window.clearTimeout(speechTimerRef.current);
      speechTimerRef.current = window.setTimeout(() => {
        setShowSpeechBubble(false);
      }, 4200);
    }

    if (onClick) {
      onClick();
    }

    setTimeout(() => {
      setIsReacting(false);
      setClickMood(null);
    }, 1400);
  };

  useEffect(() => {
    return () => {
      if (speechTimerRef.current) window.clearTimeout(speechTimerRef.current);
    };
  }, []);

  const moodEffective = activeMood;

  return (
    <div
      ref={containerRef}
      className={`codi-cat-avatar codi-cat-avatar--${size} ${isReacting ? 'codi-cat-avatar--reacting' : ''} ${className}`}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={title}
      aria-label="Codi the Cat Mascot Companion"
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      style={{
        transform: `perspective(600px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`
      }}
    >
      {/* Speech Bubble on Click */}
      {showSpeechBubble && (
        <div className="codi-speech-popup" role="status" aria-live="polite">
          <span className="codi-speech-popup__text">{CODI_QUOTES[activeQuoteIndex]}</span>
          <span className="codi-speech-popup__arrow" />
        </div>
      )}

      {/* Cat Mascot Wrapper */}
      <div className={`codi-cat-stage ${moodEffective === 'sleep' ? 'codi-cat-stage--sleep' : ''}`}>
        {/* Ambient Halo behind Cat */}
        <div className="codi-cat-aura" aria-hidden="true" />

        {/* High-Resolution Animated Transparent Cat Mascot */}
        <img
          key={moodEffective}
          src={MOOD_ANIMATIONS[moodEffective] || codiIdle}
          alt={`Codi the Cat Mascot (${moodEffective})`}
          className={`codi-cat-img codi-cat-img--${moodEffective}`}
          draggable={false}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default CodiToyAvatar;
