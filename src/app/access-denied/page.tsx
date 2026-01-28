'use client';

import Link from 'next/link';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function AccessDeniedPage() {
  const { user, isAuthenticated } = useAuth();

  // Determine the appropriate back URL based on user role
  const getBackUrl = () => {
    if (!isAuthenticated || !user) {
      return '/login';
    }

    switch (user.role) {
      case 'MENTOR':
        return '/dashboard';
      case 'MENTEE':
        return '/mentors';
      case 'ADMIN':
        return '/admin';
      default:
        return '/';
    }
  };

  const getBackLabel = () => {
    if (!isAuthenticated || !user) {
      return 'Se connecter';
    }

    switch (user.role) {
      case 'MENTOR':
        return 'Tableau de bord';
      case 'MENTEE':
        return 'Rechercher un mentor';
      case 'ADMIN':
        return 'Administration';
      default:
        return 'Accueil';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accès refusé</h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {isAuthenticated
            ? 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page. Cette section est réservée à un autre type de compte.'
            : 'Vous devez être connecté pour accéder à cette page.'}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
          <Button asChild>
            <Link href={getBackUrl()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {getBackLabel()}
            </Link>
          </Button>
        </div>

        {/* Additional info for authenticated users */}
        {isAuthenticated && user && (
          <p className="mt-8 text-sm text-gray-500">
            Connecté en tant que <span className="font-medium">{user.email}</span>
            {' '}({user.role === 'MENTOR' ? 'Mentor' : user.role === 'MENTEE' ? 'Apprenant' : user.role})
          </p>
        )}
      </div>
    </div>
  );
}
