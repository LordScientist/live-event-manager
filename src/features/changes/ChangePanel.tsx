import { useEffect, useState } from 'react';
import type { Notification, Session, Venue } from '../../domain/types';
import { useDataService } from '../../app/DataProvider';

export function ChangePanel() {
  const data = useDataService();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function refresh() {
    setSessions(await data.getSessions());
    setVenues(await data.getVenues());
    setNotifications(await data.getNotifications());
  }

  useEffect(() => {
    refresh();
    const unsubscribe = data.subscribeToChanges(() => {
      refresh();
    });
    return unsubscribe;
  }, [data]);

  async function moveSession(sessionId: string, newVenueId: string) {
    const session = sessions.find((s) => s.id === sessionId);
    await data.applyChange({
      type: 'session_moved',
      sessionId,
      oldValue: session?.venueId,
      newValue: newVenueId,
    });
  }

  return (
    <section>
      <h2>Trigger a Last-Minute Change</h2>

      {sessions.map((s) => (
        <div key={s.id} style={{ marginBottom: 8 }}>
          <span>{s.title} → </span>
          <select
            defaultValue={s.venueId}
            onChange={(e) => moveSession(s.id, e.target.value)}
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      ))}

      <h2>Notifications ({notifications.length})</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>
    </section>
  );
}