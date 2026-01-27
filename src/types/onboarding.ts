// Onboarding Step Interface
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isOptional: boolean;
}

// Learner Category Enum
export type LearnerCategory = 'CHILD' | 'TEENAGER' | 'ADULT';

// Learning Level Enum
export type LearningLevel =
  | 'NO_ARABIC'
  | 'ARABIC_BEGINNER'
  | 'ARABIC_INTERMEDIATE'
  | 'ARABIC_ADVANCED'
  | 'QURAN_BEGINNER'
  | 'QURAN_INTERMEDIATE'
  | 'QURAN_ADVANCED';

// Learning Context
export type LearningContext =
  | 'MEMORIZATION'
  | 'IMPROVEMENT'
  | 'REVISION'
  | 'CERTIFICATION';

// Learning Goal
export type LearningGoal =
  | 'LEARN_ARABIC'
  | 'MEMORIZE_QURAN'
  | 'IMPROVE_TAJWEED'
  | 'UNDERSTAND_QURAN'
  | 'ISLAMIC_STUDIES'
  | 'PREPARE_CERTIFICATION';

// Learning Pace
export type LearningPace = 'SLOW' | 'MODERATE' | 'INTENSIVE';

// Specialty
export type Specialty =
  | 'TAJWEED'
  | 'HIFZ'
  | 'FIQH'
  | 'ARABIC'
  | 'TAFSIR'
  | 'SIRA'
  | 'AQIDA'
  | 'HADITH';

// Language
export type Language = 'fr' | 'ar' | 'en' | 'es' | 'de' | 'tr' | 'ur';

// Day of Week
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

// Mentee Onboarding Data
export interface MenteeOnboardingData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  country: string;
  phone?: string;
  avatar?: File | string;

  // Step 2: Learner Profile
  learnerCategory: LearnerCategory;
  currentLevel: LearningLevel;
  yearOfBirth?: number;
  learningContext?: LearningContext;

  // Step 3: Goals
  learningGoals: LearningGoal[];
  preferredLanguages: Language[];
  learningPace: LearningPace;
  preferredSessionDuration: number; // in minutes
  hasSpecialNeeds: boolean;
  specialNeedsDescription?: string;
}

// Time Slot
export interface TimeSlot {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

// Availability
export interface Availability {
  day: DayOfWeek;
  slots: TimeSlot[];
}

// Mentor Onboarding Data
export interface MentorOnboardingData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  country: string;
  phone?: string;
  avatar?: File | string;

  // Step 2: Qualifications
  bio: string;
  headline: string;
  yearsOfExperience: number;
  certifications: string[];
  hasIjaza: boolean;
  ijazaDetails?: string;

  // Step 3: Skills
  specialties: Specialty[];
  languages: Language[];
  teachingMethodology?: string;

  // Step 4: Pricing
  hourlyRate: number;
  currency: string;
  offersFreeSession: boolean;
  packageDeals?: {
    sessions: number;
    discountPercent: number;
  }[];

  // Step 5: Availability
  availability: Availability[];
  timezone: string;
  maxStudentsPerWeek?: number;
}

// Onboarding State
export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  data: Partial<MenteeOnboardingData | MentorOnboardingData>;
  isCompleted: boolean;
}
