'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionTimerProps {
  startTime: Date;
  durationMinutes: number;
  className?: string;
}

export function SessionTimer({
  startTime,
  durationMinutes,
  className,
}: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const totalSeconds = durationMinutes * 60;
  const remainingSeconds = totalSeconds - elapsed;
  const progress = Math.min((elapsed / totalSeconds) * 100, 100);
  const isOvertime = elapsed > totalSeconds;

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get color based on remaining time
  const getTimerColor = () => {
    if (isOvertime) return 'text-red-500';
    if (remainingSeconds <= 5 * 60) return 'text-amber-500'; // Last 5 minutes
    return 'text-white';
  };

  const getProgressColor = () => {
    if (isOvertime) return 'bg-red-500';
    if (progress > 90) return 'bg-amber-500';
    return 'bg-teal-500';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2">
        {isOvertime ? (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        ) : (
          <Clock className="h-4 w-4 text-gray-400" />
        )}
        <span className={cn('font-mono text-sm', getTimerColor())}>
          {isOvertime && '+'}
          {formatTime(elapsed)} / {formatTime(totalSeconds)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-1000', getProgressColor())}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {isOvertime && (
        <span className="text-xs text-red-400 font-medium">
          Temps dépassé
        </span>
      )}
    </div>
  );
}
