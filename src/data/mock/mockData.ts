import type { Person, Session, SessionPerson, Venue } from '../../domain/types';

export const venues: Venue[] = [
  { id: 'v1', name: 'Main Hall', capacity: 500 },
  { id: 'v2', name: 'Room 204', capacity: 80 },
  { id: 'v3', name: 'Workshop Room A', capacity: 40 },
  { id: 'v4', name: 'Workshop Room B', capacity: 40 },
];

export const people: Person[] = [
  { id: 'p1', name: 'Ama Mensah',   email: 'ama@example.com',  roles: ['speaker'] },
  { id: 'p2', name: 'Kofi Boateng', email: 'kofi@example.com', roles: ['attendee'] },
  { id: 'p3', name: 'Esi Owusu',    email: 'esi@example.com',  roles: ['volunteer'] },
  { id: 'p4', name: 'Yaw Darko',    email: 'yaw@example.com',  roles: ['attendee'] },
  { id: 'p5', name: 'Akua Asante',  email: 'akua@example.com', roles: ['speaker', 'staff'] },
];

export const sessions: Session[] = [
  {
    id: 's1',
    eventId: 'e1',
    title: 'Opening Keynote',
    speakerId: 'p1',
    venueId: 'v2',
    start: '2026-10-01T14:00:00Z',
    end: '2026-10-01T15:00:00Z',
  },
  {
    id: 's2',
    eventId: 'e1',
    title: 'Designing for Stress',
    speakerId: 'p5',
    venueId: 'v3',
    start: '2026-10-01T15:30:00Z',
    end: '2026-10-01T16:30:00Z',
  },
  {
    id: 's3',
    eventId: 'e1',
    title: 'Panel: Building in Public',
    speakerId: 'p5',
    venueId: 'v4',
    start: '2026-10-01T14:30:00Z',
    end: '2026-10-01T15:20:00Z',
  },
];

export const sessionPeople: SessionPerson[] = [
  // Opening Keynote
  { sessionId: 's1', personId: 'p1', role: 'speaker' },
  { sessionId: 's1', personId: 'p2', role: 'attendee' },
  { sessionId: 's1', personId: 'p3', role: 'volunteer' },
  { sessionId: 's1', personId: 'p4', role: 'attendee' },
  // Designing for Stress
  { sessionId: 's2', personId: 'p5', role: 'speaker' },
  { sessionId: 's2', personId: 'p2', role: 'attendee' },
  // Panel
  { sessionId: 's3', personId: 'p5', role: 'speaker' },
  { sessionId: 's3', personId: 'p4', role: 'attendee' },
  { sessionId: 's3', personId: 'p3', role: 'volunteer' },
];