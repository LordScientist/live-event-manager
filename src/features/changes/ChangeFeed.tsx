import { useCallback, useEffect, useState } from 'react';
import type {
  Change, Notification, NotificationStatus, Session, Venue,
} from '../../domain/types';
import { useDataService } from '../../app/DataProvider';

const CHANGE_LABEL: Record<Change['type'], string> = {
  session_moved: '🔀 Session moved',
  time_changed: '⏰ Time changed',
  session_cancelled: '❌ Session cancelled',
};

const STATUS_LABEL: Record<NotificationStatus, string> = {
  pending: 'Sending…',
  delivered: 'Delivered',
  acknowledged: 'Acknowledged',
};

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 5) return 'just now';
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(iso).toLocaleTimeString();
}

export function ChangeFeed() {
  const data = useDataService();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = useCallback(async () => {
    setSessions(await data.getSessions());
    setVenues(await data.getVenues());
    setChanges(await data.getChanges());
    setNotifications(await data.getNotifications());
  }, [data]);

  useEffect(() => {
    refresh();
    const unsubscribe = data.subscribeToChanges(() => {
      refresh();
    });
    return unsubscribe;
  }, [data, refresh]);

  // Re-render every second so "2s ago" and progress stay fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  async function moveSession(sessionId: string, newVenueId: string) {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;
    await data.applyChange({
      type: 'session_moved',
      sessionId,
      sessionTitle: session.title,
      oldValue: session.venueId,
      newValue: newVenueId,
    });
  }

  const venueName = (id: string) =>
    venues.find((v) => v.id === id)?.name ?? id;

  return (
    <>
      <div className="trigger">
        <h2 className="section-title">Simulate a last-minute change</h2>
        {sessions.map((s) => (
          <div key={s.id} className="trigger-row">
            <span className="label">{s.title}</span>
            <select
              value={s.venueId}
              onChange={(e) => moveSession(s.id, e.target.value)}
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <h2 className="section-title">Change feed</h2>
      <div className="feed">
        {changes.length === 0 && (
          <div className="empty">
            No changes yet. Move a session above to see the ripple.
          </div>
        )}

        {changes.map((c) => {
          const affected = notifications.filter((n) => n.changeId === c.id);
          const acked = affected.filter((n) => n.status === 'acknowledged').length;
          const total = affected.length;
          const pct = total === 0 ? 0 : Math.round((acked / total) * 100);
          const pending = affected.filter((n) => n.status !== 'acknowledged');

          return (
            <div key={c.id} className="change-card">
              <div className="change-head">
                <span className="change-badge">{CHANGE_LABEL[c.type]}</span>
                <span className="change-time">{timeAgo(c.createdAt)}</span>
              </div>

              <div className="change-headline">
                <strong>{c.sessionTitle}</strong>
              </div>

              {c.type === 'session_moved' && (
                <div className="change-detail">
                  <span className="old">{venueName(String(c.oldValue))}</span>
                  <span className="arrow">→</span>
                  <span className="new">{venueName(String(c.newValue))}</span>
                </div>
              )}

              <div className="progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="progress-label">
                  <span>
                    <strong>{acked}</strong> / {total} acknowledged
                  </span>
                  <span className="progress-pct">{pct}%</span>
                </div>
              </div>

              <div className="affected-label">Reached</div>
              <div className="affected">
                {affected.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`person status-${n.status}`}
                    onClick={() => data.acknowledgeNotification(n.id)}
                    title={
                      n.status === 'acknowledged'
                        ? `Acknowledged ${n.acknowledgedAt ? timeAgo(n.acknowledgedAt) : ''}`
                        : `Click to ack — ${STATUS_LABEL[n.status]}`
                    }
                  >
                    <span className="avatar">{initials(n.personName)}</span>
                    {n.personName}
                    <span className={`role-tag role-${n.role}`}>{n.role}</span>
                    <span className={`dot dot-${n.status}`} />
                  </button>
                ))}
              </div>

              {pending.length > 0 && (
                <div className="nudge-row">
                  <button
                    type="button"
                    className="nudge-btn"
                    onClick={() => pending.forEach((n) => data.nudge(n.id))}
                  >
                    Nudge {pending.length} pending
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}