export interface User {
  id: string;
  email: string;
  role: 'MENTOR' | 'MENTEE' | 'ADMIN' | 'PARENT';
  first_name: string;
  last_name: string;
  avatar_url?: string;
  country_code: string;
  created_at: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  slug: string;
  bio: string;
  headline: string;
  languages: string[];
  native_language?: string;
  specialties: string[];
  hourly_rate: number;
  currency: string;
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
  // Profile details
  verification_status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  years_of_experience?: number;
  total_sessions?: number;
  total_students?: number;
  average_response_time?: number; // in minutes
  free_trial_available?: boolean;
  // Teaching capabilities
  teaches_children?: boolean;
  teaches_teenagers?: boolean;
  teaches_adults?: boolean;
  beginner_friendly?: boolean;
  patient_with_slow_learners?: boolean;
  experienced_with_new_muslims?: boolean;
  accepted_levels?: string[];
  // Academic info
  academic_background?: string;
  certifications?: Certification[];
  // User info (populated from join)
  user?: User;
  created_at?: string;
}

export interface Certification {
  id: string;
  type: string;
  name: string;
  institution?: string;
  year?: number;
  document_url?: string;
}

export interface MenteeProfile {
  id: string;
  user_id: string;
  learner_category: 'CHILD' | 'TEENAGER' | 'ADULT';
  current_level: string;
  learning_goals: string[];
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'MENTOR' | 'MENTEE';
}

export interface ResetPasswordData {
  email: string;
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchFilters {
  query?: string;
  languages?: string[];
  specialties?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  teachesChildren?: boolean;
  teachesTeenagers?: boolean;
  teachesAdults?: boolean;
  beginnerFriendly?: boolean;
  experiencedWithNewMuslims?: boolean;
  freeTrialAvailable?: boolean;
  freeSessionsOnly?: boolean;
  country?: string;
  acceptedLevels?: string[];
}

export type SortBy = 'rating' | 'price_asc' | 'price_desc' | 'experience' | 'reviews';

export interface SortOption {
  value: SortBy;
  label: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface MentorSearchResult {
  mentors: MentorProfile[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// AVAILABILITY & REVIEWS TYPES
// ============================================

export interface AvailabilitySlot {
  id: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  date?: string;
}

export interface Review {
  id: string;
  mentor_id: string;
  mentee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  mentor_response?: string;
  mentor_response_at?: string;
  mentee?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface ReviewsResult {
  reviews: Review[];
  total: number;
  totalPages: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReportReason {
  value: string;
  label: string;
}

export interface MentorReport {
  mentor_id: string;
  reason: string;
  description: string;
}

// ============================================
// SESSION & BOOKING TYPES
// ============================================

export type SessionStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_MENTOR'
  | 'CANCELLED_BY_MENTEE'
  | 'NO_SHOW_MENTOR'
  | 'NO_SHOW_MENTEE';

export interface Session {
  id: string;
  mentor_profile_id: string;
  mentee_profile_id: string;
  scheduled_at: string;
  scheduled_end_at: string;
  duration: number; // in minutes
  status: SessionStatus;
  mentor_confirmed: boolean;
  timezone: string;
  meeting_url?: string;
  lesson_plan?: string;
  mentor_notes?: string;
  topics_covered?: string[];
  cancellation_reason?: string;
  cancelled_at?: string;
  cancelled_by?: 'mentor' | 'mentee';
  confirmed_at?: string;
  completed_at?: string;
  price?: number;
  currency?: string;
  has_review?: boolean;
  created_at: string;
  updated_at: string;
  // Populated relations
  mentor_profile?: MentorProfile;
  mentee_profile?: MenteeProfile & { user?: User };
}

export interface BookingRequest {
  mentor_id: string;
  scheduled_at: string; // ISO date string
  duration: number; // in minutes (30, 60, 90, 120)
  timezone: string;
  lesson_plan?: string;
}

export interface BookingSlot {
  date: string; // ISO date string
  start_time: string; // format "HH:mm"
  end_time: string; // format "HH:mm"
  is_available: boolean;
  mentor_id: string;
}

export interface DayAvailability {
  date: string;
  slots: BookingSlot[];
  has_availability: boolean;
}

export interface SessionsResult {
  sessions: Session[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export type SessionDuration = 30 | 60 | 90 | 120;

export interface DurationOption {
  value: SessionDuration;
  label: string;
  price: number;
  recommended?: boolean;
}

// ============================================
// DAILY VIDEO CALL TYPES
// ============================================

export interface DailyParticipant {
  user_id: string;
  user_name: string;
  audio: boolean;
  video: boolean;
  screen: boolean;
  local: boolean;
  session_id?: string;
  joined_at?: Date;
}

export type DailyCallState =
  | 'idle'
  | 'joining'
  | 'joined'
  | 'left'
  | 'error';

export interface DailyError {
  type: 'permissions' | 'network' | 'room-expired' | 'not-allowed' | 'unknown';
  message: string;
  details?: string;
}

export interface DailyDevices {
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  selectedAudioInput?: string;
  selectedAudioOutput?: string;
  selectedVideoInput?: string;
}

export interface DailyCallConfig {
  roomUrl: string;
  token?: string;
  userName: string;
  startAudioOff?: boolean;
  startVideoOff?: boolean;
}

export interface MeetingMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: Date;
  is_local: boolean;
}
