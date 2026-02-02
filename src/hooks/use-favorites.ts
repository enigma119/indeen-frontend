'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getFavoriteIds,
} from '@/lib/api/favorites';
import {
  addFavoriteLocal,
  removeFavoriteLocal,
  loadFavorites,
} from '@/lib/favorites-storage';
import type { MentorProfile } from '@/types';

// Query key for favorites
export const favoritesKey = ['favorites'] as const;

/**
 * Hook to manage user's favorite mentors
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  // Query for fetching favorites
  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: favoritesKey,
    queryFn: getFavorites,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add favorite mutation with optimistic update
  const addMutation = useMutation({
    mutationFn: addFavorite,
    onMutate: async (mentorId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoritesKey });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData<MentorProfile[]>(favoritesKey);

      // Optimistic update: add to localStorage immediately
      addFavoriteLocal(mentorId);

      return { previousFavorites };
    },
    onError: (_err, _mentorId, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoritesKey, context.previousFavorites);
      }
      toast.error('Erreur lors de l\'ajout aux favoris');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKey });
      toast.success('Ajouté aux favoris');
    },
  });

  // Remove favorite mutation with optimistic update
  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onMutate: async (mentorId: string) => {
      await queryClient.cancelQueries({ queryKey: favoritesKey });

      const previousFavorites = queryClient.getQueryData<MentorProfile[]>(favoritesKey);

      // Optimistic update: remove from localStorage immediately
      removeFavoriteLocal(mentorId);

      // Optimistic update: remove from cache
      queryClient.setQueryData<MentorProfile[]>(favoritesKey, (old) =>
        old?.filter((m) => m.id !== mentorId) || []
      );

      return { previousFavorites };
    },
    onError: (_err, _mentorId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoritesKey, context.previousFavorites);
      }
      toast.error('Erreur lors du retrait des favoris');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKey });
      toast.success('Retiré des favoris');
    },
  });

  /**
   * Check if a mentor is in favorites
   * Uses localStorage for instant check
   */
  const isFavorited = (mentorId: string): boolean => {
    // First check localStorage for instant response
    const localFavorites = loadFavorites();
    if (localFavorites.includes(mentorId)) return true;

    // Then check query data
    return favorites.some((m) => m.id === mentorId);
  };

  /**
   * Toggle a mentor's favorite status
   */
  const toggleFavorite = (mentorId: string) => {
    if (isFavorited(mentorId)) {
      removeMutation.mutate(mentorId);
    } else {
      addMutation.mutate(mentorId);
    }
  };

  return {
    favorites,
    isLoading,
    error,
    isFavorited,
    toggleFavorite,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

/**
 * Hook to quickly check if a mentor is favorited
 * Uses localStorage for instant response without loading all favorites
 */
export function useIsFavorited(mentorId: string): boolean {
  const localFavorites = loadFavorites();
  return localFavorites.includes(mentorId);
}
