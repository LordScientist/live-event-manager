import { useCallback, useEffect, useState } from 'react';
import type { Session, Venue } from '../../domain/types';
import { useDataService } from '../../app/DataProvider';
import { useView } from '../../app/ViewContext';
import { sessionPeople } from '../../data/mock/mockData';

export function ScheduleView() {
  const data = useDataService();
  const { currentPersonId, isOrganizer } = useView();
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

  const visibleSessions = isOrganizer
    ? sessions
    : sessions.filter((s) =>
        sessionPeople.some(
          (sp) => sp.sessionId === s.id && sp.personId === currentPersonId
        )
      );

  const emptyMessage = isOrganizer
    ? 'No sessions.'
    : "You're not registered for any sessions yet.";

  return (
    <div>
      <h2 className="section-title">
        {isOrganizer ? 'Schedule' : 'Your schedule'}
      </h2>

      {visibleSessions.length === 0 && (
        <div className="empty">{emptyMessage}</div>
      )}

      {visibleSessions.map((s) => {
        const link = sessionPeople.find(
          (sp) =>
            sp.sessionId === s.id && sp.personId === currentPersonId
        );
        return (
          <div key={s.id} className="session">
            <div className="time">
              {new Date(s.start).toLocaleString(undefined, {
                weekday: 'short',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
            <div className="title">{s.title}</div>
            <div className="venue-row">
              <span className="venue">{venueName(s.venueId)}</span>
              {link && (
                <span className={`role-tag role-${link.role}`}>
                  {link.role}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}