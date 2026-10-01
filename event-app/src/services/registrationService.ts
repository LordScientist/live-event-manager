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
          resolve(reg);
        } else {
          resolve(null);
        }
      }, 200);
    });
  }
};
