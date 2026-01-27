'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function MentorOnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to step-1 immediately
    router.replace('/onboarding/mentor/step-1');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      <p className="mt-4 text-gray-500">Redirection...</p>
    </div>
  );
}
