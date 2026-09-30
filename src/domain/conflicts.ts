import type { Change, Session, Venue, Person } from './types';

export interface Conflict {
  kind: 'attendee_overlap' | 'speaker_transition' | 'venue_clash';
  severity: 'high' | 'medium';
  personId?: string;
  personName?: string;
  message: string;
  detail: string;
}

export interface ConflictCheckInput {
  proposedChange: Omit<Change, 'id' | 'createdAt'| 'status'>;
  sessions: Session[];
  venues: Venue[];
  people: Person[];
  sessionPeople: { sessionId: string; personId: string; role: string }[];
}

const TRANSITION_MINUTES = 15;

export function detectConflicts(input: ConflictCheckInput): Conflict[] {
  const { proposedChange, sessions, venues, people, sessionPeople } = input;
  const conflicts: Conflict[] = [];

  const movingSession = sessions.find((s) => s.id === proposedChange.sessionId);
  if (!movingSession) return [];

  // Compute the FUTURE state of the moving session
  const newVenueId =
    proposedChange.type === 'session_moved'
      ? String(proposedChange.newValue)
      : movingSession.venueId;

  const newStart =
    proposedChange.type === 'time_changed'
      ? (proposedChange.newValue as { start: string }).start
      : movingSession.start;

  const newEnd =
    proposedChange.type === 'time_changed'
      ? (proposedChange.newValue as { start: string; end: string }).end
      : movingSession.end;

  const futureSession: Session = {
    ...movingSession,
    venueId: newVenueId,
    start: newStart,
    end: newEnd,
  };

  const others = sessions.filter((s) => s.id !== movingSession.id);

  // -------- Rule 1: Venue clash --------
  for (const other of others) {
    if (other.venueId !== newVenueId) continue;
    if (overlaps(futureSession, other)) {
      const venue = venues.find((v) => v.id === newVenueId);
      conflicts.push({
        kind: 'venue_clash',
        severity: 'high',
        message: `${venue?.name ?? newVenueId} is already booked`,
        detail: `"${other.title}" runs ${fmt(other.start)}–${fmt(
          other.end
        )} in the same room.`,
      });
    }
  }

  // People currently in the moving session
  const movingPeopleIds = sessionPeople
    .filter((sp) => sp.sessionId === movingSession.id)
    .map((sp) => sp.personId);

  // -------- Rule 2: Attendee / volunteer overlap --------
  for (const other of others) {
    if (!overlaps(futureSession, other)) continue;

    const overlappingPeopleIds = sessionPeople
      .filter(
        (sp) =>
          sp.sessionId === other.id && movingPeopleIds.includes(sp.personId)
      )
      .map((sp) => sp.personId);

    for (const pid of overlappingPeopleIds) {
      const person = people.find((p) => p.id === pid);
      if (!person) continue;

      const link = sessionPeople.find(
        (sp) => sp.sessionId === movingSession.id && sp.personId === pid
      );
      const role = link?.role ?? person.roles[0] ?? 'attendee';

      conflicts.push({
        kind: 'attendee_overlap',
        severity: 'medium',
        personId: person.id,
        personName: person.name,
        message: `${person.name} is double-booked`,
        detail: `Already in "${other.title}" (${role}) at ${fmt(
          other.start
        )} — overlaps with the new time.`,
      });
    }
  }

  // -------- Rule 3: Speaker transition (< 15 min) --------
  const speakerId = movingSession.speakerId;
  const speaker = people.find((p) => p.id === speakerId);
  if (speaker) {
    for (const other of others) {
      if (other.speakerId !== speakerId) continue;
      if (other.venueId === newVenueId) continue; // same venue, no travel

      const gapAfter = minutesBetween(futureSession.end, other.start);
      const gapBefore = minutesBetween(other.end, futureSession.start);

      const tooTightAfter = gapAfter >= 0 && gapAfter < TRANSITION_MINUTES;
      const tooTightBefore = gapBefore >= 0 && gapBefore < TRANSITION_MINUTES;

      if (tooTightAfter || tooTightBefore) {
        const fromVenue = venues.find((v) => v.id === newVenueId)?.name;
        const toVenue = venues.find((v) => v.id === other.venueId)?.name;
        const gap = tooTightAfter ? gapAfter : gapBefore;

        conflicts.push({
          kind: 'speaker_transition',
          severity: 'medium',
          personId: speaker.id,
          personName: speaker.name,
          message: `${speaker.name} has a ${gap} min transition`,
          detail: `${fromVenue} → ${toVenue}. Needs at least ${TRANSITION_MINUTES} min to travel.`,
        });
      }
    }
  }

  return conflicts;
}

function overlaps(a: Session, b: Session): boolean {
  const aStart = new Date(a.start).getTime();
  const aEnd = new Date(a.end).getTime();
  const bStart = new Date(b.start).getTime();
  const bEnd = new Date(b.end).getTime();
  return aStart < bEnd && bStart < aEnd;
}

function minutesBetween(fromIso: string, toIso: string): number {
  return Math.round(
    (new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000
  );
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}