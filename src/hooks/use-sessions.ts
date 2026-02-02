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
  createCheckoutSession,
  confirmPayment,
  checkSlotAvailability,
  createFreeSession,
  confirmSession,
  rejectSession,
  getMyTeachingSessions,
  type CheckoutRequest,
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

// =====================
// Checkout / Payment Hooks
// =====================

/**
 * Hook to create a Stripe checkout session
 */
export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: CheckoutRequest) => createCheckoutSession(booking),
    onSuccess: (data) => {
      // Store booking info in sessionStorage for recovery after payment
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'pendingBooking',
          JSON.stringify({
            sessionId: data.sessionId,
            stripeSessionId: data.stripeSessionId,
            timestamp: Date.now(),
          })
        );
      }
      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
    },
    onError: (error: Error) => {
      toast.error('Erreur de paiement', {
        description: error.message || 'Impossible de créer la session de paiement.',
      });
    },
  });
}

/**
 * Hook to confirm payment after Stripe redirect
 */
export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stripeSessionId: string) => confirmPayment(stripeSessionId),
    onSuccess: (session) => {
      // Clear pending booking from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pendingBooking');
      }
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      // Invalidate availability for this mentor
      queryClient.invalidateQueries({
        queryKey: sessionKeys.availability(session.mentor_profile_id),
      });
      toast.success('Paiement confirmé !', {
        description: 'Votre réservation a été confirmée.',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur de confirmation', {
        description: error.message || 'Impossible de confirmer le paiement.',
      });
    },
  });
}

/**
 * Hook to check slot availability before payment
 */
export function useCheckSlotAvailability() {
  return useMutation({
    mutationFn: ({
      mentorId,
      date,
      startTime,
      duration,
    }: {
      mentorId: string;
      date: string;
      startTime: string;
      duration: number;
    }) => checkSlotAvailability(mentorId, date, startTime, duration),
    onError: (error: Error) => {
      toast.error('Erreur de vérification', {
        description: error.message || 'Impossible de vérifier la disponibilité.',
      });
    },
  });
}

/**
 * Hook to create a free session (trial)
 */
export function useCreateFreeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) => createFreeSession(booking),
    onSuccess: (session) => {
      // Clear booking store from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('booking-store');
      }
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      // Invalidate availability for this mentor
      queryClient.invalidateQueries({
        queryKey: sessionKeys.availability(session.mentor_profile_id),
      });
      toast.success('Session gratuite réservée !', {
        description: 'Votre session découverte a été réservée avec succès.',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur de réservation', {
        description: error.message || 'Impossible de réserver la session gratuite.',
      });
    },
  });
}

// =====================
// Mentor Action Hooks
// =====================

/**
 * Hook to confirm a session (mentor)
 */
export function useConfirmSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => confirmSession(sessionId),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionKeys.detail(session.id), session);
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['teaching-sessions'] });
      toast.success('Session confirmée !', {
        description: 'L\'élève a été notifié.',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur de confirmation', {
        description: error.message || 'Impossible de confirmer la session.',
      });
    },
  });
}

/**
 * Hook to reject a session (mentor)
 */
export function useRejectSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, reason }: { sessionId: string; reason: string }) =>
      rejectSession(sessionId, reason),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionKeys.detail(session.id), session);
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['teaching-sessions'] });
      toast.success('Session refusée', {
        description: 'L\'élève a été notifié et sera remboursé.',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur de refus', {
        description: error.message || 'Impossible de refuser la session.',
      });
    },
  });
}

/**
 * Hook to fetch mentor's teaching sessions
 */
export function useMyTeachingSessions(
  status?: 'pending' | 'upcoming' | 'past' | 'cancelled',
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: ['teaching-sessions', { status, page, limit }],
    queryFn: () => getMyTeachingSessions(status, page, limit),
    staleTime: 2 * 60 * 1000,
  });
}
