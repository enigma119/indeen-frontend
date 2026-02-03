import { apiClient } from './client';
import { createBrowserClient } from '@/lib/supabase/client';
import type {
  User,
  UserWithProfile,
  MentorProfile,
  MenteeProfile,
  UpdateUserProfile,
  UpdateMentorProfile,
  UpdateMenteeProfile,
} from '@/types';

/**
 * Get current user profile with mentor/mentee profile
 */
export async function getUserProfile(): Promise<UserWithProfile> {
  return apiClient.get<UserWithProfile>('/users/me');
}

/**
 * Update current user's basic profile
 */
export async function updateUserProfile(
  data: UpdateUserProfile
): Promise<User> {
  return apiClient.patch<User>('/users/me', data);
}

/**
 * Update mentor profile
 */
export async function updateMentorProfile(
  data: UpdateMentorProfile
): Promise<MentorProfile> {
  return apiClient.patch<MentorProfile>('/mentors/me', data);
}

/**
 * Update mentee profile
 */
export async function updateMenteeProfile(
  data: UpdateMenteeProfile
): Promise<MenteeProfile> {
  return apiClient.patch<MenteeProfile>('/mentees/me', data);
}

/**
 * Upload avatar to Supabase Storage
 * @param file - Image file to upload
 * @returns URL of the uploaded avatar
 */
export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update user profile with new avatar URL
  await updateUserProfile({ avatarUrl: publicUrl });

  return publicUrl;
}

/**
 * Delete user's avatar
 */
export async function deleteAvatar(): Promise<void> {
  await updateUserProfile({ avatarUrl: undefined });
}

/**
 * Delete user account (soft delete)
 */
export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/users/me');
}

/**
 * Request email verification
 */
export async function requestEmailVerification(): Promise<void> {
  await apiClient.post('/users/me/verify-email');
}

/**
 * Change password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiClient.post('/users/me/change-password', {
    currentPassword,
    newPassword,
  });
}
