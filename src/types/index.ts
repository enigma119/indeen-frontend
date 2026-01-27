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
