'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'onboarding_progress';

interface OnboardingProgress {
  currentStep: number;
  role: 'MENTOR' | 'MENTEE';
}

interface UseOnboardingNavigationOptions {
  totalSteps: number;
  role: 'MENTOR' | 'MENTEE';
  onComplete?: () => void;
}

export function useOnboardingNavigation({
  totalSteps,
  role,
  onComplete,
}: UseOnboardingNavigationOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved progress from sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress: OnboardingProgress = JSON.parse(saved);
        // Only restore if same role
        if (progress.role === role && progress.currentStep < totalSteps) {
          setCurrentStep(progress.currentStep);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setIsInitialized(true);
    }
  }, [role, totalSteps]);

  // Save progress to sessionStorage
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    try {
      const progress: OnboardingProgress = {
        currentStep,
        role,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  }, [currentStep, role, isInitialized]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Last step completed
      onComplete?.();
    }
  }, [currentStep, totalSteps, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        setCurrentStep(index);
      }
    },
    [totalSteps]
  );

  const resetProgress = useCallback(() => {
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    resetProgress,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    isInitialized,
    progress: ((currentStep + 1) / totalSteps) * 100,
  };
}
