'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMenteeOnboardingStore } from '@/stores/mentee-onboarding-store';
import { menteeStep2Schema, type MenteeStep2Data } from '@/lib/validations/onboarding';
import { LEARNER_CATEGORIES, LEARNING_LEVELS, LEARNING_CONTEXTS } from '@/lib/constants/onboarding';
import { FormSection, StepNavigation } from '@/components/onboarding';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Baby, GraduationCap, User, Info } from 'lucide-react';
import type { LearnerCategory, LearningLevel, LearningContext } from '@/types/onboarding';

// Icons for learner categories
const categoryIcons = {
  CHILD: Baby,
  TEENAGER: GraduationCap,
  ADULT: User,
};

// Generate year options
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

export default function MenteeStep2Page() {
  const router = useRouter();
  const { data, updateData } = useMenteeOnboardingStore();

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MenteeStep2Data>({
    resolver: zodResolver(menteeStep2Schema),
    mode: 'onChange',
    defaultValues: {
      learnerCategory: data.learnerCategory,
      currentLevel: data.currentLevel,
      yearOfBirth: data.yearOfBirth,
      learningContext: data.learningContext,
    },
  });

  const watchedFields = watch();
  const showYearOfBirth = watchedFields.learnerCategory === 'CHILD' || watchedFields.learnerCategory === 'TEENAGER';

  // Auto-save to store on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateData(watchedFields);
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedFields, updateData]);

  const onSubmit = (formData: MenteeStep2Data) => {
    updateData(formData);
    router.push('/onboarding/mentee/step-3');
  };

  const handlePrevious = () => {
    router.push('/onboarding/mentee/step-1');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Profil d'apprenant"
        description="Aidez-nous à mieux comprendre votre situation"
      >
        <div className="space-y-8">
          {/* Learner Category */}
          <div className="space-y-3">
            <Label>
              Catégorie d'apprenant <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LEARNER_CATEGORIES.map((category) => {
                const Icon = categoryIcons[category.value];
                const isSelected = watchedFields.learnerCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setValue('learnerCategory', category.value as LearnerCategory, { shouldValidate: true })}
                    className={cn(
                      'relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200',
                      'hover:border-teal-300 hover:bg-teal-50/50',
                      isSelected
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20'
                        : 'border-gray-200 bg-white'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
                        isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <span
                      className={cn(
                        'mt-3 font-medium',
                        isSelected ? 'text-teal-700' : 'text-gray-700'
                      )}
                    >
                      {category.label}
                    </span>
                    <span className="mt-1 text-sm text-gray-500">
                      {category.description}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.learnerCategory && (
              <p className="text-sm text-red-500">{errors.learnerCategory.message}</p>
            )}
          </div>

          {/* Year of Birth (conditional) */}
          <div
            className={cn(
              'space-y-3 overflow-hidden transition-all duration-300',
              showYearOfBirth ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <Label htmlFor="yearOfBirth">
              Année de naissance <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedFields.yearOfBirth?.toString()}
              onValueChange={(value) => setValue('yearOfBirth', parseInt(value), { shouldValidate: true })}
            >
              <SelectTrigger className={errors.yearOfBirth ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionnez l'année" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.yearOfBirth && (
              <p className="text-sm text-red-500">{errors.yearOfBirth.message}</p>
            )}

            {/* Info message for minors */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Un compte parent sera créé pour superviser les sessions</p>
            </div>
          </div>

          {/* Current Level */}
          <div className="space-y-3">
            <Label htmlFor="currentLevel">
              Niveau actuel <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedFields.currentLevel}
              onValueChange={(value) => setValue('currentLevel', value as LearningLevel, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.currentLevel ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionnez votre niveau" />
              </SelectTrigger>
              <SelectContent>
                {LEARNING_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex flex-col">
                      <span>{level.label}</span>
                      <span className="text-xs text-gray-500">{level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currentLevel && (
              <p className="text-sm text-red-500">{errors.currentLevel.message}</p>
            )}
          </div>

          {/* Learning Context */}
          <div className="space-y-3">
            <Label htmlFor="learningContext">
              Contexte d'apprentissage (optionnel)
            </Label>
            <Select
              value={watchedFields.learningContext}
              onValueChange={(value) => setValue('learningContext', value as LearningContext, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre contexte" />
              </SelectTrigger>
              <SelectContent>
                {LEARNING_CONTEXTS.map((context) => (
                  <SelectItem key={context.value} value={context.value}>
                    <div className="flex flex-col">
                      <span>{context.label}</span>
                      <span className="text-xs text-gray-500">{context.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
