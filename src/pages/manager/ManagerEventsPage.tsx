import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Settings,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import type { StatusType } from '../../components/ui/StatusBadge';
import { eventService } from '../../services/eventService';
import type { ManagerEventItem } from '../../services/eventService';
import './ManagerEventsPage.css';

type FilterType = 'all' | 'upcoming' | 'past' | 'draft';

export const ManagerEventsPage: React.FC = () => {
  const [events, setEvents] = useState<ManagerEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getManagerEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load manager events', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    const now = new Date();

    return events.filter((evt) => {
      // 1. Tab Filter
      if (activeFilter === 'draft' && evt.status !== 'draft') return false;
      if (activeFilter === 'upcoming') {
        const isUpcomingDate = new Date(evt.end_date) >= now;
        if (evt.status === 'draft' || !isUpcomingDate) return false;
      }
      if (activeFilter === 'past') {
        const isPastDate = new Date(evt.end_date) < now;
        if (evt.status === 'draft' || !isPastDate) return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = evt.name.toLowerCase().includes(q);
        const matchesVenue = evt.venue.toLowerCase().includes(q);
        const matchesCategory = evt.category.toLowerCase().includes(q);
        return matchesName || matchesVenue || matchesCategory;
      }

      return true;
    });
  }, [events, activeFilter, searchQuery]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const now = new Date();
    return {
      all: events.length,
      upcoming: events.filter((e) => e.status !== 'draft' && new Date(e.end_date) >= now).length,
      past: events.filter((e) => e.status !== 'draft' && new Date(e.end_date) < now).length,
      draft: events.filter((e) => e.status === 'draft').length
    };
  }, [events]);

  const formatDateRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', options);
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', options)}`;
  };

  const getStatusBadgeProps = (status: ManagerEventItem['status']): { status: StatusType; label: string } => {
    switch (status) {
      case 'published':
        return { status: 'published', label: 'Published' };
      case 'draft':
        return { status: 'draft', label: 'Draft' };
      case 'completed':
        return { status: 'completed', label: 'Completed' };
      case 'cancelled':
        return { status: 'cancelled', label: 'Cancelled' };
      default:
        return { status: 'info', label: status };
    }
  };

  return (
    <div className="manager-events-page">
      {/* Header & Quick Action */}
      <div className="manager-events-header">
        <div>
          <h1 className="manager-events-header__title">Managed Events</h1>
          <p className="manager-events-header__subtitle">
            View, coordinate, and edit all events hosted by your team.
          </p>
        </div>
        <Link to="/manager/create-event">
          <Button variant="primary" size="md" leftIcon={<PlusCircle size={18} />}>
            Create Event
          </Button>
        </Link>
      </div>

      {/* Controls Bar: Filters + Search */}
      <div className="manager-events-controls">
        <div className="manager-filter-tabs" role="tablist" aria-label="Event Status Filter">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'all'}
            className={`manager-filter-tab ${activeFilter === 'all' ? 'manager-filter-tab--active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All <span className="manager-filter-badge">{counts.all}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'upcoming'}
            className={`manager-filter-tab ${activeFilter === 'upcoming' ? 'manager-filter-tab--active' : ''}`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming <span className="manager-filter-badge">{counts.upcoming}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'past'}
            className={`manager-filter-tab ${activeFilter === 'past' ? 'manager-filter-tab--active' : ''}`}
            onClick={() => setActiveFilter('past')}
          >
            Past <span className="manager-filter-badge">{counts.past}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'draft'}
            className={`manager-filter-tab ${activeFilter === 'draft' ? 'manager-filter-tab--active' : ''}`}
            onClick={() => setActiveFilter('draft')}
          >
            Draft <span className="manager-filter-badge">{counts.draft}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="manager-search-box">
          <Search size={16} className="manager-search-icon" aria-hidden="true" />
          <input
            type="search"
            className="manager-search-input"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search events"
          />
        </div>
      </div>

      {/* Event Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
          Loading managed events...
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="manager-events-list">
          {filteredEvents.map((evt) => {
            const badgeProps = getStatusBadgeProps(evt.status);

            return (
              <div key={evt.id} className="manager-event-card">
                {/* Event Image Cover */}
                <div
                  className="manager-event-card__cover"
                  style={{
                    backgroundImage: evt.cover_image ? `url(${evt.cover_image})` : undefined
                  }}
                  aria-hidden="true"
                />

                {/* Event Body */}
                <div className="manager-event-card__body">
                  <div className="manager-event-card__top">
                    <div>
                      <div className="manager-event-card__meta-badges">
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-surface-subtle)',
                            color: 'var(--color-text-muted)'
                          }}
                        >
                          {evt.category}
                        </span>
                        <StatusBadge status={badgeProps.status} label={badgeProps.label} />
                      </div>

                      <h2 className="manager-event-card__title">
                        <Link to={`/manager/events/${evt.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {evt.name}
                        </Link>
                      </h2>

                      <div className="manager-event-card__details">
                        <span className="manager-event-detail-item">
                          <Calendar size={14} aria-hidden="true" />
                          {formatDateRange(evt.start_date, evt.end_date)}
                        </span>
                        <span className="manager-event-detail-item">
                          <MapPin size={14} aria-hidden="true" />
                          {evt.venue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="manager-event-card__stats">
                    <div className="manager-event-stat">
                      <span className="manager-event-stat__label">Registrations</span>
                      <span className="manager-event-stat__val">
                        {evt.total_registrations}
                        {evt.capacity && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                            {' '}of {evt.capacity} cap
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="manager-event-stat">
                      <span className="manager-event-stat__label">Pending Approvals</span>
                      <span className="manager-event-stat__val">
                        {evt.pending_approvals > 0 ? (
                          <span style={{ color: 'var(--color-warning)' }}>
                            {evt.pending_approvals} pending
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            None
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="manager-event-stat">
                      <span className="manager-event-stat__label">Lifecycle</span>
                      <span className="manager-event-stat__val" style={{ textTransform: 'capitalize' }}>
                        {evt.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Prompt Section 22: Manage, Edit, View Event) */}
                  <div className="manager-event-card__actions">
                    <Link to={`/manager/events/${evt.id}`}>
                      <Button variant="primary" size="sm" rightIcon={<ChevronRight size={15} />}>
                        Manage
                      </Button>
                    </Link>

                    <Link to={`/manager/events/${evt.id}/settings`}>
                      <Button variant="outline" size="sm" leftIcon={<Settings size={14} />}>
                        Edit
                      </Button>
                    </Link>

                    <Link to={`/events/${evt.id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" leftIcon={<ExternalLink size={14} />}>
                        View Event
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State (Prompt Section 36) */
        <div className="manager-events-empty">
          <div className="manager-events-empty__icon" aria-hidden="true">
            <Layers size={28} />
          </div>
          <h3 className="manager-events-empty__title">
            {searchQuery ? 'No matching events found' : 'No events yet'}
          </h3>
          <p className="manager-events-empty__text">
            {searchQuery
              ? `No events match "${searchQuery}". Try adjusting your search or switching filter tabs.`
              : 'Create your first event to start coordinating attendees, schedules, and real-time updates.'}
          </p>
          {searchQuery ? (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          ) : (
            <Link to="/manager/create-event">
              <Button variant="primary" size="md" leftIcon={<PlusCircle size={18} />}>
                Create Event
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
