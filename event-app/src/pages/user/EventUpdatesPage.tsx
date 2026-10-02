import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Radio,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { updateService } from '../../services/updateService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import type { EventUpdate, UpdateType, Registration } from '../../types';
import './EventUpdatesPage.css';

// Format relative timestamp
const getRelativeTime = (isoString: string): string => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
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
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading event updates...</p>
      </div>
    );
  }

  // Derive user's registered role in this event
  let userRoleCategory: 'speakers' | 'volunteers' | 'attendees' = 'attendees';
  if (userRegistration?.event_role_id.includes('speaker') || event.user_role_name === 'Speaker') {
    userRoleCategory = 'speakers';
  } else if (userRegistration?.event_role_id.includes('volunteer')) {
    userRoleCategory = 'volunteers';
  }

  // Helper to determine if an update affects this user
  const checkAffectsUser = (audience: string): boolean => {
    if (audience === 'all' || audience === 'approved') return true;
    return audience === userRoleCategory;
  };

  // Helper for UI icons and color styles based on UpdateType (Prompt Section 18)
  const getTypeConfig = (type: UpdateType) => {
    switch (type) {
      case 'venue_change':
        return {
          label: 'Venue Change',
          icon: MapPin,
          className: 'update-badge--venue',
          cardClass: 'update-card--venue'
        };
      case 'schedule_change':
        return {
          label: 'Schedule Change',
          icon: Calendar,
          className: 'update-badge--schedule',
          cardClass: 'update-card--schedule'
        };
      case 'speaker_change':
        return {
          label: 'Speaker Change',
          icon: Users,
          className: 'update-badge--speaker',
          cardClass: 'update-card--speaker'
        };
      case 'emergency':
        return {
          label: 'Emergency Alert',
          icon: AlertTriangle,
          className: 'update-badge--emergency',
          cardClass: 'update-card--emergency'
        };
      case 'general_announcement':
      default:
        return {
          label: 'General Announcement',
          icon: Info,
          className: 'update-badge--announcement',
          cardClass: 'update-card--announcement'
        };
    }
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
    <div className="container event-updates-page">
      {/* Back button */}
      <div className="updates-back">
        <button type="button" onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={16} />
          <span>Back to Event</span>
        </button>
      </div>

      {/* Header */}
      <div className="updates-header">
        <div className="updates-header__title-group">
          <span className="updates-event-tag">{event.name}</span>
          <h1 className="updates-page-title">Live Updates & Change Log</h1>
          <p className="updates-page-subtitle">
            Permanent record of venue shifts, time adjustments, and urgent announcements.
          </p>
        </div>

        <div className="live-broadcast-pill">
          <span className="live-broadcast-dot" />
          <span>Live Broadcast Enabled</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="updates-filters">
        <button
          type="button"
          className={`filter-btn ${filterType === 'all' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Updates ({updates.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filterType === 'affects_me' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilterType('affects_me')}
        >
          Affects My Role ({updates.filter((u) => checkAffectsUser(u.audience)).length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filterType === 'venue_schedule' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilterType('venue_schedule')}
        >
          Venue & Schedule Shifts
        </button>
      </div>

      {/* Updates Timeline List (Prompt Section 18) */}
      <div className="updates-timeline">
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map((update) => {
            const config = getTypeConfig(update.type);
            const Icon = config.icon;
            const affectsUser = checkAffectsUser(update.audience);
            const relativeTime = getRelativeTime(update.created_at);

            return (
              <article key={update.id} className={`update-card ${config.cardClass}`}>
                {/* Header row: Type badge, Audience, Relative Time */}
                <div className="update-card__top">
                  <div className="update-card__badges">
                    <span className={`update-badge ${config.className}`}>
                      <Icon size={14} aria-hidden="true" />
                      <span>{config.label}</span>
                    </span>

                    {affectsUser && (
                      <span className="affects-you-pill">
                        <CheckCircle2 size={13} />
                        <span>Affects You</span>
                      </span>
                    )}
                  </div>

                  <div className="update-timestamp">
                    <Clock size={13} aria-hidden="true" />
                    <span>Updated {relativeTime}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="update-card__title">{update.title}</h3>
                <p className="update-card__message">{update.message}</p>

                {/* Footer metadata: Target audience & time */}
                <div className="update-card__footer">
                  <div className="update-audience-tag">
                    <Users size={13} />
                    <span>Target Audience: <strong>{update.audience.toUpperCase()}</strong></span>
                  </div>
                  <div className="update-exact-time">
                    {new Date(update.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} • {new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="updates-empty">
            <Radio size={36} className="updates-empty__icon" />
            <h3>No updates found</h3>
            <p>There are currently no updates matching your selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
