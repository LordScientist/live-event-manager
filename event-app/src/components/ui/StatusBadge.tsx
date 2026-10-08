import React from 'react';
import './StatusBadge.css';

export type StatusType =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'draft'
  | 'published'
  | 'live'
  | 'completed'
  | 'info'
  | 'warning';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

const DEFAULT_LABELS: Record<StatusType, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Not Approved',
  cancelled: 'Cancelled',
  draft: 'Draft',
  published: 'Upcoming',
  live: 'Happening Now',
  completed: 'Past Event',
  info: 'Information',
  warning: 'Attention Needed'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  className = ''
}) => {
  const displayLabel = label || DEFAULT_LABELS[status] || status;
  const isPulsing = status === 'live' || status === 'warning';

  return (
    <span className={`status-badge status-badge--${status} status-badge--${size} ${className}`.trim()}>
      <span className={`status-badge__dot ${isPulsing ? 'status-badge__dot--pulse' : ''}`} aria-hidden="true" />
      <span className="status-badge__text">{displayLabel}</span>
    </span>
  );
};
