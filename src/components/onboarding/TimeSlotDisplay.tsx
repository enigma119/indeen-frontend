'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TimeSlotDisplayProps {
  slot: { start: string; end: string };
  onRemove: () => void;
  className?: string;
}

export function TimeSlotDisplay({ slot, onRemove, className }: TimeSlotDisplayProps) {
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    return `${hour}h${minute !== '00' ? minute : ''}`;
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        'flex items-center justify-between gap-2 px-3 py-1.5 bg-teal-100 text-teal-900 border-teal-300 animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      <span className="text-sm font-medium">
        {formatTime(slot.start)} - {formatTime(slot.end)}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-4 w-4 p-0 hover:bg-teal-200 text-teal-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}
