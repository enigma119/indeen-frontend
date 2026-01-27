import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MentorOnboardingData, Certification } from '@/types/onboarding';

/**
 * Mentor onboarding store state
 */
interface MentorOnboardingState {
  data: Partial<MentorOnboardingData>;
  currentStep: number;
  isSubmitting: boolean;
}

/**
 * Mentor onboarding store actions
 */
interface MentorOnboardingActions {
  updateData: (data: Partial<MentorOnboardingData>) => void;
  setStep: (step: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  addCertification: (certification: Certification) => void;
  removeCertification: (index: number) => void;
  reset: () => void;
  // Getters
  getStepData: (step: number) => Partial<MentorOnboardingData>;
  isStepComplete: (step: number) => boolean;
}

type MentorOnboardingStore = MentorOnboardingState & MentorOnboardingActions;

const initialState: MentorOnboardingState = {
  data: {},
  currentStep: 0,
  isSubmitting: false,
};

/**
 * Zustand store for mentor onboarding
 * Persists to sessionStorage (temporary data)
 */
export const useMentorOnboardingStore = create<MentorOnboardingStore>()(
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

      addCertification: (certification) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: [...(state.data.certifications || []), certification],
          },
        })),

      removeCertification: (index) =>
        set((state) => {
          const certifications = state.data.certifications || [];
          return {
            data: {
              ...state.data,
              certifications: certifications.filter((_, i) => i !== index),
            },
          };
        }),

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
          case 1: // Step 2: Qualifications
            return {
              headline: data.headline,
              bio: data.bio,
              yearsExperience: data.yearsExperience,
              certifications: data.certifications,
              education: data.education,
            };
          case 2: // Step 3: Skills
            return {
              specialties: data.specialties,
              languages: data.languages,
              teachingMethodology: data.teachingMethodology,
            };
          case 3: // Step 4: Pricing
            return {
              hourlyRate: data.hourlyRate,
              currency: data.currency,
              offersFreeSession: data.offersFreeSession,
              packageDeals: data.packageDeals,
            };
          case 4: // Step 5: Availability
            return {
              availability: data.availability,
              timezone: data.timezone,
              maxStudentsPerWeek: data.maxStudentsPerWeek,
            };
          default:
            return {};
        }
      },

      isStepComplete: (step) => {
        const { data } = get();
        switch (step) {
          case 0: // Step 1: Personal Info
            return !!(
              data.firstName &&
              data.lastName &&
              data.country &&
              data.phone &&
              data.avatar
            );
          case 1: // Step 2: Qualifications
            return !!(
              data.headline &&
              data.bio &&
              data.yearsExperience !== undefined &&
              data.certifications &&
              data.certifications.length > 0
            );
          case 2: // Step 3: Skills
            return !!(
              data.specialties &&
              data.specialties.length > 0 &&
              data.languages &&
              data.languages.length > 0
            );
          case 3: // Step 4: Pricing
            return !!(
              data.hourlyRate !== undefined &&
              data.currency
            );
          case 4: // Step 5: Availability
            return !!(
              data.availability &&
              data.availability.length > 0 &&
              data.timezone
            );
          default:
            return false;
        }
      },
    }),
    {
      name: 'mentor-onboarding-storage',
      storage: createJSONStorage(() => sessionStorage),
      // Don't persist File objects or submitting state
      partialize: (state) => ({
        data: {
          ...state.data,
          // Convert File to undefined for storage (can't serialize File)
          avatar: typeof state.data.avatar === 'string' ? state.data.avatar : undefined,
          // Don't persist File objects in certifications
          certifications: state.data.certifications?.map((cert) => ({
            ...cert,
            documentUrl: typeof cert.documentUrl === 'string' ? cert.documentUrl : undefined,
          })),
        },
        currentStep: state.currentStep,
      }),
    }
  )
);
