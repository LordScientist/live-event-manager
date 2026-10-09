import type { BroadcastPayload } from '../components/ui/DynamicIslandHUD';

export interface DynamicIslandStateSpec {
  id: 'compact' | 'alert' | 'expanded';
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  springPhysics: string;
  latency: string;
  techHighlights: string[];
}

export interface AudioChimeSpec {
  engine: string;
  frequencies: string;
  offlineReady: boolean;
  zeroDependency: boolean;
  latencyMs: number;
  description: string;
}

export interface RoomDiffSpec {
  engineName: string;
  previousVenue: string;
  newVenue: string;
  capacityDelta: string;
  dispatchLatency: string;
  description: string;
}

export interface PresentationChapter {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  mascotHeadline: string;
  mascotComment: string;
  takeaways: string[];
}

export const DYNAMIC_ISLAND_STATES: DynamicIslandStateSpec[] = [
  {
    id: 'compact',
    name: 'Compact Ambient',
    badge: 'State 01 • Ambient Radar',
    subtitle: 'Silent top-docked monitor',
    description:
      'Floats persistently at the top viewport. Displays a pulsing live radio beacon without obstructing viewports or demanding user focus until an actual venue shift happens.',
    springPhysics: 'Sub-40px height • zero CPU idle footprint • CSS transform scale(1)',
    latency: 'Ambient persistent state (0ms activation)',
    techHighlights: [
      'Pulsing emerald/cyan live indicator showing ongoing connection',
      'Click to expand for rapid event updates check',
      'Ultra-lightweight DOM footprint and mobile-first docking'
    ]
  },
  {
    id: 'alert',
    name: 'Sudden Alert',
    badge: 'State 02 • Sudden Room Shift',
    subtitle: 'Spring physics audio-visual banner',
    description:
      'The moment an organizer relocates a room, the island springs open with Emil Kowalski-inspired physics (cubic-bezier 0.175, 0.885, 0.32, 1.275) and fires a synthetic Web Audio chime.',
    springPhysics: 'cubic-bezier(0.175, 0.885, 0.32, 1.275) with bounce overshoot',
    latency: 'Dispatches to attendee screens in < 10 seconds',
    techHighlights: [
      'Vivid high-urgency Room Shift badge with venue diff summary',
      'Synthetic Web Audio chime (587.33Hz D5 → 880Hz A5) without audio files',
      'One tap unfolds the full 3D before/after venue comparison'
    ]
  },
  {
    id: 'expanded',
    name: '3D Expanded Diff',
    badge: 'State 03 • Comprehensive Diff',
    subtitle: 'Full before/after venue comparison',
    description:
      'Presents a crystal-clear side-by-side venue diff: Previous Room (marked Relocated) vs New Venue Now (marked Live). Includes organizer rationale, walking route guidance, and one-tap acknowledge.',
    springPhysics: 'Expanded glass dialog with backdrop refraction and click-outside dismiss',
    latency: 'Instant sync • Acknowledged state persisted in session storage',
    techHighlights: [
      'Visual room diff engine comparing Previous Venue vs New Destination',
      'Verified organizer justification note preventing crowd panic',
      'Interactive tools: Sound mute toggle, simulate alternate venue shift'
    ]
  }
];

export const AUDIO_CHIME_SPEC: AudioChimeSpec = {
  engine: 'Web Audio API Synthetic Dual-Tone Oscillator',
  frequencies: 'D5 (587.33 Hz) ramping to A5 (880.00 Hz)',
  offlineReady: true,
  zeroDependency: true,
  latencyMs: 4,
  description:
    'Requires zero MP3/WAV file downloads. Operates 100% offline with zero network lag or autoplay buffering, ensuring attendees hear the venue shift even with spotty campus cellular reception.'
};

export const ROOM_DIFF_SPEC: RoomDiffSpec = {
  engineName: 'Live Connect Room Diff Engine',
  previousVenue: 'Room 102 (Great Hall)',
  newVenue: 'Main Amphitheater • Hall A',
  capacityDelta: 'Room 102 reached 115% capacity → Keynote shifted',
  dispatchLatency: '< 10 seconds from manager edit to participant view',
  description:
    'Computes structural diffs between the previous and updated venue locations, generating unambiguous before-and-after path cards so 300+ students never walk into an empty room.'
};

export const PRESENTATION_CHAPTERS: PresentationChapter[] = [
  {
    id: 1,
    tag: '01. THE SPARK',
    title: 'Why Live Connect Exists in the First Place',
    subtitle: 'The problem was never putting an event on a poster. The nightmare starts when things change twenty minutes to start.',
    mascotHeadline: 'The WhatsApp Nightmare!',
    mascotComment:
      'Ever tried moving 300 students across campus through 6 muted group chats? Pure chaos! Live Connect stops the blackout.',
    takeaways: [
      'Announcements buried under chat replies and memes',
      'Speakers and volunteers get generic blasts with zero routing',
      'Communication blackout right when the ground reality shifts'
    ]
  },
  {
    id: 2,
    tag: '02. THE BOUNDARY',
    title: 'What We Are Not Building',
    subtitle: 'Big platforms try to do tickets, credit card billing, and promotional email blasts. We chose a sharp product over a shallow one.',
    mascotHeadline: 'Zero Bloat Policy',
    mascotComment:
      'No ticket scalpers, no 20-page forms, no payment spam. We built a laser-focused coordination engine for the actual day.',
    takeaways: [
      'Zero payment gateway or ticket markups overhead',
      'Laser focus on real-time coordination on event day',
      'Readable on mobile screens in direct sunlight'
    ]
  },
  {
    id: 3,
    tag: '03. ZERO BLACKOUTS',
    title: 'Zero Blackouts Architecture: Dynamic Island HUD & Role Decoupling',
    subtitle: 'Floating real-time broadcast HUD with spring physics & decoupled identity. Your account is who you are, your role is what you do.',
    mascotHeadline: 'Zero Blackouts Architecture!',
    mascotComment:
      'Floating Dynamic Island HUD + Role Decoupling! The HUD floats at the top of your screen with 3 spring physics states, while your account fluidly handles any role.',
    takeaways: [
      'Dynamic Island HUD with 3 reactive states: Compact Ambient, Sudden Alert, 3D Expanded Diff',
      'Synthetic Web Audio chime works 100% offline without network assets',
      'Role belongs to each event pass, never locked to your user login'
    ]
  },
  {
    id: 4,
    tag: '04. DAY-OF EXPERIENCE',
    title: 'Day-Of Companion Experience & Room Diff Engine',
    subtitle: 'Sub-10s room shift alerts, zero-dependency Web Audio chime, and instant before/after venue diffs.',
    mascotHeadline: 'Sub-10s Room Diff Engine!',
    mascotComment:
      'Watch this: Organizer shifts Room 102 to Main Amphitheater, and BAM—Dynamic Island chimes with Web Audio and shows the before/after room diff in under 10 seconds!',
    takeaways: [
      'Single edit triggers immutable audit record and subscriber queue dispatch in < 10s',
      'Room Diff Engine displays clear previous venue vs new venue with walking routes',
      'Answers the 3 live day questions: What is live? Where do I go? Did anything shift?'
    ]
  },
  {
    id: 5,
    tag: '05. ACCESSIBILITY',
    title: 'Inclusive by Design, Not as an Afterthought',
    subtitle: 'Public clarity so nobody has to guess. Private handling so nobody has to broadcast their personal medical needs.',
    mascotHeadline: 'Dignified Inclusivity',
    mascotComment:
      'Public venue specs so nobody guesses ramps. Private intake so nobody has to broadcast medical needs to group chats.',
    takeaways: [
      'Public venue specifications published upfront (ramps, elevators, ASL, audio loops)',
      'Confidential accommodation requests protected between attendee and organizer',
      'Zero public embarrassment in giant group chats for basic human dignity'
    ]
  },
  {
    id: 6,
    tag: '06. THE OUTCOME',
    title: 'What Live Connect Helps Us Achieve',
    subtitle: 'Organizers stop putting out fires. Attendees stop stressing about what changed and focus on being there.',
    mascotHeadline: 'Mission Accomplished!',
    mascotComment:
      '0 missed rooms, 0 confused speakers, and 1 single shared truth. That is how we run flawless campus events!',
    takeaways: [
      '0 missed rooms: Attendees directed to correct venues before taking a step',
      '< 10s broadcast speed from organizer venue edit to attendee screen',
      '1 single shared source of live truth across the entire campus'
    ]
  }
];

/**
 * Dispatches a real-time broadcast alert event that activates the Dynamic Island HUD
 * anywhere across the application.
 */
export function triggerLiveBroadcastShift(customPayload?: Partial<BroadcastPayload>): BroadcastPayload {
  const payload: BroadcastPayload = {
    id: customPayload?.id || `shift-demo-${Date.now()}`,
    eventName: customPayload?.eventName || 'KNUST Tech Conference 2026',
    oldVenue: customPayload?.oldVenue || 'Room 102 (Great Hall)',
    newVenue: customPayload?.newVenue || 'Main Amphitheater • Hall A',
    reason:
      customPayload?.reason ||
      'Overcapacity alert: Keynote shifted from Room 102 to Main Amphitheater. Audio chime and live venue diff synchronized.',
    timestamp: customPayload?.timestamp || 'Just now (live test)',
    urgency: customPayload?.urgency || 'high'
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<BroadcastPayload>('live-broadcast-alert', {
        detail: payload
      })
    );
  }

  return payload;
}

/**
 * Returns all presentation chapters
 */
export function getPresentationChapters(): PresentationChapter[] {
  return PRESENTATION_CHAPTERS;
}

/**
 * Returns a specific presentation chapter by ID
 */
export function getPresentationChapter(id: number): PresentationChapter | undefined {
  return PRESENTATION_CHAPTERS.find((ch) => ch.id === id);
}

/**
 * Returns the Dynamic Island architectural specifications
 */
export function getDynamicIslandSpecs(): {
  states: DynamicIslandStateSpec[];
  audioChime: AudioChimeSpec;
  roomDiff: RoomDiffSpec;
} {
  return {
    states: DYNAMIC_ISLAND_STATES,
    audioChime: AUDIO_CHIME_SPEC,
    roomDiff: ROOM_DIFF_SPEC
  };
}
