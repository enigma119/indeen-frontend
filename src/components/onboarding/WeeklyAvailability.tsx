'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TimeSlotPicker } from './TimeSlotPicker';
import { TimeSlotDisplay } from './TimeSlotDisplay';
import { DAYS_OF_WEEK } from '@/lib/constants/onboarding';

export interface WeeklyAvailabilityDay {
  day: number; // 0=Sunday, 6=Saturday
  slots: { start: string; end: string }[];
}

interface WeeklyAvailabilityProps {
  value: WeeklyAvailabilityDay[];
  onChange: (availability: WeeklyAvailabilityDay[]) => void;
  error?: string;
}

export function WeeklyAvailability({
  value,
  onChange,
  error,
}: WeeklyAvailabilityProps) {
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(null);

  // Initialize with all 7 days if empty
  const availability = value.length > 0
    ? value
    : Array.from({ length: 7 }, (_, i) => ({ day: i, slots: [] }));

  const handleAddSlot = (dayIndex: number, slot: { start: string; end: string }) => {
    const updated = [...availability];
    const dayData = updated[dayIndex];
    
    // Check for overlaps
    const hasOverlap = dayData.slots.some((existingSlot) => {
      const [startHour, startMin] = slot.start.split(':').map(Number);
      const [endHour, endMin] = slot.end.split(':').map(Number);
      const [existingStartHour, existingStartMin] = existingSlot.start.split(':').map(Number);
      const [existingEndHour, existingEndMin] = existingSlot.end.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const existingStartMinutes = existingStartHour * 60 + existingStartMin;
      const existingEndMinutes = existingEndHour * 60 + existingEndMin;

      return (
        (startMinutes < existingEndMinutes && endMinutes > existingStartMinutes) ||
        (startMinutes === existingStartMinutes && endMinutes === existingEndMinutes)
      );
    });

    if (!hasOverlap) {
      updated[dayIndex] = {
        ...dayData,
        slots: [...dayData.slots, slot].sort((a, b) => a.start.localeCompare(b.start)),
      };
      onChange(updated.filter((day) => day.slots.length > 0 || day.day === dayIndex));
    }
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...availability];
    const dayData = updated[dayIndex];
    
    updated[dayIndex] = {
      ...dayData,
      slots: dayData.slots.filter((_, i) => i !== slotIndex),
    };

    // Remove day if no slots left
    const filtered = updated.filter((day) => day.slots.length > 0);
    onChange(filtered.length > 0 ? filtered : [{ day: dayIndex, slots: [] }]);
  };

  // Map day number to DAYS_OF_WEEK (0=Sunday, 1=Monday, etc.)
  const getDayLabel = (dayNumber: number) => {
    // DAYS_OF_WEEK is 1-based (Monday=0 index), we need to map 0=Sunday to index 6
    const dayIndex = dayNumber === 0 ? 6 : dayNumber - 1;
    return DAYS_OF_WEEK[dayIndex]?.label || `Jour ${dayNumber}`;
  };

  return (
    <div className="space-y-4">
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-7 gap-4">
        {Array.from({ length: 7 }, (_, i) => {
          const dayData = availability.find((d) => d.day === i) || { day: i, slots: [] };
          const isOpen = openDayIndex === i;

          return (
            <Card key={i} className="border-2">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Day Header */}
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900">{getDayLabel(i)}</h4>
                  </div>

                  {/* Add Slot Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setOpenDayIndex(i)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter créneau
                  </Button>

                  {/* Slots List */}
                  <div className="space-y-2 min-h-[60px]">
                    {dayData.slots.map((slot, slotIndex) => (
                      <TimeSlotDisplay
                        key={`${slot.start}-${slot.end}-${slotIndex}`}
                        slot={slot}
                        onRemove={() => handleRemoveSlot(i, slotIndex)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile Scroll */}
      <div className="md:hidden overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {Array.from({ length: 7 }, (_, i) => {
            const dayData = availability.find((d) => d.day === i) || { day: i, slots: [] };
            const isOpen = openDayIndex === i;

            return (
              <Card key={i} className="w-64 flex-shrink-0 border-2">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Day Header */}
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900">{getDayLabel(i)}</h4>
                    </div>

                    {/* Add Slot Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setOpenDayIndex(i)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter créneau
                    </Button>

                    {/* Slots List */}
                    <div className="space-y-2 min-h-[60px]">
                      {dayData.slots.map((slot, slotIndex) => (
                        <TimeSlotDisplay
                          key={`${slot.start}-${slot.end}-${slotIndex}`}
                          slot={slot}
                          onRemove={() => handleRemoveSlot(i, slotIndex)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* TimeSlotPicker Dialogs */}
      {Array.from({ length: 7 }, (_, i) => {
        const dayData = availability.find((d) => d.day === i) || { day: i, slots: [] };
        return (
          <TimeSlotPicker
            key={i}
            open={openDayIndex === i}
            onOpenChange={(open) => setOpenDayIndex(open ? i : null)}
            onAdd={(slot) => handleAddSlot(i, slot)}
            existingSlots={dayData.slots}
          />
        );
      })}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
