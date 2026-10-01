import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
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
          // Derive readable role name
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

  // Tab Filtering
  const filteredItems = useMemo(() => {
    const now = new Date().toISOString();

    if (activeTab === 'Pending') {
      return items.filter((item) => item.registration.status === 'pending');
    }

    if (activeTab === 'Past') {
      return items.filter(
        (item) => item.registration.status === 'approved' && item.event.end_date < now
      );
    }

    // 'Upcoming' default
    return items.filter(
      (item) => item.registration.status === 'approved' && item.event.end_date >= now
    );
  }, [items, activeTab]);

  return (
    <div className="container my-events-page">
      {/* Header */}
      <div className="my-events-header">
        <h1>My Events</h1>
        <p>Personal event hub for schedules, attendee credentials, and live change notifications.</p>
      </div>

      {/* Tabs (Prompt Section 15: Upcoming | Pending | Past) */}
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

      {/* Content Area */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading your events...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="my-events-grid">
          {filteredItems.map(({ registration, event, roleName }) => {
            // Formatted date: "October 18"
            const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            });

            return (
              <Card key={registration.id} variant="interactive" className="my-event-card">
                <CardContent className="my-event-card__content">
                  <div className="my-event-card__header">
                    <h3 className="my-event-card__title">{event.name}</h3>
                    <StatusBadge
                      status={registration.status === 'approved' ? 'approved' : 'pending'}
                      label={registration.status === 'approved' ? 'Approved' : 'Pending Review'}
                    />
                  </div>

                  <div className="my-event-card__details">
                    <div className="detail-row">
                      <Calendar size={15} />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="detail-row">
                      <MapPin size={15} />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <div className="my-event-card__role-tag">
                    <strong>Role:</strong> {roleName}
                  </div>

                  {/* Button: Open Event (Prompt Section 15) */}
                  <div className="my-event-card__action">
                    <Link to={`/my-events/${event.id}`} style={{ width: '100%' }}>
                      <Button variant="primary" size="md" style={{ width: '100%' }} rightIcon={<ArrowRight size={16} />}>
                        Open Event
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
            {activeTab === 'Upcoming' && 'You have no confirmed upcoming events on your schedule.'}
            {activeTab === 'Pending' && 'You currently have no registrations pending organizer review.'}
            {activeTab === 'Past' && 'You do not have any past event records yet.'}
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
