import { apiClient } from './client';
import { createBrowserClient } from '@/lib/supabase/client';
import type { MenteeOnboardingData } from '@/types/onboarding';
import type { MenteeProfile } from '@/types';

/**
 * Upload avatar to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID (used as filename)
 * @returns The public URL of the uploaded avatar
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const supabase = createBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  // Get file extension
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${userId}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error('[uploadAvatar] Upload error:', uploadError);
    throw new Error('Erreur lors de l\'upload de l\'avatar');
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Create mentee profile API payload
 */
interface CreateMenteePayload {
  first_name: string;
  last_name: string;
  country_code: string;
  phone?: string;
  gender?: string;
  avatar_url?: string;
  learner_category: string;
  current_level: string;
  year_of_birth?: number;
  learning_context?: string;
  learning_goals: string[];
  preferred_languages: string[];
  learning_pace: string;
  preferred_session_duration: number;
  has_special_needs: boolean;
  special_needs_description?: string;
}

/**
 * Create mentee profile
 * @param data - The onboarding data
 * @param userId - The user's ID
 * @returns The created mentee profile
 */
export async function createMenteeProfile(
  data: Partial<MenteeOnboardingData>,
  userId: string
): Promise<MenteeProfile> {
  // Upload avatar if present
  let avatarUrl: string | undefined;

  if (data.avatar instanceof File) {
    try {
      avatarUrl = await uploadAvatar(data.avatar, userId);
    } catch (error) {
      console.error('[createMenteeProfile] Avatar upload failed:', error);
      // Continue without avatar - non-blocking error
    }
  } else if (typeof data.avatar === 'string') {
    avatarUrl = data.avatar;
  }

  // Build payload for backend
  const payload: CreateMenteePayload = {
    first_name: data.firstName || '',
    last_name: data.lastName || '',
    country_code: data.country || '',
    phone: data.phone,
    gender: data.gender,
    avatar_url: avatarUrl,
    learner_category: data.learnerCategory || 'ADULT',
    current_level: data.currentLevel || 'NO_ARABIC',
    year_of_birth: data.yearOfBirth,
    learning_context: data.learningContext,
    learning_goals: data.learningGoals || [],
    preferred_languages: data.preferredLanguages || [],
    learning_pace: data.learningPace || 'MODERATE',
    preferred_session_duration: data.preferredSessionDuration || 60,
    has_special_needs: data.hasSpecialNeeds || false,
    special_needs_description: data.specialNeedsDescription,
  };

  // Call backend API
  return apiClient.post<MenteeProfile>('/mentees', payload);
}

/**
 * Get current user's mentee profile
 */
export async function getMenteeProfile(): Promise<MenteeProfile | null> {
  try {
    return await apiClient.get<MenteeProfile>('/mentees/me');
  } catch (error) {
    console.error('[getMenteeProfile] Error:', error);
    return null;
  }
}

/**
 * Update mentee profile
 */
export async function updateMenteeProfile(
  data: Partial<CreateMenteePayload>
): Promise<MenteeProfile> {
  return apiClient.patch<MenteeProfile>('/mentees/me', data);
}
