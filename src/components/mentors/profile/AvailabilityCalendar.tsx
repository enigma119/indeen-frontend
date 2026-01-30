'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Check } from 'lucide-react';
import { useMentorAvailability } from '@/hooks/use-mentors';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarProps {
  mentorId: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dim', fullLabel: 'Dimanche' },
  { value: 1, label: 'Lun', fullLabel: 'Lundi' },
  { value: 2, label: 'Mar', fullLabel: 'Mardi' },
  { value: 3, label: 'Mer', fullLabel: 'Mercredi' },
  { value: 4, label: 'Jeu', fullLabel: 'Jeudi' },
  { value: 5, label: 'Ven', fullLabel: 'Vendredi' },
  { value: 6, label: 'Sam', fullLabel: 'Samedi' },
];

function AvailabilitySkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {DAYS_OF_WEEK.map((day) => (
        <div key={day.value} className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function AvailabilityCalendar({ mentorId }: AvailabilityCalendarProps) {
  const { data: availability, isLoading } = useMentorAvailability(mentorId);

  // Get days with availability
  const availableDays = new Set(
    availability
      ?.filter((slot) => slot.is_available)
      .map((slot) => slot.day_of_week) || []
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Disponibilités
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <AvailabilitySkeleton />
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => {
              const isAvailable = availableDays.has(day.value);
              return (
                <div
                  key={day.value}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-xs text-gray-500">{day.label}</span>
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                      isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {isAvailable ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && availableDays.size === 0 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Aucune disponibilité définie
          </p>
        )}

        {!isLoading && availableDays.size > 0 && (
          <p className="text-xs text-gray-500 text-center mt-3">
            {availableDays.size} jour{availableDays.size > 1 ? 's' : ''} de disponibilité par semaine
          </p>
        )}
      </CardContent>
    </Card>
  );
}
