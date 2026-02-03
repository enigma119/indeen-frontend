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
 * Helper to check if error is an AbortError (from Web Locks API or AbortController)
 */
function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'AbortError' || error.message.includes('aborted'))
  );
}

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
  const isMountedRef = useRef(true);

  /**
   * Fetch user profile from backend
   * Falls back to basic user info from Supabase session if backend is unavailable
   */
  const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      // Use /auth/me for authenticated users (uses token, more reliable)
      const profile = await apiClient.get<User>('/auth/me');
      return profile;
    } catch (error: any) {
      // Ignore AbortError
      if (isAbortError(error)) {
        return null;
      }

      // If 401 (token rejected) or 404 (user not found), try to create basic user from Supabase
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useAuth] Backend unavailable or rejected token. Using Supabase session data.');
        }

        // Try to get basic user info from Supabase session
        try {
          if (!supabase) return null;
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const supabaseUser = session.user;
            // Create a basic user object from Supabase metadata
            const basicUser: User = {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              role: (supabaseUser.user_metadata?.role as User['role']) || 'MENTEE',
              firstName: supabaseUser.user_metadata?.firstName || supabaseUser.user_metadata?.firstName || supabaseUser.email?.split('@')[0] || 'Utilisateur',
              lastName: supabaseUser.user_metadata?.lastName || supabaseUser.user_metadata?.lastName || '',
              avatarUrl: supabaseUser.user_metadata?.avatarUrl || supabaseUser.user_metadata?.avatarUrl,
              countryCode: supabaseUser.user_metadata?.countryCode || supabaseUser.user_metadata?.country_code || 'FR',
              createdAt: supabaseUser.created_at,
            };
            return basicUser;
          }
        } catch (sessionError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[useAuth] Error getting Supabase session:', sessionError);
          }
        }
        return null;
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuth] Error fetching user profile:', error);
      }
      return null;
    }
  }, [supabase]);

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
      // Ignore AbortError - happens when component unmounts during async operation
      if (isAbortError(error)) {
        return;
      }
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
        // Ignore AbortError
        if (isAbortError(error)) {
          return;
        }
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
      // Ignore AbortError - happens when component unmounts during async operation
      if (isAbortError(error)) {
        return;
      }
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
    isMountedRef.current = true;

    if (!isInitialized) {
      initializeAuth();
    }

    return () => {
      isMountedRef.current = false;
    };
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
