'use client';

import { useState } from 'react';
import { useDailyContext } from './DailyProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  MessageSquare,
  PhoneOff,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeetingControlsProps {
  onEndCall: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  unreadMessages?: number;
  className?: string;
}

export function MeetingControls({
  onEndCall,
  onToggleChat,
  isChatOpen,
  unreadMessages = 0,
  className,
}: MeetingControlsProps) {
  const {
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useDailyContext();

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 md:gap-4 p-4 bg-gray-900/90 backdrop-blur-sm rounded-full',
        className
      )}
    >
      {/* Microphone Toggle */}
      <Button
        variant={isAudioEnabled ? 'secondary' : 'destructive'}
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={toggleAudio}
        title={isAudioEnabled ? 'Couper le micro' : 'Activer le micro'}
      >
        {isAudioEnabled ? (
          <Mic className="h-5 w-5" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </Button>

      {/* Camera Toggle */}
      <Button
        variant={isVideoEnabled ? 'secondary' : 'destructive'}
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={toggleVideo}
        title={isVideoEnabled ? 'Couper la caméra' : 'Activer la caméra'}
      >
        {isVideoEnabled ? (
          <Video className="h-5 w-5" />
        ) : (
          <VideoOff className="h-5 w-5" />
        )}
      </Button>

      {/* Screen Share Toggle */}
      <Button
        variant={isScreenSharing ? 'default' : 'secondary'}
        size="icon"
        className={cn(
          'rounded-full h-12 w-12',
          isScreenSharing && 'bg-blue-600 hover:bg-blue-700'
        )}
        onClick={toggleScreenShare}
        title={isScreenSharing ? 'Arrêter le partage' : 'Partager l\'écran'}
      >
        {isScreenSharing ? (
          <MonitorOff className="h-5 w-5" />
        ) : (
          <MonitorUp className="h-5 w-5" />
        )}
      </Button>

      {/* Chat Toggle */}
      <Button
        variant={isChatOpen ? 'default' : 'secondary'}
        size="icon"
        className="rounded-full h-12 w-12 relative"
        onClick={onToggleChat}
        title="Chat"
      >
        <MessageSquare className="h-5 w-5" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadMessages > 9 ? '9+' : unreadMessages}
          </span>
        )}
      </Button>

      {/* Settings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres audio/vidéo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* End Call */}
      <Button
        variant="destructive"
        size="icon"
        className="rounded-full h-12 w-12 ml-2"
        onClick={onEndCall}
        title="Quitter la session"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
}
