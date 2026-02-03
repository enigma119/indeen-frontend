import { apiClient } from '@/lib/api/client';

/**
 * Daily.co Configuration
 */
export const DAILY_DOMAIN = process.env.NEXT_PUBLIC_DAILY_DOMAIN || '';

/**
 * Check if Daily is properly configured
 */
export function isDailyConfigured(): boolean {
  return Boolean(DAILY_DOMAIN);
}

/**
 * Response from creating a meeting room
 */
export interface CreateMeetingResponse {
  meeting_url: string;
  room_name: string;
  expires_at?: string;
}

/**
 * Create a meeting room via backend
 * The backend handles Daily.co API authentication
 */
export async function createMeetingRoom(
  sessionId: string
): Promise<CreateMeetingResponse> {
  return apiClient.post<CreateMeetingResponse>(
    `/sessions/${sessionId}/create-meeting`
  );
}

/**
 * Get the meeting room URL for a session
 */
export async function getMeetingRoom(
  sessionId: string
): Promise<{ meeting_url: string | null }> {
  return apiClient.get<{ meeting_url: string | null }>(
    `/sessions/${sessionId}/meeting`
  );
}

/**
 * Delete a meeting room after session ends
 */
export async function deleteMeetingRoom(
  sessionId: string
): Promise<void> {
  return apiClient.delete(`/sessions/${sessionId}/delete-meeting`);
}

/**
 * Get meeting token for authenticated user
 * Returns a token that grants access to the room with user identity
 */
export async function getMeetingToken(
  sessionId: string
): Promise<{ token: string; expires_at: string }> {
  return apiClient.get<{ token: string; expires_at: string }>(
    `/sessions/${sessionId}/meeting-token`
  );
}

/**
 * Complete a session (mentor only)
 */
export interface CompleteSessionData {
  notes?: string;
  topics_covered?: string[];
  mastery_level?: number;
}

export async function completeSession(
  sessionId: string,
  data: CompleteSessionData
): Promise<void> {
  return apiClient.patch(`/sessions/${sessionId}/complete`, data);
}

/**
 * Get room URL from room name
 */
export function getRoomUrl(roomName: string): string {
  if (!DAILY_DOMAIN) {
    throw new Error('NEXT_PUBLIC_DAILY_DOMAIN is not configured');
  }
  return `https://${DAILY_DOMAIN}/${roomName}`;
}

/**
 * Validate browser supports WebRTC
 */
export function supportsWebRTC(): boolean {
  if (typeof window === 'undefined') return false;

  const hasMediaDevices = typeof navigator !== 'undefined' &&
    navigator.mediaDevices !== undefined;
  const hasGetUserMedia = hasMediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function';
  const hasRTCPeerConnection = typeof window.RTCPeerConnection !== 'undefined';

  return hasGetUserMedia && hasRTCPeerConnection;
}

/**
 * Request media permissions
 */
export async function requestMediaPermissions(): Promise<{
  audio: boolean;
  video: boolean;
}> {
  const result = { audio: false, video: false };

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // Stop all tracks after testing
    stream.getTracks().forEach((track) => track.stop());
    result.audio = true;
    result.video = true;
  } catch (error) {
    // Try audio only
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      audioStream.getTracks().forEach((track) => track.stop());
      result.audio = true;
    } catch {
      // No audio permission
    }

    // Try video only
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      videoStream.getTracks().forEach((track) => track.stop());
      result.video = true;
    } catch {
      // No video permission
    }
  }

  return result;
}

/**
 * Get available media devices
 */
export async function getMediaDevices(): Promise<{
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
}> {
  const devices = await navigator.mediaDevices.enumerateDevices();

  return {
    audioInputs: devices.filter((d) => d.kind === 'audioinput'),
    audioOutputs: devices.filter((d) => d.kind === 'audiooutput'),
    videoInputs: devices.filter((d) => d.kind === 'videoinput'),
  };
}
