'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import DailyIframe, {
  DailyCall,
  DailyEventObjectParticipant,
  DailyEventObjectParticipantLeft,
  DailyEventObjectFatalError,
  DailyEventObjectTrack,
} from '@daily-co/daily-js';
import type {
  DailyParticipant,
  DailyCallState,
  DailyError,
  DailyCallConfig,
  MeetingMessage,
} from '@/types';

interface UseDailyReturn {
  // State
  callState: DailyCallState;
  participants: DailyParticipant[];
  localParticipant: DailyParticipant | null;
  error: DailyError | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  messages: MeetingMessage[];

  // Actions
  join: (config: DailyCallConfig) => Promise<void>;
  leave: () => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  sendMessage: (content: string) => void;

  // Call object for advanced usage
  callObject: DailyCall | null;
}

export function useDaily(): UseDailyReturn {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [callState, setCallState] = useState<DailyCallState>('idle');
  const [participants, setParticipants] = useState<DailyParticipant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<DailyParticipant | null>(null);
  const [error, setError] = useState<DailyError | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState<MeetingMessage[]>([]);

  const callObjectRef = useRef<DailyCall | null>(null);

  // Convert Daily participant to our format
  const formatParticipant = useCallback(
    (p: DailyEventObjectParticipant['participant'], isLocal: boolean): DailyParticipant => ({
      user_id: p.user_id || p.session_id,
      user_name: p.user_name || 'Participant',
      audio: !p.tracks?.audio?.off,
      video: !p.tracks?.video?.off,
      screen: !p.tracks?.screenVideo?.off,
      local: isLocal,
      session_id: p.session_id,
      joined_at: new Date(),
    }),
    []
  );

  // Update participants list
  const updateParticipants = useCallback(() => {
    const co = callObjectRef.current;
    if (!co) return;

    const allParticipants = co.participants();
    const participantsList: DailyParticipant[] = [];

    Object.entries(allParticipants).forEach(([key, p]) => {
      const isLocal = key === 'local';
      const formatted = formatParticipant(p, isLocal);

      if (isLocal) {
        setLocalParticipant(formatted);
        setIsAudioEnabled(!p.tracks?.audio?.off);
        setIsVideoEnabled(!p.tracks?.video?.off);
        setIsScreenSharing(!p.tracks?.screenVideo?.off);
      }

      participantsList.push(formatted);
    });

    setParticipants(participantsList);
  }, [formatParticipant]);

  // Join a meeting
  const join = useCallback(async (config: DailyCallConfig) => {
    try {
      setCallState('joining');
      setError(null);

      // Create call object
      const newCallObject = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: true,
      });

      callObjectRef.current = newCallObject;
      setCallObject(newCallObject);

      // Set up event listeners
      newCallObject.on('joining-meeting', () => {
        setCallState('joining');
      });

      newCallObject.on('joined-meeting', () => {
        setCallState('joined');
        updateParticipants();
      });

      newCallObject.on('left-meeting', () => {
        setCallState('left');
        setParticipants([]);
        setLocalParticipant(null);
      });

      newCallObject.on('participant-joined', (event) => {
        if (event) updateParticipants();
      });

      newCallObject.on('participant-left', (event: DailyEventObjectParticipantLeft | undefined) => {
        if (event) updateParticipants();
      });

      newCallObject.on('participant-updated', (event) => {
        if (event) updateParticipants();
      });

      newCallObject.on('track-started', (event: DailyEventObjectTrack | undefined) => {
        if (event) updateParticipants();
      });

      newCallObject.on('track-stopped', (event: DailyEventObjectTrack | undefined) => {
        if (event) updateParticipants();
      });

      newCallObject.on('error', (event: DailyEventObjectFatalError | undefined) => {
        console.error('[Daily] Error:', event);
        setCallState('error');
        setError({
          type: 'unknown',
          message: event?.errorMsg || 'Une erreur est survenue',
          details: event?.error?.type,
        });
      });

      newCallObject.on('camera-error', (event) => {
        console.error('[Daily] Camera error:', event);
        setError({
          type: 'permissions',
          message: 'Impossible d\'accéder à la caméra',
          details: event?.error?.msg,
        });
      });

      newCallObject.on('app-message', (event) => {
        if (event?.data?.type === 'chat' && event.fromId !== 'local') {
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${event.fromId}`,
              sender_id: event.fromId || 'unknown',
              sender_name: event.data.senderName || 'Participant',
              content: event.data.message,
              timestamp: new Date(),
              is_local: false,
            },
          ]);
        }
      });

      // Join the room
      await newCallObject.join({
        url: config.roomUrl,
        token: config.token,
        userName: config.userName,
        startAudioOff: config.startAudioOff,
        startVideoOff: config.startVideoOff,
      });
    } catch (err) {
      console.error('[Daily] Join error:', err);
      setCallState('error');

      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';

      if (errorMessage.includes('permission')) {
        setError({
          type: 'permissions',
          message: 'Permissions caméra/micro refusées',
          details: errorMessage,
        });
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        setError({
          type: 'network',
          message: 'Problème de connexion réseau',
          details: errorMessage,
        });
      } else if (errorMessage.includes('expired')) {
        setError({
          type: 'room-expired',
          message: 'La session a expiré',
          details: errorMessage,
        });
      } else {
        setError({
          type: 'unknown',
          message: errorMessage,
        });
      }
    }
  }, [updateParticipants]);

  // Leave the meeting
  const leave = useCallback(async () => {
    const co = callObjectRef.current;
    if (!co) return;

    try {
      await co.leave();
      co.destroy();
      callObjectRef.current = null;
      setCallObject(null);
      setCallState('left');
      setParticipants([]);
      setLocalParticipant(null);
      setMessages([]);
    } catch (err) {
      console.error('[Daily] Leave error:', err);
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    const co = callObjectRef.current;
    if (!co) return;

    const newState = !isAudioEnabled;
    co.setLocalAudio(newState);
    setIsAudioEnabled(newState);
  }, [isAudioEnabled]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    const co = callObjectRef.current;
    if (!co) return;

    const newState = !isVideoEnabled;
    co.setLocalVideo(newState);
    setIsVideoEnabled(newState);
  }, [isVideoEnabled]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    const co = callObjectRef.current;
    if (!co) return;

    try {
      if (isScreenSharing) {
        await co.stopScreenShare();
      } else {
        await co.startScreenShare();
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error('[Daily] Screen share error:', err);
      setError({
        type: 'permissions',
        message: 'Impossible de partager l\'écran',
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }, [isScreenSharing]);

  // Send chat message
  const sendMessage = useCallback((content: string) => {
    const co = callObjectRef.current;
    if (!co || !content.trim()) return;

    const localP = co.participants().local;

    co.sendAppMessage({
      type: 'chat',
      message: content,
      senderName: localP?.user_name || 'Vous',
    }, '*');

    // Add to local messages
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-local`,
        sender_id: localP?.user_id || 'local',
        sender_name: 'Vous',
        content,
        timestamp: new Date(),
        is_local: true,
      },
    ]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const co = callObjectRef.current;
      if (co) {
        co.leave();
        co.destroy();
      }
    };
  }, []);

  return {
    callState,
    participants,
    localParticipant,
    error,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    messages,
    join,
    leave,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    sendMessage,
    callObject,
  };
}
