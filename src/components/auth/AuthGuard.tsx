'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type UserRole = 'MENTOR' | 'MENTEE' | 'ADMIN' | 'PARENT';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: ReactNode;
}

/**
 * AuthGuard component for protecting UI elements based on authentication and role
 * Use this to wrap components that should only be visible to certain users
 */
export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While loading, show nothing or fallback
  if (isLoading) {
    return fallback || null;
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return fallback || <AccessDeniedMessage reason="not_authenticated" />;
  }

  // Check role if required
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      return fallback || <AccessDeniedMessage reason="wrong_role" userRole={user.role} />;
    }
  }

  return <>{children}</>;
}

interface AccessDeniedMessageProps {
  reason: 'not_authenticated' | 'wrong_role';
  userRole?: UserRole;
}

function AccessDeniedMessage({ reason, userRole }: AccessDeniedMessageProps) {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
            <ShieldX className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Accès refusé</h3>
            <p className="mt-1 text-sm text-gray-600">
              {reason === 'not_authenticated'
                ? 'Vous devez être connecté pour accéder à ce contenu.'
                : `Cette fonctionnalité n'est pas disponible pour votre compte (${getRoleName(userRole)}).`}
            </p>
            {reason === 'not_authenticated' && (
              <Button asChild size="sm" className="mt-3">
                <Link href="/login">Se connecter</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getRoleName(role?: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    MENTOR: 'Mentor',
    MENTEE: 'Apprenant',
    ADMIN: 'Administrateur',
    PARENT: 'Parent',
  };
  return role ? roleNames[role] : 'Utilisateur';
}
