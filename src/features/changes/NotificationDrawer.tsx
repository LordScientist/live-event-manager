import { useEffect } from 'react';
import type { Notification, NotificationStatus } from '../../domain/types';

const STATUS_LABEL: Record<NotificationStatus, string> = {
  pending: 'Sending…',
  delivered: 'Delivered',
  acknowledged: 'Acknowledged',
};

const CHANNEL_ICON: Record<string, string> = {
  push: '🔔',
  sms: '💬',
  email: '✉️',
  app: '📱',
};

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface Props {
  notification: Notification | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}

export function NotificationDrawer({
  notification,
  onClose,
  onAcknowledge,
}: Props) {
  useEffect(() => {
    if (!notification) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [notification, onClose]);

  if (!notification) return null;

  const isAck = notification.status === 'acknowledged';

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Notification preview">
        <header className="drawer-head">
          <div>
            <div className="drawer-eyebrow">Notification preview</div>
            <h3 className="drawer-title">
              <span className="avatar">{initials(notification.personName)}</span>
              {notification.personName}
              <span className={`role-tag role-${notification.role}`}>
                {notification.role}
              </span>
            </h3>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="phone">
          <div className="phone-screen">
            <div className="phone-time">{formatClock(notification.createdAt)}</div>

            <div className="push-notification">
              <div className="push-icon">
                {CHANNEL_ICON[notification.channel] ?? '🔔'}
              </div>
              <div className="push-content">
                <div className="push-app">Live Event Manager</div>
                <div className="push-title">{notification.title}</div>
                <div className="push-body">{notification.body}</div>
              </div>
            </div>

            <div className="phone-footer">
              <div className="phone-line">
                <span className="phone-label">Channel</span>
                <span className="phone-value">
                  {CHANNEL_ICON[notification.channel]}{' '}
                  {notification.channel.toUpperCase()}
                </span>
              </div>
              <div className="phone-line">
                <span className="phone-label">Status</span>
                <span className={`phone-value status-${notification.status}`}>
                  {STATUS_LABEL[notification.status]}
                </span>
              </div>
              {notification.acknowledgedAt && (
                <div className="phone-line">
                  <span className="phone-label">Acknowledged</span>
                  <span className="phone-value">
                    {formatClock(notification.acknowledgedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="drawer-actions">
          <button
            className="btn btn-primary"
            disabled={isAck}
            onClick={() => onAcknowledge(notification.id)}
          >
            {isAck ? '✓ Acknowledged' : 'Mark as acknowledged'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </aside>
    </>
  );
}