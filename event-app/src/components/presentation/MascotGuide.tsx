import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { CodiToyAvatar } from './CodiToyAvatar';
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
    headline: "Zero Blackouts Architecture!",
    message: "Floating Dynamic Island HUD + Role Decoupling! The HUD floats at the top with 3 spring physics states while your login seamlessly handles Speaker, Volunteer, or Attendee passes.",
    mood: "happy"
  },
  {
    slideId: 3,
    headline: "Sub-10s Room Diff Engine!",
    message: "Watch this: Organizer shifts Room 102 to Main Amphitheater, and BAM—Dynamic Island chimes with Web Audio and shows the before/after room diff in under 10 seconds!",
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
      <div className="mascot-character-wrapper">
        <CodiToyAvatar
          isWaving={isWaving}
          onClick={handleMascotClick}
          size="md"
          title="Hi! I'm Codi, your Live Connect guide. Click me to say hi!"
        />

        {isMinimized && (
          <button
            type="button"
            className="mascot-maximize-btn"
            onClick={() => setIsMinimized(false)}
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
