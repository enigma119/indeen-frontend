/**
 * Local storage helper for favorites
 * Used as fallback when API is not available
 */

const FAVORITES_KEY = 'mentor_favorites';

/**
 * Save favorite mentor IDs to localStorage
 */
export function saveFavorites(mentorIds: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(mentorIds));
}

/**
 * Load favorite mentor IDs from localStorage
 */
export function loadFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Add a mentor to favorites
 */
export function addFavoriteLocal(mentorId: string): void {
  const favorites = loadFavorites();
  if (!favorites.includes(mentorId)) {
    favorites.push(mentorId);
    saveFavorites(favorites);
  }
}

/**
 * Remove a mentor from favorites
 */
export function removeFavoriteLocal(mentorId: string): void {
  const favorites = loadFavorites();
  const filtered = favorites.filter((id) => id !== mentorId);
  saveFavorites(filtered);
}

/**
 * Check if a mentor is in favorites
 */
export function isFavoriteLocal(mentorId: string): boolean {
  const favorites = loadFavorites();
  return favorites.includes(mentorId);
}

/**
 * Clear all favorites
 */
export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAVORITES_KEY);
}
