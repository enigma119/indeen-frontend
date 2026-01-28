'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useCallback, useRef } from 'react';
import { useSearchStore } from '@/stores/search-filters-store';
import type { SearchFilters, SortBy } from '@/types';

/**
 * Hook to synchronize search filters with URL query parameters
 * - Loads filters from URL on mount
 * - Updates URL when filters change
 * - Enables shareable/bookmarkable search URLs
 */
export function useSearchParamsSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, sort, page, setFilters, setSort, setPage } = useSearchStore();
  const isInitialMount = useRef(true);
  const isUpdatingFromUrl = useRef(false);

  // Parse URL params to filters on mount
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;
    isUpdatingFromUrl.current = true;

    const urlFilters: SearchFilters = {};

    // Parse array params
    const languages = searchParams.get('languages');
    if (languages) urlFilters.languages = languages.split(',');

    const specialties = searchParams.get('specialties');
    if (specialties) urlFilters.specialties = specialties.split(',');

    const acceptedLevels = searchParams.get('acceptedLevels');
    if (acceptedLevels) urlFilters.acceptedLevels = acceptedLevels.split(',');

    // Parse numeric params
    const minPrice = searchParams.get('minPrice');
    if (minPrice) urlFilters.minPrice = Number(minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) urlFilters.maxPrice = Number(maxPrice);

    const minRating = searchParams.get('minRating');
    if (minRating) urlFilters.minRating = Number(minRating);

    // Parse boolean params
    const booleanParams = [
      'teachesChildren',
      'teachesTeenagers',
      'teachesAdults',
      'beginnerFriendly',
      'experiencedWithNewMuslims',
      'freeTrialAvailable',
      'freeSessionsOnly',
    ] as const;

    booleanParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value === 'true') {
        urlFilters[param] = true;
      }
    });

    // Parse string params
    const country = searchParams.get('country');
    if (country) urlFilters.country = country;

    // Parse sort and page
    const urlSort = (searchParams.get('sort') as SortBy) || 'rating';
    const urlPage = Number(searchParams.get('page')) || 1;

    // Update store with URL values
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
    setSort(urlSort);
    setPage(urlPage);

    // Allow URL updates after initial sync
    setTimeout(() => {
      isUpdatingFromUrl.current = false;
    }, 100);
  }, [searchParams, setFilters, setSort, setPage]);

  // Build URL from current state
  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Array filters
    if (filters.languages?.length) {
      params.set('languages', filters.languages.join(','));
    }
    if (filters.specialties?.length) {
      params.set('specialties', filters.specialties.join(','));
    }
    if (filters.acceptedLevels?.length) {
      params.set('acceptedLevels', filters.acceptedLevels.join(','));
    }

    // Numeric filters
    if (filters.minPrice !== undefined) {
      params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.minRating !== undefined) {
      params.set('minRating', filters.minRating.toString());
    }

    // Boolean filters
    if (filters.teachesChildren) params.set('teachesChildren', 'true');
    if (filters.teachesTeenagers) params.set('teachesTeenagers', 'true');
    if (filters.teachesAdults) params.set('teachesAdults', 'true');
    if (filters.beginnerFriendly) params.set('beginnerFriendly', 'true');
    if (filters.experiencedWithNewMuslims) params.set('experiencedWithNewMuslims', 'true');
    if (filters.freeTrialAvailable) params.set('freeTrialAvailable', 'true');
    if (filters.freeSessionsOnly) params.set('freeSessionsOnly', 'true');

    // String filters
    if (filters.country) params.set('country', filters.country);

    // Sort and page
    if (sort !== 'rating') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());

    return params.toString();
  }, [filters, sort, page]);

  // Update URL when state changes
  useEffect(() => {
    // Skip if we're currently loading from URL
    if (isUpdatingFromUrl.current || isInitialMount.current) return;

    const queryString = buildUrl();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Use replace to avoid adding to history on every filter change
    router.replace(newUrl, { scroll: false });
  }, [filters, sort, page, pathname, router, buildUrl]);

  return {
    // Helper to get current URL for sharing
    getShareableUrl: () => {
      const queryString = buildUrl();
      if (typeof window !== 'undefined') {
        return `${window.location.origin}${pathname}${queryString ? `?${queryString}` : ''}`;
      }
      return '';
    },
  };
}
