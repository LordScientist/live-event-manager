import React, { useState, useEffect, useRef, useCallback } from 'react';
import catWebp from '../../assets/cat.webp';
import { playCodiChirp, type CodiChirpMood } from '../../utils/codiAudio';
import './CodiToyAvatar.css';

export interface CodiToyAvatarProps {
  isWaving?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'idle' | 'happy' | 'wave' | 'curious' | 'celebrate' | 'thinking' | 'alert';
  className?: string;
  title?: string;
  interactive?: boolean;
  showTooltip?: boolean;
}

const CODI_QUOTES = [
  "Purr... I'm Codi, your Live Connect companion! 🐾",
  "Zero blackouts guaranteed on our campus!",
  "Tip: Dynamic Island broadcasts room shifts in < 10s!",
  "Switch roles freely — Attendee, Speaker, or Volunteer!",
  "All venue routes & accessibility specs verified! Meow!",
  "Tap me anytime for live tips and event perks!"
];

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

  // Pointer tracking for interactive cat tilt and glance
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
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

  // Click interaction: audio chirp + celebration hop + personality speech tip
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;

    setIsReacting(true);
    const nextMoods: CodiChirpMood[] = ['wave', 'happy', 'celebrate', 'curious'];
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
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (speechTimerRef.current) window.clearTimeout(speechTimerRef.current);
    };
  }, []);

  const moodEffective = activeMood;
  const isHappy = moodEffective === 'happy' || moodEffective === 'celebrate';
  const isWink = moodEffective === 'wave';
  const isAlert = moodEffective === 'alert';

  return (
    <div
      ref={containerRef}
      className={`codi-cat-avatar codi-cat-avatar--${size} ${isReacting ? 'codi-cat-avatar--reacting' : ''} ${className}`}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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

      {/* Celebration Paw / Sparkle Burst on click */}
      {isReacting && (
        <div className="codi-sparkles-burst" aria-hidden="true">
          <span className="codi-sparkle-dot codi-sparkle-dot--1">🐾</span>
          <span className="codi-sparkle-dot codi-sparkle-dot--2">✨</span>
          <span className="codi-sparkle-dot codi-sparkle-dot--3">💖</span>
        </div>
      )}

      {/* Cat Mascot Wrapper */}
      <div className="codi-cat-stage">
        {/* Ambient Halo behind Cat */}
        <div className="codi-cat-aura" aria-hidden="true" />

        {/* High-Resolution Cat Mascot Image */}
        <img
          src={catWebp}
          alt="Codi the Cat Mascot"
          className="codi-cat-img"
          draggable={false}
          loading="eager"
        />

        {/* Pulsing Live Connect Collar Charm */}
        <div className="codi-collar-bell-glow" aria-hidden="true">
          <span className="codi-collar-bell-dot" />
        </div>

        {/* Expressive Animated Cat Eye Overlays */}
        <div className="codi-cat-eyes-overlay" aria-hidden="true">
          {/* Happy Arched Eyes ^ ^ */}
          {isHappy && (
            <svg viewBox="0 0 100 40" className="codi-cat-eyes-svg codi-cat-eyes--happy">
              <path d="M22,26 Q35,8 48,26" fill="none" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M52,26 Q65,8 78,26" fill="none" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          )}

          {/* Wink Mode ^ _ ✦ */}
          {isWink && (
            <svg viewBox="0 0 100 40" className="codi-cat-eyes-svg codi-cat-eyes--wink">
              <path d="M22,26 Q35,10 48,26" fill="none" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
              <polygon points="65,10 67,18 75,20 67,22 65,30 63,22 55,20 63,18" fill="#ff7a1a" />
            </svg>
          )}

          {/* Alert Eyes ! ! */}
          {isAlert && (
            <svg viewBox="0 0 100 40" className="codi-cat-eyes-svg codi-cat-eyes--alert">
              <circle cx="35" cy="20" r="10" fill="#ff5722" />
              <circle cx="35" cy="20" r="4.5" fill="#ffffff" />
              <circle cx="65" cy="20" r="10" fill="#ff5722" />
              <circle cx="65" cy="20" r="4.5" fill="#ffffff" />
            </svg>
          )}
        </div>

        {/* Magnetic Paw Floating Badge */}
        <div className={`codi-cat-paw-wave ${moodEffective === 'wave' || isWaving ? 'codi-cat-paw-wave--active' : ''}`} aria-hidden="true">
          <span className="codi-cat-paw-emoji">🐾</span>
        </div>
      </div>
    </div>
  );
};

export default CodiToyAvatar;
