import type { Registration, RegistrationStatus } from '../types';

export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    event_id: 'evt-knust-2026',
    user_id: 'usr-101-regular',
    event_role_id: 'role-speaker-knust',
    status: 'approved',
    submitted_at: '2026-09-12T14:30:00Z',
    reviewed_at: '2026-09-13T10:00:00Z',
    reviewed_by: 'usr-202-manager',
    requires_accommodation: false,
    dietary_requirements: 'None',
    session_topic: 'Frontier AI Systems in African Infrastructure'
  },
  {
    id: 'reg-002',
    event_id: 'evt-ai-workshop',
    user_id: 'usr-101-regular',
    event_role_id: 'role-participant-ai',
    status: 'pending',
    submitted_at: '2026-09-28T09:15:00Z',
    requires_accommodation: true,
    accommodation_details: 'Live captions (CART) preferred during fast-paced coding walkthroughs',
    dietary_requirements: 'Vegetarian'
  },
  {
    id: 'reg-003',
    event_id: 'evt-graphic-design',
    user_id: 'usr-101-regular',
    event_role_id: 'role-participant-design',
    status: 'approved',
    submitted_at: '2026-09-25T11:00:00Z',
    reviewed_at: '2026-09-25T12:00:00Z',
    requires_accommodation: false
  },
  {
    id: 'reg-004',
    event_id: 'evt-climate-action',
    user_id: 'usr-101-regular',
    event_role_id: 'role-participant-climate',
    status: 'approved',
    submitted_at: '2026-09-26T14:20:00Z',
    reviewed_at: '2026-09-26T15:00:00Z',
    requires_accommodation: false
  },
  {
    id: 'reg-005',
    event_id: 'evt-career-fair-2026',
    user_id: 'usr-101-regular',
    event_role_id: 'role-participant-career',
    status: 'pending',
    submitted_at: '2026-09-29T16:45:00Z',
    requires_accommodation: false
  }
];

export interface RegistrationDetailItem extends Registration {
  user_name: string;
  user_email: string;
  user_phone: string;
  user_organization: string;
  role_name: string;
}

export const MOCK_DETAILED_REGISTRATIONS: RegistrationDetailItem[] = [
  {
    id: 'reg-001',
    event_id: 'evt-knust-2026',
    user_id: 'usr-101-regular',
    user_name: 'Alex Rivera',
    user_email: 'alex.rivera@example.com',
    user_phone: '+1 (555) 234-5678',
    user_organization: 'Tech For All Collective',
    role_name: 'Speaker',
    event_role_id: 'role-speaker-knust',
    status: 'approved',
    submitted_at: '2026-09-12T14:30:00Z',
    reviewed_at: '2026-09-13T10:00:00Z',
    reviewed_by: 'usr-202-manager',
    requires_accommodation: false,
    dietary_requirements: 'Vegetarian',
    session_topic: 'Frontier AI Systems in African Infrastructure'
  },
  {
    id: 'reg-002',
    event_id: 'evt-knust-2026',
    user_id: 'usr-103',
    user_name: 'Dr. Amina Touré',
    user_email: 'amina.toure@education.org',
    user_phone: '+233 24 111 2233',
    user_organization: 'Pan-African AI Labs',
    role_name: 'Speaker',
    event_role_id: 'role-speaker-knust',
    status: 'approved',
    submitted_at: '2026-09-15T11:00:00Z',
    reviewed_at: '2026-09-16T09:30:00Z',
    reviewed_by: 'usr-202-manager',
    requires_accommodation: true,
    accommodation_details: 'Live captions (CART) preferred during presentations',
    dietary_requirements: 'Halal',
    session_topic: 'AI in Education: Scaling Localized Pedagogies'
  },
  {
    id: 'reg-003',
    event_id: 'evt-knust-2026',
    user_id: 'usr-104',
    user_name: 'Kwame Mensah',
    user_email: 'k.mensah@techhub.gh',
    user_phone: '+233 20 444 5566',
    user_organization: 'KNUST Student Chapter',
    role_name: 'Participant',
    event_role_id: 'role-participant-knust',
    status: 'pending',
    submitted_at: '2026-10-01T15:20:00Z',
    requires_accommodation: true,
    accommodation_details: 'Wheelchair ramp access and step-free navigation to Main Auditorium',
    dietary_requirements: 'None',
    attendance_goals: 'Learn about distributed cloud systems'
  },
  {
    id: 'reg-004',
    event_id: 'evt-knust-2026',
    user_id: 'usr-105',
    user_name: 'Ama Serwaa',
    user_email: 'ama.serwaa@community.org',
    user_phone: '+233 54 777 8899',
    user_organization: 'Women Who Code Kumasi',
    role_name: 'Volunteer',
    event_role_id: 'role-volunteer-knust',
    status: 'approved',
    submitted_at: '2026-09-20T10:15:00Z',
    reviewed_at: '2026-09-21T08:00:00Z',
    reviewed_by: 'usr-202-manager',
    requires_accommodation: false,
    dietary_requirements: 'None',
    volunteer_availability: 'Available full day for attendee check-in and information desk'
  },
  {
    id: 'reg-005',
    event_id: 'evt-knust-2026',
    user_id: 'usr-106',
    user_name: 'Kofi Boateng',
    user_email: 'kofi.b@startup.gh',
    user_phone: '+233 27 333 4455',
    user_organization: 'Accra FinTech Studio',
    role_name: 'Participant',
    event_role_id: 'role-participant-knust',
    status: 'pending',
    submitted_at: '2026-10-02T08:00:00Z',
    requires_accommodation: true,
    accommodation_details: 'Accessible priority seating in front rows',
    dietary_requirements: 'Vegetarian',
    attendance_goals: 'Connect with engineering leaders'
  },
  {
    id: 'reg-006',
    event_id: 'evt-knust-2026',
    user_id: 'usr-107',
    user_name: 'Abena Appiah',
    user_email: 'abena.appiah@designers.org',
    user_phone: '+233 50 888 9900',
    user_organization: 'Creative Design Studio',
    role_name: 'Participant',
    event_role_id: 'role-participant-knust',
    status: 'approved',
    submitted_at: '2026-09-22T14:45:00Z',
    reviewed_at: '2026-09-23T11:00:00Z',
    reviewed_by: 'usr-202-manager',
    requires_accommodation: true,
    accommodation_details: 'Sensory quiet space access during noisy keynote breaks',
    dietary_requirements: 'None'
  },
  {
    id: 'reg-007',
    event_id: 'evt-knust-2026',
    user_id: 'usr-108',
    user_name: 'Yaw Mensah',
    user_email: 'yaw.mensah@volunteers.gh',
    user_phone: '+233 26 555 6677',
    user_organization: 'KNUST Robotics Club',
    role_name: 'Volunteer',
    event_role_id: 'role-volunteer-knust',
    status: 'pending',
    submitted_at: '2026-10-01T16:40:00Z',
    requires_accommodation: false,
    dietary_requirements: 'None',
    volunteer_availability: 'Afternoon session room moderator support'
  },
  {
    id: 'reg-008',
    event_id: 'evt-knust-2026',
    user_id: 'usr-109',
    user_name: 'Emefa Agbodza',
    user_email: 'emefa.agbodza@alumni.knust.edu.gh',
    user_phone: '+233 24 999 0011',
    user_organization: 'Alumni Network',
    role_name: 'Participant',
    event_role_id: 'role-participant-knust',
    status: 'rejected',
    submitted_at: '2026-09-25T13:20:00Z',
    reviewed_at: '2026-09-26T10:00:00Z',
    reviewed_by: 'usr-202-manager',
    requires_accommodation: false,
    dietary_requirements: 'None'
  }
];

export const registrationService = {
  getUserRegistrations: async (userId: string): Promise<Registration[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_REGISTRATIONS.filter((r) => r.user_id === userId));
      }, 100);
    });
  },

  getEventRegistrations: async (eventId: string): Promise<Registration[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_REGISTRATIONS.filter((r) => r.event_id === eventId));
      }, 100);
    });
  },

  getEventRegistrationsDetailed: async (eventId: string): Promise<RegistrationDetailItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DETAILED_REGISTRATIONS.filter((r) => r.event_id === eventId));
      }, 120);
    });
  },

  createRegistration: async (
    registration: Omit<Registration, 'id' | 'submitted_at'>
  ): Promise<Registration> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReg: Registration = {
          ...registration,
          id: `reg-${Date.now().toString(36)}`,
          submitted_at: new Date().toISOString()
        };
        MOCK_REGISTRATIONS.unshift(newReg);
        resolve(newReg);
      }, 300);
    });
  },

  updateRegistrationStatus: async (
    regId: string,
    status: RegistrationStatus,
    reviewerId: string
  ): Promise<Registration | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reg = MOCK_REGISTRATIONS.find((r) => r.id === regId);
        if (reg) {
          reg.status = status;
          reg.reviewed_at = new Date().toISOString();
          reg.reviewed_by = reviewerId;
        }

        const detailed = MOCK_DETAILED_REGISTRATIONS.find((r) => r.id === regId);
        if (detailed) {
          detailed.status = status;
          detailed.reviewed_at = new Date().toISOString();
          detailed.reviewed_by = reviewerId;
        }

        resolve(reg || detailed || null);
      }, 150);
    });
  }
};
