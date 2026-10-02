import type { Notification } from '../types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  // Today's notifications
  {
    id: 'notif-1',
    user_id: 'usr-101-regular',
    event_id: 'evt-knust-2026',
    update_id: 'upd-1',
    title: 'Venue changed',
    message: 'Your 2:00 PM session has moved to the Main Auditorium.',
    type: 'venue_change',
    read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
  },
  {
    id: 'notif-2',
    user_id: 'usr-101-regular',
    event_id: 'evt-knust-2026',
    title: 'Schedule updated',
    message: 'The event schedule has been updated.',
    type: 'schedule_change',
    read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 'notif-3',
    user_id: 'usr-101-regular',
    event_id: 'evt-knust-2026',
    title: 'Registration approved',
    message: 'Your registration for KNUST Technology Conference has been approved.',
    type: 'general_announcement',
    read: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  },

  // Earlier notifications (yesterday / previous days)
  {
    id: 'notif-4',
    user_id: 'usr-101-regular',
    event_id: 'evt-gas-2026',
    title: 'Registration received',
    message: 'We received your registration request for Global Accessibility Summit 2026.',
    type: 'general_announcement',
    read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'notif-5',
    user_id: 'usr-101-regular',
    event_id: 'evt-ai-workshop',
    title: 'Accessibility support verified',
    message: 'Your request for live captions has been reviewed and approved by the coordinator.',
    type: 'general_announcement',
    read: true,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
  }
];

export const notificationService = {
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_NOTIFICATIONS.filter((n) => n.user_id === userId)]);
      }, 120);
    });
  },

  markAsRead: async (notifId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = MOCK_NOTIFICATIONS.find((n) => n.id === notifId);
        if (item) {
          item.read = true;
        }
        resolve();
      }, 80);
    });
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_NOTIFICATIONS.forEach((n) => {
          if (n.user_id === userId) {
            n.read = true;
          }
        });
        resolve();
      }, 100);
    });
  },

  deleteNotification: async (notifId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_NOTIFICATIONS.findIndex((n) => n.id === notifId);
        if (index !== -1) {
          MOCK_NOTIFICATIONS.splice(index, 1);
        }
        resolve();
      }, 80);
    });
  },

  clearAllNotifications: async (userId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        for (let i = MOCK_NOTIFICATIONS.length - 1; i >= 0; i--) {
          if (MOCK_NOTIFICATIONS[i].user_id === userId) {
            MOCK_NOTIFICATIONS.splice(i, 1);
          }
        }
        resolve();
      }, 100);
    });
  }
};
