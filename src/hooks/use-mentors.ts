import { useQuery } from '@tanstack/react-query';
import {
  searchMentors,
  getMentorById,
  getMentorBySlug,
  getMentorAvailability,
  getMentorReviews,
  getFeaturedMentors,
  getSimilarMentors,
} from '@/lib/api/search';
import type { SearchFilters, SortBy } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/search';

// ============================================
// QUERY KEYS
// ============================================

export const mentorKeys = {
  all: ['mentors'] as const,
  search: (filters: SearchFilters, sort: SortBy, page: number) =>
    [...mentorKeys.all, 'search', { filters, sort, page }] as const,
  detail: (id: string) => [...mentorKeys.all, 'detail', id] as const,
  slug: (slug: string) => [...mentorKeys.all, 'slug', slug] as const,
  availability: (mentorId: string, date?: string) =>
    [...mentorKeys.all, 'availability', mentorId, date] as const,
  reviews: (mentorId: string, page: number) =>
    [...mentorKeys.all, 'reviews', mentorId, page] as const,
  featured: (limit: number) => [...mentorKeys.all, 'featured', limit] as const,
  similar: (mentorId: string, limit: number) =>
    [...mentorKeys.all, 'similar', mentorId, limit] as const,
};

// ============================================
// SEARCH HOOK
// ============================================

/**
 * Hook to search mentors with filters, sorting, and pagination
 */
export function useSearchMentors(
  filters: SearchFilters,
  sort: SortBy = 'rating',
  page: number = 1,
  limit: number = DEFAULT_PAGE_SIZE
) {
  return useQuery({
    queryKey: mentorKeys.search(filters, sort, page),
    queryFn: () => searchMentors(filters, sort, { page, limit }),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================
// SINGLE MENTOR HOOKS
// ============================================

/**
 * Hook to get a single mentor by ID
 */
export function useMentor(id: string | undefined) {
  return useQuery({
    queryKey: mentorKeys.detail(id || ''),
    queryFn: () => getMentorById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to get a single mentor by slug
 */
export function useMentorBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: mentorKeys.slug(slug || ''),
    queryFn: () => getMentorBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// ============================================
// AVAILABILITY HOOK
// ============================================

/**
 * Hook to get mentor's availability
 */
export function useMentorAvailability(mentorId: string | undefined, date?: Date) {
  return useQuery({
    queryKey: mentorKeys.availability(mentorId || '', date?.toISOString()),
    queryFn: () => getMentorAvailability(mentorId!, date),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 2, // 2 minutes (availability changes often)
  });
}

// ============================================
// REVIEWS HOOK
// ============================================

/**
 * Hook to get mentor's reviews with pagination
 */
export function useMentorReviews(
  mentorId: string | undefined,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: mentorKeys.reviews(mentorId || '', page),
    queryFn: () => getMentorReviews(mentorId!, page, limit),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
}

// ============================================
// FEATURED MENTORS HOOK
// ============================================

/**
 * Hook to get featured/top mentors for homepage
 */
export function useFeaturedMentors(limit: number = 6) {
  return useQuery({
    queryKey: mentorKeys.featured(limit),
    queryFn: () => getFeaturedMentors(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// ============================================
// SIMILAR MENTORS HOOK
// ============================================

/**
 * Hook to get similar mentors
 */
export function useSimilarMentors(mentorId: string | undefined, limit: number = 4) {
  return useQuery({
    queryKey: mentorKeys.similar(mentorId || '', limit),
    queryFn: () => getSimilarMentors(mentorId!, limit),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
