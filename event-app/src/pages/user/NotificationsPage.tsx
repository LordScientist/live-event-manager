import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import type { Notification } from '../../types';
import decorTopRight from '../../assets/updates-decor-top-right.png';
import decorBottomRight from '../../assets/updates-decor-bottom-right.png';
import './NotificationsPage.css';

type FilterType = 'all' | 'unread' | 'urgent';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load user notifications
  useEffect(() => {
    let isMounted = true;
    notificationService.getUserNotifications(currentUser.id).then((data) => {
      if (!isMounted) return;
      setNotifications(data);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [currentUser.id]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(currentUser.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      await notificationService.clearAllNotifications(currentUser.id);
      setNotifications([]);
    }
  };

  // Filtered list based on activeFilter
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    if (activeFilter === 'urgent') {
      return notifications.filter(
        (n) => n.type === 'venue_change' || n.type === 'schedule_change'
      );
    }
    return notifications;
  }, [notifications, activeFilter]);

  // Group notifications into Today and Earlier
  const { todayList, earlierList, unreadCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayItems: Notification[] = [];
    const earlierItems: Notification[] = [];
    let count = 0;

    notifications.forEach((item) => {
      if (!item.read) count++;
    });

    filteredNotifications.forEach((item) => {
      const itemDate = new Date(item.created_at);
      if (itemDate >= today) {
        todayItems.push(item);
      } else {
        earlierItems.push(item);
      }
    });

    return { todayList: todayItems, earlierList: earlierItems, unreadCount: count };
  }, [notifications, filteredNotifications]);

  // Priority queue tag and styling
  const getPriorityBadge = (title: string, type: string) => {
    const lower = title.toLowerCase();
    if (type === 'venue_change' || lower.includes('venue')) {
      return <span className="notif-priority-pill notif-priority-pill--venue">Venue Shift</span>;
    }
    if (type === 'schedule_change' || lower.includes('schedule') || lower.includes('time')) {
      return <span className="notif-priority-pill notif-priority-pill--schedule">Schedule Update</span>;
    }
    return <span className="notif-priority-pill notif-priority-pill--status">Official Notice</span>;
  };

  const getNotificationIcon = (title: string, type: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('venue') || type === 'venue_change') {
      return <MapPin size={20} className="notif-icon notif-icon--venue" />;
    }
    if (lower.includes('schedule') || type === 'schedule_change') {
      return <Clock size={20} className="notif-icon notif-icon--schedule" />;
    }
    if (lower.includes('approved') || lower.includes('registration')) {
      return <Bell size={20} className="notif-icon notif-icon--approved" />;
    }
    return <Bell size={20} className="notif-icon notif-icon--default" />;
  };

  const renderNotificationCard = (item: Notification) => {
    const isUnread = !item.read;

    return (
      <div
        key={item.id}
        className={`notif-card ${isUnread ? 'notif-card--unread' : ''}`}
      >
        <div className="notif-card__icon-wrapper">
          {getNotificationIcon(item.title, item.type)}
        </div>

        <div className="notif-card__content">
          <div className="notif-card__top">
            <div className="notif-card__title-row">
              <h3 className="notif-card__title">{item.title}</h3>
              {getPriorityBadge(item.title, item.type)}
            </div>

            <div className="notif-card__meta-info">
              {isUnread && <span className="unread-dot" aria-label="Unread notification" />}
              <span className="notif-card__time">
                {new Date(item.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <p className="notif-card__message">{item.message}</p>

          <div className="notif-card__footer">
            <Link to={`/my-events/${item.event_id}`} className="notif-link">
              <span>View event details</span>
              <ArrowRight size={13} />
            </Link>

            <div className="notif-card__footer-actions">
              {isUnread && (
                <button
                  type="button"
                  className="mark-read-btn"
                  onClick={(e) => handleMarkAsRead(item.id, e)}
                  title="Mark as read"
                >
                  <Check size={14} />
                  <span>Mark as read</span>
                </button>
              )}

              <button
                type="button"
                className="delete-notif-btn"
                onClick={(e) => handleDeleteNotification(item.id, e)}
                title="Delete notification"
                aria-label="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="notifications-page">
      {/* Decorative background shapes */}
      <img
        src={decorTopRight}
        alt=""
        className="notifications-decor-top-right"
        aria-hidden="true"
      />
      <img
        src={decorBottomRight}
        alt=""
        className="notifications-decor-bottom-right"
        aria-hidden="true"
      />

      <div className="notifications-content-wrap">
        {/* Header */}
        <div className="notifications-header">
          <div className="notifications-header__main">
            <div className="header-badge-row">
              <h1 className="notifications-page-title">Notifications</h1>
              {unreadCount > 0 && (
                <span className="unread-counter-badge">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="notifications-subtitle">
              Live updates on room assignments, schedule shifts, and registration statuses.
            </p>
          </div>

          <div className="notifications-header__actions">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              leftIcon={<CheckCheck size={16} />}
            >
              Mark all read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              leftIcon={<Trash2 size={15} />}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Queue Filter Bar */}
      {notifications.length > 0 && (
        <div className="notifications-queue-filter" role="tablist" aria-label="Notification queue filters">
          <button
            type="button"
            className={`queue-filter-pill ${activeFilter === 'all' ? 'queue-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Updates ({notifications.length})
          </button>
          <button
            type="button"
            className={`queue-filter-pill ${activeFilter === 'unread' ? 'queue-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`queue-filter-pill ${activeFilter === 'urgent' ? 'queue-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('urgent')}
          >
            Urgent Shifts & Times
          </button>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading notifications...</p>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="notifications-groups">
          {/* TODAY GROUP */}
          {todayList.length > 0 && (
            <section className="notifications-section">
              <h2 className="group-heading">Today's Queue ({todayList.length})</h2>
              <div className="notif-list">
                {todayList.map((item) => renderNotificationCard(item))}
              </div>
            </section>
          )}

          {/* EARLIER GROUP */}
          {earlierList.length > 0 && (
            <section className="notifications-section">
              <h2 className="group-heading">Earlier History ({earlierList.length})</h2>
              <div className="notif-list">
                {earlierList.map((item) => renderNotificationCard(item))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="notifications-empty">
          <div className="notif-empty-icon">
            <CheckCircle2 size={36} />
          </div>
          <h3>You're all caught up!</h3>
          <p>
            {activeFilter !== 'all'
              ? `No notifications found matching the "${activeFilter}" filter.`
              : 'You have no notifications or urgent schedule changes at this time.'}
          </p>
        </div>
      )}
      </div>
    </div>
  );
};
