import type { EventDataService } from '../EventDataService';
import type {
  Change,
  Notification,
  Person,
  Session,
  Venue,
} from '../../domain/types';
import {
  people,
  sessions as seedSessions,
  sessionPeople,
  venues,
} from './mockData';

export class MockEventDataService implements EventDataService {
  private sessions: Session[] = [...seedSessions];
  private notifications: Notification[] = [];
  private listeners = new Set<(change: Change) => void>();

  async getSessions(): Promise<Session[]> {
    return [...this.sessions];
  }

  async getVenues(): Promise<Venue[]> {
    return venues;
  }

  async getPeopleForSession(sessionId: string): Promise<Person[]> {
    const personIds = sessionPeople
      .filter((sp) => sp.sessionId === sessionId)
      .map((sp) => sp.personId);

    return people.filter((p) => personIds.includes(p.id));
  }

  async applyChange(
    change: Omit<Change, 'id' | 'createdAt'>
  ): Promise<Change> {
    const fullChange: Change = {
      ...change,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    if (change.type === 'session_moved') {
      this.sessions = this.sessions.map((s) =>
        s.id === change.sessionId
          ? { ...s, venueId: String(change.newValue) }
          : s
      );
    }

    if (change.type === 'time_changed') {
      const next = change.newValue as { start: string; end: string };
      this.sessions = this.sessions.map((s) =>
        s.id === change.sessionId
          ? { ...s, start: next.start, end: next.end }
          : s
      );
    }

    if (change.type === 'session_cancelled') {
      this.sessions = this.sessions.filter((s) => s.id !== change.sessionId);
    }

    const affected = await this.getPeopleForSession(change.sessionId);

    const newNotifications: Notification[] = affected.map((person) => ({
      id: crypto.randomUUID(),
      changeId: fullChange.id,
      personId: person.id,
      message: this.buildMessage(change, person),
      read: false,
      createdAt: new Date().toISOString(),
    }));

    this.notifications.push(...newNotifications);
    this.listeners.forEach((cb) => cb(fullChange));

    return fullChange;
  }

  private buildMessage(
    change: Omit<Change, 'id' | 'createdAt'>,
    person: Person
  ): string {
    if (change.type === 'session_moved') {
      return `Heads up ${person.name}: your session has moved to a new venue.`;
    }
    if (change.type === 'time_changed') {
      return `Heads up ${person.name}: your session time has changed.`;
    }
    return `Heads up ${person.name}: your session has been cancelled.`;
  }

  async getNotifications(personId?: string): Promise<Notification[]> {
    if (!personId) return [...this.notifications];
    return this.notifications.filter((n) => n.personId === personId);
  }

  subscribeToChanges(callback: (change: Change) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}