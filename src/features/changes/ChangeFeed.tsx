import { useCallback, useEffect, useState } from 'react';
import type {
  Change, Notification, NotificationStatus, Session, Venue,
} from '../../domain/types';
import { useDataService } from '../../app/DataProvider';
import { useView } from '../../app/ViewContext';
import { NotificationDrawer } from './NotificationDrawer';
import { ConflictPanel } from './ConflictPanel';
import { detectConflicts, type Conflict } from '../../domain/conflicts';
import { people as allPeople, sessionPeople } from '../../data/mock/mockData';

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

interface PendingChange {
  proposed: Omit<Change, 'id' | 'createdAt'>;
  conflicts: Conflict[];
}

export function ChangeFeed() {
  const data = useDataService();
  const { isOrganizer, currentPersonId } = useView();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);

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

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  async function attemptChange(sessionId: string, newVenueId: string) {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const proposed: Omit<Change, 'id' | 'createdAt'> = {
      type: 'session_moved',
      sessionId,
      sessionTitle: session.title,
      oldValue: session.venueId,
      newValue: newVenueId,
    };

    const conflicts = detectConflicts({
      proposedChange: proposed,
      sessions,
      venues,
      people: allPeople,
      sessionPeople,
    });

    if (conflicts.length > 0) {
      setPending({ proposed, conflicts });
      return;
    }

    await data.applyChange(proposed);
  }

  async function proceedAnyway() {
    if (!pending) return;
    await data.applyChange(pending.proposed);
    setPending(null);
  }

  const venueName = (id: string) =>
    venues.find((v) => v.id === id)?.name ?? id;

  // ---- Filter by current view ----
  const visibleChanges = isOrganizer
    ? changes
    : changes.filter((c) =>
        notifications.some(
          (n) => n.changeId === c.id && n.personId === currentPersonId
        )
      );

  const visibleNotificationsForChange = (changeId: string) => {
    const all = notifications.filter((n) => n.changeId === changeId);
    if (isOrganizer) return all;
    return all.filter((n) => n.personId === currentPersonId);
  };

  const openNotification =
    openId != null
      ? notifications.find((n) => n.id === openId) ?? null
      : null;

  return (
    <>
      {isOrganizer && (
        <div className="trigger">
          <h2 className="section-title">
            Simulate a last-minute change
          </h2>
          {sessions.map((s) => (
            <div key={s.id} className="trigger-row">
              <span className="label">{s.title}</span>
              <select
                value={s.venueId}
                onChange={(e) => attemptChange(s.id, e.target.value)}
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title">
        {isOrganizer ? 'Change feed' : 'Changes affecting you'}
      </h2>

      <div className="feed">
        {visibleChanges.length === 0 && (
          <div className="empty">
            {isOrganizer
              ? 'No changes yet. Move a session above to see the ripple.'
              : "No changes affect you yet."}
          </div>
        )}

        {visibleChanges.map((c) => {
          const affected = visibleNotificationsForChange(c.id);
          const acked = affected.filter(
            (n) => n.status === 'acknowledged'
          ).length;
          const total = affected.length;
          const pct = total === 0 ? 0 : Math.round((acked / total) * 100);
          const pendingList = affected.filter(
            (n) => n.status !== 'acknowledged'
          );

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
                  <span className="old">
                    {venueName(String(c.oldValue))}
                  </span>
                  <span className="arrow">→</span>
                  <span className="new">
                    {venueName(String(c.newValue))}
                  </span>
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
                    <strong>{acked}</strong> / {total}{' '}
                    {isOrganizer ? 'acknowledged' : 'your status'}
                  </span>
                  <span className="progress-pct">{pct}%</span>
                </div>
              </div>

              <div className="affected-label">
                {isOrganizer
                  ? 'Reached — click to preview message'
                  : 'Your notification — click to preview'}
              </div>

              <div className="affected">
                {affected.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`person status-${n.status}`}
                    onClick={() => setOpenId(n.id)}
                    title={`${STATUS_LABEL[n.status]}`}
                  >
                    <span className="avatar">
                      {initials(n.personName)}
                    </span>
                    {n.personName}
                    <span className={`role-tag role-${n.role}`}>
                      {n.role}
                    </span>
                    <span className={`dot dot-${n.status}`} />
                  </button>
                ))}
              </div>

              {isOrganizer && pendingList.length > 0 && (
                <div className="nudge-row">
                  <button
                    type="button"
                    className="nudge-btn"
                    onClick={() =>
                      pendingList.forEach((n) => data.nudge(n.id))
                    }
                  >
                    Nudge {pendingList.length} pending
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <NotificationDrawer
        notification={openNotification}
        onClose={() => setOpenId(null)}
        onAcknowledge={(id) => data.acknowledgeNotification(id)}
      />

      {isOrganizer && pending && (
        <ConflictPanel
          conflicts={pending.conflicts}
          onProceed={proceedAnyway}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
}