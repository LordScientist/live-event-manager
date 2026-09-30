# Live Event Manager by Group C
#Osman,Roland and Helina
A last-minute change command center.

Not an event app. There are a hundred event apps. This is the thing you open when the keynote speaker cancels 20 minutes before doors and you need to reach 240 people without dropping anyone.

---

## Why we built it

The brief was simple on the surface. Registration, schedule, volunteers, venues, speakers, attendees. Plus last-minute changes. Plus a demo of one change rippling through the system.

But the brief was vague on purpose. It left the shape open. That's a hint, not an oversight. It means the interesting question isn't *what* to build. It's *why*.

And the why is this. Every event tool on the market treats a change as a CRUD operation. You edit a row. Maybe you send a mass email. Done. Nobody answers the question that actually matters when you're standing backstage with a clipboard and a broken microphone:

Did the right people see it? Did they understand it? Did they act on it?

That's the wedge. That's the product. The ripple isn't the feature. **The ripple's accountability is the feature.**

So we built a command center. The schedule is the surface. The accountability layer underneath is the point.

---

## The e360 lens

We didn't invent a build process. We borrowed one. The e360 model says learning and building are not sequential. You don't wait to feel ready. You learn while building and build while learning.

Four pillars, in order:

**Nurture.** You get developed by people who invest in you. Mentors correct your work. They see your potential before you do.

**Teach.** Knowledge moves when you share it. Written, told, shown. Unshared knowledge becomes weight. Shared knowledge becomes movement.

**Learn.** Daily habits. Observe. Question. Be curious. Copy and sketch. Empathize. Do.

**Design.** Last for a reason. Building without foundation collapses under pressure.

And the design loop, five steps, no skipping:

**Create → Collaborate → Interact → Innovate → Test It.**

Rough version first. Share it messy. Put it in front of real people. Make it simpler. Then test it cold.

We did this loop ten times in this project. Maybe more.

---

## Stack choices, and why

**React + Vite + TypeScript.** Fast dev server. Type safety so we could refactor without fear. Vite because it hot reloads in milliseconds and we wanted that feedback loop tight.

**Supabase as backend (planned, not wired yet).** Postgres, auth, realtime, RLS. Everything we need in one box. We haven't touched it yet on purpose. The whole frontend was built against an interface so the Supabase swap is a one-line change. More on that below.

**pnpm.** Faster, tighter, better disk usage. Vite scaffolded it, we kept it.

**No state library.** No Redux, no Zustand, no Jotai. Just React state and a data service. We'll add one only if we need one. That's the discipline.

**No CSS framework.** Plain CSS with custom properties. Because Tailwind would have made the design decisions feel like config instead of design. We wanted to see every color and every space.

---

## The architecture, and the seam

Here's the thing. Every feature we built talks to a service. Not to Supabase. Not to a mock. To an interface.

```
UI  →  EventDataService  →  MockEventDataService (today)
                        →  SupabaseEventDataService (tomorrow)
```

The UI never knows which one it's talking to. This is the seam. It's the single most important decision in the whole build.

Here's the contract:

```ts
export interface EventDataService {
  getSessions(): Promise<Session[]>;
  getVenues(): Promise<Venue[]>;
  getPeopleForSession(sessionId: string): Promise<Person[]>;

  applyChange(
    change: Omit<Change, 'id' | 'createdAt' | 'status'>
  ): Promise<Change>;

  undoChange(changeId: string): Promise<void>;

  getChanges(): Promise<Change[]>;
  getNotifications(changeId?: string): Promise<Notification[]>;

  acknowledgeNotification(notificationId: string): Promise<void>;
  nudge(notificationId: string): Promise<void>;

  subscribeToChanges(callback: () => void): () => void;
}
```

That's it. Ten methods. Every feature we built uses only these.

When we wire up Supabase, we write one new class, `SupabaseEventDataService`, that implements this same interface. Then in `DataProvider.tsx` we change one line:

```ts
// today
const service: EventDataService = new MockEventDataService();

// tomorrow
const service: EventDataService = new SupabaseEventDataService(client);
```

The UI doesn't change. Not a single component. That's the payoff of the seam.

We didn't have to do this. We could have called Supabase directly from components. It would have been faster for the first two features. It would have been a disaster by feature five.

---

## The data model

Six core types. Nothing more.

```ts
type Role = 'attendee' | 'speaker' | 'volunteer' | 'staff' | 'venue';

type NotificationStatus =
  | 'pending'
  | 'delivered'
  | 'acknowledged'
  | 'retracted';

type Channel = 'push' | 'sms' | 'email' | 'app';

interface Person {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

interface Venue {
  id: string;
  name: string;
  capacity: number;
}

interface Session {
  id: string;
  eventId: string;
  title: string;
  speakerId: string;
  venueId: string;
  start: string;
  end: string;
}

interface Change {
  id: string;
  type: ChangeType;
  sessionId: string;
  sessionTitle: string;
  oldValue?: unknown;
  newValue?: unknown;
  sessionSnapshot?: Session;
  status: 'active' | 'undone';
  undoneAt?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  changeId: string;
  personId: string;
  personName: string;
  role: Role;
  title: string;
  body: string;
  channel: Channel;
  status: NotificationStatus;
  acknowledgedAt?: string;
  createdAt: string;
}
```

Three things to notice.

**Change carries `sessionTitle`.** Denormalized on purpose. In the feed, we render the title for every change even if the session was later cancelled and removed from the schedule. A join would work too but the extra field is cheap and the render is direct.

**Change carries `sessionSnapshot`.** Only for cancellations. When you undo a cancel, we need the original session back. We don't want to keep a separate archive table for that. So we snapshot it into the change that cancelled it.

**Notification carries `personName` and `role`.** Same reason. The feed shows chips for every person notified. If they're later removed from the event, the chip still shows their name. Denormalized but honest.

---

## The features, one by one

### 1. Registration and schedule

Sessions, venues, people, roles. A person can have multiple roles. Akua Asante is both a speaker and staff. That matters because the notification she gets depends on which role is relevant for a given session, not which role she has globally.

The schedule is the ground truth. Everything else is derived from it.

### 2. The ripple

This is the core loop.

When you change a session, three things happen:

1. The schedule mutates.
2. The system finds everyone affected (via `sessionPeople`).
3. A notification is generated per person, styled per role.

Here's the `applyChange` method from the mock service. Read it slow:

```ts
async applyChange(
  change: Omit<Change, 'id' | 'createdAt' | 'status'>
): Promise<Change> {
  const fullChange: Change = {
    ...change,
    id: crypto.randomUUID(),
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const sessionBefore = this.sessions.find(
    (s) => s.id === change.sessionId
  );
  if (!sessionBefore) return fullChange;

  if (change.type === 'session_cancelled') {
    fullChange.sessionSnapshot = { ...sessionBefore };
  }

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
    this.sessions = this.sessions.filter(
      (s) => s.id !== change.sessionId
    );
  }

  this.changes.push(fullChange);

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
```

Notice `sessionBefore`. We grab the session state **before** mutating. Because the message content needs to know what it changed from. If we grabbed it after, the "old venue" would be wrong.

Small detail. Big consequence. That's how you learn while building.

### 3. Role-specific messages

Same change, four different messages. The speaker gets one thing. The volunteer gets another. Staff get a third. Attendees get a fourth.

This is in `src/domain/messages.ts`. Here's the moved-session case:

```ts
if (change.type === 'session_moved') {
  switch (role) {
    case 'speaker':
      return {
        title: `You're on soon — ${sessionBefore.title}`,
        body: `Room change: your session moved from ${oldVenue} to ${newVenue}. Arrive 15 min early to test A/V.`,
        channel: 'push',
      };
    case 'volunteer':
      return {
        title: 'Station update',
        body: `${sessionBefore.title} is now at ${newVenue} (was ${oldVenue}). Report to the ${newVenue} entrance 20 min before start.`,
        channel: 'sms',
      };
    case 'staff':
      return {
        title: `Logistics: ${sessionBefore.title}`,
        body: `Session relocated to ${newVenue}. Update signage from ${oldVenue} and confirm room capacity.`,
        channel: 'app',
      };
    case 'venue':
      return {
        title: 'Room reassignment',
        body: `${sessionBefore.title} incoming to ${newVenue} at ${formatTime(sessionBefore.start)}. Relocating from ${oldVenue}.`,
        channel: 'email',
      };
    case 'attendee':
    default:
      return {
        title: 'Session update',
        body: `${sessionBefore.title} has moved to ${newVenue} (from ${oldVenue}). Your spot is saved.`,
        channel: 'push',
      };
  }
}
```

The speaker gets a nudge about A/V setup. The volunteer gets station instructions. Staff get a task list. Attendees get reassurance. Same room change. Four different voices. That's the difference between a broadcast and communication.

### 4. Acknowledgment tracking

A change isn't done when notifications are sent. It's done when everyone has confirmed.

Three states: `pending`, `delivered`, `acknowledged`. Plus `retracted` when a change is undone.

The mock service simulates delivery with `setTimeout`. In production, this comes from the channel (Twilio, Firebase, whatever). But the UI doesn't care. It watches the status field. That's the point of the interface.

The UI shows a **progress bar per change**. 3 of 4 acknowledged. 75%. When someone is still pending, a **Nudge** button appears. Click it, and those notifications get re-sent.

You can also click any person's chip to see the exact message they received, styled like a phone push notification. That's the drawer.

### 5. Conflict detection

Here's where it starts to feel smart.

Before a change is applied, we check three rules:

- **Attendee overlap.** Is any attendee in two sessions at once?
- **Speaker transition.** Does the speaker have less than 15 minutes between sessions at different venues?
- **Venue clash.** Is the target room already occupied at that time?

Here's the whole thing from `src/domain/conflicts.ts`, abbreviated:

```ts
export function detectConflicts(input: ConflictCheckInput): Conflict[] {
  const { proposedChange, sessions, venues, people, sessionPeople } = input;
  const conflicts: Conflict[] = [];

  const movingSession = sessions.find((s) => s.id === proposedChange.sessionId);
  if (!movingSession) return [];

  const newVenueId = /* compute future venue */;
  const newStart = /* compute future start */;
  const newEnd = /* compute future end */;

  const futureSession: Session = {
    ...movingSession,
    venueId: newVenueId,
    start: newStart,
    end: newEnd,
  };

  const others = sessions.filter((s) => s.id !== movingSession.id);

  // Rule 1: venue clash
  for (const other of others) {
    if (other.venueId !== newVenueId) continue;
    if (overlaps(futureSession, other)) {
      /* push venue_clash conflict */
    }
  }

  // Rule 2: attendee overlap
  // Rule 3: speaker transition
  // ...

  return conflicts;
}
```

If conflicts exist, we don't apply the change. We show a **Conflict Panel** with the list of everything that would break. The organizer can **Cancel** or **Proceed anyway**. Both are valid decisions. The system just makes sure you're making them on purpose.

### 6. Role switcher

One dropdown at the top. Five options plus organizer. Same data. Different story.

When you switch to Kofi Boateng (attendee), three things change:

- The trigger panel disappears. Attendees can't change sessions.
- The schedule filters to only their sessions.
- The change feed filters to only changes that touched them.

Same app. Different lens. That's the demo moment. Trigger a change as organizer. Flip to Kofi. Flip to Esi. Flip to Ama. Watch the same event tell four different stories.

### 7. Undo + timeline

Every change stays in the feed. Even after it's undone. The card goes grey. The title gets struck through. The notifications retract. A red banner appears: *"Reverted — schedule restored, notifications retracted."*

The audit trail is the point. In real life, you need to know what happened, in what order, and who did it. The timeline gives you that.

Here's the undo logic:

```ts
async undoChange(changeId: string): Promise<void> {
  const change = this.changes.find((c) => c.id === changeId);
  if (!change || change.status === 'undone') return;

  if (change.type === 'session_moved') {
    this.sessions = this.sessions.map((s) =>
      s.id === change.sessionId
        ? { ...s, venueId: String(change.oldValue) }
        : s
    );
  }

  // ... handle time_changed and session_cancelled ...

  change.status = 'undone';
  change.undoneAt = new Date().toISOString();

  this.notifications
    .filter((n) => n.changeId === changeId)
    .forEach((n) => {
      n.status = 'retracted';
      n.acknowledgedAt = undefined;
    });

  this.emit();
}
```

Notice we don't delete notifications. We retract them. History stays.

---

## The React pattern

Every component that reads data follows the same shape. Here it is in `ScheduleView.tsx`:

```tsx
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
```

Three things going on.

**`useCallback`** because `refresh` is passed to the effect, and we don't want a new function identity on every render, because that would re-subscribe on every render, because that would open a new realtime channel on every render, because that would blow through Supabase's connection quota. This is the kind of bug that costs an hour to find and thirty seconds to prevent.

**The subscribe pattern.** Subscribe once, on mount. Unsubscribe on unmount. `refresh` is called by both the initial load and every change notification. One path, one source of truth.

**Stable `data` reference.** The service is provided by context and never changes. So `data` in the deps array is effectively a no-op. But we include it for correctness.

Every data-reading component uses this exact pattern. Consistency over cleverness.

---

## What we didn't build yet

**Supabase.** Not wired. The interface exists. The mock service implements it. The swap is one line when we're ready.

**Real channels.** No Twilio, no Firebase, no email. The status transitions are simulated with `setTimeout`. Real delivery is a backend concern, not a frontend one.

**Auth.** No login. Roles are hardcoded in the mock data. When we go Supabase, this becomes real.

**Multi-event support.** The types have `eventId` but everything is scoped to one event in practice. Easy to extend.

**Time change + cancel UI.** The service supports both change types. The trigger panel only exposes venue moves. Two more buttons would complete the UI.

**Mobile layout.** The design is responsive down to about 900px. Below that it stacks. It's functional, not polished.

---

## What's next

The natural next steps, in order of leverage:

**A. Wire up Supabase.** Schema SQL, RLS policies, realtime channel, `SupabaseEventDataService`. One-line swap in `DataProvider.tsx`. This makes it real.

**B. Demo mode.** A button that script-runs the whole story. Session moved, conflict detected, proceed, notifications arrive, chips flip green, one stays red, nudge, retract, undo. Perfect for showing someone in 30 seconds.

**C. Polish pass.** Animations, mobile layout, keyboard nav, accessibility.

**D. Time change + cancel UI.** Service already supports it.

**E. Write about it.** e360 says unshared knowledge becomes weight. The whole build is worth writing down.

---

## Closing

The brief was vague. That was the point. It left room for us to decide what the product actually is.

We decided it's about accountability. Not schedules. Not notifications. The gap between *"we sent the message"* and *"they actually got it and acted on it."* That gap is where events fall apart. And nobody's solving it.

Everything we built serves that thesis. The ripple, the role-specific messages, the ack tracking, the conflicts, the undo. Each feature answers a piece of that one question.

We built rough. We showed it. We made it better. Ten times.

That's e360. That's the whole method.
