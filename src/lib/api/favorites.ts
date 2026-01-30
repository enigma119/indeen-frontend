import { apiClient } from './client';
import type { MentorProfile } from '@/types';
import {
  loadFavorites,
  addFavoriteLocal,
  removeFavoriteLocal,
} from '@/lib/favorites-storage';
import { getMentorById } from './search';

/**
 * Add a mentor to favorites
 * Falls back to localStorage if API fails
 */
export async function addFavorite(mentorId: string): Promise<void> {
  try {
    await apiClient.post('/users/me/favorites', { mentorId });
  } catch {
    // Fallback to localStorage
    addFavoriteLocal(mentorId);
  }
}

/**
 * Remove a mentor from favorites
 * Falls back to localStorage if API fails
 */
export async function removeFavorite(mentorId: string): Promise<void> {
  try {
    await apiClient.delete(`/users/me/favorites/${mentorId}`);
  } catch {
    // Fallback to localStorage
    removeFavoriteLocal(mentorId);
  }
}

/**
 * Get all favorite mentors
 * Falls back to localStorage if API fails
 */
export async function getFavorites(): Promise<MentorProfile[]> {
  try {
    return await apiClient.get<MentorProfile[]>('/users/me/favorites');
  } catch {
    // Fallback: load IDs from localStorage and fetch mentor data
    const favoriteIds = loadFavorites();
    if (favoriteIds.length === 0) return [];

    // Fetch mentor profiles for each favorite ID
    const mentors = await Promise.all(
      favoriteIds.map(async (id) => {
        try {
          return await getMentorById(id);
        } catch {
          return null;
        }
      })
    );

    return mentors.filter((m): m is MentorProfile => m !== null);
  }
}

/**
 * Get favorite mentor IDs only (for quick checks)
 * Uses localStorage for faster access
 */
export function getFavoriteIds(): string[] {
  return loadFavorites();
}
