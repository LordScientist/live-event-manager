export type Role = 'attendee' | 'speaker' | 'volunteer' | 'staff' | 'venue';

export type NotificationStatus =
  | 'pending'
  | 'delivered'
  | 'acknowledged';

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

export interface Session {
  id: string;
  eventId: string;
  title: string;
  speakerId: string;
  venueId: string;
  start: string;
  end: string;
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
  sessionTitle: string;
  oldValue?: unknown;
  newValue?: unknown;
  createdAt: string;
}

export interface Notification {
  id: string;
  changeId: string;
  personId: string;
  personName: string;
  role: Role;
  message: string;
  status: NotificationStatus;
  acknowledgedAt?: string;
  createdAt: string;
}