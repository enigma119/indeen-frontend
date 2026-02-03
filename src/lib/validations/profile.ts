import { z } from 'zod';

/**
 * General user info validation schema
 */
export const generalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s-()]+$/.test(val),
      'Numéro de téléphone invalide'
    ),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  countryCode: z.string().length(2, 'Code pays invalide'),
  timezone: z.string().min(1, 'Fuseau horaire requis'),
  locale: z.enum(['fr', 'en', 'ar']),
  preferredCurrency: z.string().length(3, 'Devise invalide'),
});

export type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;

/**
 * Mentor profile validation schema
 */
export const mentorProfileSchema = z
  .object({
    headline: z
      .string()
      .min(10, 'Minimum 10 caractères')
      .max(200, 'Maximum 200 caractères'),
    bio: z
      .string()
      .min(100, 'Minimum 100 caractères pour une bio complète')
      .max(1000, 'Maximum 1000 caractères'),
    languages: z
      .array(z.string())
      .min(1, 'Sélectionnez au moins une langue'),
    nativeLanguage: z.string().optional(),
    specialties: z
      .array(z.string())
      .min(1, 'Sélectionnez au moins une spécialité'),
    acceptedLevels: z
      .array(z.string())
      .min(1, 'Sélectionnez au moins un niveau'),
    hourlyRate: z
      .number()
      .min(0, 'Le tarif ne peut pas être négatif')
      .optional(),
    currency: z.string().length(3, 'Devise invalide'),
    teachesChildren: z.boolean(),
    teachesTeenagers: z.boolean(),
    teachesAdults: z.boolean(),
    beginnerFriendly: z.boolean(),
    patientWithSlowLearners: z.boolean(),
    experiencedWithNewMuslims: z.boolean(),
    minSessionDuration: z.number().min(15).max(180),
    maxSessionDuration: z.number().min(30).max(240),
    maxStudentsPerWeek: z.number().min(1).max(100).optional(),
    freeTrialAvailable: z.boolean(),
    freeTrialDuration: z.number().min(15).max(60).optional(),
    isAcceptingStudents: z.boolean(),
    videoIntroUrl: z
      .string()
      .url('URL invalide')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) =>
      data.teachesChildren || data.teachesTeenagers || data.teachesAdults,
    {
      message: "Sélectionnez au moins un type d'élève",
      path: ['teachesChildren'],
    }
  )
  .refine(
    (data) => data.minSessionDuration <= data.maxSessionDuration,
    {
      message:
        'La durée minimale doit être inférieure ou égale à la durée maximale',
      path: ['minSessionDuration'],
    }
  );

export type MentorProfileFormData = z.infer<typeof mentorProfileSchema>;

/**
 * Mentee profile validation schema
 */
export const menteeProfileSchema = z.object({
  learnerCategory: z.enum(['CHILD', 'TEENAGER', 'ADULT']),
  currentLevel: z.string().min(1, 'Niveau requis'),
  learningGoals: z
    .array(z.string())
    .min(1, 'Sélectionnez au moins un objectif'),
  preferredLanguages: z
    .array(z.string())
    .min(1, 'Sélectionnez au moins une langue'),
  learningPace: z.enum(['SLOW', 'MODERATE', 'FAST']),
  preferredSessionDuration: z.number().min(15).max(180),
  specialNeeds: z.string().max(500, 'Maximum 500 caractères').optional(),
});

export type MenteeProfileFormData = z.infer<typeof menteeProfileSchema>;

/**
 * Avatar upload validation
 */
export const avatarSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Taille max: 5MB')
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Format accepté: JPG, PNG, WEBP'
    ),
});

/**
 * Password change validation
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z
      .string()
      .min(8, 'Minimum 8 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Doit contenir majuscule, minuscule et chiffre'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
