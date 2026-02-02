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
  const params: Record<string, string | number> = { page, limit };
  if (status) {
    params.status = status;
  }
  return apiClient.get<SessionsResult>('/sessions/me', { params });
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
  const result = await apiClient.get<{ count: number }>('/sessions/me/upcoming-count');
  return result.count;
}
