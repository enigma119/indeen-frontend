'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useDaily } from '@/hooks/use-daily';
import type {
  DailyParticipant,
  DailyCallState,
  DailyError,
  DailyCallConfig,
  MeetingMessage,
} from '@/types';
import type { DailyCall } from '@daily-co/daily-js';

interface DailyContextValue {
  callState: DailyCallState;
  participants: DailyParticipant[];
  localParticipant: DailyParticipant | null;
  error: DailyError | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  messages: MeetingMessage[];
  join: (config: DailyCallConfig) => Promise<void>;
  leave: () => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  sendMessage: (content: string) => void;
  callObject: DailyCall | null;
}

const DailyContext = createContext<DailyContextValue | null>(null);

interface DailyProviderProps {
  children: ReactNode;
}

export function DailyProvider({ children }: DailyProviderProps) {
  const daily = useDaily();

  return (
    <DailyContext.Provider value={daily}>
      {children}
    </DailyContext.Provider>
  );
}

export function useDailyContext() {
  const context = useContext(DailyContext);
  if (!context) {
    throw new Error('useDailyContext must be used within a DailyProvider');
  }
  return context;
}

export function useDailyContextOptional() {
  return useContext(DailyContext);
}
