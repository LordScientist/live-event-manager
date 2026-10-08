import React, { useState, useEffect } from 'react';
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
    title: 'The Campus Spark',
    subtitle: 'Real-time coordination without group chat chaos',
    codiHeadline: 'The WhatsApp Nightmare Ends Here!',
    codiComment:
      "Ever tried moving 300 students when a room changes 20 minutes before kickoff through 6 muted group chats? Pure chaos! In Live Connect, the moment an organizer edits a room, everyone's screen shifts simultaneously in under 10 seconds. Zero blackouts!",
    codiTakeaways: [
      'Instant broadcast banners for sudden venue & room shifts',
      'One shared truth across organizers, speakers, and attendees',
      'Zero frantic phone calls or guessing where to go'
    ]
  },
  {
    id: 2,
    perkBadge: 'Perk 02: Multi-Role Power',
    perkColor: 'purple',
    icon: <Layers size={22} />,
    title: 'One Account, Any Role',
    subtitle: 'Your account is who you are, your role is what you do',
    codiHeadline: 'You Are Who You Are, Not Just One Rigid Role!',
    codiComment:
      'Most campus platforms lock you down into a rigid account type. Not us! Your login is simply you. You can speak on Friday, volunteer on Saturday, and attend on Sunday—all from one single account without ever creating multiple logins!',
    codiTakeaways: [
      'Your role belongs to each event pass, never your login identity',
      'One-click switch to Manager mode to organize your own events',
      'Pre-filled profile saves your details across all registrations'
    ]
  },
  {
    id: 3,
    perkBadge: 'Perk 03: Live Companion Hub',
    perkColor: 'amber',
    icon: <Clock size={22} />,
    title: 'Day-Of Radar',
    subtitle: 'The 3 critical questions answered in seconds',
    codiHeadline: 'Your Live Radar on Event Day!',
    codiComment:
      "On event day, nobody has time to dig through 10-page PDF schedules. Your Live Companion hub answers the only three things you care about: 1) What's live right now? 2) Where do I need to be? 3) Did anything shift? Instant answers without scrolling!",
    codiTakeaways: [
      'Pulsing live indicators for current sessions in progress',
      'Automatic room comparison diffs if an auditorium shifts',
      'One-tap digital badge ready at the check-in door'
    ]
  },
  {
    id: 4,
    perkBadge: 'Perk 04: Built-in Inclusivity',
    perkColor: 'emerald',
    icon: <Accessibility size={22} />,
    title: 'Inclusivity by Design',
    subtitle: 'Public venue clarity, private personal dignity',
    codiHeadline: 'Dignity for Every Single Participant!',
    codiComment:
      'Nobody should ever have to broadcast private medical or accessibility needs in a giant group chat just to get a ramp or dietary meal. We publish venue accessibility specs upfront and handle your personal accommodations confidentially.',
    codiTakeaways: [
      'Verified wheelchair ramps and audio accessibility specs',
      'Confidential intake for sensory, mobility, and ASL requests',
      'Dietary tags routed straight to event catering'
    ]
  },
  {
    id: 5,
    perkBadge: 'Mission Complete: Ready to Roll!',
    perkColor: 'orange',
    icon: <Sparkles size={22} />,
    title: "You're All Set!",
    subtitle: 'Join Codi in the complete presentation deck',
    codiHeadline: 'Want the Full Architectural Story?',
    codiComment:
      "You now know the core magic of Live Connect! If you'd like to explore our full interactive presentation deck, battle-tested design decisions, and deep product architecture, come join me in our cinematic pitch deck!",
    codiTakeaways: [
      'Interactive 6-part presentation with animated slide deck',
      'Explore university and community events right now',
      'Switch to Manager mode anytime to host your own events'
    ]
  }
];

export const InteractiveTour: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [commentaryKey, setCommentaryKey] = useState(0);

  useEffect(() => {
    // Only activate for fresh users who registered and haven't finished the tour
    const isPending = localStorage.getItem('fresh_signup_tour_pending') === 'true';
    if (isPending) {
      setIsOpen(true);
    }

    // Support manual trigger from UI or console
    const handleManualOpen = () => {
      setCurrentStepIndex(0);
      setIsOpen(true);
    };

    window.addEventListener('open-codi-tour', handleManualOpen);
    return () => window.removeEventListener('open-codi-tour', handleManualOpen);
  }, []);

  useEffect(() => {
    // Re-trigger bubble pop animation when step changes
    setCommentaryKey((prev) => prev + 1);
  }, [currentStepIndex]);

  const completeTour = () => {
    localStorage.removeItem('fresh_signup_tour_pending');
    localStorage.setItem('has_completed_tour', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeTour();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleGoToPresentation = () => {
    completeTour();
    navigate('/presentation');
  };

  const handleMascotClick = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 900);
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
            <div className="tour-header-meta__left">
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

              <span className={`tour-perk-badge tour-perk-badge--${currentStep.perkColor}`}>
                {currentStep.perkBadge}
              </span>
              <span className="tour-step-counter">
                {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>

            <div className="tour-header-meta__right">
              <button
                type="button"
                className="tour-deck-shortcut-btn"
                onClick={handleGoToPresentation}
                title="Explore Full Presentation Deck"
              >
                <Presentation size={13} />
                <span>Full Deck</span>
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
                isWaving={isWaving}
                onClick={handleMascotClick}
                title="I'm Codi! Click me to say hi!"
              />
              <span className="tour-mascot-hint">Click me to wave!</span>
            </div>

            {/* Mascot Speech Bubble delivering the Presentation commentary */}
            <div key={commentaryKey} className="tour-speech-bubble">
              <div className="tour-speech-bubble__header">
                <span className="tour-speech-tag">
                  <Sparkles size={13} className="tour-sparkle-icon" />
                  <span>Codi's Commentary</span>
                </span>
                <span className="tour-step-tagline">{currentStep.subtitle}</span>
              </div>

              <h3 className="tour-speech-title">{currentStep.codiHeadline}</h3>
              <p className="tour-speech-text">{currentStep.codiComment}</p>

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
                onClick={() => setCurrentStepIndex(i)}
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
