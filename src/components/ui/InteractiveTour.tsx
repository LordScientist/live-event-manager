import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Layers,
  Accessibility,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Presentation,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from './Button';
import { CodiToyAvatar } from '../presentation/CodiToyAvatar';
import { triggerConfetti } from '../../utils/confetti';
import { triggerLiveBroadcastShift } from '../../services/presentationService';
import { playCodiChirp, type CodiChirpMood } from '../../utils/codiAudio';
import './InteractiveTour.css';

interface TourStep {
  id: number;
  perkBadge: string;
  perkColor: 'blue' | 'purple' | 'amber' | 'emerald' | 'orange';
  title: string;
  subtitle: string;
  codiHeadline: string;
  codiComment: string;
  codiTakeaways: string[];
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    perkBadge: 'Perk 01: Zero Blackouts',
    perkColor: 'blue',
    icon: <Radio size={22} />,
    title: 'Zero Blackouts',
    subtitle: 'Sub-10s venue shift alerts',
    codiHeadline: 'No More Lost Crowds',
    codiComment:
      'When an auditorium shifts right before kickoff, the Dynamic Island HUD broadcasts the change in under 10 seconds with audio chimes and visual room diffs.',
    codiTakeaways: [
      'One real-time source of truth eliminates chaotic group chats and missed sessions.'
    ]
  },
  {
    id: 2,
    perkBadge: 'Perk 02: Multi-Role Power',
    perkColor: 'purple',
    icon: <Layers size={22} />,
    title: 'One Account, Any Role',
    subtitle: 'One login, endless flexibility',
    codiHeadline: 'Flexible Roles, One Profile',
    codiComment:
      'Speak on Friday, volunteer on Saturday, and attend on Sunday from a single account without multiple logins.',
    codiTakeaways: [
      'Your identity stays unified while your role adapts freely per event.'
    ]
  },
  {
    id: 3,
    perkBadge: 'Perk 03: Live Companion Hub',
    perkColor: 'amber',
    icon: <Clock size={22} />,
    title: 'Day-Of Radar',
    subtitle: 'Live status at a glance',
    codiHeadline: 'Ditch 10-Page PDF Schedules',
    codiComment:
      'Instantly see what is live right now, where to go next, and flash your digital check-in badge at a glance.',
    codiTakeaways: [
      'Instant live radar delivers stage status, room directions, and your pass in seconds.'
    ]
  },
  {
    id: 4,
    perkBadge: 'Perk 04: Built-in Inclusivity',
    perkColor: 'emerald',
    icon: <Accessibility size={22} />,
    title: 'Inclusivity by Design',
    subtitle: 'Transparent venues, private dignity',
    codiHeadline: 'Dignified Accessibility',
    codiComment:
      'View verified ramp and audio specs upfront, while dietary and mobility accommodations stay strictly confidential.',
    codiTakeaways: [
      'Full venue accessibility clarity without ever broadcasting personal needs publicly.'
    ]
  },
  {
    id: 5,
    perkBadge: 'Mission Complete: Ready to Roll!',
    perkColor: 'orange',
    icon: <Sparkles size={22} />,
    title: "You're All Set!",
    subtitle: 'Ready to explore or pitch',
    codiHeadline: 'Ready to Roll!',
    codiComment:
      'Explore live events now, or dive into our interactive 6-part pitch deck for the complete product story.',
    codiTakeaways: [
      'Instant access to campus events or the full interactive architectural pitch.'
    ]
  }
];

export const InteractiveTour: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('fresh_signup_tour_pending') === 'true';
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [codiMood, setCodiMood] = useState<CodiChirpMood>('wave');
  const [simulatedShiftActive, setSimulatedShiftActive] = useState(false);

  const lastNextClickTimeRef = useRef<number>(0);
  const moodResetTimerRef = useRef<number | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  // Inactivity sleep timer: if staying on a page without interaction for 20s, Codi falls asleep!
  const resetSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) window.clearTimeout(sleepTimerRef.current);

    sleepTimerRef.current = window.setTimeout(() => {
      setCodiMood('sleep');
      playCodiChirp('sleep');
    }, 20000); // 20s inactivity
  }, []);

  const handleUserActivity = useCallback(() => {
    setCodiMood((prev) => (prev === 'sleep' ? 'idle' : prev));
    resetSleepTimer();
  }, [resetSleepTimer]);

  // When onboarding opens: first wave at user, then settle to idle
  useEffect(() => {
    if (!isOpen) {
      if (sleepTimerRef.current) window.clearTimeout(sleepTimerRef.current);
      if (moodResetTimerRef.current) window.clearTimeout(moodResetTimerRef.current);
      return;
    }

    const welcomeTimer = window.setTimeout(() => {
      setCodiMood('idle');
    }, 2400);

    resetSleepTimer();

    return () => {
      window.clearTimeout(welcomeTimer);
      if (sleepTimerRef.current) window.clearTimeout(sleepTimerRef.current);
      if (moodResetTimerRef.current) window.clearTimeout(moodResetTimerRef.current);
    };
  }, [isOpen, resetSleepTimer]);

  const handleSimulateShift = () => {
    handleUserActivity();
    setSimulatedShiftActive(true);
    triggerLiveBroadcastShift({
      id: 'tour-shift-sim',
      eventName: 'KNUST Tech Conference 2026',
      oldVenue: 'Room 102 (Great Hall)',
      newVenue: 'Main Amphitheater • Hall A',
      reason: 'Overcapacity alert: Keynote relocated immediately to Main Amphitheater. Audio chime and live venue diff synchronized.',
      timestamp: 'Just now (live tour test)',
      urgency: 'high'
    });
  };

  useEffect(() => {
    // Support manual trigger from UI or console
    const handleManualOpen = () => {
      setCurrentStepIndex(0);
      setIsOpen(true);
      setCodiMood('wave');
      playCodiChirp('wave');
      setTimeout(() => setCodiMood('idle'), 2400);
    };

    window.addEventListener('open-codi-tour', handleManualOpen);
    return () => window.removeEventListener('open-codi-tour', handleManualOpen);
  }, []);

  useEffect(() => {
    // 2026 Celebration Microinteraction: Trigger confetti and celebrate on reaching the final step
    if (isOpen && currentStepIndex === TOUR_STEPS.length - 1) {
      playCodiChirp('celebrate');
      triggerConfetti(0.5, 0.45);
    }
  }, [currentStepIndex, isOpen]);

  const completeTour = () => {
    if (sleepTimerRef.current) window.clearTimeout(sleepTimerRef.current);
    if (moodResetTimerRef.current) window.clearTimeout(moodResetTimerRef.current);
    localStorage.removeItem('fresh_signup_tour_pending');
    localStorage.setItem('has_completed_tour', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    handleUserActivity();
    const now = Date.now();
    const delta = now - lastNextClickTimeRef.current;
    lastNextClickTimeRef.current = now;

    // Fast clicking (within 1 second) triggers confused mood
    const isRapidClick = delta > 0 && delta <= 1000;

    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      if (nextIndex === TOUR_STEPS.length - 1) {
        // Final step reached -> celebrate!
        setCodiMood('celebrate');
        playCodiChirp('celebrate');
      } else if (isRapidClick) {
        // Rapid clicks -> confused face!
        setCodiMood('confused');
        playCodiChirp('confused');
        if (moodResetTimerRef.current) window.clearTimeout(moodResetTimerRef.current);
        moodResetTimerRef.current = window.setTimeout(() => {
          setCodiMood('idle');
        }, 1600);
      } else {
        // Normal pace -> happy mood!
        setCodiMood('happy');
        playCodiChirp('happy');
        if (moodResetTimerRef.current) window.clearTimeout(moodResetTimerRef.current);
        moodResetTimerRef.current = window.setTimeout(() => {
          setCodiMood('idle');
        }, 1600);
      }
    } else {
      setCodiMood('celebrate');
      playCodiChirp('celebrate');
      triggerConfetti(0.5, 0.5);
      completeTour();
    }
  };

  const handleBack = () => {
    handleUserActivity();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setCodiMood('happy');
      if (moodResetTimerRef.current) window.clearTimeout(moodResetTimerRef.current);
      moodResetTimerRef.current = window.setTimeout(() => setCodiMood('idle'), 1400);
    }
  };

  const handleGoToPresentation = () => {
    triggerConfetti(0.5, 0.4);
    completeTour();
    navigate('/presentation');
  };

  const handleMascotClick = () => {
    handleUserActivity();
    setIsWaving(true);
    setCodiMood('wave');
    playCodiChirp('wave');
    setTimeout(() => {
      setIsWaving(false);
      setCodiMood('idle');
    }, 1800);
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFinalStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <div
      className="tour-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Codi Mascot Onboarding Walkthrough"
      onPointerMove={handleUserActivity}
    >
      <div className="tour-modal macos-window">
        {/* macOS Aurora Fluid Mesh Background */}
        <div className="macos-tour-mesh-bg" aria-hidden="true">
          <div className="macos-tour-mesh-blob macos-tour-mesh-blob--blue" />
          <div className="macos-tour-mesh-blob macos-tour-mesh-blob--amber" />
          <div className="macos-tour-mesh-blob macos-tour-mesh-blob--purple" />
        </div>

        {/* Top Header / Progress Track with macOS Window Chrome */}
        <div className="tour-modal__header">
          <div className="tour-progress-bar">
            <div
              className="tour-progress-bar__fill"
              style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
          <div className="tour-header-meta">
            <div className="tour-header-controls">
              {/* macOS Traffic Lights Controls */}
              <div className="macos-traffic-lights" aria-label="macOS Window Controls">
                <button
                  type="button"
                  className="macos-traffic-dot macos-traffic-dot--close"
                  onClick={completeTour}
                  title="Close onboarding"
                  aria-label="Close onboarding"
                >
                  <span className="macos-traffic-glyph">✕</span>
                </button>
                <span className="macos-traffic-dot macos-traffic-dot--minimize" title="Minimize">
                  <span className="macos-traffic-glyph">−</span>
                </span>
                <button
                  type="button"
                  className="macos-traffic-dot macos-traffic-dot--zoom"
                  onClick={handleGoToPresentation}
                  title="Open Full Presentation Deck"
                  aria-label="Open Full Presentation Deck"
                >
                  <span className="macos-traffic-glyph">⤢</span>
                </button>
              </div>
            </div>

            <div className="tour-header-badges">
              <span className={`tour-perk-badge tour-perk-badge--${currentStep.perkColor}`}>
                {currentStep.perkBadge}
              </span>
              <span className="tour-step-counter">
                {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>

            <div className="tour-header-actions">
              <button
                type="button"
                className="tour-deck-shortcut-btn"
                onClick={handleGoToPresentation}
                title="Explore Full Presentation Deck"
              >
                <Presentation size={13} />
                <span className="tour-deck-btn-label">Full Deck</span>
              </button>
              <button
                type="button"
                className="tour-close-btn"
                onClick={completeTour}
                aria-label="Skip walkthrough"
                title="Skip walkthrough"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Step Body Featuring Codi the Toy Companion */}
        <div className="tour-modal__body">
          {/* Codi Avatar and Dialogue Section */}
          <div className="tour-mascot-section">
            <div className="tour-mascot-avatar-col">
              <CodiToyAvatar
                size="md"
                mood={codiMood}
                isWaving={isWaving}
                onClick={handleMascotClick}
                title="I'm Codi! Click me to say hi!"
              />
              <span className="tour-mascot-hint">Click me to wave!</span>
            </div>

            {/* Mascot Speech Bubble delivering the Presentation commentary */}
            <div key={currentStepIndex} className="tour-speech-bubble">
              <div className="tour-speech-bubble__header">
                <span className="tour-speech-tag">
                  <Sparkles size={13} className="tour-sparkle-icon" />
                  <span>Codi's Commentary</span>
                </span>
                <span className="tour-step-tagline">{currentStep.subtitle}</span>
              </div>

              <h3 className="tour-speech-title">{currentStep.codiHeadline}</h3>
              <p className="tour-speech-text">{currentStep.codiComment}</p>

              {currentStep.id === 1 && (
                <div className="tour-island-trigger-container">
                  <button
                    type="button"
                    className="tour-island-trigger-btn luminous-bloom luminous-bloom--amber"
                    onClick={handleSimulateShift}
                  >
                    <Radio size={14} className="tour-island-btn-icon animate-pulse" />
                    <span>Simulate Shift (Test Dynamic Island)</span>
                  </button>
                  {simulatedShiftActive && (
                    <div className="tour-island-trigger-hint">
                      <Sparkles size={12} className="tour-sparkle-amber" />
                      <span>Live HUD triggered! Look at the top Dynamic Island bouncing with chime ⬆️</span>
                    </div>
                  )}
                </div>
              )}

              {/* Triangle Tail pointing toward Codi */}
              <div className="tour-speech-tail" aria-hidden="true" />
            </div>
          </div>

          {/* Key Insights / Architecture Takeaways */}
          <div className="tour-takeaways-card">
            <h4 className="tour-takeaways-heading">
              <span>Why this matters for your campus experience</span>
            </h4>
            <div className="tour-takeaways-list">
              {currentStep.codiTakeaways.map((point, idx) => (
                <div key={idx} className="tour-takeaway-item">
                  <CheckCircle2 size={16} className="tour-takeaway-icon" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="tour-modal__footer">
          <div className="tour-step-dots">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`tour-dot ${
                  i === currentStepIndex
                    ? 'tour-dot--active'
                    : i < currentStepIndex
                    ? 'tour-dot--completed'
                    : ''
                }`}
                onClick={() => {
                  handleUserActivity();
                  setCurrentStepIndex(i);
                  if (i === TOUR_STEPS.length - 1) {
                    setCodiMood('celebrate');
                  } else {
                    setCodiMood('happy');
                    if (moodResetTimerRef.current) window.clearTimeout(moodResetTimerRef.current);
                    moodResetTimerRef.current = window.setTimeout(() => setCodiMood('idle'), 1600);
                  }
                }}
                aria-label={`Jump to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="tour-actions">
            {currentStepIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                leftIcon={<ArrowLeft size={14} />}
              >
                Back
              </Button>
            )}

            {isFinalStep ? (
              <div className="tour-final-actions">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleGoToPresentation}
                  leftIcon={<Presentation size={15} />}
                >
                  Go to Presentation with Codi
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={completeTour}
                >
                  Enter App
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ArrowRight size={14} />}
              >
                Next Perk
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
