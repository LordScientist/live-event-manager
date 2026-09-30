import type {
  Session,
  Person,
  Change,
  Notification,
  Venue,
} from '../domain/types';

export interface EventDataService {
  getSessions(): Promise<Session[]>;
  getVenues(): Promise<Venue[]>;
  getPeopleForSession(sessionId: string): Promise<Person[]>;

  applyChange(
    change: Omit<Change, 'id' | 'createdAt'>
  ): Promise<Change>;

  getNotifications(personId?: string): Promise<Notification[]>;

  subscribeToChanges(
    callback: (change: Change) => void
  ): () => void;
}
