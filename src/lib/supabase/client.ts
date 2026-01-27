'use client';

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Creates a Supabase client for use in browser/client components
 * Use this in React components with 'use client' directive
 * Returns null if Supabase is not configured
 */
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Supabase] Missing environment variables. Auth will not work.');
    }
    return null;
  }

  return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
