import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Building, ChevronRight, User, Heart } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import type { StatusType } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import type { EventWithMeta } from '../../services/eventService';
import './EventCard.css';

export interface EventCardProps {
  event: EventWithMeta;
  actionUrl?: string;
  actionLabel?: string;
  variant?: 'grid' | 'compact';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  actionUrl,
  actionLabel,
  variant = 'grid'
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const startDate = new Date(event.start_date);
  const monthAbbr = startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = startDate.toLocaleDateString('en-US', { day: 'numeric' });

  // Format date: "October 18, 2026"
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Format time: "09:00 AM"
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Map registration status to badge styling (Section 8)
  const getStatusBadgeConfig = (): { status: StatusType; label: string } => {
    switch (event.registration_status) {
      case 'registered':
        return {
          status: 'approved',
          label: event.user_role_name ? `Registered (${event.user_role_name})` : 'Registered'
        };
      case 'pending':
        return { status: 'pending', label: 'Pending Approval' };
      case 'closing_soon':
        return { status: 'warning', label: 'Closing Soon' };
      case 'full':
        return { status: 'rejected', label: 'Registration Full' };
      case 'open':
      default:
        return { status: 'published', label: 'Open' };
    }
  };

  const badgeConfig = getStatusBadgeConfig();
  const destinationUrl = actionUrl || (event.registration_status === 'registered' ? `/my-events/${event.id}` : `/events/${event.id}`);
  const buttonLabel = actionLabel || (event.registration_status === 'registered' ? 'Open Event' : 'View Event');

  if (variant === 'compact') {
    return (
      <Card variant="interactive" className="event-card event-card--compact">
        {/* Left: Distinct Date Block */}
        <div className="event-card__compact-date">
          <span className="event-card__date-month">{monthAbbr}</span>
          <span className="event-card__date-day">{dayNum}</span>
        </div>

        {/* Center: Info Column (Guaranteed Zero Overlaps) */}
        <div className="event-card__compact-info">
          <div className="event-card__compact-header">
            <StatusBadge status={badgeConfig.status} label={badgeConfig.label} />
          </div>
          <h4 className="event-card__compact-title">
            <Link to={destinationUrl} className="event-card__title-link">
              {event.name}
            </Link>
          </h4>
          <div className="event-card__compact-meta">
            <span><Clock size={13} aria-hidden="true" /> {formattedTime}</span>
            <span><MapPin size={13} aria-hidden="true" /> {event.venue}</span>
          </div>
          <div className="event-card__compact-tags">
            <span className="event-card__compact-category">{event.category}</span>
            {event.user_role_name && (
              <span className="event-card__role-pill">
                <User size={12} aria-hidden="true" /> {event.user_role_name}
              </span>
            )}
          </div>
        </div>

        {/* Right: Chevron Link Action */}
        <Link to={destinationUrl} className="event-card__compact-arrow" aria-label={`Open ${event.name}`}>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="interactive" className="event-card event-card--grid">
      {/* Cover Image with Category & Status Overlay */}
      <div className="event-card__image-wrapper">
        <img
          src={event.cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'}
          alt={`${event.name} cover`}
          className="event-card__image"
          loading="lazy"
        />
        <div className="event-card__date-overlay">
          <span className="event-card__date-month">{monthAbbr}</span>
          <span className="event-card__date-day">{dayNum}</span>
        </div>

        {/* Top-Right Frosted Favorite / Bookmark Button (Image 1 Inspiration) */}
        <button
          type="button"
          className={`event-card__favorite-btn ${isBookmarked ? 'event-card__favorite-btn--active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
          title={isBookmarked ? 'Bookmarked' : 'Bookmark event'}
        >
          <Heart size={15} fill={isBookmarked ? '#ef4444' : 'none'} color={isBookmarked ? '#ef4444' : '#ffffff'} />
        </button>

        <div className="event-card__badges">
          <span className="event-card__category">{event.category}</span>
          <div className="event-card__status-wrap">
            <StatusBadge status={badgeConfig.status} label={badgeConfig.label} />
          </div>
        </div>
      </div>

      <CardContent className="event-card__content">
        {/* Tactile Attendees Pill (Image 1 Inspiration: "150+ Joined") */}
        <div className="event-card__attendees-pill">
          <div className="attendee-avatars" aria-hidden="true">
            <span className="attendee-avatar attendee-avatar--blue">J</span>
            <span className="attendee-avatar attendee-avatar--amber">S</span>
            <span className="attendee-avatar attendee-avatar--emerald">D</span>
          </div>
          <span className="attendee-count-text">
            {event.registered_count ? `${event.registered_count}+ Joined` : '120+ Joined'}
          </span>
        </div>

        <h3 className="event-card__title">
          <Link to={destinationUrl} className="event-card__title-link">
            {event.name}
          </Link>
        </h3>

        {/* Organizer */}
        <div className="event-card__organizer">
          <Building size={14} aria-hidden="true" />
          <span>Organized by {event.organizer_name}</span>
        </div>

        {/* Metadata Details */}
        <div className="event-card__meta">
          <div className="event-card__meta-item">
            <Calendar size={15} aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>
          <div className="event-card__meta-item">
            <Clock size={15} aria-hidden="true" />
            <span>{formattedTime}</span>
          </div>
          <div className="event-card__meta-item">
            <MapPin size={15} aria-hidden="true" />
            <span title={`${event.venue}, ${event.location_details || ''}`}>
              {event.venue}
            </span>
          </div>
        </div>

        {/* View Event Button with 3D Luminous Bloom */}
        <div className="event-card__footer">
          <Link to={destinationUrl} style={{ width: '100%' }}>
            <Button
              variant={event.registration_status === 'registered' ? 'primary' : 'secondary'}
              size="md"
              className={event.registration_status === 'registered' ? 'luminous-bloom' : ''}
              style={{ width: '100%' }}
            >
              {buttonLabel}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
