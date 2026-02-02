'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAvailableSlots,
  getSlotsForDay,
  createSession,
  getMySessions,
  getSessionById,
  cancelSession,
  rescheduleSession,
} from '@/lib/api/sessions';
import type {
  BookingRequest,
  SessionStatus,
  DayAvailability,
  BookingSlot,
} from '@/types';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...sessionKeys.lists(), filters] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  availability: (mentorId: string) => ['availability', mentorId] as const,
  slots: (mentorId: string, date: string, duration: number) =>
    ['slots', mentorId, date, duration] as const,
  daySlots: (mentorId: string, date: string, duration: number) =>
    ['daySlots', mentorId, date, duration] as const,
};

/**
 * Hook to fetch available slots for a mentor
 */
export function useAvailableSlots(
  mentorId: string | undefined,
  date: string | undefined,
  duration: number
) {
  return useQuery<DayAvailability[]>({
    queryKey: sessionKeys.slots(mentorId || '', date || '', duration),
    queryFn: () => getAvailableSlots(mentorId!, date!, duration),
    enabled: !!mentorId && !!date && duration > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch slots for a specific day
 */
export function useSlotsForDay(
  mentorId: string | undefined,
  date: string | undefined,
  duration: number
) {
  return useQuery<BookingSlot[]>({
    queryKey: sessionKeys.daySlots(mentorId || '', date || '', duration),
    queryFn: () => getSlotsForDay(mentorId!, date!, duration),
    enabled: !!mentorId && !!date && duration > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new session
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) => createSession(booking),
    onSuccess: (session) => {
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      // Invalidate availability for this mentor
      queryClient.invalidateQueries({
        queryKey: sessionKeys.availability(session.mentor_profile_id),
      });
      toast.success('Session réservée !', {
        description: 'Votre session a été réservée avec succès.',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur de réservation', {
        description: error.message || 'Impossible de réserver la session.',
      });
    },
  });
}

/**
 * Hook to fetch current user's sessions
 */
export function useMySessions(
  status?: SessionStatus | 'upcoming' | 'past',
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: sessionKeys.list({ status, page, limit }),
    queryFn: () => getMySessions(status, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch a single session
 */
export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId || ''),
    queryFn: () => getSessionById(sessionId!),
    enabled: !!sessionId,
  });
}

/**
 * Hook to cancel a session
 */
export function useCancelSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, reason }: { sessionId: string; reason: string }) =>
      cancelSession(sessionId, reason),
    onSuccess: (session) => {
      // Update the session in cache
      queryClient.setQueryData(sessionKeys.detail(session.id), session);
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('Session annulée', {
        description: 'La session a été annulée avec succès.',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur d\'annulation', {
        description: error.message || 'Impossible d\'annuler la session.',
      });
    },
  });
}

/**
 * Hook to reschedule a session
 */
export function useRescheduleSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      newScheduledAt,
    }: {
      sessionId: string;
      newScheduledAt: string;
    }) => rescheduleSession(sessionId, newScheduledAt),
    onSuccess: (session) => {
      // Update the session in cache
      queryClient.setQueryData(sessionKeys.detail(session.id), session);
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('Session reprogrammée', {
        description: 'La session a été reprogrammée avec succès.',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur de reprogrammation', {
        description: error.message || 'Impossible de reprogrammer la session.',
      });
    },
  });
}
