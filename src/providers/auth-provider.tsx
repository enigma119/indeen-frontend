'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';
import { AuthLoader } from '@/components/auth/AuthLoader';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Inner component that uses the auth hook
 * Separated to ensure hooks are called in proper order
 */
function AuthProviderInner({ children }: AuthProviderProps) {
  // Initialize auth by calling the hook
  useAuth();

  const { isInitialized } = useAuthStore();

  // Show loading spinner only during initial auth check
  if (!isInitialized) {
    return <AuthLoader message="Chargement de votre session..." />;
  }

  return <>{children}</>;
}

/**
 * Auth Provider component
 * Wraps the application and handles auth initialization
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthProviderInner>{children}</AuthProviderInner>;
}
