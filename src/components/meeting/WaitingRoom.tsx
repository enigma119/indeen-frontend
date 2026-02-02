'use client';

import { useDailyContext } from './DailyProvider';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';

interface WaitingRoomProps {
  otherParticipantName: string;
  onLeave: () => void;
}

export function WaitingRoom({ otherParticipantName, onLeave }: WaitingRoomProps) {
  const { participants } = useDailyContext();

  // Check if other participant has joined
  const otherJoined = participants.length > 1;

  if (otherJoined) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
          <Users className="h-10 w-10 text-gray-400" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          En attente de {otherParticipantName}...
        </h2>
        <p className="text-gray-400 mb-6">
          La session commencera dès que l'autre participant rejoindra l'appel.
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Connexion en cours...</span>
        </div>

        <Button variant="outline" onClick={onLeave}>
          Quitter l'attente
        </Button>
      </div>
    </div>
  );
}
