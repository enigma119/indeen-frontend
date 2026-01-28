'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Generate time options (00:00 to 23:45 in 15-minute intervals)
const generateTimeOptions = () => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeStr);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

interface TimeSlotPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (slot: { start: string; end: string }) => void;
  existingSlots?: { start: string; end: string }[];
}

export function TimeSlotPicker({
  open,
  onOpenChange,
  onAdd,
  existingSlots = [],
}: TimeSlotPickerProps) {
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);

    if (!startTime || !endTime) {
      setError('Veuillez sélectionner une heure de début et de fin');
      return;
    }

    // Validate end > start
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      setError('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    // Check for overlaps with existing slots
    const hasOverlap = existingSlots.some((slot) => {
      const [slotStartHour, slotStartMin] = slot.start.split(':').map(Number);
      const [slotEndHour, slotEndMin] = slot.end.split(':').map(Number);
      const slotStartMinutes = slotStartHour * 60 + slotStartMin;
      const slotEndMinutes = slotEndHour * 60 + slotEndMin;

      // Check if new slot overlaps with existing slot
      return (
        (startMinutes < slotEndMinutes && endMinutes > slotStartMinutes) ||
        (startMinutes === slotStartMinutes && endMinutes === slotEndMinutes)
      );
    });

    if (hasOverlap) {
      setError('Ce créneau chevauche avec un créneau existant');
      return;
    }

    onAdd({ start: startTime, end: endTime });
    setStartTime('');
    setEndTime('');
    setError(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setStartTime('');
    setEndTime('');
    setError(null);
    onOpenChange(false);
  };

  // Filter end time options based on start time
  const getEndTimeOptions = () => {
    if (!startTime) return TIME_OPTIONS;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;

    return TIME_OPTIONS.filter((time) => {
      const [hour, min] = time.split(':').map(Number);
      const minutes = hour * 60 + min;
      return minutes > startMinutes;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un créneau</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">
              Heure de début <span className="text-red-500">*</span>
            </Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger id="startTime">
                <SelectValue placeholder="Sélectionnez l'heure de début" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">
              Heure de fin <span className="text-red-500">*</span>
            </Label>
            <Select
              value={endTime}
              onValueChange={setEndTime}
              disabled={!startTime}
            >
              <SelectTrigger id="endTime">
                <SelectValue placeholder="Sélectionnez l'heure de fin" />
              </SelectTrigger>
              <SelectContent>
                {getEndTimeOptions().map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleAdd} disabled={!startTime || !endTime}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
