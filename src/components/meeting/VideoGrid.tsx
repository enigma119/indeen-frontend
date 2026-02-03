'use client';

import { useDailyContext } from './DailyProvider';
import { VideoTile } from './VideoTile';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  className?: string;
}

export function VideoGrid({ className }: VideoGridProps) {
  const { participants } = useDailyContext();

  // Filter out participants and sort local first
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.local) return -1;
    if (b.local) return 1;
    return 0;
  });

  const count = sortedParticipants.length;

  // Determine grid layout based on participant count
  const getGridClass = () => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
      case 4:
        return 'grid-cols-2';
      case 5:
      case 6:
        return 'grid-cols-2 md:grid-cols-3';
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  if (count === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-full bg-gray-900 rounded-lg',
          className
        )}
      >
        <p className="text-gray-400">En attente de participants...</p>
      </div>
    );
  }

  // Special layout for 2 participants (side by side)
  if (count === 2) {
    return (
      <div className={cn('grid gap-4', getGridClass(), className)}>
        {sortedParticipants.map((participant) => (
          <VideoTile
            key={participant.session_id || participant.user_id}
            participant={participant}
            className="h-full min-h-[200px] md:min-h-[300px]"
          />
        ))}
      </div>
    );
  }

  // Special layout for single participant (fullscreen)
  if (count === 1) {
    return (
      <div className={cn('h-full', className)}>
        <VideoTile
          participant={sortedParticipants[0]}
          className="h-full min-h-[400px]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4 auto-rows-fr',
        getGridClass(),
        className
      )}
    >
      {sortedParticipants.map((participant) => (
        <VideoTile
          key={participant.session_id || participant.user_id}
          participant={participant}
        />
      ))}
    </div>
  );
}
