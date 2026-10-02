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
    description: 'Annual student and engineer conference sharing practical software, electronics, and tech projects built in Ghana.',
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
    collect_dietary: true,
    created_at: '2026-09-01T10:00:00Z',
    organizer_name: 'KNUST Engineering Society',
    registration_status: 'registered',
    user_role_name: 'Speaker'
  },
  {
    id: 'evt-gas-2026',
    manager_id: 'usr-202-manager',
    name: 'Global Accessibility Summit 2026',
    description: 'A conference dedicated to making digital tools and event venues accessible for everyone.',
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
    description: 'A hands-on coding lab on building fast backend services and live event notification queues.',
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
  },
  {
    id: 'evt-graphic-design',
    manager_id: 'usr-202-manager',
    name: 'Graphic Design Bootcamp',
    description: 'Intensive hands-on workshop covering digital branding, typography, and collaborative design tooling.',
    cover_image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-10-20T10:00:00Z',
    end_date: '2026-10-20T16:00:00Z',
    venue: 'Design Innovation Studio',
    location_details: 'Creative Arts Center, Studio 3',
    category: 'Design',
    status: 'published',
    registration_deadline: '2026-10-18T23:59:59Z',
    approval_mode: 'automatic',
    capacity: 50,
    accessibility_info: 'Step-free entrance and reserved assistive workstations available.',
    created_at: '2026-09-20T10:00:00Z',
    organizer_name: 'Creative Minds Hub',
    registration_status: 'registered'
  },
  {
    id: 'evt-climate-action',
    manager_id: 'usr-202-manager',
    name: 'Climate Action Workshop',
    description: 'Community solutions for climate resilience, sustainable urban development, and renewable technologies.',
    cover_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-10-25T14:00:00Z',
    end_date: '2026-10-25T18:00:00Z',
    venue: 'Eco Center Auditorium',
    location_details: 'Green Campus Hall A',
    category: 'Community',
    status: 'published',
    registration_deadline: '2026-10-23T23:59:59Z',
    approval_mode: 'automatic',
    capacity: 120,
    accessibility_info: 'Wheelchair access, live audio transcript, and sensory quiet room.',
    created_at: '2026-09-22T12:00:00Z',
    organizer_name: 'Green Earth Initiative',
    registration_status: 'open'
  },
  {
    id: 'evt-career-fair-2026',
    manager_id: 'usr-202-manager',
    name: 'Career Fair 2026',
    description: 'Connect with over 40 technology employers, recruit talent, and explore graduate apprenticeship pathways.',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    start_date: '2026-11-05T10:00:00Z',
    end_date: '2026-11-05T17:00:00Z',
    venue: 'National Exhibition Centre',
    location_details: 'Main Pavilion Hall B',
    category: 'Career',
    status: 'published',
    registration_deadline: '2026-11-01T23:59:59Z',
    approval_mode: 'manual',
    capacity: 600,
    accessibility_info: 'Ramped corridors, sighted guides on request, and assistive audio loops.',
    created_at: '2026-09-25T14:00:00Z',
    organizer_name: 'Future Careers Network',
    registration_status: 'pending'
  }
];

export interface ManagerEventItem {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  venue: string;
  status: 'published' | 'draft' | 'completed' | 'cancelled';
  total_registrations: number;
  pending_approvals: number;
  capacity?: number;
  cover_image?: string;
  category: string;
}

export interface ManagerActivityItem {
  id: string;
  type: 'registration' | 'approval' | 'schedule_change' | 'venue_change' | 'announcement';
  text: string;
  detail?: string;
  event_name: string;
  event_id: string;
  timestamp: string; // ISO 8601
}

export interface ManagerDashboardStats {
  total_events: number;
  upcoming_events: number;
  total_registrations: number;
  pending_approvals: number;
  upcoming_list: ManagerEventItem[];
  recent_activities: ManagerActivityItem[];
}

export const MOCK_MANAGER_EVENTS: ManagerEventItem[] = [
  {
    id: 'evt-knust-2026',
    name: 'KNUST Technology Conference 2026',
    start_date: '2026-10-18T09:00:00Z',
    end_date: '2026-10-18T17:00:00Z',
    venue: 'Great Hall, KNUST',
    status: 'published',
    total_registrations: 452,
    pending_approvals: 21,
    capacity: 450,
    category: 'Conference',
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'evt-ai-workshop',
    name: 'Hands-on AI & Systems Architecture Workshop',
    start_date: '2026-10-25T13:00:00Z',
    end_date: '2026-10-25T16:30:00Z',
    venue: 'Innovation Hub Lab 4',
    status: 'published',
    total_registrations: 38,
    pending_approvals: 12,
    capacity: 40,
    category: 'Workshop',
    cover_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'evt-gas-2026',
    name: 'Global Accessibility Summit 2026',
    start_date: '2026-11-05T08:30:00Z',
    end_date: '2026-11-06T18:00:00Z',
    venue: 'Main Convention Center • Hall A',
    status: 'published',
    total_registrations: 280,
    pending_approvals: 4,
    capacity: 300,
    category: 'Conference',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'evt-career-fair',
    name: 'Tech & Engineering Career Connect 2026',
    start_date: '2026-11-12T10:00:00Z',
    end_date: '2026-11-12T16:00:00Z',
    venue: 'University Sports Complex Arena',
    status: 'published',
    total_registrations: 418,
    pending_approvals: 0,
    capacity: 800,
    category: 'Career',
    cover_image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'evt-community-meetup',
    name: 'Open Source Community Code & Coffee',
    start_date: '2026-10-31T10:00:00Z',
    end_date: '2026-10-31T14:00:00Z',
    venue: 'City Central Library Auditorium',
    status: 'published',
    total_registrations: 60,
    pending_approvals: 0,
    capacity: 60,
    category: 'Community',
    cover_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'evt-bootcamp-draft',
    name: 'Frontend Engineering & Accessibility Bootcamp',
    start_date: '2026-12-01T09:00:00Z',
    end_date: '2026-12-03T17:00:00Z',
    venue: 'Tech Park Training Room B',
    status: 'draft',
    total_registrations: 0,
    pending_approvals: 0,
    capacity: 50,
    category: 'Bootcamp',
    cover_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'evt-past-design-systems',
    name: 'Design Systems & Inclusive Web Roundtable 2025',
    start_date: '2025-11-14T10:00:00Z',
    end_date: '2025-11-14T15:30:00Z',
    venue: 'Innovation Auditorium 1',
    status: 'completed',
    total_registrations: 320,
    pending_approvals: 0,
    capacity: 350,
    category: 'Roundtable',
    cover_image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80'
  }
];

export const MOCK_ACTIVITIES: ManagerActivityItem[] = [
  {
    id: 'act-1',
    type: 'registration',
    text: '5 new registrations received',
    detail: 'KNUST Technology Conference 2026',
    event_name: 'KNUST Technology Conference 2026',
    event_id: 'evt-knust-2026',
    timestamp: '2026-10-02T08:50:00Z'
  },
  {
    id: 'act-2',
    type: 'approval',
    text: '3 registrations approved',
    detail: 'Hands-on AI & Systems Architecture Workshop',
    event_name: 'Hands-on AI & Systems Architecture Workshop',
    event_id: 'evt-ai-workshop',
    timestamp: '2026-10-02T08:15:00Z'
  },
  {
    id: 'act-3',
    type: 'schedule_change',
    text: 'Schedule updated',
    detail: 'Keynote session moved to 10:30 AM',
    event_name: 'KNUST Technology Conference 2026',
    event_id: 'evt-knust-2026',
    timestamp: '2026-10-02T07:00:00Z'
  },
  {
    id: 'act-4',
    type: 'venue_change',
    text: 'Venue changed',
    detail: 'Workshop moved from Room 204 to Lab 4',
    event_name: 'Hands-on AI & Systems Architecture Workshop',
    event_id: 'evt-ai-workshop',
    timestamp: '2026-10-01T16:30:00Z'
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
  },

  getManagerEvents: async (): Promise<ManagerEventItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_MANAGER_EVENTS]);
      }, 150);
    });
  },

  getManagerDashboardStats: async (): Promise<ManagerDashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total_events: 12,
          upcoming_events: 5,
          total_registrations: 1248,
          pending_approvals: 37,
          upcoming_list: MOCK_MANAGER_EVENTS.filter((e) => e.status === 'published').slice(0, 4),
          recent_activities: [...MOCK_ACTIVITIES]
        });
      }, 150);
    });
  },

  createEvent: async (input: {
    name: string;
    description: string;
    category: string;
    cover_image?: string;
    start_date: string;
    end_date: string;
    venue: string;
    location_details?: string;
    format?: 'physical' | 'online' | 'hybrid';
    online_link?: string;
    status: 'draft' | 'published';
    approval_mode: 'automatic' | 'manual';
    roles: string[];
    capacity?: number;
    registration_deadline?: string;
    accessibility_info?: string;
    collected_fields: string[];
  }): Promise<ManagerEventItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = `evt-${Date.now().toString(36)}`;
        const newManagerEvent: ManagerEventItem = {
          id,
          name: input.name,
          start_date: input.start_date,
          end_date: input.end_date,
          venue: input.venue,
          status: input.status,
          total_registrations: 0,
          pending_approvals: 0,
          capacity: input.capacity,
          category: input.category,
          cover_image: input.cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'
        };

        const newPublicEvent: EventWithMeta = {
          id,
          manager_id: 'usr-202-manager',
          name: input.name,
          description: input.description,
          category: input.category,
          cover_image: newManagerEvent.cover_image,
          start_date: input.start_date,
          end_date: input.end_date,
          venue: input.venue,
          location_details: input.location_details,
          status: input.status,
          registration_deadline: input.registration_deadline,
          approval_mode: input.approval_mode,
          capacity: input.capacity,
          accessibility_info: input.accessibility_info,
          collect_dietary: input.collected_fields.includes('dietary_requirements'),
          created_at: new Date().toISOString(),
          organizer_name: 'Roland Adjei',
          registration_status: input.status === 'published' ? 'open' : undefined
        };

        MOCK_MANAGER_EVENTS.unshift(newManagerEvent);
        MOCK_EVENTS.unshift(newPublicEvent);
        resolve(newManagerEvent);
      }, 250);
    });
  }
};
