import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  AlertTriangle,
  ArrowLeft,
  Search
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { scheduleService } from '../../services/scheduleService';
import type { ScheduleItem } from '../../types';
import decorTopRight from '../../assets/updates-decor-top-right.png';
import decorBottomRight from '../../assets/updates-decor-bottom-right.png';
import './EventSchedulePage.css';

interface EnrichedScheduleItem extends ScheduleItem {
  status: 'upcoming' | 'live' | 'completed' | 'changed';
  isChanged?: boolean;
  changeNote?: {
    type: 'venue_changed' | 'time_shifted';
    previous: string;
    current: string;
  };
}

export const EventSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [scheduleItems, setScheduleItems] = useState<EnrichedScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Changes Only'>('All');

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    Promise.all([
      eventService.getEventById(id),
      scheduleService.getEventSchedule(id)
    ]).then(([evtData, schData]) => {
      if (!isMounted) return;

      setEvent(evtData);

      // Enrich items with statuses and prompt Section 17 changes example
      const enriched: EnrichedScheduleItem[] = schData.map((item, idx) => {
        if (idx === 0) {
          return {
            ...item,
            status: 'completed',
            venue: 'Main Entrance'
          };
        }
        if (idx === 1) {
          return {
            ...item,
            status: 'live',
            venue: 'Great Hall'
          };
        }
        if (idx === 2) {
          return {
            ...item,
            title: 'AI & Future of Work',
            speaker_name: 'Jane Doe',
            status: 'changed',
            isChanged: true,
            changeNote: {
              type: 'venue_changed',
              previous: 'Room 204',
              current: 'Main Auditorium'
            }
          };
        }
        return {
          ...item,
          status: 'upcoming'
        };
      });

      setScheduleItems(enriched);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading || !event) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading schedule...</p>
      </div>
    );
  }

  const filteredSchedule = scheduleItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.speaker_name && item.speaker_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'All' || item.isChanged;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="event-schedule-page">
      {/* Decorative background shapes */}
      <img
        src={decorTopRight}
        alt=""
        className="schedule-decor-top-right"
        aria-hidden="true"
      />
      <img
        src={decorBottomRight}
        alt=""
        className="schedule-decor-bottom-right"
        aria-hidden="true"
      />

      <div className="schedule-content-wrap">
        {/* Top Back Navigation Bar */}
        <header className="schedule-top-bar">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="schedule-back-btn"
            aria-label="Back to event"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="schedule-top-title-group">
            <span className="schedule-event-label">{event.name}</span>
            <h1 className="schedule-page-title">Event Schedule</h1>
          </div>
        </header>

      {/* Controls Bar: Search & Change Filter */}
      <div className="schedule-controls">
        <div className="schedule-search-box">
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search sessions, speakers, or rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="schedule-search-input"
          />
        </div>

        <div className="schedule-filter-pills">
          <button
            type="button"
            className={`filter-pill ${selectedFilter === 'All' ? 'filter-pill--active' : ''}`}
            onClick={() => setSelectedFilter('All')}
          >
            All Sessions ({scheduleItems.length})
          </button>
          <button
            type="button"
            className={`filter-pill filter-pill--warning ${selectedFilter === 'Changes Only' ? 'filter-pill--active' : ''}`}
            onClick={() => setSelectedFilter('Changes Only')}
          >
            <AlertTriangle size={14} />
            <span>Updated Sessions ({scheduleItems.filter((i) => i.isChanged).length})</span>
          </button>
        </div>
      </div>

      {/* Timeline List (Prompt Section 17) */}
      <div className="schedule-timeline">
        {filteredSchedule.map((item, index) => {
          const startTimeFormatted = new Date(item.start_time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          const endTimeFormatted = new Date(item.end_time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          return (
            <div
              key={item.id}
              className={`schedule-timeline-item ${item.isChanged ? 'schedule-timeline-item--changed' : ''}`}
            >
              {/* Left Column: Time */}
              <div className="timeline-item__time-col">
                <span className="timeline-start-time">{startTimeFormatted}</span>
                <span className="timeline-end-time">{endTimeFormatted}</span>
              </div>

              {/* Middle Column: Line & Dot */}
              <div className="timeline-item__axis">
                <div
                  className={`timeline-dot ${item.status === 'live' ? 'timeline-dot--live' : item.isChanged ? 'timeline-dot--changed' : ''}`}
                />
                {index < filteredSchedule.length - 1 && <div className="timeline-axis-line" />}
              </div>

              {/* Right Column: Card Content */}
              <div className="timeline-item__card">
                <div className="timeline-card-header">
                  <div className="timeline-card-title-group">
                    <h3 className="timeline-card-title">{item.title}</h3>
                    {item.speaker_name && (
                      <div className="timeline-speaker-tag">
                        <Users size={14} />
                        <span>Speaker: <strong>{item.speaker_name}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="timeline-status-badge">
                    {item.isChanged ? (
                      <span className="change-warning-badge">
                        <AlertTriangle size={13} />
                        <span>Venue Changed</span>
                      </span>
                    ) : (
                      <StatusBadge
                        status={item.status === 'live' ? 'live' : item.status === 'completed' ? 'completed' : 'published'}
                        label={item.status === 'live' ? 'Happening Now' : item.status === 'completed' ? 'Completed' : 'Upcoming'}
                      />
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="timeline-card-desc">{item.description}</p>
                )}

                {/* Change Callout Box (Prompt Section 17: Previous: Room 204 -> New: Main Auditorium) */}
                {item.changeNote && (
                  <div className="change-details-callout">
                    <div className="change-callout-title">
                      <AlertTriangle size={14} />
                      <span>Notice: Location Change</span>
                    </div>
                    <div className="change-callout-comparison">
                      <div className="change-prev">
                        <span className="change-label">Previous:</span>
                        <span className="change-value change-value--strikethrough">{item.changeNote.previous}</span>
                      </div>
                      <div className="change-arrow">→</div>
                      <div className="change-curr">
                        <span className="change-label">New:</span>
                        <span className="change-value change-value--highlight">{item.changeNote.current}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Standard Venue Display */}
                {!item.changeNote && (
                  <div className="timeline-card-venue">
                    <MapPin size={15} />
                    <span>{item.venue}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
