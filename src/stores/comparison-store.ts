import { create } from 'zustand';
import { toast } from 'sonner';
import type { MentorProfile } from '@/types';

const MAX_COMPARISON_MENTORS = 3;

interface ComparisonState {
  mentors: MentorProfile[];
  isModalOpen: boolean;
}

interface ComparisonActions {
  addMentor: (mentor: MentorProfile) => void;
  removeMentor: (mentorId: string) => void;
  clearAll: () => void;
  isInComparison: (mentorId: string) => boolean;
  toggleMentor: (mentor: MentorProfile) => void;
  openModal: () => void;
  closeModal: () => void;
}

type ComparisonStore = ComparisonState & ComparisonActions;

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
  // State
  mentors: [],
  isModalOpen: false,

  // Actions
  addMentor: (mentor) =>
    set((state) => {
      if (state.mentors.length >= MAX_COMPARISON_MENTORS) {
        toast.error(`Maximum ${MAX_COMPARISON_MENTORS} mentors en comparaison`);
        return state;
      }
      if (state.mentors.some((m) => m.id === mentor.id)) {
        return state;
      }
      toast.success('Mentor ajouté à la comparaison');
      return { mentors: [...state.mentors, mentor] };
    }),

  removeMentor: (id) =>
    set((state) => ({
      mentors: state.mentors.filter((m) => m.id !== id),
    })),

  clearAll: () => set({ mentors: [], isModalOpen: false }),

  isInComparison: (mentorId) => {
    return get().mentors.some((m) => m.id === mentorId);
  },

  toggleMentor: (mentor) => {
    const { isInComparison, addMentor, removeMentor } = get();
    if (isInComparison(mentor.id)) {
      removeMentor(mentor.id);
    } else {
      addMentor(mentor);
    }
  },

  openModal: () => set({ isModalOpen: true }),

  closeModal: () => set({ isModalOpen: false }),
}));
