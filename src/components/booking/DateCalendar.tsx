'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { useAvailableSlots } from '@/hooks/use-sessions';
import { format, startOfMonth, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

interface DateCalendarProps {
  mentorId: string;
  duration: number;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
}

export function DateCalendar({
  mentorId,
  duration,
  selectedDate,
  onDateSelect,
}: DateCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  // Fetch availability for the current month
  const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
  const { data: availability, isLoading } = useAvailableSlots(
    mentorId,
    startDate,
    duration
  );

  // Get dates that have availability
  const availableDates = new Set(
    availability
      ?.filter((day) => day.has_availability)
      .map((day) => day.date) || []
  );

  // Check if a date has availability
  const hasAvailability = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableDates.has(dateStr);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      )}

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={fr}
        disabled={(date) => isBefore(date, today) || !hasAvailability(date)}
        showOutsideDays
        className="rounded-lg border p-3 bg-white"
        classNames={{
          months: "flex flex-col",
          month: "space-y-4",
          month_caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "flex items-center justify-between absolute inset-x-0",
          button_previous: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          ),
          button_next: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          ),
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex",
          weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          week: "flex w-full mt-2",
          day: "h-9 w-9 text-center text-sm p-0 relative",
          day_button: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-teal-100 hover:text-teal-900"
          ),
          selected: "bg-teal-600 text-white hover:bg-teal-700 hover:text-white focus:bg-teal-700 focus:text-white",
          today: "bg-accent text-accent-foreground",
          outside: "text-muted-foreground opacity-50",
          disabled: "text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent",
          hidden: "invisible",
        }}
        components={{
          Chevron: ({ orientation }) => {
            if (orientation === "left") {
              return <ChevronLeft className="h-4 w-4" />;
            }
            return <ChevronRight className="h-4 w-4" />;
          },
        }}
        footer={
          <div className="mt-3 pt-3 border-t flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span>Indisponible</span>
            </div>
          </div>
        }
      />
    </div>
  );
}
