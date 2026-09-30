import type { EventDataService } from '../EventDataService';
import type {
  Change, Notification, Person, Role, Session, Venue,
} from '../../domain/types';
import {
  people, sessions as seedSessions, sessionPeople, venues,
} from './mockData';
import { buildMessage } from '../../domain/messages';

export class MockEventDataService implements EventDataService {
  private sessions: Session[] = [...seedSessions];
  private changes: Change[] = [];
  private notifications: Notification[] = [];
  private listeners = new Set<() => void>();

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

    // Capture the session BEFORE mutation, so we can build accurate messages
    const sessionBefore = this.sessions.find((s) => s.id === change.sessionId);
    if (!sessionBefore) return fullChange;

    // Mutate schedule
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

    // Build role-specific notifications
    const affected = await this.getPeopleForSession(change.sessionId);
    const links = sessionPeople.filter(
      (sp) => sp.sessionId === change.sessionId
    );

    const newNotifications: Notification[] = affected.map((person) => {
      const link = links.find((sp) => sp.personId === person.id);
      const role: Role = link?.role ?? person.roles[0] ?? 'attendee';
      const content = buildMessage({
        change: fullChange,
        sessionBefore,
        role,
        venues,
      });

      return {
        id: crypto.randomUUID(),
        changeId: fullChange.id,
        personId: person.id,
        personName: person.name,
        role,
        title: content.title,
        body: content.body,
        channel: content.channel,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    });

    this.notifications.push(...newNotifications);
    this.emit();
    newNotifications.forEach((n) => this.scheduleDelivery(n.id));

    return fullChange;
  }

  private scheduleDelivery(notificationId: string) {
    setTimeout(() => {
      const n = this.notifications.find((x) => x.id === notificationId);
      if (!n || n.status === 'acknowledged') return;
      n.status = 'delivered';
      this.emit();
    }, 600);

    setTimeout(() => {
      const n = this.notifications.find((x) => x.id === notificationId);
      if (!n || n.status === 'acknowledged') return;
      if (Math.random() < 0.8) {
        n.status = 'acknowledged';
        n.acknowledgedAt = new Date().toISOString();
        this.emit();
      }
    }, 2000 + Math.random() * 4000);
  }

  async acknowledgeNotification(notificationId: string): Promise<void> {
    const n = this.notifications.find((x) => x.id === notificationId);
    if (!n) return;
    n.status = 'acknowledged';
    n.acknowledgedAt = new Date().toISOString();
    this.emit();
  }

  async nudge(notificationId: string): Promise<void> {
    const n = this.notifications.find((x) => x.id === notificationId);
    if (!n) return;
    n.status = 'pending';
    n.acknowledgedAt = undefined;
    this.emit();
    this.scheduleDelivery(notificationId);
  }

  async getNotifications(changeId?: string): Promise<Notification[]> {
    if (!changeId) return [...this.notifications];
    return this.notifications.filter((n) => n.changeId === changeId);
  }

  subscribeToChanges(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => { this.listeners.delete(callback); };
  }

  private emit() {
    this.listeners.forEach((cb) => cb());
  }
}