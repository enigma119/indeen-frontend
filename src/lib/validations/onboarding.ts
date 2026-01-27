import { z } from 'zod';

// ============================================
// MENTEE STEP SCHEMAS
// ============================================

// Step 1: Personal Info
export const menteeStep1Schema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  country: z
    .string()
    .min(2, 'Veuillez sélectionner un pays'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),
      'Numéro de téléphone invalide'
    ),
  gender: z.enum(['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY']).optional(),
  avatar: z.any().optional(),
});

// Step 2: Learner Profile (base schema)
export const menteeStep2BaseSchema = z.object({
  learnerCategory: z.enum(['CHILD', 'TEENAGER', 'ADULT'], {
    message: 'Veuillez sélectionner une catégorie',
  }),
  currentLevel: z.enum([
    'NO_ARABIC',
    'ARABIC_BEGINNER',
    'ARABIC_INTERMEDIATE',
    'ARABIC_ADVANCED',
    'QURAN_BEGINNER',
    'QURAN_INTERMEDIATE',
    'QURAN_ADVANCED',
  ], {
    message: 'Veuillez sélectionner votre niveau',
  }),
  yearOfBirth: z
    .number()
    .min(1900, 'Année invalide')
    .max(new Date().getFullYear(), 'Année invalide')
    .optional(),
  learningContext: z.enum([
    'MEMORIZATION',
    'IMPROVEMENT',
    'REVISION',
    'CERTIFICATION',
  ]).optional(),
});

// Step 2: with refinement
export const menteeStep2Schema = menteeStep2BaseSchema.refine(
  (data) => {
    // If learner is CHILD or TEENAGER, yearOfBirth is required
    if (data.learnerCategory === 'CHILD' || data.learnerCategory === 'TEENAGER') {
      return data.yearOfBirth !== undefined && data.yearOfBirth !== null;
    }
    return true;
  },
  {
    message: 'L\'année de naissance est requise pour les mineurs',
    path: ['yearOfBirth'],
  }
);

// Step 3: Goals (base schema)
export const menteeStep3BaseSchema = z.object({
  learningGoals: z
    .array(z.enum([
      'LEARN_ARABIC',
      'MEMORIZE_QURAN',
      'IMPROVE_TAJWEED',
      'UNDERSTAND_QURAN',
      'ISLAMIC_STUDIES',
      'PREPARE_CERTIFICATION',
    ]))
    .min(1, 'Veuillez sélectionner au moins un objectif'),
  preferredLanguages: z
    .array(z.enum(['fr', 'ar', 'en', 'es', 'de', 'tr', 'ur']))
    .min(1, 'Veuillez sélectionner au moins une langue'),
  learningPace: z.enum(['SLOW', 'MODERATE', 'INTENSIVE'], {
    message: 'Veuillez sélectionner un rythme',
  }),
  preferredSessionDuration: z
    .number()
    .min(15, 'La durée minimale est de 15 minutes')
    .max(180, 'La durée maximale est de 3 heures'),
  hasSpecialNeeds: z.boolean(),
  specialNeedsDescription: z.string().optional(),
});

// Step 3: with refinement
export const menteeStep3Schema = menteeStep3BaseSchema.refine(
  (data) => {
    if (data.hasSpecialNeeds) {
      return data.specialNeedsDescription && data.specialNeedsDescription.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Veuillez décrire vos besoins particuliers',
    path: ['specialNeedsDescription'],
  }
);

// ============================================
// MENTOR STEP SCHEMAS
// ============================================

// Step 1: Personal Info (for mentors - avatar and phone are required)
export const mentorStep1Schema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  country: z
    .string()
    .min(2, 'Veuillez sélectionner un pays'),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est obligatoire pour les mentors')
    .refine(
      (val) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),
      'Numéro de téléphone invalide'
    ),
  gender: z.enum(['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY']).optional(),
  avatar: z.any().refine(
    (val) => val !== undefined && val !== null,
    'La photo de profil est obligatoire pour les mentors'
  ),
});

// Certification schema
const certificationSchema = z.object({
  type: z.enum(['IJAZA', 'DIPLOMA', 'TRAINING', 'OTHER'], {
    message: 'Veuillez sélectionner un type de certification',
  }),
  institution: z
    .string()
    .min(2, 'Le nom de l\'institution doit contenir au moins 2 caractères')
    .max(200, 'Le nom de l\'institution ne peut pas dépasser 200 caractères'),
  year: z
    .number()
    .min(1900, 'Année invalide')
    .max(new Date().getFullYear(), 'L\'année ne peut pas être dans le futur'),
  documentUrl: z.string().optional(),
});

// Step 2: Qualifications (base schema)
export const mentorStep2BaseSchema = z.object({
  headline: z
    .string()
    .min(10, 'Le titre doit contenir au moins 10 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  bio: z
    .string()
    .min(100, 'La biographie doit contenir au moins 100 caractères')
    .max(1000, 'La biographie ne peut pas dépasser 1000 caractères'),
  yearsExperience: z
    .number()
    .min(0, 'L\'expérience ne peut pas être négative')
    .max(50, 'Veuillez vérifier vos années d\'expérience'),
  certifications: z
    .array(certificationSchema)
    .min(1, 'Veuillez ajouter au moins une certification')
    .max(5, 'Maximum 5 certifications'),
  education: z
    .string()
    .optional(),
});

// Step 2: with refinement
export const mentorStep2Schema = mentorStep2BaseSchema;

// Step 3: Skills (base schema)
export const mentorStep3BaseSchema = z.object({
  languages: z
    .array(z.enum(['fr', 'ar', 'en', 'es', 'de', 'tr', 'ur']))
    .min(1, 'Veuillez sélectionner au moins une langue'),
  nativeLanguage: z.string().optional(),
  specialties: z
    .array(z.enum([
      'TAJWEED',
      'HIFZ',
      'FIQH',
      'ARABIC',
      'TAFSIR',
      'SIRA',
      'AQIDA',
      'HADITH',
    ]))
    .min(1, 'Veuillez sélectionner au moins une spécialité')
    .max(5, 'Maximum 5 spécialités'),
  teachesChildren: z.boolean().default(false),
  teachesTeenagers: z.boolean().default(false),
  teachesAdults: z.boolean().default(false),
  beginnerFriendly: z.boolean().default(false),
  patientWithSlowLearners: z.boolean().default(false),
  experiencedWithNewMuslims: z.boolean().default(false),
  specialNeedsSupport: z.boolean().default(false),
  acceptedLevels: z
    .array(z.enum([
      'NO_ARABIC',
      'ARABIC_BEGINNER',
      'ARABIC_INTERMEDIATE',
      'ARABIC_ADVANCED',
      'QURAN_BEGINNER',
      'QURAN_INTERMEDIATE',
      'QURAN_ADVANCED',
    ]))
    .optional(),
});

// Step 3: with refinement
export const mentorStep3Schema = mentorStep3BaseSchema.refine(
  (data) => {
    // At least one type of student must be selected
    return data.teachesChildren || data.teachesTeenagers || data.teachesAdults;
  },
  {
    message: 'Veuillez sélectionner au moins un type d\'étudiant',
    path: ['teachesChildren'],
  }
);

// Step 4: Pricing (base schema)
export const mentorStep4BaseSchema = z.object({
  freeSessionsOnly: z.boolean().default(false),
  hourlyRate: z.number().optional(),
  currency: z.enum(['EUR', 'USD', 'GBP', 'MAD', 'TND', 'DZD']).optional(),
  freeTrialAvailable: z.boolean().default(false),
  freeTrialDuration: z.number().optional(),
  minSessionDuration: z
    .number()
    .min(30, 'La durée minimale est de 30 minutes')
    .max(180, 'La durée maximale est de 180 minutes'),
  maxSessionDuration: z
    .number()
    .min(60, 'La durée minimale est de 60 minutes')
    .max(180, 'La durée maximale est de 180 minutes'),
  maxStudentsPerWeek: z
    .number()
    .min(1, 'Minimum 1 étudiant')
    .max(50, 'Maximum 50 étudiants')
    .default(20),
});

// Step 4: with refinement
export const mentorStep4Schema = mentorStep4BaseSchema.refine(
  (data) => {
    // If not free sessions only, hourlyRate and currency are required
    if (!data.freeSessionsOnly) {
      return data.hourlyRate !== undefined && data.hourlyRate > 0 && data.currency !== undefined;
    }
    return true;
  },
  {
    message: 'Le tarif horaire et la devise sont requis si vous facturez',
    path: ['hourlyRate'],
  }
).refine(
  (data) => {
    // minSessionDuration must be less than maxSessionDuration
    return data.minSessionDuration < data.maxSessionDuration;
  },
  {
    message: 'La durée minimale doit être inférieure à la durée maximale',
    path: ['maxSessionDuration'],
  }
).refine(
  (data) => {
    // If freeTrialAvailable is true, freeTrialDuration is required
    if (data.freeTrialAvailable) {
      return data.freeTrialDuration !== undefined;
    }
    return true;
  },
  {
    message: 'Veuillez sélectionner la durée de l\'essai gratuit',
    path: ['freeTrialDuration'],
  }
);

// Step 5: Availability
const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:mm)'),
}).refine(
  (data) => {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
  },
  { message: 'L\'heure de fin doit être après l\'heure de début' }
);

const availabilitySchema = z.object({
  day: z.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]),
  slots: z.array(timeSlotSchema).min(1, 'Ajoutez au moins un créneau'),
});

export const mentorStep5Schema = z.object({
  availability: z
    .array(availabilitySchema)
    .min(1, 'Veuillez ajouter au moins un jour de disponibilité'),
  timezone: z.string().min(1, 'Veuillez sélectionner votre fuseau horaire'),
  maxStudentsPerWeek: z
    .number()
    .min(1, 'Minimum 1 étudiant')
    .max(100, 'Maximum 100 étudiants')
    .optional(),
});

// ============================================
// COMPLETE SCHEMAS
// ============================================

export const completeMenteeOnboardingSchema = z.object({
  ...menteeStep1Schema.shape,
  ...menteeStep2BaseSchema.shape,
  ...menteeStep3BaseSchema.shape,
});

export const completeMentorOnboardingSchema = z.object({
  ...mentorStep1Schema.shape,
  ...mentorStep2BaseSchema.shape,
  ...mentorStep3Schema.shape,
  ...mentorStep4Schema.shape,
  ...mentorStep5Schema.shape,
});

// Export types
export type MenteeStep1Data = z.infer<typeof menteeStep1Schema>;
export type MenteeStep2Data = z.infer<typeof menteeStep2Schema>;
export type MenteeStep3Data = z.infer<typeof menteeStep3Schema>;

export type MentorStep1Data = z.infer<typeof mentorStep1Schema>;
export type MentorStep2Data = z.infer<typeof mentorStep2Schema>;
export type MentorStep3Data = z.infer<typeof mentorStep3Schema>;
export type MentorStep4Data = z.infer<typeof mentorStep4Schema>;
export type MentorStep5Data = z.infer<typeof mentorStep5Schema>;

// Base types (without refinements)
export type MentorStep3BaseData = z.infer<typeof mentorStep3BaseSchema>;
export type MentorStep4BaseData = z.infer<typeof mentorStep4BaseSchema>;
