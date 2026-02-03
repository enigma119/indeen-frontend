export interface User {
  id: string;
  email: string;
  role: 'MENTOR' | 'MENTEE' | 'ADMIN' | 'PARENT';
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  gender?: string;
  countryCode: string;
  timezone?: string;
  locale?: string;
  preferredCurrency?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
  // Populated profiles
  mentorProfile?: MentorProfile;
  menteeProfile?: MenteeProfile;
}

export interface MentorProfile {
  id: string;
  userId: string;
  slug: string;
  bio: string;
  headline: string;
  languages: string[];
  nativeLanguage?: string;
  specialties: string[];
  hourlyRate: number;
  currency: string;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  isAcceptingStudents?: boolean;
  // Profile details
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  yearsOfExperience?: number;
  totalSessions?: number;
  totalStudents?: number;
  completedSessions?: number;
  averageResponseTime?: number; // in minutes
  freeTrialAvailable?: boolean;
  freeTrialDuration?: number;
  // Teaching capabilities
  teachesChildren?: boolean;
  teachesTeenagers?: boolean;
  teachesAdults?: boolean;
  beginnerFriendly?: boolean;
  patientWithSlowLearners?: boolean;
  experiencedWithNewMuslims?: boolean;
  acceptedLevels?: string[];
  // Session settings
  minSessionDuration?: number;
  maxSessionDuration?: number;
  maxStudentsPerWeek?: number;
  // Academic info
  academicBackground?: string;
  certifications?: Certification[];
  videoIntroUrl?: string;
  // User info (populated from join)
  user?: User;
  createdAt?: string;
}

export interface Certification {
  id: string;
  type: string;
  name: string;
  institution?: string;
  year?: number;
  documentUrl?: string;
}

export interface MenteeProfile {
  id: string;
  userId: string;
  learnerCategory: 'CHILD' | 'TEENAGER' | 'ADULT';
  currentLevel: string;
  learningGoals: string[];
  preferredLanguages?: string[];
  learningPace?: 'SLOW' | 'MODERATE' | 'FAST';
  preferredSessionDuration?: number;
  specialNeeds?: string;
  totalSessions?: number;
  completedSessions?: number;
  totalHoursLearned?: number;
  user?: User;
  createdAt?: string;
}

// ============================================
// PROFILE UPDATE TYPES
// ============================================

export interface UpdateUserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  countryCode?: string;
  timezone?: string;
  locale?: string;
  preferredCurrency?: string;
  avatarUrl?: string;
}

export interface UpdateMentorProfile {
  bio?: string;
  headline?: string;
  languages?: string[];
  nativeLanguage?: string;
  specialties?: string[];
  hourlyRate?: number;
  currency?: string;
  teachesChildren?: boolean;
  teachesTeenagers?: boolean;
  teachesAdults?: boolean;
  beginnerFriendly?: boolean;
  patientWithSlowLearners?: boolean;
  experiencedWithNewMuslims?: boolean;
  acceptedLevels?: string[];
  minSessionDuration?: number;
  maxSessionDuration?: number;
  maxStudentsPerWeek?: number;
  freeTrialAvailable?: boolean;
  freeTrialDuration?: number;
  isAcceptingStudents?: boolean;
  videoIntroUrl?: string;
}

export interface UpdateMenteeProfile {
  learnerCategory?: 'CHILD' | 'TEENAGER' | 'ADULT';
  currentLevel?: string;
  learningGoals?: string[];
  preferredLanguages?: string[];
  learningPace?: 'SLOW' | 'MODERATE' | 'FAST';
  preferredSessionDuration?: number;
  specialNeeds?: string;
}

export interface UserWithProfile extends User {
  mentorProfile?: MentorProfile;
  menteeProfile?: MenteeProfile;
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
  mentorId: string;
  menteeId: string;
  rating: number;
  comment: string;
  createdAt: string;
  mentorResponse?: string;
  mentorResponseAt?: string;
  mentee?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
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

// ============================================
// SETTINGS TYPES
// ============================================

export interface NotificationPreferences {
  emailNotifications: boolean;
  emailSessions: boolean;
  emailPayments: boolean;
  emailReviews: boolean;
  emailMarketing: boolean;
  emailNewsletter: boolean;
  inAppNotifications: boolean;
  inAppMessages: boolean;
  inAppSessions: boolean;
  inAppBookingRequests: boolean;
  pushNotifications: boolean;
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface PrivacySettings {
  // Mentee settings
  profileVisibleToMentors: boolean;
  shareFirstName: boolean;
  shareCountry: boolean;
  shareLearningGoals: boolean;
  // Mentor settings
  appearInSearch: boolean;
  acceptingNewStudents: boolean;
  // Common settings
  analyticalCookies: boolean;
  marketingCookies: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActivity: string;
  isCurrent: boolean;
}

export interface LoginHistory {
  id: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  success: boolean;
}

export interface TwoFactorSetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface DataExportRequest {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
  format: 'json' | 'csv';
}

export interface DeleteAccountCheck {
  canDelete: boolean;
  pendingSessions: number;
  pendingPayments: number;
  blockers: string[];
}

export type DeleteAccountReason =
  | 'no_longer_needed'
  | 'too_expensive'
  | 'technical_issues'
  | 'bad_experience'
  | 'other';
