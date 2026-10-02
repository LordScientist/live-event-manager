import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lcIcon from '../../assets/lc-icon.png';
import splashDecorTL from '../../assets/splash-decor-top-left.png';
import splashDecorBR from '../../assets/splash-decor-bottom-right.png';
import './SplashScreen.css';

export interface SplashScreenProps {
  onComplete?: () => void;
  autoAdvance?: boolean;
  duration?: number;
  standalone?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  autoAdvance = true,
  duration = 2400,
  standalone = false
}) => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else if (standalone) {
        navigate('/signup');
      }
    }, 420);
  };

  useEffect(() => {
    if (!autoAdvance) return;
    const timer = setTimeout(() => {
      handleFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoAdvance, duration]);

  return (
    <div
      className={`splash-screen ${isExiting ? 'splash-screen--exiting' : ''}`}
      onClick={handleFinish}
      role="banner"
      aria-label="Live Connect Splash Screen"
    >
      {/* Top Left Decorative Motif */}
      <img
        src={splashDecorTL}
        alt=""
        className="splash-decor-tl"
        aria-hidden="true"
      />

      {/* Bottom Right Decorative Motif */}
      <img
        src={splashDecorBR}
        alt=""
        className="splash-decor-br"
        aria-hidden="true"
      />

      {/* Center Branding Content */}
      <div className="splash-center-content">
        <img
          src={lcIcon}
          alt="Live Connect Logo"
          className="splash-logo-mark"
        />

        <div className="splash-brand-title">
          <span className="splash-brand-live">LIVE</span>{' '}
          <span className="splash-brand-connect">CONNECT</span>
        </div>

        <p className="splash-tagline">
          Where Events Come to life.
        </p>
      </div>

      {/* Subtle Mobile Tap Prompt */}
      <div className="splash-loader-bar">
        <span className="splash-loader-dot" />
        <span className="splash-loader-text">Tap to continue</span>
      </div>
    </div>
  );
};
