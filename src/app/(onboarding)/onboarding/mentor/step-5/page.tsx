'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMentorOnboardingStore } from '@/stores/mentor-onboarding-store';
import { mentorStep5Schema, type MentorStep5Data } from '@/lib/validations/onboarding';
import { FormSection, StepNavigation, WeeklyAvailability } from '@/components/onboarding';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { TIMEZONES } from '@/lib/constants/timezones';
import type { WeeklyAvailabilityDay } from '@/components/onboarding/WeeklyAvailability';

export default function MentorStep5Page() {
  const router = useRouter();
  const { data, updateData } = useMentorOnboardingStore();

  // Get user's timezone as default
  const getUserTimezone = () => {
    if (typeof window !== 'undefined') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return 'Europe/Paris';
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MentorStep5Data>({
    resolver: zodResolver(mentorStep5Schema),
    mode: 'onChange',
    defaultValues: {
      weeklyAvailability: (data.weeklyAvailability as WeeklyAvailabilityDay[]) || [],
      timezone: data.timezone || getUserTimezone(),
    },
  });

  const watchedFields = watch();

  // Auto-save to store on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateData(watchedFields);
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedFields, updateData]);

  const onSubmit = (formData: MentorStep5Data) => {
    updateData(formData);
    router.push('/onboarding/mentor/step-6');
  };

  const handlePrevious = () => {
    router.push('/onboarding/mentor/step-4');
  };

  const handleAvailabilityChange = (availability: WeeklyAvailabilityDay[]) => {
    setValue('weeklyAvailability', availability, { shouldValidate: true });
  };

  // Calculate total slots
  const totalSlots = (watchedFields.weeklyAvailability || []).reduce(
    (sum, day) => sum + day.slots.length,
    0
  );
  const daysWithSlots = (watchedFields.weeklyAvailability || []).filter(
    (day) => day.slots.length > 0
  ).length;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Disponibilités"
        description="Configurez vos créneaux disponibles"
      >
        <div className="space-y-6">
          {/* Helper Message */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Ajoutez vos disponibilités récurrentes. Vous pourrez les modifier plus tard.
            </AlertDescription>
          </Alert>

          {/* Weekly Availability Calendar */}
          <div className="space-y-2">
            <Label>
              Calendrier hebdomadaire <span className="text-red-500">*</span>
            </Label>
            <WeeklyAvailability
              value={watchedFields.weeklyAvailability as WeeklyAvailabilityDay[]}
              onChange={handleAvailabilityChange}
              error={errors.weeklyAvailability?.message as string}
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {totalSlots} créneau{totalSlots > 1 ? 'x' : ''} sur {daysWithSlots} jour
                {daysWithSlots > 1 ? 's' : ''}
              </span>
              {totalSlots === 0 && (
                <span className="text-red-500">
                  Au moins un créneau est requis
                </span>
              )}
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone">
              Fuseau horaire <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedFields.timezone}
              onValueChange={(value) => setValue('timezone', value, { shouldValidate: true })}
            >
              <SelectTrigger
                id="timezone"
                className={errors.timezone ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Sélectionnez votre fuseau horaire" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timezone && (
              <p className="text-sm text-red-500">{errors.timezone.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Les créneaux seront affichés dans ce fuseau horaire
            </p>
          </div>
        </div>

        {/* Navigation */}
        <StepNavigation
          onPrevious={handlePrevious}
          onNext={() => {}}
          isFirstStep={false}
          isLastStep={false}
          canProceed={isValid}
        />
      </FormSection>
    </form>
  );
}
