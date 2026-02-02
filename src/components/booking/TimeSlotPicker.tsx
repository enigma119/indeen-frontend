'use client';

import { useSlotsForDay } from '@/hooks/use-sessions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingSlot } from '@/types';

interface TimeSlotPickerProps {
  mentorId: string;
  date: Date;
  duration: number;
  selectedSlot?: BookingSlot | null;
  onSlotSelect: (slot: BookingSlot) => void;
}

export function TimeSlotPicker({
  mentorId,
  date,
  duration,
  selectedSlot,
  onSlotSelect,
}: TimeSlotPickerProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const { data: slots, isLoading, error } = useSlotsForDay(mentorId, dateStr, duration);

  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement des créneaux</p>
      </div>
    );
  }

  const availableSlots = slots?.filter((slot) => slot.is_available) || [];

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Créneaux disponibles le {formattedDate}
      </h3>

      {availableSlots.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune disponibilité ce jour</p>
          <p className="text-sm text-gray-400 mt-1">
            Sélectionnez une autre date
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {availableSlots.map((slot) => {
            const isSelected =
              selectedSlot?.start_time === slot.start_time &&
              selectedSlot?.date === slot.date;

            return (
              <button
                key={`${slot.date}-${slot.start_time}`}
                onClick={() => onSlotSelect(slot)}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border transition-all',
                  'hover:border-teal-500 hover:bg-teal-50',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  isSelected
                    ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-700 hover:border-teal-700'
                    : 'border-gray-200 bg-white text-gray-700'
                )}
              >
                {slot.start_time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
