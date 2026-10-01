import type { ScheduleItem } from '../types';

export const MOCK_SCHEDULE: Record<string, ScheduleItem[]> = {
  'evt-knust-2026': [
    {
      id: 'sch-1',
      event_id: 'evt-knust-2026',
      title: 'Attendee Registration & Welcome Badge Pickup',
      description: 'Collect your attendee pass, grab morning coffee, and connect with volunteers.',
      start_time: '2026-10-18T09:00:00Z',
      end_time: '2026-10-18T10:00:00Z',
      venue: 'Main Foyer, Great Hall'
    },
    {
      id: 'sch-2',
      event_id: 'evt-knust-2026',
      title: 'Opening Ceremony & Vice Chancellor Keynote',
      description: 'Official welcome remarks setting the theme of tech innovation in Africa.',
      start_time: '2026-10-18T10:00:00Z',
      end_time: '2026-10-18T11:15:00Z',
      venue: 'Great Hall Main Auditorium',
      speaker_name: 'Prof. Kwame Mensah'
    },
    {
      id: 'sch-3',
      event_id: 'evt-knust-2026',
      title: 'AI & The Future of African Engineering',
      description: 'Key panel discussion on machine learning applications in local industry.',
      start_time: '2026-10-18T11:30:00Z',
      end_time: '2026-10-18T13:00:00Z',
      venue: 'Room 204 (Now shifted to Main Auditorium)',
      speaker_name: 'Dr. Amina Touré & Panel'
    },
    {
      id: 'sch-4',
      event_id: 'evt-knust-2026',
      title: 'Interactive System Design Clinics',
      description: 'Hands-on architectural review workshops with industry mentors.',
      start_time: '2026-10-18T14:00:00Z',
      end_time: '2026-10-18T16:00:00Z',
      venue: 'Engineering Lab Block C'
    }
  ],
  'evt-gas-2026': [
    {
      id: 'sch-gas-1',
      event_id: 'evt-gas-2026',
      title: 'Registration & Accessibility Equipment Check',
      description: 'Assistive listening device loaning and quiet lounge check-in.',
      start_time: '2026-11-05T08:30:00Z',
      end_time: '2026-11-05T09:30:00Z',
      venue: 'East Concourse'
    },
    {
      id: 'sch-gas-2',
      event_id: 'evt-gas-2026',
      title: 'Designing Beyond WCAG 2.2: The Inclusive Future',
      description: 'Keynote exploration into cognitive accessibility and neurodiversity in digital tools.',
      start_time: '2026-11-05T09:30:00Z',
      end_time: '2026-11-05T11:00:00Z',
      venue: 'Grand Ballroom A',
      speaker_name: 'Elena Rostova'
    }
  ]
};

export const scheduleService = {
  getEventSchedule: async (eventId: string): Promise<ScheduleItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_SCHEDULE[eventId] || []);
      }, 100);
    });
  }
};
