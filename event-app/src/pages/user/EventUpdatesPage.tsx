import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Calendar,
  MapPin,
  Sparkles,
  ArrowLeft,
  X,
  Clock,
  Users,
  Radio,
  ExternalLink
} from 'lucide-react';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { updateService } from '../../services/updateService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import type { EventUpdate, UpdateType, Registration } from '../../types';
import decorTopRight from '../../assets/updates-decor-top-right.png';
import decorBottomRight from '../../assets/updates-decor-bottom-right.png';
import './EventUpdatesPage.css';

// Format relative timestamp matching Figma: "2 hours ago", "4 hours ago", "1 day ago"
const getRelativeTime = (isoString: string): string => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

export const EventUpdatesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [updates, setUpdates] = useState<EventUpdate[]>([]);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'affects_me' | 'venue_schedule'>('all');
  const [selectedUpdate, setSelectedUpdate] = useState<EventUpdate | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    Promise.all([
      eventService.getEventById(id),
      updateService.getEventUpdates(id),
      registrationService.getUserRegistrations(currentUser.id)
    ]).then(([evtData, updData, regs]) => {
      if (!isMounted) return;

      setEvent(evtData);
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
      <div className="event-updates-page event-updates-page--loading">
        <div className="updates-loading-spinner" />
        <p>Loading event updates...</p>
      </div>
    );
  }

  // Derive user role
  let userRoleCategory: 'speakers' | 'volunteers' | 'attendees' = 'attendees';
  if (userRegistration?.event_role_id.includes('speaker') || event.user_role_name === 'Speaker') {
    userRoleCategory = 'speakers';
  } else if (userRegistration?.event_role_id.includes('volunteer')) {
    userRoleCategory = 'volunteers';
  }

  // Check if an update affects this user
  const checkAffectsUser = (audience: string): boolean => {
    if (audience === 'all' || audience === 'approved') return true;
    return audience === userRoleCategory;
  };

  // Icon and theme config matching Figma Frame 1:11
  const getTypeConfig = (type: UpdateType) => {
    switch (type) {
      case 'speaker_change':
        return {
          icon: Megaphone,
          iconColor: '#16A34A', // Vibrant green matching frame
          iconBg: 'rgba(22, 163, 74, 0.12)'
        };
      case 'schedule_change':
        return {
          icon: Calendar,
          iconColor: '#FF2625', // Vibrant red calendar
          iconBg: 'rgba(255, 38, 37, 0.12)'
        };
      case 'venue_change':
        return {
          icon: MapPin,
          iconColor: '#EA580C', // Vibrant orange map pin
          iconBg: 'rgba(234, 88, 12, 0.12)'
        };
      case 'emergency':
        return {
          icon: Calendar,
          iconColor: '#DC2626',
          iconBg: 'rgba(220, 38, 38, 0.15)'
        };
      case 'general_announcement':
      default:
        return {
          icon: Sparkles,
          iconColor: '#4F46E5', // Indigo / resource blue
          iconBg: 'rgba(79, 70, 229, 0.12)'
        };
    }
  };

  // Derive top featured alert (prefer schedule_change or emergency, fallback to latest)
  const featuredChange = updates.find(
    (u) => u.type === 'schedule_change' || u.type === 'emergency'
  ) || {
    title: 'SCHEDULE CHANGED',
    message: 'Your 2:00 PM session has moved from Room 204 to the Main Auditorium.'
  };

  // Filter updates
  const filteredUpdates = updates.filter((upd) => {
    const affectsUser = checkAffectsUser(upd.audience);
    if (filterType === 'affects_me') {
      return affectsUser;
    }
    if (filterType === 'venue_schedule') {
      return upd.type === 'venue_change' || upd.type === 'schedule_change';
    }
    return true;
  });

  return (
    <div className="event-updates-page">
      {/* Decorative background shapes matching Figma Frame 1:11 */}
      <img
        src={decorTopRight}
        alt=""
        className="updates-decor-top-right"
        aria-hidden="true"
      />
      <img
        src={decorBottomRight}
        alt=""
        className="updates-decor-bottom-right"
        aria-hidden="true"
      />

      <div className="updates-content-wrap">
        {/* 1. Header Bar: Back Arrow + Event Update */}
        <header className="updates-top-bar">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="updates-back-btn"
            aria-label="Back to event"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="updates-page-title">Event Update</h1>
        </header>

        {/* 2. Highlight Alert Card matching Figma Frame 1:11 */}
        <section className="updates-alert-card" aria-label="Schedule Changed Alert">
          <span className="updates-alert-tag">SCHEDULE CHANGED</span>
          <p className="updates-alert-message">
            {featuredChange.message ||
              'Your 2:00 PM session has moved from Room 204 to the Main Auditorium.'}
          </p>
          <button
            type="button"
            className="updates-alert-btn"
            onClick={() => navigate(`/events/${id}/schedule`)}
          >
            View Schedule
          </button>
        </section>

        {/* 3. Section Header: "Recent Updates" + Live broadcast pill */}
        <div className="updates-section-header">
          <div className="updates-section-title-wrap">
            <h2 className="updates-section-title">Recent Updates</h2>
            <div className="live-broadcast-pill">
              <span className="live-broadcast-dot" />
              <span>Live Broadcast</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="updates-filters" role="tablist" aria-label="Filter updates">
            <button
              type="button"
              className={`filter-pill ${filterType === 'all' ? 'filter-pill--active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All ({updates.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${filterType === 'affects_me' ? 'filter-pill--active' : ''}`}
              onClick={() => setFilterType('affects_me')}
            >
              Affects Me
            </button>
            <button
              type="button"
              className={`filter-pill ${filterType === 'venue_schedule' ? 'filter-pill--active' : ''}`}
              onClick={() => setFilterType('venue_schedule')}
            >
              Venue & Schedule
            </button>
          </div>
        </div>

        {/* 4. Updates List matching Figma Frame 1:11 */}
        <div className="updates-list">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update) => {
              const config = getTypeConfig(update.type);
              const Icon = config.icon;
              const affectsUser = checkAffectsUser(update.audience);
              const relativeTime = getRelativeTime(update.created_at);

              return (
                <article
                  key={update.id}
                  className="update-card-item"
                  onClick={() => setSelectedUpdate(update)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedUpdate(update);
                    }
                  }}
                  aria-label={`${update.title}, updated ${relativeTime}`}
                >
                  <div
                    className="update-card-item__icon-wrap"
                    style={{ color: config.iconColor, backgroundColor: config.iconBg }}
                  >
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div className="update-card-item__body">
                    <div className="update-card-item__top-line">
                      <h3 className="update-card-item__title">{update.title}</h3>
                      {affectsUser && (
                        <span className="update-card-item__affects-tag">Affects You</span>
                      )}
                    </div>
                    <span className="update-card-item__time">{relativeTime}</span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="updates-empty-card">
              <Radio size={36} className="updates-empty-icon" />
              <h3>No updates available</h3>
              <p>Everything is currently proceeding according to schedule.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Update Detail Modal for deep inspection */}
      {selectedUpdate && (
        <div className="update-modal-backdrop" onClick={() => setSelectedUpdate(null)}>
          <div
            className="update-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-update-title"
          >
            <div className="update-modal__header">
              <h3 id="modal-update-title" className="update-modal__title">
                {selectedUpdate.title}
              </h3>
              <button
                type="button"
                className="update-modal__close"
                onClick={() => setSelectedUpdate(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="update-modal__body">
              <div className="update-modal__meta-row">
                <span className="update-modal__time">
                  <Clock size={14} />
                  {getRelativeTime(selectedUpdate.created_at)} (
                  {new Date(selectedUpdate.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  )
                </span>
                <span className="update-modal__audience">
                  <Users size={14} />
                  Audience: <strong>{selectedUpdate.audience.toUpperCase()}</strong>
                </span>
              </div>

              <p className="update-modal__message">{selectedUpdate.message}</p>

              {(selectedUpdate.type === 'schedule_change' || selectedUpdate.type === 'venue_change') && (
                <div className="update-modal__actions">
                  <button
                    type="button"
                    className="update-modal__action-btn"
                    onClick={() => {
                      setSelectedUpdate(null);
                      navigate(`/events/${id}/schedule`);
                    }}
                  >
                    <span>Open Schedule Timeline</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
