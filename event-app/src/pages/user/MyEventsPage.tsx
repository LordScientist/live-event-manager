import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import type { Registration } from '../../types';
import './MyEventsPage.css';

type TabType = 'Upcoming' | 'Pending' | 'Past';

interface EnrichedRegistration {
  registration: Registration;
  event: EventWithMeta;
  roleName: string;
}

export const MyEventsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const [items, setItems] = useState<EnrichedRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      registrationService.getUserRegistrations(currentUser.id),
      eventService.getEvents()
    ]).then(([regs, allEvents]) => {
      if (!isMounted) return;

      const enriched: EnrichedRegistration[] = [];
      for (const reg of regs) {
        const foundEvt = allEvents.find((e) => e.id === reg.event_id);
        if (foundEvt) {
          let roleName = 'Participant';
          if (reg.event_role_id.includes('speaker')) roleName = 'Speaker';
          else if (reg.event_role_id.includes('volunteer')) roleName = 'Volunteer';

          enriched.push({
            registration: reg,
            event: foundEvt,
            roleName
          });
        }
      }
      setItems(enriched);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [currentUser.id]);

  // Tab & Search Filtering
  const filteredItems = useMemo(() => {
    const now = new Date().toISOString();

    return items.filter((item) => {
      // Tab check
      let matchesTab = false;
      if (activeTab === 'Pending') {
        matchesTab = item.registration.status === 'pending';
      } else if (activeTab === 'Past') {
        matchesTab = item.registration.status === 'approved' && item.event.end_date < now;
      } else {
        // 'Upcoming'
        matchesTab = item.registration.status === 'approved' && item.event.end_date >= now;
      }

      if (!matchesTab) return false;

      // Search check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.event.name.toLowerCase().includes(q) ||
        item.event.venue.toLowerCase().includes(q) ||
        item.event.category.toLowerCase().includes(q) ||
        item.roleName.toLowerCase().includes(q)
      );
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div className="container my-events-page">
      {/* Header: Title only, no description */}
      <div className="my-events-header">
        <h1>My Events</h1>
      </div>

      {/* Search Bar */}
      <div className="my-events-search">
        <Search size={18} className="my-events-search__icon" aria-hidden="true" />
        <input
          type="search"
          className="my-events-search__input"
          placeholder="Search your registered events or venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search your events"
        />
        {searchQuery && (
          <button
            type="button"
            className="my-events-search__clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="my-events-tabs" role="tablist">
        {(['Upcoming', 'Pending', 'Past'] as const).map((tab) => {
          const count =
            tab === 'Pending'
              ? items.filter((i) => i.registration.status === 'pending').length
              : tab === 'Past'
              ? items.filter((i) => i.registration.status === 'approved' && i.event.end_date < new Date().toISOString()).length
              : items.filter((i) => i.registration.status === 'approved' && i.event.end_date >= new Date().toISOString()).length;

          return (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={activeTab === tab}
              className={`tab-btn ${activeTab === tab ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
              <span className="tab-counter">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area with EventCard */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading your events...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="my-events-grid">
          {filteredItems.map(({ registration, event, roleName }) => {
            const isApproved = registration.status === 'approved';
            return (
              <EventCard
                key={registration.id}
                event={{
                  ...event,
                  registration_status: isApproved ? 'registered' : 'pending',
                  user_role_name: roleName
                }}
                actionUrl={isApproved ? `/my-events/${event.id}` : `/events/${event.id}`}
                actionLabel={isApproved ? 'Open Event' : 'View Application'}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="my-events-empty">
          <div className="empty-icon">
            <Sparkles size={32} />
          </div>
          <h3>No {activeTab.toLowerCase()} events</h3>
          <p>
            {searchQuery
              ? `No ${activeTab.toLowerCase()} events match "${searchQuery}".`
              : activeTab === 'Upcoming'
              ? 'You have no confirmed upcoming events on your schedule.'
              : activeTab === 'Pending'
              ? 'You currently have no registrations pending organizer review.'
              : 'You do not have any past event records yet.'}
          </p>
          {activeTab !== 'Past' && (
            <Link to="/events">
              <Button variant="primary" size="md">
                Browse Events
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
