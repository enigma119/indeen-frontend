'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to warn users about unsaved changes when leaving the page
 *
 * @param isDirty - Boolean indicating if the form has unsaved changes
 * @param message - Optional custom message (default: French message)
 */
export function useUnsavedChanges(
  isDirty: boolean,
  message: string = 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?'
) {
  // Handle browser beforeunload event (page refresh, close tab)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // Modern browsers will show their own message, but we set returnValue for compatibility
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, message]);

  // Confirmation function for programmatic navigation
  const confirmNavigation = useCallback((): boolean => {
    if (isDirty) {
      return window.confirm(message);
    }
    return true;
  }, [isDirty, message]);

  return { confirmNavigation };
}

/**
 * Hook for route change interception with Next.js
 * Warns user when navigating away with unsaved changes
 *
 * @param isDirty - Boolean indicating if the form has unsaved changes
 * @param message - Optional custom message
 */
export function useRouteChangeWarning(
  isDirty: boolean,
  message: string = 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?'
) {
  const router = useRouter();

  // Handle browser beforeunload
  useUnsavedChanges(isDirty, message);

  // Create a safe navigation function that checks for unsaved changes
  const safeNavigate = useCallback(
    (path: string) => {
      if (isDirty) {
        const confirmed = window.confirm(message);
        if (confirmed) {
          router.push(path);
        }
      } else {
        router.push(path);
      }
    },
    [isDirty, message, router]
  );

  return { safeNavigate };
}
