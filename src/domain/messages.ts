import type { Change, Role, Session, Venue, Channel } from './types';

export interface MessageContent {
  title: string;
  body: string;
  channel: Channel;
}

interface BuildArgs {
  change: Change;
  sessionBefore: Session;
  role: Role;
  venues: Venue[];
}

const VENUE_FALLBACK = 'Unknown venue';

export function buildMessage({
  change,
  sessionBefore,
  role,
  venues,
}: BuildArgs): MessageContent {
  const venueName = (id: unknown) => {
    const found = venues.find((v) => v.id === String(id));
    return found?.name ?? VENUE_FALLBACK;
  };

  const oldVenue = venueName(change.oldValue);
  const newVenue = venueName(change.newValue);

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

  if (change.type === 'time_changed') {
    const next = change.newValue as { start: string; end: string } | undefined;
    const newTime = next ? formatTime(next.start) : 'a new time';
    const oldTime = formatTime(sessionBefore.start);

    switch (role) {
      case 'speaker':
        return {
          title: `Time change — ${sessionBefore.title}`,
          body: `Your session now starts at ${newTime} (was ${oldTime}). Plan accordingly.`,
          channel: 'push',
        };
      case 'volunteer':
        return {
          title: 'Shift timing updated',
          body: `${sessionBefore.title} now starts at ${newTime}. Adjust your station prep.`,
          channel: 'sms',
        };
      case 'attendee':
      default:
        return {
          title: 'Schedule change',
          body: `${sessionBefore.title} now starts at ${newTime} (was ${oldTime}).`,
          channel: 'push',
        };
    }
  }

  // session_cancelled
  switch (role) {
    case 'speaker':
      return {
        title: 'Session cancelled',
        body: `${sessionBefore.title} has been cancelled. No action needed on your part.`,
        channel: 'push',
      };
    case 'volunteer':
      return {
        title: 'Stand down',
        body: `${sessionBefore.title} is cancelled. You can leave your post.`,
        channel: 'sms',
      };
    case 'staff':
      return {
        title: 'Remove from schedule',
        body: `${sessionBefore.title} cancelled. Update signage and systems.`,
        channel: 'app',
      };
    case 'attendee':
    default:
      return {
        title: 'Session cancelled',
        body: `${sessionBefore.title} has been cancelled. Sorry for the inconvenience.`,
        channel: 'push',
      };
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}