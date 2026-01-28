'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMentorOnboardingStore } from '@/stores/mentor-onboarding-store';
import { mentorStep3BaseSchema, type MentorStep3BaseData } from '@/lib/validations/onboarding';
import { FormSection, StepNavigation, SpecialtyCard } from '@/components/onboarding';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Baby, GraduationCap, User } from 'lucide-react';
import { LANGUAGES, SPECIALTIES, LEARNING_LEVELS } from '@/lib/constants/onboarding';
import type { Language, Specialty, LearningLevel } from '@/types/onboarding';
import { cn } from '@/lib/utils';

export default function MentorStep3Page() {
  const router = useRouter();
  const { data, updateData } = useMentorOnboardingStore();
  const [allLevelsSelected, setAllLevelsSelected] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MentorStep3BaseData>({
    resolver: zodResolver(mentorStep3BaseSchema),
    mode: 'onChange',
    defaultValues: {
      languages: data.languages || [],
      nativeLanguage: data.nativeLanguage,
      specialties: data.specialties || [],
      teachesChildren: data.teachesChildren || false,
      teachesTeenagers: data.teachesTeenagers || false,
      teachesAdults: data.teachesAdults || false,
      beginnerFriendly: data.beginnerFriendly || false,
      patientWithSlowLearners: data.patientWithSlowLearners || false,
      experiencedWithNewMuslims: data.experiencedWithNewMuslims || false,
      specialNeedsSupport: data.specialNeedsSupport || false,
      acceptedLevels: data.acceptedLevels || [],
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

  // Check if all levels are selected
  useEffect(() => {
    const allLevels = LEARNING_LEVELS.map((l) => l.value);
    const selectedLevels = watchedFields.acceptedLevels || [];
    setAllLevelsSelected(
      allLevels.length > 0 && allLevels.every((level) => selectedLevels.includes(level))
    );
  }, [watchedFields.acceptedLevels]);

  const onSubmit = (formData: MentorStep3BaseData) => {
    updateData(formData);
    router.push('/onboarding/mentor/step-4');
  };

  const handlePrevious = () => {
    router.push('/onboarding/mentor/step-2');
  };

  const toggleLanguage = (language: Language) => {
    const current = watchedFields.languages || [];
    const updated = current.includes(language)
      ? current.filter((l) => l !== language)
      : [...current, language];
    setValue('languages', updated, { shouldValidate: true });
  };

  const toggleSpecialty = (specialty: Specialty) => {
    const current = watchedFields.specialties || [];
    if (current.length >= 5 && !current.includes(specialty)) {
      return; // Max 5 specialties
    }
    const updated = current.includes(specialty)
      ? current.filter((s) => s !== specialty)
      : [...current, specialty];
    setValue('specialties', updated, { shouldValidate: true });
  };

  const toggleLevel = (level: LearningLevel) => {
    const current = watchedFields.acceptedLevels || [];
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    setValue('acceptedLevels', updated, { shouldValidate: true });
  };

  const toggleAllLevels = () => {
    if (allLevelsSelected) {
      setValue('acceptedLevels', [], { shouldValidate: true });
    } else {
      const allLevels = LEARNING_LEVELS.map((l) => l.value);
      setValue('acceptedLevels', allLevels, { shouldValidate: true });
    }
  };

  const selectedLanguages = watchedFields.languages || [];
  const selectedSpecialties = watchedFields.specialties || [];
  const selectedLevels = watchedFields.acceptedLevels || [];
  const hasAtLeastOneStudentType =
    watchedFields.teachesChildren ||
    watchedFields.teachesTeenagers ||
    watchedFields.teachesAdults;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Compétences"
        description="Sélectionnez vos domaines d'expertise"
      >
        <div className="space-y-8">
          {/* Section 1: Languages */}
          <div className="space-y-4">
            <Label>
              Langues enseignées <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.value}
                  className={cn(
                    'flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all',
                    selectedLanguages.includes(lang.value)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => toggleLanguage(lang.value)}
                >
                  <Checkbox
                    checked={selectedLanguages.includes(lang.value)}
                    onCheckedChange={() => toggleLanguage(lang.value)}
                  />
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                </div>
              ))}
            </div>
            {errors.languages && (
              <p className="text-sm text-red-500">{errors.languages.message}</p>
            )}

            {/* Native Language */}
            <div className="space-y-2 mt-4">
              <Label htmlFor="nativeLanguage">Langue maternelle (optionnel)</Label>
              <Select
                value={watchedFields.nativeLanguage}
                onValueChange={(value) => setValue('nativeLanguage', value as Language, { shouldValidate: true })}
              >
                <SelectTrigger id="nativeLanguage">
                  <SelectValue placeholder="Sélectionnez votre langue maternelle" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <span className="mr-2">{lang.flag}</span>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 2: Specialties */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>
                Spécialités <span className="text-red-500">*</span>
              </Label>
              <span className="text-sm text-gray-500">
                {selectedSpecialties.length}/5 sélectionnées
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPECIALTIES.map((specialty) => (
                <SpecialtyCard
                  key={specialty.value}
                  specialty={specialty.value}
                  isSelected={selectedSpecialties.includes(specialty.value)}
                  onToggle={toggleSpecialty}
                  disabled={selectedSpecialties.length >= 5 && !selectedSpecialties.includes(specialty.value)}
                />
              ))}
            </div>
            {errors.specialties && (
              <p className="text-sm text-red-500">{errors.specialties.message}</p>
            )}
            {selectedSpecialties.length >= 5 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Maximum 5 spécialités atteint
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Section 3: Student Types */}
          <div className="space-y-4">
            <Label>
              Types d'étudiants acceptés <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3">
              <div
                className={cn(
                  'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all',
                  watchedFields.teachesChildren
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setValue('teachesChildren', !watchedFields.teachesChildren, { shouldValidate: true })}
              >
                <Checkbox
                  checked={watchedFields.teachesChildren}
                  onCheckedChange={(checked) =>
                    setValue('teachesChildren', checked === true, { shouldValidate: true })
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Baby className="h-5 w-5 text-teal-600" />
                    <Label className="font-medium cursor-pointer">
                      J'enseigne aux enfants (&lt; 13 ans)
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Enseignement adapté aux plus jeunes
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all',
                  watchedFields.teachesTeenagers
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setValue('teachesTeenagers', !watchedFields.teachesTeenagers, { shouldValidate: true })}
              >
                <Checkbox
                  checked={watchedFields.teachesTeenagers}
                  onCheckedChange={(checked) =>
                    setValue('teachesTeenagers', checked === true, { shouldValidate: true })
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-teal-600" />
                    <Label className="font-medium cursor-pointer">
                      J'enseigne aux adolescents (13-17 ans)
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Approche adaptée aux adolescents
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all',
                  watchedFields.teachesAdults
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setValue('teachesAdults', !watchedFields.teachesAdults, { shouldValidate: true })}
              >
                <Checkbox
                  checked={watchedFields.teachesAdults}
                  onCheckedChange={(checked) =>
                    setValue('teachesAdults', checked === true, { shouldValidate: true })
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-teal-600" />
                    <Label className="font-medium cursor-pointer">
                      J'enseigne aux adultes (18+)
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Enseignement pour adultes
                  </p>
                </div>
              </div>
            </div>
            {!hasAtLeastOneStudentType && errors.teachesChildren && (
              <p className="text-sm text-red-500">{errors.teachesChildren.message}</p>
            )}
          </div>

          {/* Section 4: Pedagogical Capabilities */}
          <div className="space-y-4">
            <Label>Capacités pédagogiques (optionnel)</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="beginnerFriendly"
                  checked={watchedFields.beginnerFriendly}
                  onCheckedChange={(checked) =>
                    setValue('beginnerFriendly', checked === true)
                  }
                />
                <Label htmlFor="beginnerFriendly" className="cursor-pointer">
                  À l'aise avec les débutants complets
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="patientWithSlowLearners"
                  checked={watchedFields.patientWithSlowLearners}
                  onCheckedChange={(checked) =>
                    setValue('patientWithSlowLearners', checked === true)
                  }
                />
                <Label htmlFor="patientWithSlowLearners" className="cursor-pointer">
                  Patient avec les apprenants lents
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="experiencedWithNewMuslims"
                  checked={watchedFields.experiencedWithNewMuslims}
                  onCheckedChange={(checked) =>
                    setValue('experiencedWithNewMuslims', checked === true)
                  }
                />
                <Label htmlFor="experiencedWithNewMuslims" className="cursor-pointer">
                  Expérience avec les nouveaux musulmans
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="specialNeedsSupport"
                  checked={watchedFields.specialNeedsSupport}
                  onCheckedChange={(checked) =>
                    setValue('specialNeedsSupport', checked === true)
                  }
                />
                <Label htmlFor="specialNeedsSupport" className="cursor-pointer">
                  Support pour besoins spéciaux
                </Label>
              </div>
            </div>
          </div>

          {/* Section 5: Accepted Levels */}
          <div className="space-y-4">
            <Label>Niveaux acceptés (optionnel)</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <Checkbox
                  id="allLevels"
                  checked={allLevelsSelected}
                  onCheckedChange={toggleAllLevels}
                />
                <Label htmlFor="allLevels" className="cursor-pointer font-medium">
                  Tous les niveaux
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                {LEARNING_LEVELS.map((level) => (
                  <div
                    key={level.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`level-${level.value}`}
                      checked={selectedLevels.includes(level.value)}
                      onCheckedChange={() => toggleLevel(level.value)}
                    />
                    <Label htmlFor={`level-${level.value}`} className="cursor-pointer text-sm">
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
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
