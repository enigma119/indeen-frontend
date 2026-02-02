'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

interface SessionCountdownProps {
  scheduledAt: string;
  className?: string;
}

type UrgencyLevel = 'neutral' | 'warning' | 'urgent';

function getUrgencyLevel(scheduledAt: Date): UrgencyLevel {
  const now = new Date();
  const hoursUntil = differenceInHours(scheduledAt, now);

  if (hoursUntil < 1) return 'urgent';
  if (hoursUntil < 24) return 'warning';
  return 'neutral';
}

function formatTimeRemaining(scheduledAt: Date): string {
  const now = new Date();
  const totalSeconds = differenceInSeconds(scheduledAt, now);

  if (totalSeconds <= 0) {
    return 'Maintenant';
  }

  const days = differenceInDays(scheduledAt, now);
  const hours = differenceInHours(scheduledAt, now) % 24;
  const minutes = differenceInMinutes(scheduledAt, now) % 60;

  if (days > 0) {
    return `Dans ${days} jour${days > 1 ? 's' : ''}${hours > 0 ? ` ${hours}h` : ''}`;
  }

  if (hours > 0) {
    return `Dans ${hours}h ${minutes > 0 ? `${minutes}min` : ''}`;
  }

  return `Dans ${minutes} min`;
}

export function SessionCountdown({ scheduledAt, className }: SessionCountdownProps) {
  const scheduledDate = new Date(scheduledAt);
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(scheduledDate));
  const [urgency, setUrgency] = useState<UrgencyLevel>(getUrgencyLevel(scheduledDate));

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(scheduledDate));
      setUrgency(getUrgencyLevel(scheduledDate));
    }, 60000);

    return () => clearInterval(interval);
  }, [scheduledAt]);

  // Also update on mount and when scheduledAt changes
  useEffect(() => {
    setTimeRemaining(formatTimeRemaining(scheduledDate));
    setUrgency(getUrgencyLevel(scheduledDate));
  }, [scheduledAt]);

  const urgencyStyles: Record<UrgencyLevel, string> = {
    neutral: 'bg-gray-100 text-gray-700',
    warning: 'bg-amber-100 text-amber-800',
    urgent: 'bg-red-100 text-red-800 animate-pulse',
  };

  const Icon = urgency === 'urgent' ? AlertCircle : Clock;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium',
        urgencyStyles[urgency],
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{timeRemaining}</span>
    </div>
  );
}
