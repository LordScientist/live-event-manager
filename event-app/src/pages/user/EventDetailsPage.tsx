import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Building,
  ArrowLeft,
  Clock,
  User,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { scheduleService } from '../../services/scheduleService';
import type { ScheduleItem } from '../../types';
import './EventDetailsPage.css';

type DetailTab = 'overview' | 'schedule' | 'speaker' | 'faqs';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    Promise.all([
      eventService.getEventById(id),
      scheduleService.getEventSchedule(id)
    ]).then(([evtData, schData]) => {
      if (isMounted) {
        setEvent(evtData);
        setSchedule(schData);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="event-details-loading">
        <div className="event-details-skeleton" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container event-not-found">
        <h2>Event not found</h2>
        <p>The event you requested could not be located.</p>
        <Link to="/events">
          <Button variant="primary">Browse All Events</Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(event.start_date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const isRegistered = event.registration_status === 'registered';

  return (
    <div className="event-details-container">
      {/* 1. Top Navigation Bar: Back Arrow + Page Title */}
      <div className="event-details-top-bar">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="event-details-back-btn"
          aria-label="Back to previous page"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="event-details-heading">Event Details</h1>
      </div>

      {/* 2. Hero Image with Category Badge */}
      <div className="event-details-media">
        <img
          src={event.cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
          alt={event.name}
          className="event-details-image"
        />
        <span className="event-details-category-pill">{event.category}</span>
      </div>

      {/* 3. Event Primary Info */}
      <div className="event-details-primary-info">
        <h2 className="event-details-title">{event.name}</h2>

        <div className="event-details-meta-item">
          <Calendar size={18} className="meta-icon" aria-hidden="true" />
          <span>{formattedDate} - {formattedTime}</span>
        </div>

        <div className="event-details-meta-item">
          <MapPin size={18} className="meta-icon" aria-hidden="true" />
          <span>{event.venue}</span>
        </div>

        <div className="event-details-status-wrap">
          <span className="event-details-open-badge">
            {isRegistered ? 'Registered' : 'Open'}
          </span>
        </div>
      </div>

      {/* 4. Primary CTA: Register for Event */}
      <div className="event-details-cta-section">
        {isRegistered ? (
          <Link to="/my-events" style={{ width: '100%' }}>
            <Button
              variant="primary"
              size="lg"
              className="event-details-register-btn"
            >
              Go to My Event Experience
            </Button>
          </Link>
        ) : (
          <Link to={`/events/${event.id}/register`} style={{ width: '100%' }}>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="event-details-register-btn"
            >
              Register for Event
            </Button>
          </Link>
        )}
      </div>

      {/* 5. Horizontal Tab Navigation: Overview | Schedule | Speaker | FAQs */}
      <div className="event-details-tab-bar" role="tablist" aria-label="Event Details Tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`event-tab-btn ${activeTab === 'overview' ? 'event-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'schedule'}
          className={`event-tab-btn ${activeTab === 'schedule' ? 'event-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'speaker'}
          className={`event-tab-btn ${activeTab === 'speaker' ? 'event-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('speaker')}
        >
          Speaker
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'faqs'}
          className={`event-tab-btn ${activeTab === 'faqs' ? 'event-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          FAQs
        </button>
      </div>

      {/* 6. Tab Content Panels */}
      <div className="event-details-tab-content">
        {activeTab === 'overview' && (
          <div className="tab-pane-overview">
            <h3 className="tab-section-title">About this event</h3>
            <p className="tab-description-para">
              {event.description ||
                'The KNUST Technology Conference brings together innovators, researchers, and students to explore the future of technology and its impact on society.'}
            </p>

            {/* Accessibility Accommodations */}
            <div className="details-card-block">
              <div className="details-card-block__header">
                <ShieldCheck size={20} className="details-block-icon" />
                <h4 className="details-card-block__title">Accessibility Accommodations</h4>
              </div>
              <p className="details-card-block__desc">
                {event.accessibility_info ||
                  'Ramp access at main entrance, sign language interpreter during keynotes, priority seating reserved in rows 1-3.'}
              </p>
              <div className="accessibility-pill-tags">
                <span className="acc-tag">✓ Step-free entrance</span>
                <span className="acc-tag">✓ Front row seating</span>
                <span className="acc-tag">✓ Live captioning (CART)</span>
                <span className="acc-tag">✓ Sensory quiet area</span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <Link to={`/events/${event.id}/accessibility`} className="details-acc-view-link">
                  <span>View Full Accessibility Details</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="details-organizer-block">
              <Building size={18} className="details-block-icon" />
              <span>Organized by <strong>{event.organizer_name}</strong></span>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="tab-pane-schedule">
            <div className="schedule-header-row">
              <h3 className="tab-section-title">Schedule</h3>
              <Link to={`/events/${event.id}/schedule`} className="full-schedule-link">
                Full View <ChevronRight size={14} />
              </Link>
            </div>
            {schedule.length > 0 ? (
              <div className="detail-schedule-list">
                {schedule.map((item) => {
                  const itemTime = new Date(item.start_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  });
                  return (
                    <div key={item.id} className="detail-schedule-card">
                      <div className="detail-schedule-time">
                        <Clock size={14} />
                        <span>{itemTime}</span>
                      </div>
                      <div className="detail-schedule-body">
                        <h4 className="detail-schedule-title">{item.title}</h4>
                        <div className="detail-schedule-meta">
                          <span className="detail-schedule-venue">
                            <MapPin size={13} />
                            <span>{item.venue}</span>
                          </span>
                          {item.speaker_name && (
                            <span className="detail-schedule-speaker">
                              <User size={13} />
                              <span>{item.speaker_name}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="tab-empty-text">No schedule published yet.</p>
            )}
          </div>
        )}

        {activeTab === 'speaker' && (
          <div className="tab-pane-speakers">
            <h3 className="tab-section-title">Featured Speakers</h3>
            <div className="speaker-cards-list">
              <div className="speaker-card">
                <div className="speaker-avatar-circle">
                  <User size={22} />
                </div>
                <div className="speaker-info">
                  <h4 className="speaker-name">Prof. Kwame Mensah</h4>
                  <span className="speaker-role">Vice Chancellor & Keynote Speaker</span>
                  <p className="speaker-bio">Leading advocate for digital infrastructure and engineering research across West Africa.</p>
                </div>
              </div>
              <div className="speaker-card">
                <div className="speaker-avatar-circle">
                  <User size={22} />
                </div>
                <div className="speaker-info">
                  <h4 className="speaker-name">Dr. Amina Touré</h4>
                  <span className="speaker-role">AI Systems Architect & Panelist</span>
                  <p className="speaker-bio">Specializing in edge machine learning and accessible computing in emerging tech ecosystems.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="tab-pane-faqs">
            <h3 className="tab-section-title">Frequently Asked Questions</h3>
            <div className="faq-items-list">
              <div className="faq-item">
                <h4 className="faq-question">
                  <HelpCircle size={16} /> How do I check in on the event day?
                </h4>
                <p className="faq-answer">
                  Show your mobile registration badge or provide your registered email at the entrance desk to receive your attendee credentials.
                </p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">
                  <HelpCircle size={16} /> Is the venue wheelchair accessible?
                </h4>
                <p className="faq-answer">
                  Yes, the Great Hall has ramp access at the primary entryway and priority seating reserved in the front rows.
                </p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">
                  <HelpCircle size={16} /> Can I request special accommodations?
                </h4>
                <p className="faq-answer">
                  Yes, during the registration flow you can indicate dietary requirements, CART captioning, or other personalized arrangements.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
