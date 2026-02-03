import { apiClient } from './client';
import type {
  Session,
  SessionsResult,
  BookingRequest,
  BookingSlot,
  DayAvailability,
  SessionStatus,
} from '@/types';

/**
 * Get available slots for a mentor
 * @param mentorId - The mentor's profile ID
 * @param date - Start date (ISO string, typically start of week)
 * @param duration - Session duration in minutes
 */
export async function getAvailableSlots(
  mentorId: string,
  date: string,
  duration: number
): Promise<DayAvailability[]> {
  return apiClient.get<DayAvailability[]>(
    `/mentors/${mentorId}/available-slots`,
    {
      params: { date, duration },
    }
  );
}

/**
 * Get available slots for a specific day
 * @param mentorId - The mentor's profile ID
 * @param date - The specific date (ISO string)
 * @param duration - Session duration in minutes
 */
export async function getSlotsForDay(
  mentorId: string,
  date: string,
  duration: number
): Promise<BookingSlot[]> {
  return apiClient.get<BookingSlot[]>(
    `/mentors/${mentorId}/available-slots/day`,
    {
      params: { date, duration },
    }
  );
}

/**
 * Create a new session booking
 * @param booking - The booking request data
 */
export async function createSession(booking: BookingRequest): Promise<Session> {
  return apiClient.post<Session>('/sessions', booking);
}

/**
 * Get current user's sessions
 * @param status - Filter by session status (optional)
 * @param page - Page number
 * @param limit - Items per page
 */
export async function getMySessions(
  status?: SessionStatus | 'upcoming' | 'past',
  page: number = 1,
  limit: number = 10
): Promise<SessionsResult> {
  // For 'upcoming' and 'past', use dedicated endpoints
  if (status === 'upcoming') {
    const sessions = await apiClient.get<Session[]>('/sessions/upcoming');
    return {
      sessions,
      total: sessions.length,
      page: 1,
      totalPages: 1,
      hasMore: false,
    };
  }
  if (status === 'past') {
    const sessions = await apiClient.get<Session[]>('/sessions/past', {
      params: { limit },
    });
    return {
      sessions,
      total: sessions.length,
      page: 1,
      totalPages: 1,
      hasMore: false,
    };
  }

  // For specific status or all sessions
  const params: Record<string, string | number> = { page, limit };
  if (status) {
    params.status = status;
  }
  const result = await apiClient.get<{
    data: Session[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>('/sessions', { params });

  return {
    sessions: result.data,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    hasMore: result.page < result.totalPages,
  };
}

/**
 * Get a session by ID
 * @param sessionId - The session ID
 */
export async function getSessionById(sessionId: string): Promise<Session> {
  return apiClient.get<Session>(`/sessions/${sessionId}`);
}

/**
 * Cancel a session
 * @param sessionId - The session ID
 * @param reason - Cancellation reason
 */
export async function cancelSession(
  sessionId: string,
  reason: string
): Promise<Session> {
  return apiClient.post<Session>(`/sessions/${sessionId}/cancel`, { reason });
}

/**
 * Reschedule a session
 * @param sessionId - The session ID
 * @param newScheduledAt - New scheduled date/time (ISO string)
 */
export async function rescheduleSession(
  sessionId: string,
  newScheduledAt: string
): Promise<Session> {
  return apiClient.patch<Session>(`/sessions/${sessionId}/reschedule`, {
    scheduled_at: newScheduledAt,
  });
}

/**
 * Get upcoming sessions count
 */
export async function getUpcomingSessionsCount(): Promise<number> {
  const sessions = await apiClient.get<Session[]>('/sessions/upcoming');
  return sessions.length;
}

// =====================
// Checkout / Payment
// =====================

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  stripeSessionId: string;
}

export interface CheckoutRequest extends BookingRequest {
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Create a Stripe checkout session for a booking
 * @param booking - The booking request with optional redirect URLs
 */
export async function createCheckoutSession(
  booking: CheckoutRequest
): Promise<CheckoutSessionResponse> {
  // Set default URLs if not provided
  const successUrl =
    booking.successUrl ||
    `${window.location.origin}/sessions/payment-success`;
  const cancelUrl =
    booking.cancelUrl ||
    `${window.location.origin}/sessions/payment-cancelled`;

  return apiClient.post<CheckoutSessionResponse>('/sessions/create-checkout', {
    ...booking,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

/**
 * Confirm payment after Stripe redirect
 * @param stripeSessionId - The Stripe checkout session ID
 */
export async function confirmPayment(
  stripeSessionId: string
): Promise<Session> {
  return apiClient.post<Session>('/sessions/confirm-payment', {
    stripe_session_id: stripeSessionId,
  });
}

/**
 * Check if a slot is still available (revalidation before payment)
 * @param mentorId - The mentor's profile ID
 * @param date - The slot date
 * @param startTime - The slot start time
 * @param duration - Session duration
 */
export async function checkSlotAvailability(
  mentorId: string,
  date: string,
  startTime: string,
  duration: number
): Promise<{ available: boolean; reason?: string }> {
  return apiClient.get<{ available: boolean; reason?: string }>(
    `/mentors/${mentorId}/check-slot`,
    {
      params: { date, start_time: startTime, duration },
    }
  );
}

/**
 * Create a free session (when free trial is applied)
 * @param booking - The booking request
 */
export async function createFreeSession(booking: BookingRequest): Promise<Session> {
  return apiClient.post<Session>('/sessions/create-free', booking);
}

// =====================
// Mentor Actions
// =====================

/**
 * Confirm a session (mentor action)
 * @param sessionId - The session ID
 */
export async function confirmSession(sessionId: string): Promise<Session> {
  return apiClient.patch<Session>(`/sessions/${sessionId}/confirm`);
}

/**
 * Reject a session (mentor action)
 * @param sessionId - The session ID
 * @param reason - Rejection reason
 */
export async function rejectSession(
  sessionId: string,
  reason: string
): Promise<Session> {
  return apiClient.patch<Session>(`/sessions/${sessionId}/reject`, { reason });
}

/**
 * Get mentor's teaching sessions
 * @param status - Filter by status
 * @param page - Page number
 * @param limit - Items per page
 */
export async function getMyTeachingSessions(
  status?: 'pending' | 'upcoming' | 'past' | 'cancelled',
  page: number = 1,
  limit: number = 10
): Promise<SessionsResult> {
  // Map frontend status to backend status
  if (status === 'upcoming') {
    const sessions = await apiClient.get<Session[]>('/sessions/upcoming');
    return {
      sessions,
      total: sessions.length,
      page: 1,
      totalPages: 1,
      hasMore: false,
    };
  }
  if (status === 'past') {
    const sessions = await apiClient.get<Session[]>('/sessions/past', {
      params: { limit },
    });
    return {
      sessions,
      total: sessions.length,
      page: 1,
      totalPages: 1,
      hasMore: false,
    };
  }

  // For pending and other statuses, use the main sessions endpoint
  const params: Record<string, string | number> = { page, limit };
  if (status === 'pending') {
    // Pending = SCHEDULED sessions that haven't started yet
    params.status = 'SCHEDULED';
  } else if (status === 'cancelled') {
    // Will need to filter client-side or add backend support
  } else if (status) {
    params.status = status;
  }

  const result = await apiClient.get<{
    data: Session[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>('/sessions', { params });

  return {
    sessions: result.data,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    hasMore: result.page < result.totalPages,
  };
}
