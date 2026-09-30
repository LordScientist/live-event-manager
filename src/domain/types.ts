export type Role = 'attendee' | 'speaker' | 'volunteer' | 'staff' | 'venue';

export interface Person {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
}

export interface EventItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Session {
  id: string;
  eventId: string;
  title: string;
  speakerId: string;
  venueId: string;
  start: string; // ISO
  end: string;   // ISO
}

export interface SessionPerson {
  sessionId: string;
  personId: string;
  role: Role;
}

export type ChangeType =
  | 'session_moved'
  | 'session_cancelled'
  | 'time_changed';

export interface Change {
  id: string;
  type: ChangeType;
  sessionId: string;
  oldValue?: unknown;
  newValue?: unknown;
  createdAt: string;
}

export interface Notification {
  id: string;
  changeId: string;
  personId: string;
  message: string;
  read: boolean;
  createdAt: string;
}
