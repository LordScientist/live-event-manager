import { useEffect, useState } from 'react';
import type { Session, Venue } from '../../domain/types';
import { useDataService } from '../../app/DataProvider';

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

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
    return data.subscribeToChanges(() => { refresh(); });
  }, [data]);

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