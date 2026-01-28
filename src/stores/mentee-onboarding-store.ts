import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MenteeOnboardingData } from '@/types/onboarding';

/**
 * Mentee onboarding store state
 */
interface MenteeOnboardingState {
  data: Partial<MenteeOnboardingData>;
  currentStep: number;
  isSubmitting: boolean;
}

/**
 * Mentee onboarding store actions
 */
interface MenteeOnboardingActions {
  updateData: (data: Partial<MenteeOnboardingData>) => void;
  setStep: (step: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
  // Getters
  getStepData: (step: number) => Partial<MenteeOnboardingData>;
  isStepComplete: (step: number) => boolean;
}

type MenteeOnboardingStore = MenteeOnboardingState & MenteeOnboardingActions;

const initialState: MenteeOnboardingState = {
  data: {},
  currentStep: 0,
  isSubmitting: false,
};

/**
 * Zustand store for mentee onboarding
 * Persists to sessionStorage (temporary data)
 */
export const useMenteeOnboardingStore = create<MenteeOnboardingStore>()(
  persist(
    (set, get) => ({
      // State
      ...initialState,

      // Actions
      updateData: (newData) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),

      setStep: (step) => set({ currentStep: step }),

      setSubmitting: (isSubmitting) => set({ isSubmitting }),

      reset: () => set(initialState),

      // Getters
      getStepData: (step) => {
        const { data } = get();
        switch (step) {
          case 0: // Step 1: Personal Info
            return {
              firstName: data.firstName,
              lastName: data.lastName,
              country: data.country,
              phone: data.phone,
              gender: data.gender,
              avatar: data.avatar,
            };
          case 1: // Step 2: Learner Profile
            return {
              learnerCategory: data.learnerCategory,
              currentLevel: data.currentLevel,
              yearOfBirth: data.yearOfBirth,
              learningContext: data.learningContext,
            };
          case 2: // Step 3: Goals
            return {
              learningGoals: data.learningGoals,
              preferredLanguages: data.preferredLanguages,
              learningPace: data.learningPace,
              preferredSessionDuration: data.preferredSessionDuration,
              hasSpecialNeeds: data.hasSpecialNeeds,
              specialNeedsDescription: data.specialNeedsDescription,
            };
          case 3: // Step 4: Confirmation
            return data;
          default:
            return {};
        }
      },

      isStepComplete: (step) => {
        const { data } = get();
        switch (step) {
          case 0: // Step 1
            return !!(data.firstName && data.lastName && data.country);
          case 1: // Step 2
            return !!(data.learnerCategory && data.currentLevel);
          case 2: // Step 3
            return !!(
              data.learningGoals?.length &&
              data.preferredLanguages?.length &&
              data.learningPace &&
              data.preferredSessionDuration
            );
          case 3: // Step 4 (confirmation)
            return true;
          default:
            return false;
        }
      },
    }),
    {
      name: 'mentee-onboarding-storage',
      storage: createJSONStorage(() => sessionStorage),
      // Don't persist File objects or submitting state
      partialize: (state) => ({
        data: {
          ...state.data,
          // Convert File to undefined for storage (can't serialize File)
          avatar: typeof state.data.avatar === 'string' ? state.data.avatar : undefined,
        },
        currentStep: state.currentStep,
      }),
    }
  )
);
