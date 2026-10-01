import type { Event } from '../types';

export interface EventWithMeta extends Event {
  organizer_name: string;
  registration_status?: 'open' | 'closing_soon' | 'full' | 'registered' | 'pending';
  user_role_name?: string;
}

export const MOCK_EVENTS: EventWithMeta[] = [
  {
    id: 'evt-knust-2026',
    manager_id: 'usr-202-manager',
    name: 'KNUST Technology Conference 2026',
    description: 'Annual gathering of innovators, students, engineers, and researchers exploring frontier software, hardware, and AI systems in Africa.',
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-10-18T09:00:00Z',
    end_date: '2026-10-18T17:00:00Z',
    venue: 'Great Hall, KNUST',
    location_details: 'Main Campus, Kumasi',
    category: 'Conference',
    status: 'published',
    registration_deadline: '2026-10-14T23:59:59Z',
    approval_mode: 'manual',
    capacity: 450,
    accessibility_info: 'Ramp access at main entrance, sign language interpreter during keynotes, priority seating reserved in rows 1-3.',
    created_at: '2026-09-01T10:00:00Z',
    organizer_name: 'KNUST Engineering Society',
    registration_status: 'registered',
    user_role_name: 'Speaker'
  },
  {
    id: 'evt-gas-2026',
    manager_id: 'usr-202-manager',
    name: 'Global Accessibility Summit 2026',
    description: 'An international conference dedicated to designing and building truly inclusive digital and physical event experiences.',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-11-05T08:30:00Z',
    end_date: '2026-11-06T18:00:00Z',
    venue: 'Main Convention Center • Hall A',
    location_details: 'Downtown Tech District',
    category: 'Conference',
    status: 'published',
    registration_deadline: '2026-10-28T23:59:59Z',
    approval_mode: 'automatic',
    capacity: 300,
    accessibility_info: 'Elevators to all floors, live captioning (CART), tactile guidance paths, quiet sensory decompression room.',
    created_at: '2026-09-10T12:00:00Z',
    organizer_name: 'Inclusive Design Global',
    registration_status: 'closing_soon'
  },
  {
    id: 'evt-ai-workshop',
    manager_id: 'usr-202-manager',
    name: 'Hands-on AI & Systems Architecture Workshop',
    description: 'Deep dive technical lab building resilient backend event streaming and data processing systems.',
    cover_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-10-25T13:00:00Z',
    end_date: '2026-10-25T16:30:00Z',
    venue: 'Innovation Hub Lab 4',
    location_details: 'Science Building, 2nd Floor',
    category: 'Workshop',
    status: 'published',
    registration_deadline: '2026-10-22T23:59:59Z',
    approval_mode: 'manual',
    capacity: 40,
    accessibility_info: 'Accessible restrooms adjacent to lab, screen reader compatible lab workstations.',
    created_at: '2026-09-15T08:00:00Z',
    organizer_name: 'Dev Community Network',
    registration_status: 'pending'
  },
  {
    id: 'evt-career-fair',
    manager_id: 'usr-202-manager',
    name: 'Tech & Engineering Career Connect 2026',
    description: 'Meet 50+ hiring partners, attend portfolio critique clinics, and connect directly with engineering managers.',
    cover_image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-11-12T10:00:00Z',
    end_date: '2026-11-12T16:00:00Z',
    venue: 'University Sports Complex Arena',
    location_details: 'North Campus',
    category: 'Career',
    status: 'published',
    registration_deadline: '2026-11-10T23:59:59Z',
    approval_mode: 'automatic',
    capacity: 800,
    accessibility_info: 'Wheelchair accessible ramps and booth corridors with minimum 5ft clearance.',
    created_at: '2026-09-20T14:00:00Z',
    organizer_name: 'University Placement Center',
    registration_status: 'open'
  },
  {
    id: 'evt-community-meetup',
    manager_id: 'usr-202-manager',
    name: 'Open Source Community Code & Coffee',
    description: 'Informal morning hackathon and collaboration session for open-source contributors and newcomers.',
    cover_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-10-31T10:00:00Z',
    end_date: '2026-10-31T14:00:00Z',
    venue: 'City Central Library Auditorium',
    location_details: 'Ground Floor Community Hall',
    category: 'Community',
    status: 'published',
    registration_deadline: '2026-10-30T18:00:00Z',
    approval_mode: 'automatic',
    capacity: 60,
    accessibility_info: 'Full ground floor accessibility, hearing loop installed in auditorium.',
    created_at: '2026-09-22T09:00:00Z',
    organizer_name: 'OpenTech Collective',
    registration_status: 'full'
  }
];

// Async service functions with simulated latency
export const eventService = {
  getEvents: async (): Promise<EventWithMeta[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_EVENTS]);
      }, 150);
    });
  },

  getEventById: async (id: string): Promise<EventWithMeta | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_EVENTS.find((e) => e.id === id) || null;
        resolve(found);
      }, 150);
    });
  }
};
