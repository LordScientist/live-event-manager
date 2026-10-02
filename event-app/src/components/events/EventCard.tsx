import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Building } from 'lucide-react';
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
}

export const EventCard: React.FC<EventCardProps> = ({ event, actionUrl, actionLabel }) => {
  // Format date: "October 18, 2026"
  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Format time: "09:00 AM"
  const formattedTime = new Date(event.start_date).toLocaleTimeString('en-US', {
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

  return (
    <Card variant="interactive" className="event-card">
      {/* Cover Image with Category & Status Overlay */}
      <div className="event-card__image-wrapper">
        <img
          src={event.cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'}
          alt={`${event.name} cover`}
          className="event-card__image"
          loading="lazy"
        />
        <div className="event-card__badges">
          <span className="event-card__category">{event.category}</span>
          <StatusBadge status={badgeConfig.status} label={badgeConfig.label} />
        </div>
      </div>

      <CardContent className="event-card__content">
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

        {/* View Event Button */}
        <div className="event-card__footer">
          <Link to={destinationUrl} style={{ width: '100%' }}>
            <Button
              variant={event.registration_status === 'registered' ? 'primary' : 'secondary'}
              size="md"
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
