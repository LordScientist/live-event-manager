import React from 'react';
import './CodiToyAvatar.css';

interface CodiToyAvatarProps {
  isWaving?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

export const CodiToyAvatar: React.FC<CodiToyAvatarProps> = ({
  isWaving = false,
  onClick,
  size = 'md',
  className = '',
  title = "Hi! I'm Codi, your Live Connect companion! Click me to say hi!"
}) => {
  return (
    <div
      className={`codi-toy-avatar codi-toy-avatar--${size} ${isWaving ? 'codi-toy-avatar--wave' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={title}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <svg
        viewBox="0 0 120 130"
        className="codi-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="codiRobotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="codiRobotScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="codiRobotCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <filter id="codiCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating Base Shadow / Hover Thruster */}
        <ellipse cx="60" cy="122" rx="28" ry="6" fill="rgba(37, 99, 235, 0.28)" className="codi-thruster-glow" />

        {/* Floating Arms */}
        <g className="codi-arm codi-arm--left">
          <rect x="18" y="66" width="12" height="24" rx="6" fill="#94a3b8" />
          <circle cx="24" cy="94" r="6" fill="#3b82f6" />
        </g>
        <g className="codi-arm codi-arm--right">
          <rect x="90" y="66" width="12" height="24" rx="6" fill="#94a3b8" />
          <circle cx="96" cy="94" r="6" fill="#3b82f6" />
        </g>

        {/* Robot Torso */}
        <rect x="34" y="60" width="52" height="46" rx="14" fill="url(#codiRobotBodyGrad)" stroke="#94a3b8" strokeWidth="2" />

        {/* Glowing Reactor Core */}
        <circle cx="60" cy="83" r="11" fill="url(#codiRobotCoreGrad)" filter="url(#codiCoreGlow)" className="codi-core" />
        <circle cx="60" cy="83" r="6" fill="#ffffff" opacity="0.85" />

        {/* Antenna with Pulsing Waves */}
        <line x1="60" y1="28" x2="60" y2="16" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="14" r="5" fill="#f97316" className="codi-antenna-light" />
        <path d="M50,10 A14,14 0 0,1 70,10" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" className="codi-antenna-wave codi-antenna-wave--1" />
        <path d="M44,5 A22,22 0 0,1 76,5" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" className="codi-antenna-wave codi-antenna-wave--2" />

        {/* Robot Head */}
        <rect x="30" y="24" width="60" height="42" rx="16" fill="url(#codiRobotBodyGrad)" stroke="#94a3b8" strokeWidth="2" />

        {/* Ear Bolts */}
        <rect x="25" y="38" width="6" height="14" rx="3" fill="#64748b" />
        <rect x="89" y="38" width="6" height="14" rx="3" fill="#64748b" />

        {/* Visor Screen Face */}
        <rect x="38" y="32" width="44" height="26" rx="9" fill="url(#codiRobotScreenGrad)" />

        {/* LED Expressive Eyes */}
        <g className="codi-eyes">
          <ellipse cx="49" cy="45" rx="5" ry="6" fill="#38bdf8" className="codi-eye codi-eye--left" />
          <ellipse cx="71" cy="45" rx="5" ry="6" fill="#38bdf8" className="codi-eye codi-eye--right" />
          <circle cx="51" cy="43" r="1.5" fill="#ffffff" />
          <circle cx="73" cy="43" r="1.5" fill="#ffffff" />
        </g>

        {/* Cheerful Smile Line */}
        <path d="M55,53 Q60,57 65,53" fill="none" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
};
