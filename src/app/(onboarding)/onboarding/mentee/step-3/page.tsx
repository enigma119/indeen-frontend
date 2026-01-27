'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMenteeOnboardingStore } from '@/stores/mentee-onboarding-store';
import { menteeStep3Schema, type MenteeStep3Data } from '@/lib/validations/onboarding';
import {
  LEARNING_GOALS,
  LANGUAGES,
  LEARNING_PACES,
  SESSION_DURATIONS,
} from '@/lib/constants/onboarding';
import { FormSection, StepNavigation } from '@/components/onboarding';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { LearningGoal, Language, LearningPace } from '@/types/onboarding';

export default function MenteeStep3Page() {
  const router = useRouter();
  const { data, updateData } = useMenteeOnboardingStore();

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MenteeStep3Data>({
    resolver: zodResolver(menteeStep3Schema),
    mode: 'onChange',
    defaultValues: {
      learningGoals: data.learningGoals || [],
      preferredLanguages: data.preferredLanguages || [],
      learningPace: data.learningPace,
      preferredSessionDuration: data.preferredSessionDuration || 60,
      hasSpecialNeeds: data.hasSpecialNeeds || false,
      specialNeedsDescription: data.specialNeedsDescription || '',
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

  const onSubmit = (formData: MenteeStep3Data) => {
    updateData(formData);
    router.push('/onboarding/mentee/step-4');
  };

  const handlePrevious = () => {
    router.push('/onboarding/mentee/step-2');
  };

  const toggleGoal = (goal: LearningGoal) => {
    const current = watchedFields.learningGoals || [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    setValue('learningGoals', updated, { shouldValidate: true });
  };

  const toggleLanguage = (language: Language) => {
    const current = watchedFields.preferredLanguages || [];
    const updated = current.includes(language)
      ? current.filter((l) => l !== language)
      : [...current, language];
    setValue('preferredLanguages', updated, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Objectifs et préférences"
        description="Définissez vos objectifs d'apprentissage"
      >
        <div className="space-y-8">
          {/* Learning Goals */}
          <div className="space-y-3">
            <Label>
              Objectifs d'apprentissage <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500">
              Sélectionnez un ou plusieurs objectifs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LEARNING_GOALS.map((goal) => {
                const isSelected = watchedFields.learningGoals?.includes(goal.value);
                return (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => toggleGoal(goal.value)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all',
                      'hover:border-teal-300',
                      isSelected
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 bg-white'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                        isSelected
                          ? 'border-teal-500 bg-teal-500'
                          : 'border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12">
                          <path
                            fill="currentColor"
                            d="M10.28 2.28L4 8.56l-2.28-2.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z"
                          />
                        </svg>
                      )}
                    </div>
                    <span className={isSelected ? 'text-teal-700 font-medium' : 'text-gray-700'}>
                      {goal.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.learningGoals && (
              <p className="text-sm text-red-500">{errors.learningGoals.message}</p>
            )}
          </div>

          {/* Preferred Languages */}
          <div className="space-y-3">
            <Label>
              Langues préférées <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500">
              Dans quelle(s) langue(s) souhaitez-vous apprendre ?
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = watchedFields.preferredLanguages?.includes(lang.value);
                return (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => toggleLanguage(lang.value)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all',
                      'hover:border-teal-300',
                      isSelected
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className={isSelected ? 'font-medium' : ''}>
                      {lang.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.preferredLanguages && (
              <p className="text-sm text-red-500">{errors.preferredLanguages.message}</p>
            )}
          </div>

          {/* Learning Pace */}
          <div className="space-y-3">
            <Label>
              Rythme d'apprentissage <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {LEARNING_PACES.map((pace) => {
                const isSelected = watchedFields.learningPace === pace.value;
                return (
                  <button
                    key={pace.value}
                    type="button"
                    onClick={() => setValue('learningPace', pace.value as LearningPace, { shouldValidate: true })}
                    className={cn(
                      'flex flex-col p-4 rounded-lg border-2 text-center transition-all',
                      'hover:border-teal-300',
                      isSelected
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 bg-white'
                    )}
                  >
                    <span className={cn(
                      'font-medium',
                      isSelected ? 'text-teal-700' : 'text-gray-700'
                    )}>
                      {pace.label}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {pace.description}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.learningPace && (
              <p className="text-sm text-red-500">{errors.learningPace.message}</p>
            )}
          </div>

          {/* Session Duration */}
          <div className="space-y-3">
            <Label htmlFor="preferredSessionDuration">
              Durée de session préférée <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedFields.preferredSessionDuration?.toString()}
              onValueChange={(value) => setValue('preferredSessionDuration', parseInt(value), { shouldValidate: true })}
            >
              <SelectTrigger className={errors.preferredSessionDuration ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionnez une durée" />
              </SelectTrigger>
              <SelectContent>
                {SESSION_DURATIONS.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value.toString()}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preferredSessionDuration && (
              <p className="text-sm text-red-500">{errors.preferredSessionDuration.message}</p>
            )}
          </div>

          {/* Special Needs */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="hasSpecialNeeds"
                checked={watchedFields.hasSpecialNeeds}
                onCheckedChange={(checked) => setValue('hasSpecialNeeds', !!checked, { shouldValidate: true })}
              />
              <Label htmlFor="hasSpecialNeeds" className="cursor-pointer">
                J'ai des besoins spéciaux d'apprentissage
              </Label>
            </div>

            {/* Conditional textarea */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                watchedFields.hasSpecialNeeds ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <Textarea
                placeholder="Décrivez vos besoins particuliers..."
                value={watchedFields.specialNeedsDescription || ''}
                onChange={(e) => setValue('specialNeedsDescription', e.target.value, { shouldValidate: true })}
                className={cn(
                  'mt-3',
                  errors.specialNeedsDescription ? 'border-red-500' : ''
                )}
                rows={3}
              />
              {errors.specialNeedsDescription && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.specialNeedsDescription.message}
                </p>
              )}
            </div>
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
