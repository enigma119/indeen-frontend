'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Loading spinner component displayed during auth initialization
 */
function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
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
    return <LoadingSpinner />;
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
