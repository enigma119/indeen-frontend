'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useMenteeOnboardingStore } from '@/stores/mentee-onboarding-store';
import { ProgressStepper } from '@/components/onboarding';
import { MENTEE_STEPS } from '@/lib/constants/onboarding';
import { Loader2 } from 'lucide-react';

interface MenteeOnboardingLayoutProps {
  children: React.ReactNode;
}

export default function MenteeOnboardingLayout({ children }: MenteeOnboardingLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized } = useAuthStore();
  const { currentStep, setStep } = useMenteeOnboardingStore();

  // Get current step from URL
  const urlStep = pathname?.match(/step-(\d+)/)?.[1];
  const urlStepIndex = urlStep ? parseInt(urlStep) - 1 : 0;

  // Sync URL step with store
  useEffect(() => {
    if (urlStepIndex !== currentStep) {
      setStep(urlStepIndex);
    }
  }, [urlStepIndex, currentStep, setStep]);

  // Auth guard - redirect if not authenticated or not MENTEE
  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace('/login?redirectTo=/onboarding/mentee/step-1');
      return;
    }

    if (user.role !== 'MENTEE') {
      router.replace('/onboarding');
      return;
    }
  }, [user, isInitialized, router]);

  // Redirect to step-1 if on /onboarding/mentee
  useEffect(() => {
    if (pathname === '/onboarding/mentee') {
      router.replace('/onboarding/mentee/step-1');
    }
  }, [pathname, router]);

  // Show loader while checking auth
  if (!isInitialized || !user || user.role !== 'MENTEE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <p className="mt-4 text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Stepper */}
      <ProgressStepper steps={MENTEE_STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
