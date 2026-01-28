import { apiClient } from './client';
import { createBrowserClient } from '@/lib/supabase/client';
import type { MentorOnboardingData } from '@/types/onboarding';
import type { MentorProfile } from '@/types';

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
 * Upload certification document to Supabase Storage
 * @param file - The document file to upload
 * @param userId - The user's ID
 * @returns The public URL of the uploaded document
 */
export async function uploadCertification(
  file: File,
  userId: string
): Promise<string> {
  const supabase = createBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const fileName = `${userId}/${timestamp}.${fileExt}`;
  const filePath = `certifications/${fileName}`;

  const { error } = await supabase.storage.from('certifications').upload(filePath, file, {
    contentType: file.type,
  });

  if (error) {
    console.error('[uploadCertification] Upload error:', error);
    throw new Error('Erreur lors de l\'upload du document de certification');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('certifications')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Create mentor profile API payload
 */
interface CreateMentorPayload {
  bio: string;
  headline?: string;
  yearsExperience?: number;
  certifications?: object[];
  education?: string;
  languages: string[];
  nativeLanguage?: string;
  specialties: string[];
  teachesChildren?: boolean;
  teachesTeenagers?: boolean;
  teachesAdults?: boolean;
  beginnerFriendly?: boolean;
  patientWithSlowLearners?: boolean;
  experiencedWithNewMuslims?: boolean;
  specialNeedsSupport?: boolean;
  acceptedLevels?: string[];
  hourlyRate?: number;
  currency?: string;
  freeTrialAvailable?: boolean;
  freeTrialDuration?: number;
  freeSessionsOnly?: boolean;
  minSessionDuration?: number;
  maxSessionDuration?: number;
  maxStudentsPerWeek?: number;
}

/**
 * Create mentor profile
 * @param data - The onboarding data
 * @param userId - The user's ID
 * @returns The created mentor profile
 */
export async function createMentorProfile(
  data: Partial<MentorOnboardingData>,
  userId: string
): Promise<MentorProfile> {
  // 1. Upload avatar (required)
  let avatarUrl: string | undefined;

  if (data.avatar instanceof File) {
    try {
      avatarUrl = await uploadAvatar(data.avatar, userId);
    } catch (error) {
      console.error('[createMentorProfile] Avatar upload failed:', error);
      throw new Error('Erreur lors de l\'upload de la photo de profil');
    }
  } else if (typeof data.avatar === 'string') {
    avatarUrl = data.avatar;
  } else {
    throw new Error('La photo de profil est obligatoire');
  }

  // 2. Upload certification documents if present
  const certificationsWithUrls = await Promise.all(
    (data.certifications || []).map(async (cert) => {
      let documentUrl = cert.documentUrl;
      
      // If there's a File object, upload it
      if (cert.documentFile instanceof File) {
        try {
          documentUrl = await uploadCertification(cert.documentFile, userId);
        } catch (error) {
          console.error('[createMentorProfile] Certification upload failed:', error);
          // Continue without document - non-blocking error
        }
      }
      
      return {
        type: cert.type,
        institution: cert.institution,
        year: cert.year,
        documentUrl: documentUrl,
      };
    })
  );

  // 3. Create mentor profile via API
  const payload: CreateMentorPayload = {
    bio: data.bio || '',
    headline: data.headline,
    yearsExperience: data.yearsExperience,
    certifications: certificationsWithUrls.map((cert) => ({
      type: cert.type,
      institution: cert.institution,
      year: cert.year,
      documentUrl: cert.documentUrl,
    })),
    education: data.education,
    languages: data.languages || [],
    nativeLanguage: data.nativeLanguage,
    specialties: data.specialties || [],
    teachesChildren: data.teachesChildren || false,
    teachesTeenagers: data.teachesTeenagers || false,
    teachesAdults: data.teachesAdults || false,
    beginnerFriendly: data.beginnerFriendly,
    patientWithSlowLearners: data.patientWithSlowLearners,
    experiencedWithNewMuslims: data.experiencedWithNewMuslims,
    specialNeedsSupport: data.specialNeedsSupport,
    acceptedLevels: data.acceptedLevels,
    hourlyRate: data.freeSessionsOnly ? undefined : data.hourlyRate,
    currency: data.freeSessionsOnly ? undefined : data.currency,
    freeTrialAvailable: data.freeTrialAvailable,
    freeTrialDuration: data.freeTrialDuration,
    freeSessionsOnly: data.freeSessionsOnly || false,
    minSessionDuration: data.minSessionDuration,
    maxSessionDuration: data.maxSessionDuration,
    maxStudentsPerWeek: data.maxStudentsPerWeek,
  };

  const profile = await apiClient.post<MentorProfile>('/mentors', payload);

  // 4. Update user with avatar URL
  if (avatarUrl) {
    try {
      await apiClient.patch('/users/me', {
        avatarUrl,
      });
    } catch (error) {
      console.error('[createMentorProfile] Error updating user avatar:', error);
      // Non-blocking error
    }
  }

  // 5. Create availability slots
  if (data.weeklyAvailability && data.weeklyAvailability.length > 0) {
    try {
      // Convert weekly availability to backend format
      // Backend expects: dayOfWeek (0=Sunday, 6=Saturday), startTime, endTime
      const weeklyPattern = data.weeklyAvailability.flatMap((day) =>
        day.slots.map((slot) => ({
          dayOfWeek: day.day, // 0=Sunday, 6=Saturday
          startTime: slot.start, // "09:00"
          endTime: slot.end, // "12:00"
        }))
      );

      if (weeklyPattern.length > 0) {
        await apiClient.post(`/mentors/${profile.id}/availability/bulk`, {
          weeklyPattern,
        });
      }
    } catch (error) {
      console.error('[createMentorProfile] Error creating availability:', error);
      // Non-blocking error - mentor can add availability later
    }
  }

  return profile;
}

/**
 * Get current user's mentor profile
 */
export async function getMentorProfile(): Promise<MentorProfile | null> {
  try {
    return await apiClient.get<MentorProfile>('/mentors/me');
  } catch (error) {
    console.error('[getMentorProfile] Error:', error);
    return null;
  }
}

/**
 * Update mentor profile
 */
export async function updateMentorProfile(
  data: Partial<CreateMentorPayload>
): Promise<MentorProfile> {
  return apiClient.patch<MentorProfile>('/mentors/me', data);
}
