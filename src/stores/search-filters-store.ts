import { create } from 'zustand';
import type { SearchFilters, SortBy } from '@/types';

interface SearchState {
  // State
  filters: SearchFilters;
  sort: SortBy;
  page: number;

  // Actions
  setFilters: (filters: Partial<SearchFilters>) => void;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  removeFilter: (key: keyof SearchFilters) => void;
  setSort: (sort: SortBy) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  resetAll: () => void;

  // Computed
  hasActiveFilters: () => boolean;
  getActiveFiltersCount: () => number;
}

const initialState = {
  filters: {} as SearchFilters,
  sort: 'rating' as SortBy,
  page: 1,
};

export const useSearchStore = create<SearchState>((set, get) => ({
  // Initial state
  ...initialState,

  // Set multiple filters at once
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // Reset page when filters change
    })),

  // Set a single filter
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1,
    })),

  // Remove a specific filter
  removeFilter: (key) =>
    set((state) => {
      const newFilters = { ...state.filters };
      delete newFilters[key];
      return { filters: newFilters, page: 1 };
    }),

  // Set sort option
  setSort: (sort) => set({ sort, page: 1 }),

  // Set page (for pagination)
  setPage: (page) => set({ page }),

  // Reset only filters (keep sort)
  resetFilters: () =>
    set({
      filters: {},
      page: 1,
    }),

  // Reset everything to initial state
  resetAll: () => set(initialState),

  // Check if any filters are active
  hasActiveFilters: () => {
    const { filters } = get();
    return Object.keys(filters).some((key) => {
      const value = filters[key as keyof SearchFilters];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value === true;
      return value !== undefined && value !== null;
    });
  },

  // Count active filters
  getActiveFiltersCount: () => {
    const { filters } = get();
    let count = 0;

    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof SearchFilters];
      if (Array.isArray(value) && value.length > 0) {
        count += value.length;
      } else if (typeof value === 'boolean' && value === true) {
        count += 1;
      } else if (value !== undefined && value !== null) {
        count += 1;
      }
    });

    return count;
  },
}));
