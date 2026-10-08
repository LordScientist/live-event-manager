import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import './MascotGuide.css';

interface MascotGuideProps {
  currentSlide: number;
}

const MASCOT_DIALOGUES = [
  {
    slideId: 0,
    headline: "The WhatsApp Nightmare!",
    message: "Ever tried moving 300 students across campus through 6 muted group chats? Pure chaos! Live Connect stops the blackout.",
    mood: "alert"
  },
  {
    slideId: 1,
    headline: "Zero Bloat Policy",
    message: "No ticket scalpers, no 20-page forms, no payment spam. We built a laser-focused coordination engine for the actual day.",
    mood: "confident"
  },
  {
    slideId: 2,
    headline: "Role Freedom!",
    message: "Speaker on Friday, Volunteer on Saturday, Attendee on Sunday? Your login handles all your roles without locked accounts!",
    mood: "happy"
  },
  {
    slideId: 3,
    headline: "Sub-10s Chain Reaction",
    message: "Watch this: Organizer edits Room 204 to Great Hall, and BAM—an urgent Venue Shift banner lands on attendee screens instantly!",
    mood: "excited"
  },
  {
    slideId: 4,
    headline: "Dignified Inclusivity",
    message: "Public venue specs so nobody guesses ramps. Private intake so nobody has to broadcast medical needs to group chats.",
    mood: "caring"
  },
  {
    slideId: 5,
    headline: "Mission Accomplished!",
    message: "0 missed rooms, 0 confused speakers, and 1 single shared truth. That's how we run flawless campus events!",
    mood: "celebrate"
  }
];

export const MascotGuide: React.FC<MascotGuideProps> = ({ currentSlide }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [dialogueKey, setDialogueKey] = useState(0);

  const dialogue = MASCOT_DIALOGUES[currentSlide] || MASCOT_DIALOGUES[0];

  useEffect(() => {
    // Re-trigger dialogue bubble pop-in on slide change
    setDialogueKey((prev) => prev + 1);
  }, [currentSlide]);

  const handleMascotClick = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 900);
  };

  return (
    <aside className={`mascot-container ${isMinimized ? 'mascot-container--minimized' : ''}`} aria-label="Codi Mascot Guide">
      {/* Speech Bubble */}
      {!isMinimized && (
        <div key={dialogueKey} className="mascot-bubble" role="status" aria-live="polite">
          <div className="mascot-bubble__header">
            <span className="mascot-tag">
              <Sparkles size={12} className="mascot-sparkle" />
              <span>Codi's Guide</span>
            </span>
            <button
              type="button"
              className="mascot-bubble__toggle-btn"
              onClick={() => setIsMinimized(true)}
              title="Minimize guide"
              aria-label="Minimize Codi Guide"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <h4 className="mascot-bubble__title">{dialogue.headline}</h4>
          <p className="mascot-bubble__text">{dialogue.message}</p>
          <div className="mascot-bubble__tip">
            <span>Tip: Use ← / → keys to glide through slides</span>
          </div>
          <div className="mascot-bubble__tail" />
        </div>
      )}

      {/* Interactive Toy Mascot Character */}
      <div
        className={`mascot-character ${isWaving ? 'mascot-character--wave' : ''}`}
        onClick={handleMascotClick}
        title="Hi! I'm Codi, your Live Connect guide. Click me to say hi!"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleMascotClick();
          }
        }}
      >
        <svg
          viewBox="0 0 120 130"
          className="mascot-svg"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Body gradients */}
            <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <linearGradient id="robotScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="robotCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Floating Base Shadow / Hover Thruster */}
          <ellipse cx="60" cy="122" rx="28" ry="6" fill="rgba(37, 99, 235, 0.25)" className="mascot-thruster-glow" />

          {/* Robot Floating Arms */}
          <g className="mascot-arm mascot-arm--left">
            <rect x="18" y="66" width="12" height="24" rx="6" fill="#94a3b8" />
            <circle cx="24" cy="94" r="6" fill="#3b82f6" />
          </g>
          <g className="mascot-arm mascot-arm--right">
            <rect x="90" y="66" width="12" height="24" rx="6" fill="#94a3b8" />
            <circle cx="96" cy="94" r="6" fill="#3b82f6" />
          </g>

          {/* Robot Torso */}
          <rect x="34" y="60" width="52" height="46" rx="14" fill="url(#robotBodyGrad)" stroke="#94a3b8" strokeWidth="2" />

          {/* Glowing Reactor Core */}
          <circle cx="60" cy="83" r="11" fill="url(#robotCoreGrad)" filter="url(#coreGlow)" className="mascot-core" />
          <circle cx="60" cy="83" r="6" fill="#ffffff" opacity="0.8" />

          {/* Antenna with Pulsing Broadcast Waves */}
          <line x1="60" y1="28" x2="60" y2="16" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="14" r="5" fill="#f97316" className="mascot-antenna-light" />
          <path d="M50,10 A14,14 0 0,1 70,10" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" className="antenna-wave antenna-wave--1" />
          <path d="M44,5 A22,22 0 0,1 76,5" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" className="antenna-wave antenna-wave--2" />

          {/* Robot Head */}
          <rect x="30" y="24" width="60" height="42" rx="16" fill="url(#robotBodyGrad)" stroke="#94a3b8" strokeWidth="2" />

          {/* Ear Bolts */}
          <rect x="25" y="38" width="6" height="14" rx="3" fill="#64748b" />
          <rect x="89" y="38" width="6" height="14" rx="3" fill="#64748b" />

          {/* Visor Screen Face */}
          <rect x="38" y="32" width="44" height="26" rx="9" fill="url(#robotScreenGrad)" />

          {/* LED Expressive Eyes */}
          <g className="mascot-eyes">
            <ellipse cx="49" cy="45" rx="5" ry="6" fill="#38bdf8" className="mascot-eye mascot-eye--left" />
            <ellipse cx="71" cy="45" rx="5" ry="6" fill="#38bdf8" className="mascot-eye mascot-eye--right" />
            {/* Eye glints */}
            <circle cx="51" cy="43" r="1.5" fill="#ffffff" />
            <circle cx="73" cy="43" r="1.5" fill="#ffffff" />
          </g>

          {/* Smile line */}
          <path d="M56,53 Q60,56 64,53" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {isMinimized && (
          <button
            type="button"
            className="mascot-maximize-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
            title="Expand Codi Guide"
            aria-label="Expand Codi Guide"
          >
            <ChevronUp size={14} />
          </button>
        )}
      </div>
    </aside>
  );
};
export default MascotGuide;
