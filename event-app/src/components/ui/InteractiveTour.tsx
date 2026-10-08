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
import './InteractiveTour.css';

interface TourStep {
  id: number;
  perkBadge: string;
  perkColor: 'blue' | 'purple' | 'amber' | 'emerald' | 'orange';
  title: string;
  subtitle: string;
  description: string;
  highlightPoints: string[];
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    perkBadge: 'Perk 01: Zero Blackouts',
    perkColor: 'blue',
    icon: <Radio size={28} />,
    title: 'Welcome to Live Connect',
    subtitle: 'Event coordination without the group chat chaos',
    description:
      'When an event detail shifts 20 minutes before start time, everyone sees the exact same updated reality instantly—no missed WhatsApp messages or confused attendees.',
    highlightPoints: [
      'Instant broadcast banners for venue and room changes',
      'One shared truth for organizers, speakers, and attendees',
      'Clean mobile view designed for quick checks on the move'
    ]
  },
  {
    id: 2,
    perkBadge: 'Perk 02: Multi-Role Power',
    perkColor: 'purple',
    icon: <Layers size={28} />,
    title: 'One Account, Flexible Roles',
    subtitle: 'Your account is who you are, your role is what you do',
    description:
      'You are never locked into a single rigid account type. You can attend as a Guest today, help as a Volunteer tomorrow, or present as a Speaker next week.',
    highlightPoints: [
      'Role belongs to your event registration, not your login',
      'Pre-filled profile saves your details across all events',
      'Role-specific instructions and duties provided directly in your pass'
    ]
  },
  {
    id: 3,
    perkBadge: 'Perk 03: Live Companion',
    perkColor: 'amber',
    icon: <Clock size={28} />,
    title: 'Your Day-of Event Hub',
    subtitle: 'Answering the 3 vital questions without scrolling',
    description:
      'On event day, your live companion page stays anchored to: 1) What is happening right now? 2) Where do I need to be? 3) Has anything changed?',
    highlightPoints: [
      'Pulsing live indicators for sessions in progress',
      'Automatic room comparisons if an auditorium changes',
      'One-tap digital badge and quick schedule timeline'
    ]
  },
  {
    id: 4,
    perkBadge: 'Perk 04: Built-in Inclusivity',
    perkColor: 'emerald',
    icon: <Accessibility size={28} />,
    title: 'Inclusive by Design',
    subtitle: 'Accommodations and dietary needs handled upfront',
    description:
      'Wheelchair access, sign language interpretation, sensory quiet rooms, and dietary requirements are verified early so every participant is supported.',
    highlightPoints: [
      'Transparent venue accessibility checklist on every event page',
      'Confidential accommodation request flow during signup',
      'Dietary tags surfaced straight to event organizers'
    ]
  },
  {
    id: 5,
    perkBadge: 'Mission Complete: Ready to Roll',
    perkColor: 'orange',
    icon: <Sparkles size={28} />,
    title: "You're All Set!",
    subtitle: 'Want to dive deeper into the Live Connect story?',
    description:
      "You now know how Live Connect keeps everyone synchronized. If you'd like to explore our design principles, architecture, and the complete vision, check out the interactive presentation deck.",
    highlightPoints: [
      'Explore the interactive pitch presentation anytime',
      'Switch between Participant and Manager modes in the header',
      'Discover upcoming university and community events right now'
    ]
  }
];

export const InteractiveTour: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Only activate for fresh users who registered and haven't finished the tour
    const isPending = localStorage.getItem('fresh_signup_tour_pending') === 'true';
    if (isPending) {
      setIsOpen(true);
    }
  }, []);

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

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFinalStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <div className="tour-overlay" role="dialog" aria-modal="true" aria-label="Interactive App Walkthrough">
      <div className="tour-modal">
        {/* Top Header / Progress Track */}
        <div className="tour-modal__header">
          <div className="tour-progress-bar">
            <div
              className="tour-progress-bar__fill"
              style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
          <div className="tour-header-meta">
            <span className={`tour-perk-badge tour-perk-badge--${currentStep.perkColor}`}>
              {currentStep.perkBadge}
            </span>
            <button
              type="button"
              className="tour-close-btn"
              onClick={completeTour}
              aria-label="Skip walkthrough"
              title="Skip walkthrough"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Step Body */}
        <div className="tour-modal__body">
          <div className={`tour-icon-wrap tour-icon-wrap--${currentStep.perkColor}`}>
            {currentStep.icon}
          </div>

          <h2 className="tour-title">{currentStep.title}</h2>
          <p className="tour-subtitle">{currentStep.subtitle}</p>
          <p className="tour-desc">{currentStep.description}</p>

          <div className="tour-highlights">
            {currentStep.highlightPoints.map((point, idx) => (
              <div key={idx} className="tour-highlight-item">
                <CheckCircle2 size={16} className="tour-highlight-icon" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="tour-modal__footer">
          <div className="tour-step-dots">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`tour-dot ${i === currentStepIndex ? 'tour-dot--active' : i < currentStepIndex ? 'tour-dot--completed' : ''}`}
                onClick={() => setCurrentStepIndex(i)}
                aria-label={`Go to step ${i + 1}`}
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
                  Go to Presentation
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
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
