'use client';

import { useEffect, useRef } from 'react';
import { useDailyContext } from './DailyProvider';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, MonitorSmartphone } from 'lucide-react';
import type { DailyParticipant } from '@/types';

interface VideoTileProps {
  participant: DailyParticipant;
  className?: string;
}

export function VideoTile({ participant, className }: VideoTileProps) {
  const { callObject } = useDailyContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attach video track to video element
  useEffect(() => {
    if (!callObject || !videoRef.current) return;

    const participants = callObject.participants();
    const p = participant.local
      ? participants.local
      : Object.values(participants).find(
          (p) => p.session_id === participant.session_id
        );

    if (!p) return;

    const videoTrack = p.tracks?.video?.persistentTrack;
    const screenTrack = p.tracks?.screenVideo?.persistentTrack;

    // Prefer screen share track if available
    const track = screenTrack || videoTrack;

    if (track && videoRef.current) {
      const stream = new MediaStream([track]);
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [callObject, participant]);

  const initials = participant.user_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        'relative bg-gray-900 rounded-lg overflow-hidden aspect-video',
        className
      )}
    >
      {/* Video or placeholder */}
      {participant.video || participant.screen ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.local}
          className={cn(
            'w-full h-full object-cover',
            participant.local && 'transform scale-x-[-1]' // Mirror local video
          )}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-semibold">
            {initials}
          </div>
        </div>
      )}

      {/* Overlay with name and indicators */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium truncate max-w-[150px]">
              {participant.user_name}
            </span>
            {participant.local && (
              <Badge variant="secondary" className="text-xs">
                Vous
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {participant.screen && (
              <div className="p-1 rounded-full bg-blue-500">
                <MonitorSmartphone className="h-3 w-3 text-white" />
              </div>
            )}
            <div
              className={cn(
                'p-1 rounded-full',
                participant.audio ? 'bg-green-500' : 'bg-red-500'
              )}
            >
              {participant.audio ? (
                <Mic className="h-3 w-3 text-white" />
              ) : (
                <MicOff className="h-3 w-3 text-white" />
              )}
            </div>
            <div
              className={cn(
                'p-1 rounded-full',
                participant.video ? 'bg-green-500' : 'bg-red-500'
              )}
            >
              {participant.video ? (
                <Video className="h-3 w-3 text-white" />
              ) : (
                <VideoOff className="h-3 w-3 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Speaking indicator */}
      {participant.audio && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}
    </div>
  );
}
