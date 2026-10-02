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
      type: 'speaker_change',
      audience: 'speakers',
      created_by: 'usr-202-manager',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: 'upd-3',
      event_id: 'evt-knust-2026',
      title: 'Lunch Break & Dietary Stations Open',
      message: 'Buffet lines open at Main Dining Hall. Dedicated vegetarian and halal stations located at West Wing.',
      type: 'general_announcement',
      audience: 'all',
      created_by: 'usr-202-manager',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ],
  'evt-gas-2026': [
    {
      id: 'upd-gas-1',
      event_id: 'evt-gas-2026',
      title: 'Live Captioning Stream Link Activated',
      message: 'Real-time captions can now be accessed on your mobile browser via the caption portal.',
      type: 'general_announcement',
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
