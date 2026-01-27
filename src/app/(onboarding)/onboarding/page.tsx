'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    // If no user, redirect to signup
    if (!user) {
      router.replace('/signup');
      return;
    }

    // Redirect based on role
    switch (user.role) {
      case 'MENTEE':
        router.replace('/onboarding/mentee');
        break;
      case 'MENTOR':
        router.replace('/onboarding/mentor');
        break;
      default:
        // If no valid role, redirect to signup
        router.replace('/signup');
    }
  }, [user, isInitialized, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      <p className="mt-4 text-gray-500">Chargement...</p>
    </div>
  );
}
