import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Radio,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Users
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { scheduleService } from '../../services/scheduleService';
import { updateService } from '../../services/updateService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import type { ScheduleItem, EventUpdate, Registration } from '../../types';
import decorTopRight from '../../assets/updates-decor-top-right.png';
import decorBottomRight from '../../assets/updates-decor-bottom-right.png';
import './MyEventExperiencePage.css';

export const MyEventExperiencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [updates, setUpdates] = useState<EventUpdate[]>([]);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    Promise.all([
      eventService.getEventById(id),
      scheduleService.getEventSchedule(id),
      updateService.getEventUpdates(id),
      registrationService.getUserRegistrations(currentUser.id)
    ]).then(([evtData, schData, updData, regs]) => {
      if (!isMounted) return;

      setEvent(evtData);
      setSchedule(schData);
      setUpdates(updData);

      const matchingReg = regs.find((r) => r.event_id === id) || null;
      setUserRegistration(matchingReg);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id, currentUser.id]);

  if (isLoading || !event) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading your event experience...</p>
      </div>
    );
  }

  // Determine user role
  let roleTitle = 'Participant';
  if (userRegistration?.event_role_id.includes('speaker') || event.user_role_name === 'Speaker') {
    roleTitle = 'Speaker';
  } else if (userRegistration?.event_role_id.includes('volunteer')) {
    roleTitle = 'Volunteer';
  }

  // Next Up Session (Prompt Section 16)
  const nextSession = schedule[1] || {
    title: 'Volunteer briefing & stage logistics',
    start_time: '2026-10-18T11:30:00Z',
    venue: 'Conference Room B'
  };

  const nextSessionTime = new Date(nextSession.start_time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Latest Update (Prompt Section 16)
  const latestUpdate = updates[0] || {
    id: 'upd-default',
    title: 'Registration desk relocation',
    message: 'Registration has moved to the North Entrance.',
    type: 'venue_change',
    created_at: new Date().toISOString()
  };

  return (
    <div className="experience-page">
      {/* Decorative background shapes */}
      <img
        src={decorTopRight}
        alt=""
        className="experience-decor-top-right"
        aria-hidden="true"
      />
      <img
        src={decorBottomRight}
        alt=""
        className="experience-decor-bottom-right"
        aria-hidden="true"
      />

      <div className="experience-content-wrap">
        {/* Top Back Navigation */}
        <div className="experience-back">
          <button type="button" onClick={() => navigate('/my-events')} className="experience-back-btn">
            <ArrowLeft size={18} />
            <span>Back to My Events</span>
          </button>
        </div>

      {/* Header (Prompt Section 16: Event Name + Role: You are attending as a Volunteer) */}
      <header className="experience-header">
        <div className="experience-header__top">
          <span className="experience-category">{event.category}</span>
          <span className="live-status-pill">
            <span className="live-status-dot" /> Live Experience
          </span>
        </div>
        <h1 className="experience-event-name">{event.name}</h1>
        <div className="experience-role-callout">
          <Users size={18} aria-hidden="true" />
          <span>You are attending as a <strong>{roleTitle}</strong></span>
        </div>
      </header>

      {/* Top Highlights Grid (Next Up & Latest Update) */}
      <div className="experience-highlights-grid">
        {/* NEXT UP CARD (Prompt Section 16) */}
        <Card className="highlight-card highlight-card--next">
          <CardContent>
            <div className="highlight-card__badge">
              <Clock size={16} />
              <span>Next Up</span>
            </div>
            <div className="next-up-time">{nextSessionTime}</div>
            <h3 className="next-up-title">{nextSession.title}</h3>
            <div className="next-up-venue">
              <MapPin size={16} />
              <span>{nextSession.venue}</span>
            </div>
          </CardContent>
        </Card>

        {/* LATEST UPDATE (Prompt Section 16) */}
        <Card className="highlight-card highlight-card--update">
          <CardContent>
            <div className="highlight-card__badge highlight-card__badge--warning">
              <Radio size={16} />
              <span>Latest Update</span>
            </div>
            <div className="latest-update-quote">
              "{latestUpdate.message}"
            </div>
            <div className="latest-update-footer">
              <span className="update-time">Updated 5 minutes ago</span>
              <span className="update-scope">Applies to: All Attendees & Volunteers</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="experience-body-layout">
        {/* FULL SCHEDULE (Prompt Section 16 & 17) */}
        <div className="experience-main-content">
          <section className="experience-section">
            <div className="section-title-row">
              <h2 className="section-title">Schedule</h2>
              <span className="schedule-meta-badge">
                <Calendar size={14} /> Full Event Timeline
              </span>
            </div>

            <div className="timeline-list">
              {schedule.map((item, index) => {
                const itemTime = new Date(item.start_time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });

                const isVenueChanged = index === 2; // Simulated changed item from Section 17

                return (
                  <div
                    key={item.id}
                    className={`timeline-item ${isVenueChanged ? 'timeline-item--changed' : ''}`}
                  >
                    <div className="timeline-time">{itemTime}</div>
                    <div className="timeline-connector">
                      <div className="timeline-dot" />
                      {index < schedule.length - 1 && <div className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4 className="timeline-title">{item.title}</h4>
                        {isVenueChanged && (
                          <span className="change-indicator-pill">
                            <AlertTriangle size={12} /> Venue Changed
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="timeline-desc">{item.description}</p>
                      )}

                      <div className="timeline-meta-row">
                        <div className="timeline-venue">
                          <MapPin size={14} />
                          {isVenueChanged ? (
                            <span>
                              <span className="venue-previous">Previous: Room 204</span> →{' '}
                              <strong>New: Main Auditorium</strong>
                            </span>
                          ) : (
                            <span>{item.venue}</span>
                          )}
                        </div>

                        {item.speaker_name && (
                          <div className="timeline-speaker">
                            <Users size={14} />
                            <span>Speaker: {item.speaker_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* SIDEBAR: MY ROLE & INCLUSIVE DETAILS (Prompt Section 16) */}
        <aside className="experience-sidebar">
          {/* My Role Card */}
          <Card className="role-responsibilities-card">
            <CardContent>
              <div className="card-badge-row">
                <Briefcase size={16} />
                <h3 className="sidebar-card-title">My Role: {roleTitle}</h3>
              </div>

              {roleTitle === 'Volunteer' && (
                <div className="role-instructions">
                  <p><strong>Assigned Area:</strong> Registration Desk & Logistics</p>
                  <p><strong>Reporting Lead:</strong> Marcus Osei (Hall Coordinator)</p>
                  <p><strong>Responsibilities:</strong></p>
                  <ul className="role-checklist">
                    <li>Arrive at 08:30 AM for the volunteer briefing in Conference Room B.</li>
                    <li>Verify attendee registration QR codes and distribute name badges.</li>
                    <li>Guide attendees with accommodations to priority seating rows 1-3.</li>
                  </ul>
                </div>
              )}

              {roleTitle === 'Speaker' && (
                <div className="role-instructions">
                  <p><strong>Session:</strong> AI & The Future of African Engineering</p>
                  <p><strong>Time:</strong> 11:30 AM – 13:00 PM</p>
                  <p><strong>AV Tech Check:</strong> 10:45 AM at Main Stage AV Booth</p>
                  <ul className="role-checklist">
                    <li>HDMI / USB-C adapters provided at the lectern.</li>
                    <li>Green room access enabled in Room 102 with refreshments.</li>
                  </ul>
                </div>
              )}

              {roleTitle === 'Participant' && (
                <div className="role-instructions">
                  <p><strong>Attendance Type:</strong> In-person Pass</p>
                  <p><strong>Check-in Desk:</strong> North Entrance Great Hall</p>
                  <ul className="role-checklist">
                    <li>Have your digital badge ready for quick scanning.</li>
                    <li>Access live session question slips via this portal.</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Assistance Card */}
          <Card>
            <CardContent>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Need Assistance On-Site?
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Event organizers and accessibility assistants are stationed at the Help Desk in the Main Foyer.
              </p>
              <Link to={`/events/${event.id}`}>
                <Button variant="outline" size="sm" style={{ width: '100%' }}>
                  View Public Event Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
      </div>
    </div>
  );
};
