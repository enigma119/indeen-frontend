'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/auth-store';
import { useMentorOnboardingStore } from '@/stores/mentor-onboarding-store';
import { mentorStep1Schema, type MentorStep1Data } from '@/lib/validations/onboarding';
import { COUNTRIES, GENDERS } from '@/lib/constants/onboarding';
import { FormSection, StepNavigation, AvatarUpload } from '@/components/onboarding';
import { Input } from '@/components/ui/input';
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
import type { Gender } from '@/types/onboarding';

export default function MentorStep1Page() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, updateData } = useMentorOnboardingStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MentorStep1Data>({
    resolver: zodResolver(mentorStep1Schema),
    mode: 'onChange',
    defaultValues: {
      firstName: data.firstName || user?.firstName || '',
      lastName: data.lastName || user?.lastName || '',
      country: data.country || '',
      phone: data.phone || '',
      gender: data.gender,
      avatar: data.avatar,
    },
  });

  // Watch all fields for auto-save
  const watchedFields = watch();

  // Auto-save to store on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateData(watchedFields);
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedFields, updateData]);

  // Pre-fill from user data on mount
  useEffect(() => {
    if (user && !data.firstName) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
    }
  }, [user, data.firstName, setValue]);

  const onSubmit = (formData: MentorStep1Data) => {
    updateData(formData);
    router.push('/onboarding/mentor/step-2');
  };

  const handleAvatarChange = (file: File | null) => {
    setValue('avatar', file || undefined, { shouldValidate: true });
    updateData({ avatar: file || undefined });
  };

  // Get initials for avatar placeholder
  const getInitials = () => {
    const first = watchedFields.firstName?.[0] || '';
    const last = watchedFields.lastName?.[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Informations personnelles"
        description="Créez un profil qui inspire confiance"
      >
        {/* Encouraging message */}
        <Alert className="mb-6 border-teal-200 bg-teal-50">
          <Info className="h-4 w-4 text-teal-600" />
          <AlertDescription className="text-teal-800">
            Une photo professionnelle aide les élèves à vous faire confiance
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Avatar Upload - Prominent */}
          <div className="flex flex-col items-center pb-6">
            <AvatarUpload
              value={watchedFields.avatar}
              onChange={handleAvatarChange}
              defaultInitials={getInitials()}
              error={errors.avatar?.message as string}
            />
            {errors.avatar && (
              <p className="mt-2 text-sm text-red-500">{errors.avatar.message as string}</p>
            )}
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Votre prénom"
                {...register('firstName')}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Votre nom"
                {...register('lastName')}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">
              Pays de résidence <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedFields.country}
              onValueChange={(value) => setValue('country', value, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionnez votre pays" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          {/* Phone - Required for mentors */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Téléphone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Format international recommandé. Le téléphone est obligatoire pour les mentors.
            </p>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Genre (optionnel)</Label>
            <Select
              value={watchedFields.gender}
              onValueChange={(value) => setValue('gender', value as Gender, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre genre" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem key={gender.value} value={gender.value}>
                    {gender.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Navigation */}
        <StepNavigation
          onPrevious={() => {}}
          onNext={() => {}}
          isFirstStep={true}
          isLastStep={false}
          canProceed={isValid}
        />
      </FormSection>
    </form>
  );
}
