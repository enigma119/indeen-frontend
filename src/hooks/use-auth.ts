'use client';

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { apiClient } from '@/lib/api/client';
import type { User } from '@/types';

// Session refresh interval (4 minutes)
const SESSION_REFRESH_INTERVAL = 4 * 60 * 1000;
// Time before expiry to trigger refresh (5 minutes)
const REFRESH_THRESHOLD = 5 * 60;

/**
 * Hook for managing authentication state
 * Initializes auth on mount, listens for auth changes, and provides auth methods
 */
export function useAuth() {
  const {
    user,
    isLoading,
    isInitialized,
    setUser,
    setLoading,
    setInitialized,
    logout: storeLogout,
    isAuthenticated,
    isMentor,
    isMentee,
    isAdmin,
  } = useAuthStore();

  const supabase = useMemo(() => createBrowserClient(), []);
  const isConfigured = isSupabaseConfigured();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch user profile from backend
   */
  const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      // Use /auth/me for authenticated users (uses token, more reliable)
      const profile = await apiClient.get<User>('/auth/me');
      return profile;
    } catch (error: any) {
      // If user doesn't exist in database, the trigger should have created them
      // If 404, it means the user wasn't created yet (trigger might not have run)
      // In that case, we just return null - the user can refresh or the trigger will create them
      if (error?.response?.status === 404) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useAuth] User not found in database. The trigger should create them automatically.');
        }
        return null;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuth] Error fetching user profile:', error);
      }
      return null;
    }
  }, []);

  /**
   * Check and refresh session if needed
   */
  const checkAndRefreshSession = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // No session, user is logged out
        return;
      }

      // Check if token is about to expire
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = expiresAt - now;

        if (timeUntilExpiry < REFRESH_THRESHOLD) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[useAuth] Token expiring soon, refreshing...');
          }

          const { error } = await supabase.auth.refreshSession();

          if (error) {
            console.error('[useAuth] Error refreshing session:', error);
            // If refresh fails, log out the user
            storeLogout();
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuth] Error checking session:', error);
      }
    }
  }, [supabase, storeLogout]);

  /**
   * Initialize authentication state
   */
  const initializeAuth = useCallback(async () => {
    // If Supabase is not configured, skip initialization
    if (!supabase) {
      setUser(null);
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useAuth] Error getting session:', error);
        }
        setUser(null);
      } else if (session?.user) {
        // Fetch complete user profile from backend
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuth] Error initializing auth:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [supabase, setUser, setLoading, setInitialized, fetchUserProfile]);

  /**
   * Sign out the user
   */
  const signOut = useCallback(async () => {
    if (!supabase) {
      storeLogout();
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useAuth] Error signing out:', error);
        }
      }

      storeLogout();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuth] Error during sign out:', error);
      }
      storeLogout();
    } finally {
      setLoading(false);
    }
  }, [supabase, storeLogout, setLoading]);

  /**
   * Refresh user profile from backend
   */
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuth] Error refreshing profile:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchUserProfile, setUser, setLoading]);

  // Initialize auth on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  // Set up periodic session refresh
  useEffect(() => {
    if (!supabase || !isInitialized) return;

    // Initial check
    checkAndRefreshSession();

    // Set up interval
    refreshIntervalRef.current = setInterval(checkAndRefreshSession, SESSION_REFRESH_INTERVAL);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [supabase, isInitialized, checkAndRefreshSession]);

  // Listen for auth state changes
  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useAuth] Auth state changed:', event);
      }

      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        storeLogout();
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Optionally refresh profile on token refresh
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile, setUser, storeLogout]);

  return {
    user,
    isLoading,
    isConfigured,
    isAuthenticated: isAuthenticated(),
    isMentor: isMentor(),
    isMentee: isMentee(),
    isAdmin: isAdmin(),
    signOut,
    refreshProfile,
  };
}
