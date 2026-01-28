'use client';

import { DAYS_OF_WEEK } from '@/lib/constants/onboarding';

export interface WeeklyAvailabilityDay {
  day: number; // 0=Sunday, 6=Saturday
  slots: { start: string; end: string }[];
}

interface WeeklyAvailabilityDisplayProps {
  availability: WeeklyAvailabilityDay[];
}

export function WeeklyAvailabilityDisplay({
  availability,
}: WeeklyAvailabilityDisplayProps) {
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    return `${hour}h${minute !== '00' ? minute : ''}`;
  };

  // Map day number to DAYS_OF_WEEK (0=Sunday, 1=Monday, etc.)
  const getDayLabel = (dayNumber: number) => {
    // DAYS_OF_WEEK is 1-based (Monday=0 index), we need to map 0=Sunday to index 6
    const dayIndex = dayNumber === 0 ? 6 : dayNumber - 1;
    return DAYS_OF_WEEK[dayIndex]?.label || `Jour ${dayNumber}`;
  };

  if (!availability || availability.length === 0) {
    return <p className="text-sm text-gray-500">Aucune disponibilité définie</p>;
  }

  // Calculate totals
  const totalSlots = availability.reduce((sum, day) => sum + day.slots.length, 0);
  const daysWithSlots = availability.filter((day) => day.slots.length > 0).length;

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        {totalSlots} créneau{totalSlots > 1 ? 'x' : ''} sur {daysWithSlots} jour
        {daysWithSlots > 1 ? 's' : ''}
      </p>
      <div className="space-y-1">
        {availability
          .filter((day) => day.slots.length > 0)
          .map((day) => (
            <div key={day.day} className="text-sm">
              <span className="font-medium">{getDayLabel(day.day)} :</span>{' '}
              <span className="text-gray-600">
                {day.slots
                  .map((slot) => `${formatTime(slot.start)}-${formatTime(slot.end)}`)
                  .join(', ')}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
