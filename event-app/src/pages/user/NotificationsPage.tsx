import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import type { Notification } from '../../types';
import './NotificationsPage.css';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  // Group notifications into Today and Earlier (Prompt Section 19)
  const { todayList, earlierList, unreadCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayItems: Notification[] = [];
    const earlierItems: Notification[] = [];
    let count = 0;

    notifications.forEach((item) => {
      if (!item.read) count++;
      const itemDate = new Date(item.created_at);
      if (itemDate >= today) {
        todayItems.push(item);
      } else {
        earlierItems.push(item);
      }
    });

    return { todayList: todayItems, earlierList: earlierItems, unreadCount: count };
  }, [notifications]);

  // Icon mapping according to Prompt examples
  const getNotificationIcon = (title: string, type: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('venue') || type === 'venue_change') {
      return <MapPin size={18} className="notif-icon notif-icon--venue" />;
    }
    if (lowerTitle.includes('schedule') || type === 'schedule_change') {
      return <Clock size={18} className="notif-icon notif-icon--schedule" />;
    }
    if (lowerTitle.includes('approved') || lowerTitle.includes('registration')) {
      return <Bell size={18} className="notif-icon notif-icon--approved" />;
    }
    return <Bell size={18} className="notif-icon notif-icon--default" />;
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
          <div className="notif-card__header">
            <h3 className="notif-card__title">
              {item.title}
              {isUnread && <span className="unread-dot" aria-label="Unread notification" />}
            </h3>
            <span className="notif-card__time">
              {new Date(item.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <p className="notif-card__message">{item.message}</p>

          <div className="notif-card__actions">
            <Link to={`/my-events/${item.event_id}`} className="notif-link">
              <span>View details</span>
              <ArrowRight size={13} />
            </Link>

            {isUnread && (
              <button
                type="button"
                className="mark-read-btn"
                onClick={(e) => handleMarkAsRead(item.id, e)}
                title="Mark as read"
              >
                <Check size={13} />
                <span>Mark as read</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container notifications-page">
      {/* Header */}
      <div className="notifications-header">
        <div>
          <div className="header-badge-row">
            <h1>Notifications</h1>
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

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            leftIcon={<CheckCheck size={16} />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="notifications-groups">
          {/* TODAY GROUP (Prompt Section 19) */}
          {todayList.length > 0 && (
            <section className="notifications-section">
              <h2 className="group-heading">Today</h2>
              <div className="notif-list">
                {todayList.map((item) => renderNotificationCard(item))}
              </div>
            </section>
          )}

          {/* EARLIER GROUP (Prompt Section 19) */}
          {earlierList.length > 0 && (
            <section className="notifications-section">
              <h2 className="group-heading">Earlier</h2>
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
          <p>You have no notifications or urgent schedule changes at this time.</p>
        </div>
      )}
    </div>
  );
};
