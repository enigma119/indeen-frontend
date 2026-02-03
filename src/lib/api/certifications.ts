import { apiClient } from './client';
import { createBrowserClient } from '@/lib/supabase/client';
import type {
  Certification,
  CreateCertificationDto,
  UpdateCertificationDto,
} from '@/types';

// ============================================
// MENTOR CERTIFICATIONS
// ============================================

/**
 * Get all certifications for the current mentor
 */
export async function getCertifications(): Promise<Certification[]> {
  return apiClient.get<Certification[]>('/mentors/me/certifications');
}

/**
 * Get a single certification by ID
 */
export async function getCertification(id: string): Promise<Certification> {
  return apiClient.get<Certification>(`/certifications/${id}`);
}

/**
 * Create a new certification
 */
export async function createCertification(
  data: CreateCertificationDto,
  file: File
): Promise<Certification> {
  // Upload file first
  const documentUrl = await uploadCertificationDocument(file);

  // Create certification with document URL
  return apiClient.post<Certification>('/mentors/me/certifications', {
    ...data,
    documentUrl,
  });
}

/**
 * Update a certification
 */
export async function updateCertification(
  id: string,
  data: UpdateCertificationDto,
  file?: File
): Promise<Certification> {
  let documentUrl: string | undefined;

  // Upload new file if provided
  if (file) {
    documentUrl = await uploadCertificationDocument(file);
  }

  return apiClient.patch<Certification>(`/certifications/${id}`, {
    ...data,
    ...(documentUrl && { documentUrl }),
  });
}

/**
 * Delete a certification
 */
export async function deleteCertification(id: string): Promise<void> {
  await apiClient.delete(`/certifications/${id}`);
}

/**
 * Upload certification document to Supabase Storage
 */
export async function uploadCertificationDocument(file: File): Promise<string> {
  const supabase = createBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Type de fichier non autorisé. Utilisez PDF, JPG, PNG ou WEBP.');
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Le fichier est trop volumineux. Taille max: 10MB.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const fileName = `${timestamp}-${randomStr}.${fileExt}`;
  const filePath = `certifications/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('certifications')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('certifications')
    .getPublicUrl(filePath);

  return publicUrl;
}

// ============================================
// ADMIN CERTIFICATIONS
// ============================================

/**
 * Get all pending certifications (admin only)
 */
export async function getPendingCertifications(): Promise<
  (Certification & { mentor?: { id: string; user?: { firstName: string; lastName: string; email: string } } })[]
> {
  return apiClient.get('/admin/certifications/pending');
}

/**
 * Approve a certification (admin only)
 */
export async function approveCertification(id: string): Promise<Certification> {
  return apiClient.patch<Certification>(`/admin/certifications/${id}/approve`);
}

/**
 * Reject a certification (admin only)
 */
export async function rejectCertification(
  id: string,
  reason: string
): Promise<Certification> {
  return apiClient.patch<Certification>(`/admin/certifications/${id}/reject`, {
    reason,
  });
}
