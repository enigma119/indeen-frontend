import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BookingSlot, SessionDuration, MentorProfile } from '@/types';

interface BookingState {
  // Data
  mentorId: string | null;
  mentor: MentorProfile | null;
  selectedDate: string | null; // ISO date string
  selectedSlot: BookingSlot | null;
  duration: SessionDuration;
  lessonPlan: string;
  timezone: string;
  currentStep: number;

  // Actions
  setMentor: (mentorId: string, mentor: MentorProfile) => void;
  setSelectedDate: (date: string | null) => void;
  setSlot: (slot: BookingSlot | null) => void;
  setDuration: (duration: SessionDuration) => void;
  setLessonPlan: (lessonPlan: string) => void;
  setTimezone: (timezone: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  canProceedToStep2: () => boolean;
  canProceedToStep3: () => boolean;
}

const initialState = {
  mentorId: null,
  mentor: null,
  selectedDate: null,
  selectedSlot: null,
  duration: 60 as SessionDuration,
  lessonPlan: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  currentStep: 1,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setMentor: (mentorId, mentor) => set({ mentorId, mentor }),

      setSelectedDate: (date) => set({ selectedDate: date, selectedSlot: null }),

      setSlot: (slot) => set({ selectedSlot: slot }),

      setDuration: (duration) =>
        set({
          duration,
          // Reset slot when duration changes (slots may differ)
          selectedSlot: null,
        }),

      setLessonPlan: (lessonPlan) => set({ lessonPlan }),

      setTimezone: (timezone) => set({ timezone }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      goToStep: (step) =>
        set({
          currentStep: Math.max(1, Math.min(step, 3)),
        }),

      reset: () => set(initialState),

      canProceedToStep2: () => {
        const state = get();
        return !!(state.mentorId && state.selectedSlot && state.duration);
      },

      canProceedToStep3: () => {
        const state = get();
        return state.canProceedToStep2();
        // lessonPlan is optional, so step 2 validation is same as step 1
      },
    }),
    {
      name: 'booking-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        mentorId: state.mentorId,
        mentor: state.mentor,
        selectedDate: state.selectedDate,
        selectedSlot: state.selectedSlot,
        duration: state.duration,
        lessonPlan: state.lessonPlan,
        timezone: state.timezone,
        currentStep: state.currentStep,
      }),
    }
  )
);

/**
 * Calculate price for a given duration
 */
export function calculatePrice(hourlyRate: number, duration: SessionDuration): number {
  return (hourlyRate / 60) * duration;
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Get duration options with prices
 */
export function getDurationOptions(hourlyRate: number, currency: string = 'EUR') {
  const durations: SessionDuration[] = [30, 60, 90, 120];

  return durations.map((duration) => ({
    value: duration,
    label: duration === 60 ? '1 heure' : `${duration} min`,
    price: calculatePrice(hourlyRate, duration),
    formattedPrice: formatPrice(calculatePrice(hourlyRate, duration), currency),
    recommended: duration === 60,
  }));
}
