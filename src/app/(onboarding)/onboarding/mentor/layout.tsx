'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useMentorOnboardingStore } from '@/stores/mentor-onboarding-store';
import { ProgressStepper } from '@/components/onboarding';
import { MENTOR_STEPS } from '@/lib/constants/onboarding';
import { Loader2 } from 'lucide-react';

interface MentorOnboardingLayoutProps {
  children: React.ReactNode;
}

export default function MentorOnboardingLayout({ children }: MentorOnboardingLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized } = useAuthStore();
  const { currentStep, setStep } = useMentorOnboardingStore();

  // Get current step from URL
  const urlStep = pathname?.match(/step-(\d+)/)?.[1];
  const urlStepIndex = urlStep ? parseInt(urlStep) - 1 : 0;

  // Sync URL step with store
  useEffect(() => {
    if (urlStepIndex !== currentStep) {
      setStep(urlStepIndex);
    }
  }, [urlStepIndex, currentStep, setStep]);

  // Auth guard - redirect if not authenticated or not MENTOR
  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace('/login?redirectTo=/onboarding/mentor/step-1');
      return;
    }

    if (user.role !== 'MENTOR') {
      router.replace('/onboarding');
      return;
    }
  }, [user, isInitialized, router]);

  // Redirect to step-1 if on /onboarding/mentor
  useEffect(() => {
    if (pathname === '/onboarding/mentor') {
      router.replace('/onboarding/mentor/step-1');
    }
  }, [pathname, router]);

  // Show loader while checking auth
  if (!isInitialized || !user || user.role !== 'MENTOR') {
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
      <ProgressStepper steps={MENTOR_STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
