'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/auth-store';
import { useMenteeOnboardingStore } from '@/stores/mentee-onboarding-store';
import { menteeStep1Schema, type MenteeStep1Data } from '@/lib/validations/onboarding';
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
import type { Gender } from '@/types/onboarding';

export default function MenteeStep1Page() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, updateData } = useMenteeOnboardingStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MenteeStep1Data>({
    resolver: zodResolver(menteeStep1Schema),
    mode: 'onChange',
    defaultValues: {
      firstName: data.firstName || user?.first_name || '',
      lastName: data.lastName || user?.last_name || '',
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
      setValue('firstName', user.first_name || '');
      setValue('lastName', user.last_name || '');
    }
  }, [user, data.firstName, setValue]);

  const onSubmit = (formData: MenteeStep1Data) => {
    updateData(formData);
    router.push('/onboarding/mentee/step-2');
  };

  const handleAvatarChange = (file: File | null) => {
    setValue('avatar', file || undefined);
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
        description="Commencez par nous parler un peu de vous"
      >
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex justify-center pb-4">
            <AvatarUpload
              value={watchedFields.avatar}
              onChange={handleAvatarChange}
              defaultInitials={getInitials()}
              error={errors.avatar?.message as string}
            />
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

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
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
              Format international recommandé
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
