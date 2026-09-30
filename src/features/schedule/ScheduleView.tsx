import { useCallback, useEffect, useState } from 'react';
import type { Session, Venue } from '../../domain/types';
import { useDataService } from '../../app/DataProvider';

export function ScheduleView() {
  const data = useDataService();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const refresh = useCallback(async () => {
    setSessions(await data.getSessions());
    setVenues(await data.getVenues());
  }, [data]);

  useEffect(() => {
    refresh();
    const unsubscribe = data.subscribeToChanges(() => {
      refresh();
    });
    return unsubscribe;
  }, [data, refresh]);

  const venueName = (id: string) =>
    venues.find((v) => v.id === id)?.name ?? id;

  return (
    <div>
      <h2 className="section-title">Schedule</h2>
      {sessions.map((s) => (
        <div key={s.id} className="session">
          <div className="time">
            {new Date(s.start).toLocaleString(undefined, {
              weekday: 'short', hour: 'numeric', minute: '2-digit',
            })}
          </div>
          <div className="title">{s.title}</div>
          <div className="venue">{venueName(s.venueId)}</div>
        </div>
      ))}
    </div>
  );
}