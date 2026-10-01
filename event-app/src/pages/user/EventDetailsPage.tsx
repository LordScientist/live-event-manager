import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Users,
  ChevronRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import type { StatusType } from '../../components/ui/StatusBadge';
import { Alert } from '../../components/ui/Alert';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { scheduleService } from '../../services/scheduleService';
import { updateService } from '../../services/updateService';
import type { ScheduleItem, EventUpdate } from '../../types';
import './EventDetailsPage.css';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [updates, setUpdates] = useState<EventUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    Promise.all([
      eventService.getEventById(id),
      scheduleService.getEventSchedule(id),
      updateService.getEventUpdates(id)
    ]).then(([evtData, schData, updData]) => {
      if (isMounted) {
        setEvent(evtData);
        setSchedule(schData);
        setUpdates(updData);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading event information...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', textAlign: 'center' }}>
        <h2>Event not found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          The event you requested could not be located.
        </p>
        <Link to="/events">
          <Button variant="primary">Browse All Events</Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedStartTime = new Date(event.start_date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedEndTime = new Date(event.end_date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const deadlineFormatted = event.registration_deadline
    ? new Date(event.registration_deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Open until event date';

  const isRegistered = event.registration_status === 'registered';

  return (
    <div className="event-details-page">
      {/* Back button */}
      <div className="container event-details-back">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-btn"
          aria-label="Back to events"
        >
          <ArrowLeft size={16} />
          <span>Back to events</span>
        </button>
      </div>

      {/* 1. HERO SECTION (Prompt Section 9) */}
      <section className="event-hero container">
        <div className="event-hero__grid">
          <div className="event-hero__media">
            <img
              src={event.cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
              alt={event.name}
              className="event-hero__image"
            />
          </div>
          <div className="event-hero__info">
            <div className="event-hero__tags">
              <span className="event-hero__category">{event.category}</span>
              <StatusBadge
                status={isRegistered ? 'approved' : (event.registration_status as StatusType) || 'published'}
                label={isRegistered ? `Registered (${event.user_role_name || 'Participant'})` : undefined}
              />
            </div>

            <h1 className="event-hero__title">{event.name}</h1>

            <div className="event-hero__organizer">
              <Building size={16} aria-hidden="true" />
              <span>Organized by <strong>{event.organizer_name}</strong></span>
            </div>

            <div className="event-hero__quick-meta">
              <div className="quick-meta-item">
                <Calendar size={18} aria-hidden="true" />
                <div>
                  <div className="meta-label">Date</div>
                  <div className="meta-value">{formattedDate}</div>
                </div>
              </div>
              <div className="quick-meta-item">
                <Clock size={18} aria-hidden="true" />
                <div>
                  <div className="meta-label">Time</div>
                  <div className="meta-value">{formattedStartTime} – {formattedEndTime}</div>
                </div>
              </div>
              <div className="quick-meta-item">
                <MapPin size={18} aria-hidden="true" />
                <div>
                  <div className="meta-label">Location</div>
                  <div className="meta-value">{event.venue}, {event.location_details}</div>
                </div>
              </div>
            </div>

            {/* Primary CTA (Prompt: Register for Event / View My Registration) */}
            <div className="event-hero__cta">
              {isRegistered ? (
                <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                  <Link to="/my-events" style={{ flex: 1 }}>
                    <Button variant="primary" size="lg" style={{ width: '100%' }} rightIcon={<ChevronRight size={18} />}>
                      Go to My Event Experience
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to={`/events/${event.id}/register`} style={{ width: '100%' }}>
                  <Button variant="primary" size="lg" style={{ width: '100%' }}>
                    Register for Event
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="container event-details-body">
        <div className="event-details-main">
          {/* LATEST UPDATES (Prompt Section 9: Show most recent event updates) */}
          {updates.length > 0 && (
            <section className="event-section">
              <div className="section-title-row">
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Radio size={20} className="pulse-icon" />
                  <span>Latest Updates</span>
                </h2>
                <Link to={`/events/${event.id}/updates`} className="section-link">
                  View All Updates ({updates.length})
                </Link>
              </div>
              <div className="updates-list">
                {updates.map((update) => (
                  <Alert
                    key={update.id}
                    type={update.type === 'venue_change' ? 'warning' : 'info'}
                    title={update.title}
                    icon={update.type === 'venue_change' ? <AlertTriangle size={18} /> : <Radio size={18} />}
                  >
                    <p>{update.message}</p>
                    <span className="update-timestamp">Updated 5 minutes ago</span>
                  </Alert>
                ))}
              </div>
            </section>
          )}

          {/* 2. OVERVIEW (Prompt Section 9) */}
          <section className="event-section">
            <h2 className="section-title">Overview</h2>
            <div className="event-description">
              <p>{event.description}</p>
              <h3 style={{ fontSize: 'var(--text-base)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                What to Expect
              </h3>
              <p>
                Join fellow practitioners, keynote speakers, and organizers for structured talks, breakout technical clinics, and active networking. All registered participants receive live push notifications regarding room adjustments and schedule shifts.
              </p>
            </div>
          </section>

          {/* 3. ACCESSIBILITY SECTION (Prompt Section 9: Display before registration) */}
          <section className="event-section accessibility-card-section">
            <div className="accessibility-card">
              <div className="accessibility-card__header">
                <ShieldCheck size={22} className="accessibility-icon" />
                <div>
                  <h2 className="section-title" style={{ marginBottom: 0 }}>Accessibility</h2>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Physical & digital accommodations provided by the organizer
                  </p>
                </div>
              </div>
              <div className="accessibility-features-list">
                <div className="feature-item feature-item--available">
                  <CheckCircle2 size={16} />
                  <span>Step-free entrance and ramps</span>
                </div>
                <div className="feature-item feature-item--available">
                  <CheckCircle2 size={16} />
                  <span>Accessible seating in front rows</span>
                </div>
                <div className="feature-item feature-item--available">
                  <CheckCircle2 size={16} />
                  <span>Live captioning (CART) in main auditorium</span>
                </div>
                <div className="feature-item feature-item--unavailable">
                  <XCircle size={16} />
                  <span>Sign-language interpretation unavailable</span>
                </div>
                <div className="feature-item feature-item--available">
                  <CheckCircle2 size={16} />
                  <span>Quiet sensory space available</span>
                </div>
              </div>

              {/* Request an accommodation link */}
              <div className="accessibility-request-box">
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  Need specific accommodations, dietary support, or assistance?
                </p>
                <Link to={`/events/${event.id}/register?step=accessibility`}>
                  <Button variant="outline" size="sm">
                    Request an accommodation
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* 4. AVAILABLE ROLES (Prompt Section 9) */}
          <section className="event-section">
            <h2 className="section-title">Available Roles</h2>
            <div className="roles-grid">
              <Card className="role-card">
                <CardContent>
                  <div className="role-card__header">
                    <Users size={18} />
                    <h3 className="role-card__title">Participant</h3>
                  </div>
                  <p className="role-card__desc">
                    Attend sessions, ask questions during panels, and connect with peers.
                  </p>
                  <span className="role-capacity">Automatic Approval • Capacity Open</span>
                </CardContent>
              </Card>

              <Card className="role-card">
                <CardContent>
                  <div className="role-card__header">
                    <Users size={18} />
                    <h3 className="role-card__title">Volunteer</h3>
                  </div>
                  <p className="role-card__desc">
                    Assist with attendee check-in, stage logistics, and accessibility support.
                  </p>
                  <span className="role-capacity">Reviewed by Organizer • 15 slots remaining</span>
                </CardContent>
              </Card>

              <Card className="role-card">
                <CardContent>
                  <div className="role-card__header">
                    <Users size={18} />
                    <h3 className="role-card__title">Speaker</h3>
                  </div>
                  <p className="role-card__desc">
                    Deliver lighting talks or panels on engineering and design topics.
                  </p>
                  <span className="role-capacity">Subject to Review • Requires topic submission</span>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 5. SCHEDULE PREVIEW (Prompt Section 9) */}
          <section className="event-section">
            <div className="section-title-row">
              <h2 className="section-title">Schedule Preview</h2>
              <Link to={`/events/${event.id}/schedule`} className="section-link">
                View Full Schedule
              </Link>
            </div>
            <div className="schedule-preview-list">
              {schedule.slice(0, 3).map((item) => {
                const itemTime = new Date(item.start_time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });
                return (
                  <div key={item.id} className="schedule-preview-item">
                    <span className="preview-time">{itemTime}</span>
                    <div className="preview-details">
                      <div className="preview-title">{item.title}</div>
                      <div className="preview-venue">{item.venue}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* SIDEBAR: EVENT INFORMATION (Prompt Section 9) */}
        <aside className="event-details-sidebar">
          <Card className="sidebar-card">
            <CardContent>
              <h3 className="sidebar-card__title">Event Information</h3>
              <div className="sidebar-info-list">
                <div className="sidebar-info-item">
                  <div className="info-label">Date</div>
                  <div className="info-value">{formattedDate}</div>
                </div>
                <div className="sidebar-info-item">
                  <div className="info-label">Time</div>
                  <div className="info-value">{formattedStartTime} – {formattedEndTime}</div>
                </div>
                <div className="sidebar-info-item">
                  <div className="info-label">Venue</div>
                  <div className="info-value">{event.venue}</div>
                  <div className="info-sub">{event.location_details}</div>
                </div>
                <div className="sidebar-info-item">
                  <div className="info-label">Online Option</div>
                  <div className="info-value">Hybrid • Live stream available for keynote</div>
                </div>
                <div className="sidebar-info-item">
                  <div className="info-label">Registration Deadline</div>
                  <div className="info-value">{deadlineFormatted}</div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                {isRegistered ? (
                  <Link to="/my-events" style={{ width: '100%' }}>
                    <Button variant="secondary" size="md" style={{ width: '100%' }}>
                      View My Registration
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/events/${event.id}/register`} style={{ width: '100%' }}>
                    <Button variant="primary" size="md" style={{ width: '100%' }}>
                      Register for Event
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};
