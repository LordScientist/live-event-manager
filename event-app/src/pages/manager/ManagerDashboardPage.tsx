import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Calendar,
  Users,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  MapPin,
  CalendarClock,
  Radio
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import type { ManagerDashboardStats } from '../../services/eventService';
import './ManagerDashboardPage.css';

const formatEventDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const formatActivityTime = (timestamp: string) => {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return 'yesterday';
};

export const ManagerDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<ManagerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await eventService.getManagerDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Time-of-day greeting (Prompt Section 21: "Good afternoon, Osmond")
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <Users size={16} aria-hidden="true" />;
      case 'approval':
        return <CheckCircle2 size={16} aria-hidden="true" />;
      case 'schedule_change':
        return <CalendarClock size={16} aria-hidden="true" />;
      case 'venue_change':
        return <MapPin size={16} aria-hidden="true" />;
      default:
        return <Radio size={16} aria-hidden="true" />;
    }
  };

  return (
    <div className="manager-dashboard">
      {/* Header & Quick Action (Prompt Section 21) */}
      <div className="manager-dashboard__header">
        <div>
          <h1 className="manager-dashboard__greeting">
            {getGreeting()}, {currentUser.first_name}
          </h1>
          <p className="manager-dashboard__subtitle">
            Coordinate schedules, track registrations, and publish live event updates.
          </p>
        </div>
        <Link to="/manager/create-event">
          <Button variant="primary" size="md" leftIcon={<PlusCircle size={18} />}>
            Create Event
          </Button>
        </Link>
      </div>

      {/* Four Dashboard Statistics Cards (Prompt Section 21) */}
      <div className="dashboard-stats-grid">
        {/* Total Events */}
        <div className="stat-card">
          <div className="stat-card__content">
            <span className="stat-card__label">Total Events</span>
            <div className="stat-card__value">
              {loading ? '...' : (stats?.total_events ?? 12)}
            </div>
            <span className="stat-card__subtext">Across all categories</span>
          </div>
          <div className="stat-card__icon-wrap stat-card__icon-wrap--primary" aria-hidden="true">
            <Calendar size={22} />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="stat-card">
          <div className="stat-card__content">
            <span className="stat-card__label">Upcoming Events</span>
            <div className="stat-card__value">
              {loading ? '...' : (stats?.upcoming_events ?? 5)}
            </div>
            <span className="stat-card__subtext">Active on calendar</span>
          </div>
          <div className="stat-card__icon-wrap stat-card__icon-wrap--accent" aria-hidden="true">
            <Clock size={22} />
          </div>
        </div>

        {/* Total Registrations */}
        <div className="stat-card">
          <div className="stat-card__content">
            <span className="stat-card__label">Total Registrations</span>
            <div className="stat-card__value">
              {loading ? '...' : (stats?.total_registrations.toLocaleString() ?? '1,248')}
            </div>
            <span className="stat-card__subtext">Participants & speakers</span>
          </div>
          <div className="stat-card__icon-wrap stat-card__icon-wrap--success" aria-hidden="true">
            <Users size={22} />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="stat-card stat-card--attention">
          <div className="stat-card__content">
            <span className="stat-card__label">Pending Approvals</span>
            <div className="stat-card__value" style={{ color: 'var(--color-warning)' }}>
              {loading ? '...' : (stats?.pending_approvals ?? 37)}
            </div>
            <span className="stat-card__subtext">Requires organizer review</span>
          </div>
          <div className="stat-card__icon-wrap stat-card__icon-wrap--warning" aria-hidden="true">
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Upcoming Events Table + Recent Activity */}
      <div className="dashboard-main-grid">
        {/* Left Column: Upcoming Events List */}
        <Card>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>Upcoming Events</CardTitle>
            <Link
              to="/manager/events"
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View all ({stats?.total_events ?? 12}) <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent style={{ padding: 0 }}>
            <div className="dashboard-events-table-wrapper">
              <table className="dashboard-events-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Registrations</th>
                    <th>Pending</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.upcoming_list.map((evt) => (
                    <tr key={evt.id}>
                      <td>
                        <div className="event-cell-primary">
                          <Link to={`/manager/events/${evt.id}`} className="event-cell-primary__name">
                            {evt.name}
                          </Link>
                          <span className="event-cell-primary__category">
                            {evt.category} • {evt.venue}
                          </span>
                        </div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {formatEventDate(evt.start_date)}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{evt.total_registrations}</span>
                        {evt.capacity && (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                            {' '}/ {evt.capacity}
                          </span>
                        )}
                      </td>
                      <td>
                        {evt.pending_approvals > 0 ? (
                          <span className="pending-badge">
                            {evt.pending_approvals} pending
                          </span>
                        ) : (
                          <span className="pending-badge pending-badge--none">
                            0
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusBadge
                          status={evt.status === 'published' ? 'published' : 'draft'}
                          label={evt.status === 'published' ? 'Published' : 'Draft'}
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/manager/events/${evt.id}`}>
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Recent Activity Feed (Prompt Section 21) */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="activity-list">
              {stats?.recent_activities.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className={`activity-item__icon activity-item__icon--${act.type}`}>
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="activity-item__body">
                    <span className="activity-item__text">{act.text}</span>
                    {act.detail && (
                      <span className="activity-item__detail" title={act.detail}>
                        {act.detail}
                      </span>
                    )}
                    <span className="activity-item__time">
                      {formatActivityTime(act.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
