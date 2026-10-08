import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EventCard } from '../../components/events/EventCard';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import type { Registration } from '../../types';
import lcLogoFull from '../../assets/lc-logo-full.png';
import './MyEventsPage.css';

type TabType = 'Upcoming' | 'Past';

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

  // Filtering based on tab & optional search
  const filteredItems = useMemo(() => {
    const now = new Date().toISOString();

    return items.filter((item) => {
      const matchesTab =
        activeTab === 'Past'
          ? item.event.end_date < now
          : item.event.end_date >= now;

      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.event.name.toLowerCase().includes(q) ||
        item.event.venue.toLowerCase().includes(q) ||
        item.event.category.toLowerCase().includes(q)
      );
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div className="my-events-screen">
      <div className="my-events-container">
        {/* 1. Header Bar: Authentic Live Connect Logo + My Events Title */}
        <header className="my-events-header-bar">
          <img
            src={lcLogoFull}
            alt="Live Connect"
            className="my-events-header-logo"
          />
          <h1 className="my-events-title">My Events</h1>
        </header>

        {/* 2. Top Segmented Control Tabs matching Figma Node 1:10 */}
        <div className="my-events-segmented-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'Upcoming'}
            className={`my-events-tab-btn ${activeTab === 'Upcoming' ? 'my-events-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('Upcoming')}
          >
            <span>Upcoming</span>
            {activeTab === 'Upcoming' && <span className="my-events-tab-indicator" />}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'Past'}
            className={`my-events-tab-btn ${activeTab === 'Past' ? 'my-events-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('Past')}
          >
            <span>Past</span>
            {activeTab === 'Past' && <span className="my-events-tab-indicator" />}
          </button>
        </div>

        {/* 3. Search Bar */}
        <div className="my-events-search-wrap">
          <Search size={16} className="my-events-search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search your events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="my-events-search-input"
            aria-label="Search your registered events"
          />
        </div>

        {/* 4. Event Cards List matching Figma Node 1:10 */}
        {isLoading ? (
          <div className="my-events-loading">
            <div className="my-events-skeleton" />
            <div className="my-events-skeleton" />
            <div className="my-events-skeleton" />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="my-events-list" role="list">
            {filteredItems.map(({ registration, event, roleName }) => {
              const isApproved = registration.status === 'approved';

              return (
                <EventCard
                  key={registration.id}
                  variant="compact"
                  event={{
                    ...event,
                    registration_status: isApproved ? 'registered' : 'pending',
                    user_role_name: roleName
                  }}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="my-events-empty-state">
            <div className="my-events-empty-icon">
              <Sparkles size={28} />
            </div>
            <h3 className="my-events-empty-title">
              No {activeTab.toLowerCase()} events
            </h3>
            <p className="my-events-empty-desc">
              {searchQuery
                ? `No events match "${searchQuery}".`
                : activeTab === 'Upcoming'
                ? "You haven't registered for any upcoming events yet."
                : 'You have no past event records.'}
            </p>
            {activeTab === 'Upcoming' && (
              <Link to="/events" className="my-events-browse-link">
                Browse Events
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
