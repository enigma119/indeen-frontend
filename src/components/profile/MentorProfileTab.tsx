'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import { mentorProfileSchema, type MentorProfileFormData } from '@/lib/validations/profile';
import { useUpdateMentorProfile } from '@/hooks/use-profile';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import type { MentorProfile } from '@/types';

interface MentorProfileTabProps {
  profile: MentorProfile;
}

const LANGUAGES = [
  { code: 'ar', name: 'Arabe' },
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'Anglais' },
  { code: 'es', name: 'Espagnol' },
  { code: 'de', name: 'Allemand' },
  { code: 'it', name: 'Italien' },
  { code: 'pt', name: 'Portugais' },
  { code: 'tr', name: 'Turc' },
  { code: 'ur', name: 'Ourdou' },
  { code: 'bn', name: 'Bengali' },
  { code: 'id', name: 'Indonésien' },
  { code: 'ms', name: 'Malais' },
];

const SPECIALTIES = [
  { value: 'quran_memorization', label: 'Mémorisation du Coran' },
  { value: 'quran_recitation', label: 'Récitation du Coran' },
  { value: 'tajweed', label: 'Tajweed' },
  { value: 'arabic_language', label: 'Langue arabe' },
  { value: 'islamic_studies', label: 'Études islamiques' },
  { value: 'fiqh', label: 'Fiqh' },
  { value: 'aqidah', label: 'Aqidah' },
  { value: 'hadith', label: 'Hadith' },
  { value: 'seerah', label: 'Seerah' },
  { value: 'tafsir', label: 'Tafsir' },
];

const LEVELS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'elementary', label: 'Élémentaire' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'expert', label: 'Expert' },
];

const CURRENCIES = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'MAD', symbol: 'DH' },
  { code: 'SAR', symbol: 'SR' },
  { code: 'AED', symbol: 'AED' },
  { code: 'GBP', symbol: '£' },
];

const SESSION_DURATIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1h' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2h' },
];

const TRIAL_DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 heure' },
];

export function MentorProfileTab({ profile }: MentorProfileTabProps) {
  const updateProfile = useUpdateMentorProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
    control,
  } = useForm<MentorProfileFormData>({
    resolver: zodResolver(mentorProfileSchema),
    defaultValues: {
      headline: profile.headline || '',
      bio: profile.bio || '',
      languages: profile.languages || [],
      nativeLanguage: profile.nativeLanguage || '',
      specialties: profile.specialties || [],
      acceptedLevels: profile.acceptedLevels || [],
      hourlyRate: profile.hourlyRate || 0,
      currency: profile.currency || 'EUR',
      teachesChildren: profile.teachesChildren || false,
      teachesTeenagers: profile.teachesTeenagers || false,
      teachesAdults: profile.teachesAdults || false,
      beginnerFriendly: profile.beginnerFriendly || false,
      patientWithSlowLearners: profile.patientWithSlowLearners || false,
      experiencedWithNewMuslims: profile.experiencedWithNewMuslims || false,
      minSessionDuration: profile.minSessionDuration || 30,
      maxSessionDuration: profile.maxSessionDuration || 60,
      maxStudentsPerWeek: profile.maxStudentsPerWeek || undefined,
      freeTrialAvailable: profile.freeTrialAvailable || false,
      freeTrialDuration: profile.freeTrialDuration || 30,
      isAcceptingStudents: profile.isAcceptingStudents ?? true,
      videoIntroUrl: profile.videoIntroUrl || '',
    },
  });

  useUnsavedChanges(isDirty);

  const watchFreeTrialAvailable = watch('freeTrialAvailable');
  const watchHourlyRate = watch('hourlyRate');

  const onSubmit = async (data: MentorProfileFormData) => {
    await updateProfile.mutateAsync({
      headline: data.headline,
      bio: data.bio,
      languages: data.languages,
      nativeLanguage: data.nativeLanguage || undefined,
      specialties: data.specialties,
      acceptedLevels: data.acceptedLevels,
      hourlyRate: data.hourlyRate || undefined,
      currency: data.currency,
      teachesChildren: data.teachesChildren,
      teachesTeenagers: data.teachesTeenagers,
      teachesAdults: data.teachesAdults,
      beginnerFriendly: data.beginnerFriendly,
      patientWithSlowLearners: data.patientWithSlowLearners,
      experiencedWithNewMuslims: data.experiencedWithNewMuslims,
      minSessionDuration: data.minSessionDuration,
      maxSessionDuration: data.maxSessionDuration,
      maxStudentsPerWeek: data.maxStudentsPerWeek || undefined,
      freeTrialAvailable: data.freeTrialAvailable,
      freeTrialDuration: data.freeTrialAvailable ? data.freeTrialDuration : undefined,
      isAcceptingStudents: data.isAcceptingStudents,
      videoIntroUrl: data.videoIntroUrl || undefined,
    });
    reset(data);
  };

  const handleCancel = () => {
    reset();
  };

  const toggleArrayValue = (
    field: 'languages' | 'specialties' | 'acceptedLevels',
    value: string
  ) => {
    const current = watch(field) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-8">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Les modifications seront visibles immédiatement sur votre profil public.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Presentation Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Présentation</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="headline">Titre accrocheur *</Label>
              <Input
                id="headline"
                {...register('headline')}
                placeholder="Ex: Enseignant de Coran avec 10 ans d'expérience"
                maxLength={200}
              />
              <p className="text-xs text-gray-500">
                {watch('headline')?.length || 0}/200 caractères
              </p>
              {errors.headline && (
                <p className="text-sm text-red-500">{errors.headline.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie *</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Parlez de votre parcours, votre méthode d'enseignement, ce qui vous motive..."
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">
                {watch('bio')?.length || 0}/1000 caractères (minimum 100)
              </p>
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoIntroUrl">Vidéo de présentation (optionnel)</Label>
              <Input
                id="videoIntroUrl"
                {...register('videoIntroUrl')}
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
              />
              <p className="text-xs text-gray-500">
                Lien YouTube ou Vimeo de votre vidéo de présentation
              </p>
              {errors.videoIntroUrl && (
                <p className="text-sm text-red-500">{errors.videoIntroUrl.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compétences</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Langues d&apos;enseignement *</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleArrayValue('languages', lang.code)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      watch('languages')?.includes(lang.code)
                        ? 'bg-teal-100 border-teal-500 text-teal-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              {errors.languages && (
                <p className="text-sm text-red-500">{errors.languages.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nativeLanguage">Langue maternelle</Label>
              <Select
                value={watch('nativeLanguage') || ''}
                onValueChange={(value) => setValue('nativeLanguage', value, { shouldDirty: true })}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Spécialités *</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((specialty) => (
                  <button
                    key={specialty.value}
                    type="button"
                    onClick={() => toggleArrayValue('specialties', specialty.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      watch('specialties')?.includes(specialty.value)
                        ? 'bg-teal-100 border-teal-500 text-teal-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {specialty.label}
                  </button>
                ))}
              </div>
              {errors.specialties && (
                <p className="text-sm text-red-500">{errors.specialties.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Niveaux acceptés *</Label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => toggleArrayValue('acceptedLevels', level.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      watch('acceptedLevels')?.includes(level.value)
                        ? 'bg-teal-100 border-teal-500 text-teal-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
              {errors.acceptedLevels && (
                <p className="text-sm text-red-500">{errors.acceptedLevels.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarification</h2>
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Tarif horaire</Label>
                <div className="flex gap-2">
                  <Input
                    id="hourlyRate"
                    type="number"
                    min={0}
                    {...register('hourlyRate', { valueAsNumber: true })}
                    placeholder="0 = gratuit"
                    className="flex-1"
                  />
                  <Select
                    value={watch('currency')}
                    onValueChange={(value) => setValue('currency', value, { shouldDirty: true })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {watchHourlyRate === 0 && (
                  <p className="text-xs text-teal-600">Vos sessions seront gratuites</p>
                )}
                {errors.hourlyRate && (
                  <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Controller
                name="freeTrialAvailable"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="freeTrialAvailable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="space-y-1">
                <Label htmlFor="freeTrialAvailable" className="cursor-pointer">
                  Proposer un essai gratuit
                </Label>
                <p className="text-xs text-gray-500">
                  Permettez aux nouveaux élèves de vous découvrir
                </p>
              </div>
            </div>

            {watchFreeTrialAvailable && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="freeTrialDuration">Durée de l&apos;essai gratuit</Label>
                <Select
                  value={String(watch('freeTrialDuration') || 30)}
                  onValueChange={(value) =>
                    setValue('freeTrialDuration', Number(value), { shouldDirty: true })
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIAL_DURATIONS.map((duration) => (
                      <SelectItem key={duration.value} value={String(duration.value)}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </section>

        {/* Student Types Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Types d&apos;élèves</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Controller
                  name="teachesChildren"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="teachesChildren"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="teachesChildren" className="cursor-pointer">
                  Enfants (-12 ans)
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="teachesTeenagers"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="teachesTeenagers"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="teachesTeenagers" className="cursor-pointer">
                  Adolescents (12-18 ans)
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="teachesAdults"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="teachesAdults"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="teachesAdults" className="cursor-pointer">
                  Adultes (+18 ans)
                </Label>
              </div>
            </div>
            {errors.teachesChildren && (
              <p className="text-sm text-red-500">{errors.teachesChildren.message}</p>
            )}

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="beginnerFriendly"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="beginnerFriendly"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="beginnerFriendly" className="cursor-pointer">
                  Adapté aux débutants
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="patientWithSlowLearners"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="patientWithSlowLearners"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="patientWithSlowLearners" className="cursor-pointer">
                  Patient avec les apprenants lents
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="experiencedWithNewMuslims"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="experiencedWithNewMuslims"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="experiencedWithNewMuslims" className="cursor-pointer">
                  Expérience avec les nouveaux musulmans
                </Label>
              </div>
            </div>
          </div>
        </section>

        {/* Capacity Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacité</h2>
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minSessionDuration">Durée minimale de session</Label>
                <Select
                  value={String(watch('minSessionDuration'))}
                  onValueChange={(value) =>
                    setValue('minSessionDuration', Number(value), { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_DURATIONS.map((duration) => (
                      <SelectItem key={duration.value} value={String(duration.value)}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.minSessionDuration && (
                  <p className="text-sm text-red-500">{errors.minSessionDuration.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSessionDuration">Durée maximale de session</Label>
                <Select
                  value={String(watch('maxSessionDuration'))}
                  onValueChange={(value) =>
                    setValue('maxSessionDuration', Number(value), { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_DURATIONS.map((duration) => (
                      <SelectItem key={duration.value} value={String(duration.value)}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.maxSessionDuration && (
                  <p className="text-sm text-red-500">{errors.maxSessionDuration.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStudentsPerWeek">Nombre max d&apos;élèves par semaine</Label>
              <Input
                id="maxStudentsPerWeek"
                type="number"
                min={1}
                max={100}
                {...register('maxStudentsPerWeek', { valueAsNumber: true })}
                placeholder="Laissez vide pour illimité"
                className="w-48"
              />
            </div>

            <div className="flex items-center gap-3">
              <Controller
                name="isAcceptingStudents"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isAcceptingStudents"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div>
                <Label htmlFor="isAcceptingStudents" className="cursor-pointer">
                  J&apos;accepte de nouveaux élèves
                </Label>
                <p className="text-xs text-gray-500">
                  Décochez si vous êtes temporairement indisponible
                </p>
              </div>
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
          <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
            {updateProfile.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
