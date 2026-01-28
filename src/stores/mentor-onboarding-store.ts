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
              languages: data.languages,
              nativeLanguage: data.nativeLanguage,
              specialties: data.specialties,
              teachesChildren: data.teachesChildren,
              teachesTeenagers: data.teachesTeenagers,
              teachesAdults: data.teachesAdults,
              beginnerFriendly: data.beginnerFriendly,
              patientWithSlowLearners: data.patientWithSlowLearners,
              experiencedWithNewMuslims: data.experiencedWithNewMuslims,
              specialNeedsSupport: data.specialNeedsSupport,
              acceptedLevels: data.acceptedLevels,
              teachingMethodology: data.teachingMethodology,
            };
          case 3: // Step 4: Pricing
            return {
              freeSessionsOnly: data.freeSessionsOnly,
              hourlyRate: data.hourlyRate,
              currency: data.currency,
              freeTrialAvailable: data.freeTrialAvailable,
              freeTrialDuration: data.freeTrialDuration,
              minSessionDuration: data.minSessionDuration,
              maxSessionDuration: data.maxSessionDuration,
              maxStudentsPerWeek: data.maxStudentsPerWeek,
            };
          case 4: // Step 5: Availability
            return {
              weeklyAvailability: data.weeklyAvailability,
              timezone: data.timezone,
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
              data.languages &&
              data.languages.length > 0 &&
              data.specialties &&
              data.specialties.length > 0 &&
              (data.teachesChildren || data.teachesTeenagers || data.teachesAdults)
            );
          case 3: // Step 4: Pricing
            if (data.freeSessionsOnly) {
              return !!(
                data.minSessionDuration !== undefined &&
                data.maxSessionDuration !== undefined &&
                data.maxStudentsPerWeek !== undefined
              );
            }
            return !!(
              data.hourlyRate !== undefined &&
              data.hourlyRate > 0 &&
              data.currency &&
              data.minSessionDuration !== undefined &&
              data.maxSessionDuration !== undefined &&
              data.maxStudentsPerWeek !== undefined &&
              data.minSessionDuration < data.maxSessionDuration
            );
          case 4: // Step 5: Availability
            const totalSlots = (data.weeklyAvailability || []).reduce(
              (sum, day) => sum + day.slots.length,
              0
            );
            return !!(
              data.weeklyAvailability &&
              totalSlots > 0 &&
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
            type: cert.type,
            institution: cert.institution,
            year: cert.year,
            documentUrl: typeof cert.documentUrl === 'string' ? cert.documentUrl : undefined,
            // Don't persist documentFile
          })),
        },
        currentStep: state.currentStep,
      }),
    }
  )
);
