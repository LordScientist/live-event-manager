import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Sparkles, Calendar, MapPin, ArrowRight, Radio } from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import type { Registration } from '../../types';
import { useAuth } from '../../context/AuthContext';
import './UserHomePage.css';

const CATEGORIES = ['All', 'Conference', 'Workshop', 'Seminar', 'Career', 'Community'] as const;
type Category = typeof CATEGORIES[number];

export const UserHomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<EventWithMeta[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  // Load events and registrations
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      eventService.getEvents(),
      registrationService.getUserRegistrations(currentUser.id)
    ]).then(([eventsData, regsData]) => {
      if (isMounted) {
        setEvents(eventsData);
        setRegistrations(regsData);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentUser.id]);

  // Derive current / active registered event for quicklink dashboard card
  const activeEventData = useMemo(() => {
    if (!registrations.length || !events.length) return null;
    // Find approved registration first, or pending
    const reg = registrations.find((r) => r.status === 'approved') || registrations[0];
    if (!reg) return null;
    const evt = events.find((e) => e.id === reg.event_id);
    if (!evt) return null;

    let roleName = 'Participant';
    if (reg.event_role_id.includes('speaker')) roleName = 'Speaker';
    else if (reg.event_role_id.includes('volunteer')) roleName = 'Volunteer';

    return {
      registration: reg,
      event: evt,
      roleName
    };
  }, [registrations, events]);

  // Time-aware greeting: "Good morning/afternoon/evening, [First Name]"
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let prefix = 'Good afternoon';
    if (hour < 12) prefix = 'Good morning';
    else if (hour >= 18) prefix = 'Good evening';
    return `${prefix}, ${currentUser.first_name || 'Participant'}`;
  }, [currentUser.first_name]);

  // Filtered events by search and category
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesCategory =
        selectedCategory === 'All' || evt.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.organizer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  return (
    <div className="container user-home-page">
      {/* Header Section: Single notification icon, no duplicate profile icon, no greeting subtitle */}
      <section className="user-home-header">
        <div className="user-home-header__top">
          <div className="user-home-greeting">
            <h1 className="user-home-greeting__title">{greeting}</h1>
          </div>
          <div className="user-home-header__quick-actions">
            <Link to="/notifications" className="icon-badge-btn" aria-label="View notifications">
              <Bell size={20} />
              <span className="icon-badge-btn__dot" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="user-home-search">
          <Search size={18} className="user-home-search__icon" aria-hidden="true" />
          <input
            type="search"
            className="user-home-search__input"
            placeholder="Find an event, topic, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Find an event"
          />
          {searchQuery && (
            <button
              type="button"
              className="user-home-search__clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Quicklink Dashboard Card: Shows your current / registered event with quick actions */}
      {activeEventData && (
        <section className="active-event-quicklink" aria-label="Current Event Dashboard">
          <div className="active-event-quicklink__header">
            <span className="active-event-quicklink__tag">
              <Radio size={14} />
              <span>Your Active Event</span>
            </span>
            <StatusBadge
              status={activeEventData.registration.status === 'approved' ? 'approved' : 'pending'}
              label={
                activeEventData.registration.status === 'approved'
                  ? `Approved (${activeEventData.roleName})`
                  : 'Pending Review'
              }
            />
          </div>

          <h2 className="active-event-quicklink__title">{activeEventData.event.name}</h2>

          <div className="active-event-quicklink__meta">
            <div className="active-event-quicklink__meta-item">
              <Calendar size={15} />
              <span>
                {new Date(activeEventData.event.start_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="active-event-quicklink__meta-item">
              <MapPin size={15} />
              <span>{activeEventData.event.venue}</span>
            </div>
          </div>

          <div className="active-event-quicklink__actions">
            <Link to={`/my-events/${activeEventData.event.id}`}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                Open Event Hub
              </Button>
            </Link>
            <Link to={`/events/${activeEventData.event.id}/schedule`}>
              <Button variant="secondary" size="sm">
                View Schedule
              </Button>
            </Link>
            <Link to={`/events/${activeEventData.event.id}/updates`}>
              <Button variant="outline" size="sm">
                Live Updates
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Categories Bar */}
      <section className="user-home-categories" aria-label="Event Categories">
        <div className="categories-scroll">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-pill ${selectedCategory === category ? 'category-pill--active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured / Upcoming Events Grid: No subtitle */}
      <section className="user-home-events" aria-label="Upcoming Events">
        <div className="events-section-header">
          <div>
            <h2 className="events-section-title">
              {selectedCategory === 'All' ? 'Upcoming Events' : `${selectedCategory}s`}
            </h2>
          </div>
          <span className="events-count-badge">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        {isLoading ? (
          <div className="events-loading-skeleton" aria-busy="true">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="events-empty-state">
            <div className="empty-state-icon">
              <Sparkles size={32} />
            </div>
            <h3 className="empty-state-title">No upcoming events yet.</h3>
            <p className="empty-state-desc">
              {searchQuery
                ? `No events match "${searchQuery}". Try adjusting your keywords or clearing the category filter.`
                : 'There are currently no events matching this category.'}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Explore Events
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
