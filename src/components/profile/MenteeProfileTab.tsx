'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
import { Loader2 } from 'lucide-react';
import { menteeProfileSchema, type MenteeProfileFormData } from '@/lib/validations/profile';
import { useUpdateMenteeProfile } from '@/hooks/use-profile';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import type { MenteeProfile } from '@/types';

interface MenteeProfileTabProps {
  profile: MenteeProfile;
}

const LEARNER_CATEGORIES = [
  { value: 'CHILD', label: 'Enfant (moins de 12 ans)' },
  { value: 'TEENAGER', label: 'Adolescent (12-18 ans)' },
  { value: 'ADULT', label: 'Adulte (plus de 18 ans)' },
];

const LEVELS = [
  { value: 'beginner', label: 'Débutant - Je ne connais pas encore l\'alphabet arabe' },
  { value: 'elementary', label: 'Élémentaire - Je connais l\'alphabet et peux lire lentement' },
  { value: 'intermediate', label: 'Intermédiaire - Je peux lire le Coran avec aide' },
  { value: 'advanced', label: 'Avancé - Je lis couramment avec bon tajweed' },
  { value: 'expert', label: 'Expert - Je maîtrise le tajweed et mémorise régulièrement' },
];

const LEARNING_GOALS = [
  { value: 'learn_arabic', label: 'Apprendre l\'alphabet arabe' },
  { value: 'read_quran', label: 'Lire le Coran couramment' },
  { value: 'memorize_quran', label: 'Mémoriser le Coran (Hifz)' },
  { value: 'improve_tajweed', label: 'Améliorer mon tajweed' },
  { value: 'understand_arabic', label: 'Comprendre l\'arabe coranique' },
  { value: 'islamic_studies', label: 'Études islamiques générales' },
  { value: 'daily_adhkar', label: 'Apprendre les adhkar quotidiens' },
  { value: 'prayer_perfection', label: 'Perfectionner ma prière' },
];

const LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'Arabe' },
  { code: 'en', name: 'Anglais' },
  { code: 'es', name: 'Espagnol' },
  { code: 'de', name: 'Allemand' },
  { code: 'tr', name: 'Turc' },
  { code: 'ur', name: 'Ourdou' },
];

const LEARNING_PACES = [
  { value: 'SLOW', label: 'Lent - Je préfère prendre mon temps' },
  { value: 'MODERATE', label: 'Modéré - Rythme régulier' },
  { value: 'FAST', label: 'Rapide - Je veux progresser vite' },
];

const SESSION_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 heure' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2 heures' },
];

export function MenteeProfileTab({ profile }: MenteeProfileTabProps) {
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState(!!profile.specialNeeds);
  const updateProfile = useUpdateMenteeProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
    control,
  } = useForm<MenteeProfileFormData>({
    resolver: zodResolver(menteeProfileSchema),
    defaultValues: {
      learnerCategory: profile.learnerCategory || 'ADULT',
      currentLevel: profile.currentLevel || '',
      learningGoals: profile.learningGoals || [],
      preferredLanguages: profile.preferredLanguages || [],
      learningPace: profile.learningPace || 'MODERATE',
      preferredSessionDuration: profile.preferredSessionDuration || 60,
      specialNeeds: profile.specialNeeds || '',
    },
  });

  useUnsavedChanges(isDirty);

  const onSubmit = async (data: MenteeProfileFormData) => {
    await updateProfile.mutateAsync({
      learnerCategory: data.learnerCategory,
      currentLevel: data.currentLevel,
      learningGoals: data.learningGoals,
      preferredLanguages: data.preferredLanguages,
      learningPace: data.learningPace,
      preferredSessionDuration: data.preferredSessionDuration,
      specialNeeds: hasSpecialNeeds ? data.specialNeeds : undefined,
    });
    reset(data);
  };

  const handleCancel = () => {
    reset();
    setHasSpecialNeeds(!!profile.specialNeeds);
  };

  const toggleArrayValue = (
    field: 'learningGoals' | 'preferredLanguages',
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Level Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mon niveau</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="learnerCategory">Catégorie d&apos;âge *</Label>
              <Select
                value={watch('learnerCategory')}
                onValueChange={(value) =>
                  setValue('learnerCategory', value as 'CHILD' | 'TEENAGER' | 'ADULT', {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="w-full sm:w-96">
                  <SelectValue placeholder="Sélectionnez votre catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {LEARNER_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.learnerCategory && (
                <p className="text-sm text-red-500">{errors.learnerCategory.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentLevel">Niveau actuel *</Label>
              <Select
                value={watch('currentLevel')}
                onValueChange={(value) => setValue('currentLevel', value, { shouldDirty: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez votre niveau" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currentLevel && (
                <p className="text-sm text-red-500">{errors.currentLevel.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes objectifs</h2>
          <div className="space-y-4">
            <Label>Objectifs d&apos;apprentissage *</Label>
            <p className="text-sm text-gray-500">
              Sélectionnez un ou plusieurs objectifs
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {LEARNING_GOALS.map((goal) => (
                <div
                  key={goal.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    watch('learningGoals')?.includes(goal.value)
                      ? 'bg-teal-50 border-teal-500'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleArrayValue('learningGoals', goal.value)}
                >
                  <Checkbox
                    checked={watch('learningGoals')?.includes(goal.value)}
                    onCheckedChange={() => toggleArrayValue('learningGoals', goal.value)}
                  />
                  <span className="text-sm">{goal.label}</span>
                </div>
              ))}
            </div>
            {errors.learningGoals && (
              <p className="text-sm text-red-500">{errors.learningGoals.message}</p>
            )}
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Préférences</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Langues préférées pour les cours *</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleArrayValue('preferredLanguages', lang.code)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      watch('preferredLanguages')?.includes(lang.code)
                        ? 'bg-teal-100 border-teal-500 text-teal-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              {errors.preferredLanguages && (
                <p className="text-sm text-red-500">{errors.preferredLanguages.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningPace">Rythme d&apos;apprentissage *</Label>
              <Select
                value={watch('learningPace')}
                onValueChange={(value) =>
                  setValue('learningPace', value as 'SLOW' | 'MODERATE' | 'FAST', {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="w-full sm:w-96">
                  <SelectValue placeholder="Sélectionnez votre rythme" />
                </SelectTrigger>
                <SelectContent>
                  {LEARNING_PACES.map((pace) => (
                    <SelectItem key={pace.value} value={pace.value}>
                      {pace.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.learningPace && (
                <p className="text-sm text-red-500">{errors.learningPace.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredSessionDuration">
                Durée de session préférée *
              </Label>
              <Select
                value={String(watch('preferredSessionDuration'))}
                onValueChange={(value) =>
                  setValue('preferredSessionDuration', Number(value), { shouldDirty: true })
                }
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Sélectionnez une durée" />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_DURATIONS.map((duration) => (
                    <SelectItem key={duration.value} value={String(duration.value)}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.preferredSessionDuration && (
                <p className="text-sm text-red-500">
                  {errors.preferredSessionDuration.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Special Needs Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Besoins spéciaux</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="hasSpecialNeeds"
                checked={hasSpecialNeeds}
                onCheckedChange={(checked) => {
                  setHasSpecialNeeds(checked as boolean);
                  if (!checked) {
                    setValue('specialNeeds', '', { shouldDirty: true });
                  }
                }}
              />
              <Label htmlFor="hasSpecialNeeds" className="cursor-pointer">
                J&apos;ai des besoins spéciaux ou des difficultés d&apos;apprentissage
              </Label>
            </div>

            {hasSpecialNeeds && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="specialNeeds">
                  Décrivez vos besoins (confidentiel)
                </Label>
                <Textarea
                  id="specialNeeds"
                  {...register('specialNeeds')}
                  placeholder="Ex: dyslexie, troubles de l'attention, handicap visuel, etc. Ces informations aideront votre mentor à adapter ses cours."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  {watch('specialNeeds')?.length || 0}/500 caractères
                </p>
                {errors.specialNeeds && (
                  <p className="text-sm text-red-500">{errors.specialNeeds.message}</p>
                )}
              </div>
            )}
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
