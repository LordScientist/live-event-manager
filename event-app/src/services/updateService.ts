import type { EventUpdate } from '../types';

export const MOCK_UPDATES: Record<string, EventUpdate[]> = {
  'evt-knust-2026': [
    {
      id: 'upd-1',
      event_id: 'evt-knust-2026',
      title: 'Session Venue Relocation',
      message: 'Your 2:00 PM session has moved from Room 204 to the Main Auditorium due to high attendance.',
      type: 'venue_change',
      audience: 'all',
      created_by: 'usr-202-manager',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
    },
    {
      id: 'upd-2',
      event_id: 'evt-knust-2026',
      title: 'Speaker Prep Room Access',
      message: 'Speakers: Room 102 is now open with microphones, presentation adapters, and test monitors.',
      type: 'announcement',
      audience: 'speakers',
      created_by: 'usr-202-manager',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    }
  ],
  'evt-gas-2026': [
    {
      id: 'upd-gas-1',
      event_id: 'evt-gas-2026',
      title: 'Live Captioning Stream Link Activated',
      message: 'Real-time captions can now be accessed on your mobile browser via the caption portal.',
      type: 'announcement',
      audience: 'all',
      created_by: 'usr-202-manager',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ]
};

export const updateService = {
  getEventUpdates: async (eventId: string): Promise<EventUpdate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_UPDATES[eventId] || []);
      }, 100);
    });
  }
};
