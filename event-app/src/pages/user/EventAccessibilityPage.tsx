import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  X,
  ShieldCheck,
  Send,
  ChevronRight
} from 'lucide-react';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import decorTopRight from '../../assets/accessibility-decor-top-right.png';
import decorBottomRight from '../../assets/accessibility-decor-bottom-right.png';
import './EventAccessibilityPage.css';

interface AccessibilityOption {
  id: string;
  label: string;
  isAvailable: boolean;
  description?: string;
}

export const EventAccessibilityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state for requesting custom accommodations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    eventService.getEventById(id).then((evt) => {
      if (isMounted) {
        setEvent(evt);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Accessibility checklist items matching Figma Node 1:8
  const accessibilityOptions: AccessibilityOption[] = [
    {
      id: 'step-free',
      label: 'Step-free entrance',
      isAvailable: true,
      description: 'Wheelchair ramp and level entry access at all main entrances.'
    },
    {
      id: 'accessible-seating',
      label: 'Accessibility seating',
      isAvailable: true,
      description: 'Priority front row and aisle seating reserved for mobility assistance.'
    },
    {
      id: 'live-caption',
      label: 'Live caption',
      isAvailable: true,
      description: 'Real-time speech-to-text CART captions displayed on main screens.'
    },
    {
      id: 'sign-language',
      label: 'Sign- language interpretation',
      isAvailable: false,
      description: 'Not scheduled by default; available upon advance attendee request.'
    },
    {
      id: 'quiet-space',
      label: 'Quiet space available',
      isAvailable: true,
      description: 'Sensory-friendly decompression quiet lounge located on the ground floor.'
    }
  ];

  const handleToggleNeed = (item: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setRequestSubmitted(false);
    }, 2000);
  };

  if (isLoading || !event) {
    return (
      <div className="event-accessibility-loading">
        <div className="event-acc-skeleton" />
      </div>
    );
  }

  return (
    <div className="event-accessibility-screen">
      {/* Decorative Brand Corner Graphics matching Figma Node 1:8 */}
      <img
        src={decorTopRight}
        alt=""
        aria-hidden="true"
        className="event-acc-decor-tr"
      />
      <img
        src={decorBottomRight}
        alt=""
        aria-hidden="true"
        className="event-acc-decor-br"
      />

      <div className="event-acc-container">
        {/* 1. Top Navigation Bar */}
        <header className="event-acc-top-bar">
          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="event-acc-back-btn"
            aria-label="Back to event details"
          >
            <ArrowLeft size={22} strokeWidth={2.6} />
          </button>
          <span className="event-acc-top-title">Accessibility</span>
        </header>

        {/* 2. Main Page Headings */}
        <div className="event-acc-heading-group">
          <h1 className="event-acc-heading">Accessibility</h1>
          <p className="event-acc-intro">
            We are committed to making this event accessible to everyone.Please review the accessibility options below.
          </p>
        </div>

        {/* 3. Accessibility Checklist Cards */}
        <div className="event-acc-list" role="list">
          {accessibilityOptions.map((item) => (
            <div
              key={item.id}
              className={`event-acc-card ${!item.isAvailable ? 'event-acc-card--unavailable' : ''}`}
              role="listitem"
            >
              <div
                className={`event-acc-icon-badge ${
                  item.isAvailable ? 'event-acc-icon-badge--check' : 'event-acc-icon-badge--cross'
                }`}
                aria-label={item.isAvailable ? 'Available feature' : 'Unavailable feature'}
              >
                {item.isAvailable ? (
                  <Check size={18} strokeWidth={3.5} className="acc-icon" />
                ) : (
                  <X size={18} strokeWidth={3.5} className="acc-icon" />
                )}
              </div>
              <div className="event-acc-card-content">
                <span className="event-acc-card-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Primary Call to Action Button */}
        <div className="event-acc-actions">
          <button
            type="button"
            className="event-acc-btn-request"
            onClick={() => setIsModalOpen(true)}
          >
            Request an accommodation
          </button>

          {/* Secondary Registration Link */}
          <Link
            to={`/events/${event.id}/register`}
            className="event-acc-btn-register"
          >
            <span>Proceed to Registration</span>
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* 5. Footnote Disclaimer */}
        <p className="event-acc-footnote">
          Accessibility information is shown before registration to help you make an informed decision.
        </p>
      </div>

      {/* 6. Interactive Accommodation Request Modal */}
      {isModalOpen && (
        <div className="event-acc-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="event-acc-modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="acc-modal-title"
          >
            <div className="event-acc-modal-header">
              <div className="event-acc-modal-title-wrap">
                <ShieldCheck size={22} className="acc-modal-icon" />
                <h3 id="acc-modal-title" className="event-acc-modal-title">
                  Request an Accommodation
                </h3>
              </div>
              <button
                type="button"
                className="event-acc-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {requestSubmitted ? (
              <div className="event-acc-modal-success">
                <Check size={40} className="acc-success-icon" />
                <h4>Request Received!</h4>
                <p>
                  Our event accessibility coordinator has received your accommodation preferences for {event.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="event-acc-modal-form">
                <p className="event-acc-modal-desc">
                  Select the accommodations you require for <strong>{event.name}</strong>. We will coordinate directly with venue staff.
                </p>

                <div className="event-acc-modal-checklist">
                  {[
                    'Sign language interpretation (ASL / Ghanaian SL)',
                    'Wheelchair ramp / reserved mobility seating',
                    'Live captioning display or handheld CART receiver',
                    'Assistive listening device headset',
                    'Sensory quiet room reservation',
                    'Digital large-print conference materials',
                    'Other specific accessibility accommodation'
                  ].map((opt) => (
                    <label key={opt} className="event-acc-modal-checkbox-row">
                      <input
                        type="checkbox"
                        checked={selectedNeeds.includes(opt)}
                        onChange={() => handleToggleNeed(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="event-acc-modal-field">
                  <label htmlFor="acc-custom-note" className="event-acc-modal-label">
                    Additional notes or requirements:
                  </label>
                  <textarea
                    id="acc-custom-note"
                    rows={3}
                    placeholder="Provide any details to help us ensure full accessibility for you..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="event-acc-modal-textarea"
                  />
                </div>

                <div className="event-acc-modal-footer">
                  <button
                    type="button"
                    className="event-acc-modal-btn-cancel"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="event-acc-modal-btn-submit"
                  >
                    <Send size={15} />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAccessibilityPage;
