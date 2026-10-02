/* ==========================================================================
   EVENT COORDINATION & MANAGEMENT SYSTEM - CORE TYPES
   Relational models reflecting the 7-table database architecture & Section 2
   ========================================================================== */

/**
 * Account Types (Section 2)
 * Note: 'role' in an event belongs to Registration, NOT permanently to the User Account.
 */
export type AccountType = 'user' | 'manager';

export interface UserProfile {
  id: string; // UUID
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  gender?: string;
  organization?: string;
  job_title?: string;
  dietary?: string;
  accessibility?: string;
  profile_photo?: string;
  account_type: AccountType;
  created_at: string; // ISO 8601
}

/**
 * Event Entity
 */
export type EventStatus = 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
export type ApprovalMode = 'automatic' | 'manual';

export interface Event {
  id: string; // UUID
  manager_id: string; // UserProfile ID of the manager
  name: string;
  description: string;
  cover_image?: string;
  start_date: string; // ISO 8601
  end_date: string; // ISO 8601
  venue: string;
  location_details?: string;
  category: string;
  status: EventStatus;
  registration_deadline?: string;
  approval_mode: ApprovalMode;
  capacity?: number;
  accessibility_info?: string; // Venue accessibility summary
  collect_dietary?: boolean; // Organizer toggle (Section 12)
  created_at: string;
}

/**
 * Event Roles (Configured per event, e.g. Participant, Speaker, Volunteer)
 */
export interface EventRole {
  id: string; // UUID
  event_id: string;
  name: string; // "Participant" | "Speaker" | "Volunteer" | custom
  description?: string;
  capacity?: number;
  filled_count?: number;
  enabled: boolean;
}

/**
 * Registration Entity
 * Architectural rule: User -> Event Registration -> (Event, Role, Status, Details)
 */
export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Registration {
  id: string; // UUID
  event_id: string;
  user_id: string;
  event_role_id: string; // Tied to specific EventRole
  status: RegistrationStatus;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  
  // Accommodation & Inclusive Participation (Private / Protected)
  requires_accommodation: boolean;
  accommodation_details?: string;
  dietary_requirements?: string;
  
  // Role-specific answers
  session_topic?: string; // For speakers
  volunteer_availability?: string; // For volunteers
  attendance_goals?: string; // For general participants
}

/**
 * Schedule Items (Sessions)
 */
export interface ScheduleItem {
  id: string; // UUID
  event_id: string;
  title: string;
  description?: string;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  venue: string; // Room / Hall
  speaker_id?: string;
  speaker_name?: string;
  audience?: string;
}

/**
 * Event Updates (The core differentiator: permanent change log & targeted alerts)
 */
export type UpdateType =
  | 'schedule_change'
  | 'venue_change'
  | 'speaker_change'
  | 'general_announcement'
  | 'emergency';
export type UpdateAudience = 'all' | 'speakers' | 'volunteers' | 'attendees' | 'participants' | 'approved';

export interface EventUpdate {
  id: string; // UUID
  event_id: string;
  title: string;
  message: string;
  type: UpdateType;
  audience: UpdateAudience;
  created_by: string; // Manager UserProfile ID
  created_at: string; // ISO 8601
}

/**
 * Notifications (Per-user targeted alerts)
 */
export interface Notification {
  id: string; // UUID
  user_id: string;
  event_id: string;
  update_id?: string;
  title: string;
  message: string;
  type: UpdateType;
  read: boolean;
  created_at: string; // ISO 8601
}
