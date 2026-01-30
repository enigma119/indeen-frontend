import { apiClient } from './client';
import type {
  SearchFilters,
  SortBy,
  PaginationParams,
  MentorSearchResult,
  MentorProfile,
  AvailabilitySlot,
  ReviewsResult,
  MentorReport,
} from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/search';

/**
 * Search mentors with filters, sorting, and pagination
 */
export async function searchMentors(
  filters: SearchFilters = {},
  sort: SortBy = 'rating',
  pagination: PaginationParams = { page: 1, limit: DEFAULT_PAGE_SIZE }
): Promise<MentorSearchResult> {
  const params = new URLSearchParams();

  // Array filters
  if (filters.languages?.length) {
    params.append('languages', filters.languages.join(','));
  }
  if (filters.specialties?.length) {
    params.append('specialties', filters.specialties.join(','));
  }
  if (filters.acceptedLevels?.length) {
    params.append('acceptedLevels', filters.acceptedLevels.join(','));
  }

  // Numeric filters
  if (filters.minPrice !== undefined) {
    params.append('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined) {
    params.append('maxPrice', filters.maxPrice.toString());
  }
  if (filters.minRating !== undefined) {
    params.append('minRating', filters.minRating.toString());
  }

  // Boolean filters
  if (filters.teachesChildren !== undefined) {
    params.append('teachesChildren', filters.teachesChildren.toString());
  }
  if (filters.teachesTeenagers !== undefined) {
    params.append('teachesTeenagers', filters.teachesTeenagers.toString());
  }
  if (filters.teachesAdults !== undefined) {
    params.append('teachesAdults', filters.teachesAdults.toString());
  }
  if (filters.beginnerFriendly !== undefined) {
    params.append('beginnerFriendly', filters.beginnerFriendly.toString());
  }
  if (filters.experiencedWithNewMuslims !== undefined) {
    params.append('experiencedWithNewMuslims', filters.experiencedWithNewMuslims.toString());
  }
  if (filters.freeTrialAvailable !== undefined) {
    params.append('freeTrialAvailable', filters.freeTrialAvailable.toString());
  }
  if (filters.freeSessionsOnly !== undefined) {
    params.append('freeSessionsOnly', filters.freeSessionsOnly.toString());
  }

  // String filters
  if (filters.country) {
    params.append('country', filters.country);
  }

  // Pagination and sorting
  params.append('page', pagination.page.toString());
  params.append('limit', pagination.limit.toString());
  params.append('sortBy', sort);

  return apiClient.get<MentorSearchResult>(`/mentors/search?${params.toString()}`);
}

/**
 * Get a mentor by ID
 */
export async function getMentorById(id: string): Promise<MentorProfile> {
  return apiClient.get<MentorProfile>(`/mentors/${id}`);
}

/**
 * Get a mentor by slug (URL-friendly identifier)
 */
export async function getMentorBySlug(slug: string): Promise<MentorProfile> {
  return apiClient.get<MentorProfile>(`/mentors/slug/${slug}`);
}

/**
 * Get mentor's availability slots
 * @param mentorId - The mentor's ID
 * @param date - Optional date to get availability for a specific week
 */
export async function getMentorAvailability(
  mentorId: string,
  date?: Date
): Promise<AvailabilitySlot[]> {
  const params = date ? `?date=${date.toISOString()}` : '';
  return apiClient.get<AvailabilitySlot[]>(`/mentors/${mentorId}/availability${params}`);
}

/**
 * Get mentor's reviews with pagination
 */
export async function getMentorReviews(
  mentorId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResult> {
  return apiClient.get<ReviewsResult>(`/mentors/${mentorId}/reviews?page=${page}&limit=${limit}`);
}

/**
 * Get featured/top mentors for homepage
 */
export async function getFeaturedMentors(limit: number = 6): Promise<MentorProfile[]> {
  return apiClient.get<MentorProfile[]>(`/mentors/featured?limit=${limit}`);
}

/**
 * Get similar mentors based on specialties/languages
 */
export async function getSimilarMentors(
  mentorId: string,
  limit: number = 4
): Promise<MentorProfile[]> {
  return apiClient.get<MentorProfile[]>(`/mentors/${mentorId}/similar?limit=${limit}`);
}

/**
 * Report a mentor profile
 */
export async function reportMentor(report: MentorReport): Promise<void> {
  return apiClient.post(`/mentors/${report.mentor_id}/report`, {
    reason: report.reason,
    description: report.description,
  });
}
