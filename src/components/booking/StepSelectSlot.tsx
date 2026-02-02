'use client';

import { useBookingStore, getDurationOptions } from '@/stores/booking-store';
import { DateCalendar } from './DateCalendar';
import { TimeSlotPicker } from './TimeSlotPicker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionDuration } from '@/types';

export function StepSelectSlot() {
  const {
    mentor,
    mentorId,
    duration,
    selectedDate,
    selectedSlot,
    setDuration,
    setSelectedDate,
    setSlot,
  } = useBookingStore();

  if (!mentor || !mentorId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chargement des informations du mentor...</p>
      </div>
    );
  }

  const durationOptions = getDurationOptions(mentor.hourly_rate, mentor.currency);

  return (
    <div className="space-y-8">
      {/* Duration Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-600" />
          Durée de la session
        </h3>

        <RadioGroup
          value={duration.toString()}
          onValueChange={(value) => setDuration(parseInt(value) as SessionDuration)}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {durationOptions.map((option) => (
            <div key={option.value}>
              <RadioGroupItem
                value={option.value.toString()}
                id={`duration-${option.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`duration-${option.value}`}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all',
                  'hover:border-teal-500 hover:bg-teal-50/50',
                  'peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50',
                  option.recommended && 'ring-2 ring-teal-200 ring-offset-2'
                )}
              >
                {option.recommended && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                    Recommandé
                  </span>
                )}
                <span className="font-semibold text-gray-900">{option.label}</span>
                <span className="text-teal-600 font-medium mt-1">
                  {option.formattedPrice}
                </span>
                {duration === option.value && (
                  <Check className="h-4 w-4 text-teal-600 mt-2" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Calendar and Time Slots */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choisissez une date
          </h3>
          <DateCalendar
            mentorId={mentorId}
            duration={duration}
            selectedDate={selectedDate ? new Date(selectedDate) : undefined}
            onDateSelect={(date) => setSelectedDate(date.toISOString())}
          />
        </div>

        {/* Time Slots */}
        <div>
          {selectedDate ? (
            <TimeSlotPicker
              mentorId={mentorId}
              date={new Date(selectedDate)}
              duration={duration}
              selectedSlot={selectedSlot}
              onSlotSelect={setSlot}
            />
          ) : (
            <Card className="h-full flex items-center justify-center bg-gray-50">
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Sélectionnez une date pour voir les créneaux disponibles
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSlot && (
        <Card className="bg-teal-50 border-teal-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-700">Créneau sélectionné</p>
                <p className="font-semibold text-teal-900">
                  {new Date(selectedSlot.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  à {selectedSlot.start_time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-teal-700">Durée</p>
                <p className="font-semibold text-teal-900">{duration} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
