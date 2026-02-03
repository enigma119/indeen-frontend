'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { generalInfoSchema, type GeneralInfoFormData } from '@/lib/validations/profile';
import { useUpdateProfile } from '@/hooks/use-profile';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import type { User } from '@/types';
import { AvatarUploadDialog } from './AvatarUploadDialog';

interface GeneralInfoTabProps {
  user: User;
}

const COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'MA', name: 'Maroc' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'CA', name: 'Canada' },
  { code: 'US', name: 'États-Unis' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'SA', name: 'Arabie Saoudite' },
  { code: 'AE', name: 'Émirats Arabes Unis' },
  { code: 'EG', name: 'Égypte' },
];

const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
  { value: 'Europe/London', label: 'Londres (UTC+0)' },
  { value: 'Africa/Casablanca', label: 'Casablanca (UTC+0)' },
  { value: 'Africa/Algiers', label: 'Alger (UTC+1)' },
  { value: 'Africa/Tunis', label: 'Tunis (UTC+1)' },
  { value: 'Asia/Riyadh', label: 'Riyad (UTC+3)' },
  { value: 'Asia/Dubai', label: 'Dubaï (UTC+4)' },
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'America/Montreal', label: 'Montréal (UTC-5)' },
];

const CURRENCIES = [
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'USD', name: 'Dollar US ($)' },
  { code: 'MAD', name: 'Dirham marocain (DH)' },
  { code: 'DZD', name: 'Dinar algérien (DA)' },
  { code: 'TND', name: 'Dinar tunisien (DT)' },
  { code: 'SAR', name: 'Riyal saoudien (SR)' },
  { code: 'AED', name: 'Dirham émirati (AED)' },
  { code: 'CAD', name: 'Dollar canadien (CAD)' },
  { code: 'GBP', name: 'Livre sterling (£)' },
];

const GENDERS = [
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
  { value: 'other', label: 'Autre' },
];

export function GeneralInfoTab({ user }: GeneralInfoTabProps) {
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<GeneralInfoFormData>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      gender: (user.gender as 'male' | 'female' | 'other' | '') || '',
      countryCode: user.countryCode || 'FR',
      timezone: user.timezone || 'Europe/Paris',
      locale: (user.locale as 'fr' | 'en' | 'ar') || 'fr',
      preferredCurrency: user.preferredCurrency || 'EUR',
    },
  });

  // Warn about unsaved changes
  useUnsavedChanges(isDirty);

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  const onSubmit = async (data: GeneralInfoFormData) => {
    await updateProfile.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
      gender: data.gender || undefined,
      countryCode: data.countryCode,
      timezone: data.timezone,
      locale: data.locale,
      preferredCurrency: data.preferredCurrency,
    });
    reset(data);
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <div className="space-y-8">
      {/* Photo Section */}
      <section className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="bg-teal-100 text-teal-700 text-xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowAvatarDialog(true)}
              className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAvatarDialog(true)}
            >
              Changer la photo
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG ou WEBP. Max 5MB.
            </p>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations personnelles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Votre prénom"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Votre nom"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                L&apos;email ne peut pas être modifié
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+33 6 12 34 56 78"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays *</Label>
              <Select
                value={watch('countryCode')}
                onValueChange={(value) => setValue('countryCode', value, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryCode && (
                <p className="text-sm text-red-500">{errors.countryCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Genre</Label>
              <Select
                value={watch('gender') || ''}
                onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other' | '', { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
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
        </section>

        {/* Regional Preferences */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Préférences régionales
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire *</Label>
              <Select
                value={watch('timezone')}
                onValueChange={(value) => setValue('timezone', value, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un fuseau" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale">Langue de l&apos;interface *</Label>
              <Select
                value={watch('locale')}
                onValueChange={(value) => setValue('locale', value as 'fr' | 'en' | 'ar', { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
              {errors.locale && (
                <p className="text-sm text-red-500">{errors.locale.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise préférée *</Label>
              <Select
                value={watch('preferredCurrency')}
                onValueChange={(value) => setValue('preferredCurrency', value, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une devise" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.preferredCurrency && (
                <p className="text-sm text-red-500">{errors.preferredCurrency.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={!isDirty || updateProfile.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || updateProfile.isPending}
          >
            {updateProfile.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Enregistrer
          </Button>
        </div>
      </form>

      {/* Avatar Upload Dialog */}
      <AvatarUploadDialog
        open={showAvatarDialog}
        onOpenChange={setShowAvatarDialog}
        currentAvatarUrl={user.avatarUrl}
      />
    </div>
  );
}
