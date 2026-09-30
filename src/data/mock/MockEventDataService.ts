import type { EventDataService } from '../EventDataService';
import type {
  Change, Notification, Person, Session, Venue,
} from '../../domain/types';
import {
  people, sessions as seedSessions, sessionPeople, venues,
} from './mockData';

export class MockEventDataService implements EventDataService {
  private sessions: Session[] = [...seedSessions];
  private changes: Change[] = [];
  private notifications: Notification[] = [];
  private listeners = new Set<(change: Change) => void>();

  async getSessions() { return [...this.sessions]; }
  async getVenues(): Promise<Venue[]> { return venues; }
  async getChanges() { return [...this.changes].reverse(); }

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

    // mutate schedule
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

    this.changes.push(fullChange);

    // ripple: find affected people, generate notifications
    const affected = await this.getPeopleForSession(change.sessionId);
    const enrichedAffected = sessionPeople.filter(
      (sp) => sp.sessionId === change.sessionId
    );

    const newNotifications: Notification[] = affected.map((person) => {
      const link = enrichedAffected.find((sp) => sp.personId === person.id);
      return {
        id: crypto.randomUUID(),
        changeId: fullChange.id,
        personId: person.id,
        personName: person.name,
        role: link?.role ?? person.roles[0] ?? 'attendee',
        message: `${change.sessionTitle}: ${change.type.replace('_', ' ')}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
    });

    this.notifications.push(...newNotifications);
    this.listeners.forEach((cb) => cb(fullChange));
    return fullChange;
  }

  async getNotifications(changeId?: string): Promise<Notification[]> {
    if (!changeId) return [...this.notifications];
    return this.notifications.filter((n) => n.changeId === changeId);
  }

  subscribeToChanges(callback: (change: Change) => void): () => void {
    this.listeners.add(callback);
    return () => { this.listeners.delete(callback); };
  }
}