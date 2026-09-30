import { useEffect, useState } from 'react';
import type { Session, Venue } from '../../domain/types';
import { useDataService } from '../../app/DataProvider';

export function ScheduleView() {
  const data = useDataService();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  async function refresh() {
    setSessions(await data.getSessions());
    setVenues(await data.getVenues());
  }

  useEffect(() => {
    refresh();
    const unsubscribe = data.subscribeToChanges(() => {
      refresh();
    });
    return unsubscribe;
  }, [data]);

  function venueName(id: string) {
    return venues.find((v) => v.id === id)?.name ?? id;
  }

  return (
    <section>
      <h2>Schedule</h2>
      <ul>
        {sessions.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong> — {venueName(s.venueId)} —{' '}
            {new Date(s.start).toLocaleString()}
          </li>
        ))}
      </ul>
    </section>
  );
}