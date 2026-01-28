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
  bio: string;
  headline: string;
  languages: string[];
  specialties: string[];
  hourly_rate: number;
  currency: string;
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
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
  mentee?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}
