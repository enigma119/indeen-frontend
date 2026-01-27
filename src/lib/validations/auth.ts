import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
  remember: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Signup form validation schema
 */
export const signupSchema = z
  .object({
    role: z.enum(['MENTOR', 'MENTEE'], {
      message: 'Veuillez choisir un rôle',
    }),
    firstName: z
      .string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z
      .string()
      .min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z
      .string()
      .min(1, 'L\'email est requis')
      .email('Format d\'email invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        /[A-Z]/,
        'Le mot de passe doit contenir au moins une majuscule'
      )
      .regex(
        /[0-9]/,
        'Le mot de passe doit contenir au moins un chiffre'
      ),
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Vous devez accepter les conditions d\'utilisation',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
