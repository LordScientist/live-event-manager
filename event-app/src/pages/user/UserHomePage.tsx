import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Sparkles } from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/ui/Button';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import './UserHomePage.css';

const CATEGORIES = ['All', 'Conference', 'Workshop', 'Seminar', 'Career', 'Community'] as const;
type Category = typeof CATEGORIES[number];

export const UserHomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<EventWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  // Load events via async service
  useEffect(() => {
    let isMounted = true;
    eventService.getEvents().then((data) => {
      if (isMounted) {
        setEvents(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
      {/* Header Section (Prompt Section 7: Greeting, Search bar, Notification icon, Profile avatar) */}
      <section className="user-home-header">
        <div className="user-home-header__top">
          <div className="user-home-greeting">
            <h1 className="user-home-greeting__title">{greeting}</h1>
            <p className="user-home-greeting__subtitle">
              Find your events and see what is happening next.
            </p>
          </div>
          <div className="user-home-header__quick-actions">
            <Link to="/notifications" className="icon-badge-btn" aria-label="View notifications">
              <Bell size={20} />
              <span className="icon-badge-btn__dot" />
            </Link>
            <Link to="/profile" className="profile-avatar-btn" aria-label="View profile">
              {currentUser.first_name[0]}{currentUser.last_name[0]}
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

      {/* Categories Bar (Prompt Section 7: Horizontal scroll on mobile) */}
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

      {/* Featured / Upcoming Events Grid */}
      <section className="user-home-events" aria-label="Upcoming Events">
        <div className="events-section-header">
          <div>
            <h2 className="events-section-title">
              {selectedCategory === 'All' ? 'Upcoming Events' : `${selectedCategory}s`}
            </h2>
            <p className="events-section-subtitle">
              Browse sessions, verify accessible facilities, and sign up in your chosen role.
            </p>
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
          /* Empty State (Prompt Section 7: "No upcoming events yet." + Button: "Explore Events") */
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
