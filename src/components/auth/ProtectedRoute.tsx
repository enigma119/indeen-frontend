'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthLoader } from './AuthLoader';

type UserRole = 'MENTOR' | 'MENTEE' | 'ADMIN' | 'PARENT';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

/**
 * ProtectedRoute component for protecting entire pages
 * Redirects to login if not authenticated, or to access-denied if wrong role
 */
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to initialize
    if (isLoading) return;

    // Not authenticated - redirect to login with return URL
    if (!isAuthenticated || !user) {
      const loginUrl = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    // Check role if required
    if (requiredRole) {
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = requiredRoles.includes(user.role);

      if (!hasRequiredRole) {
        // Redirect to access denied or dashboard
        router.replace('/access-denied');
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, pathname, redirectTo]);

  // Show loader while checking auth
  if (isLoading) {
    return <AuthLoader message="Vérification de l'authentification..." />;
  }

  // Not authenticated - show loader while redirecting
  if (!isAuthenticated || !user) {
    return <AuthLoader message="Redirection vers la connexion..." />;
  }

  // Check role
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      return <AuthLoader message="Vérification des permissions..." />;
    }
  }

  return <>{children}</>;
}
