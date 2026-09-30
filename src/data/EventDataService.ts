import type {
  Session, Person, Change, Notification, Venue,
} from '../domain/types';

export interface EventDataService {
  getSessions(): Promise<Session[]>;
  getVenues(): Promise<Venue[]>;
  getPeopleForSession(sessionId: string): Promise<Person[]>;

  applyChange(
    change: Omit<Change, 'id' | 'createdAt'>
  ): Promise<Change>;

  getChanges(): Promise<Change[]>;
  getNotifications(changeId?: string): Promise<Notification[]>;

  acknowledgeNotification(notificationId: string): Promise<void>;
  nudge(notificationId: string): Promise<void>;

  subscribeToChanges(callback: () => void): () => void;
}