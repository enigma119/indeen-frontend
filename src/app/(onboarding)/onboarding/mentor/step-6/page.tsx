'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { useMentorOnboardingStore } from '@/stores/mentor-onboarding-store';
import { createMentorProfile } from '@/lib/api/mentors';
import {
  COUNTRIES,
  GENDERS,
  SPECIALTIES,
  LANGUAGES,
  LEARNING_LEVELS,
  CURRENCIES,
  SESSION_DURATIONS,
} from '@/lib/constants/onboarding';
import { FormSection, StepNavigation } from '@/components/onboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Pencil,
  User,
  GraduationCap,
  Award,
  DollarSign,
  Calendar,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { WeeklyAvailabilityDisplay } from '@/components/mentor/WeeklyAvailabilityDisplay';
import type { WeeklyAvailabilityDay } from '@/components/onboarding/WeeklyAvailability';

// Helper to get label from value
const getLabel = <T extends { value: string; label: string }>(
  items: T[],
  value: string | undefined
): string => {
  if (!value) return '-';
  return items.find((item) => item.value === value)?.label || value;
};

export default function MentorStep6Page() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, reset, setSubmitting } = useMentorOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);

  const handlePrevious = () => {
    router.push('/onboarding/mentor/step-5');
  };

  const handleEdit = (step: number) => {
    router.push(`/onboarding/mentor/step-${step}`);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Erreur: utilisateur non connecté');
      return;
    }

    // Final validation
    if (!data.avatar) {
      toast.error('La photo de profil est obligatoire');
      return;
    }

    if (!data.phone) {
      toast.error('Le numéro de téléphone est obligatoire');
      return;
    }

    if (!data.headline || !data.bio || !data.yearsExperience) {
      toast.error('Veuillez compléter toutes les sections');
      return;
    }

    if (!data.languages || data.languages.length === 0) {
      toast.error('Veuillez sélectionner au moins une langue');
      return;
    }

    if (!data.specialties || data.specialties.length === 0) {
      toast.error('Veuillez sélectionner au moins une spécialité');
      return;
    }

    if (
      !data.teachesChildren &&
      !data.teachesTeenagers &&
      !data.teachesAdults
    ) {
      toast.error('Veuillez sélectionner au moins un type d\'étudiant');
      return;
    }

    const totalSlots = (data.weeklyAvailability || []).reduce(
      (sum, day) => sum + day.slots.length,
      0
    );
    if (totalSlots === 0) {
      toast.error('Veuillez ajouter au moins un créneau de disponibilité');
      return;
    }

    setIsLoading(true);
    setSubmitting(true);

    try {
      // Create mentor profile (includes uploads)
      await createMentorProfile(data, user.id);

      toast.success('Profil soumis ! Vérification en cours...', {
        description: 'Vous recevrez un email sous 48h.',
      });

      // Clear onboarding store
      reset();

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('[MentorStep6] Error creating profile:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Une erreur est survenue lors de la création du profil';
      toast.error(message);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    const first = data.firstName?.[0] || '';
    const last = data.lastName?.[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  // Get avatar preview URL
  const getAvatarUrl = () => {
    if (data.avatar instanceof File) {
      return URL.createObjectURL(data.avatar);
    }
    return data.avatar || '';
  };

  // Calculate totals
  const totalSlots = (data.weeklyAvailability || []).reduce(
    (sum, day) => sum + day.slots.length,
    0
  );
  const daysWithSlots = (data.weeklyAvailability || []).filter(
    (day) => day.slots.length > 0
  ).length;

  return (
    <FormSection
      title="Confirmation"
      description="Vérifiez vos informations avant de soumettre votre profil"
    >
      <div className="space-y-6">
        {/* Important Message */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Votre profil sera soumis à vérification</strong>
            <br />
            Nos équipes vérifieront vos certifications et qualifications.
            <br />
            Vous recevrez un email sous 48h.
          </AlertDescription>
        </Alert>

        {/* Section 1: Personal Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-teal-600" />
              Informations personnelles
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(1)}
              className="text-gray-500 hover:text-teal-600"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">
                  {data.firstName} {data.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {getLabel(COUNTRIES, data.country)}
                </p>
                {data.phone && (
                  <p className="text-sm text-gray-500">{data.phone}</p>
                )}
                {data.gender && (
                  <p className="text-sm text-gray-500">
                    {getLabel(GENDERS, data.gender)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Qualifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-teal-600" />
              Qualifications
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(2)}
              className="text-gray-500 hover:text-teal-600"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500 mb-1">Titre accrocheur</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {data.headline || '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Années d'expérience</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {data.yearsExperience ?? 0} an{data.yearsExperience !== 1 ? 's' : ''}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Certifications</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {data.certifications?.length || 0} certification
                  {(data.certifications?.length || 0) > 1 ? 's' : ''}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Section 3: Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-teal-600" />
              Compétences
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(3)}
              className="text-gray-500 hover:text-teal-600"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500 mb-1">Langues enseignées</dt>
                <dd className="flex flex-wrap gap-2">
                  {data.languages?.map((lang) => {
                    const langData = LANGUAGES.find((l) => l.value === lang);
                    return (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {langData?.flag} {langData?.label}
                      </span>
                    );
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 mb-1">Spécialités</dt>
                <dd className="flex flex-wrap gap-2">
                  {data.specialties?.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                    >
                      {getLabel(SPECIALTIES, spec)}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 mb-1">Types d'étudiants</dt>
                <dd className="flex flex-wrap gap-2">
                  {data.teachesChildren && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Enfants
                    </span>
                  )}
                  {data.teachesTeenagers && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Adolescents
                    </span>
                  )}
                  {data.teachesAdults && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Adultes
                    </span>
                  )}
                </dd>
              </div>
              {data.acceptedLevels && data.acceptedLevels.length > 0 && (
                <div>
                  <dt className="text-sm text-gray-500 mb-1">Niveaux acceptés</dt>
                  <dd className="flex flex-wrap gap-2">
                    {data.acceptedLevels.map((level) => (
                      <span
                        key={level}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {getLabel(LEARNING_LEVELS, level)}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Section 4: Pricing */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-teal-600" />
              Tarification
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(4)}
              className="text-gray-500 hover:text-teal-600"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Mode</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {data.freeSessionsOnly ? 'Sessions gratuites uniquement' : 'Sessions payantes'}
                </dd>
              </div>
              {!data.freeSessionsOnly && data.hourlyRate && (
                <>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tarif horaire</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {data.hourlyRate} {data.currency && CURRENCIES.find((c) => c.value === data.currency)?.symbol || data.currency}/h
                    </dd>
                  </div>
                  {data.freeTrialAvailable && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Essai gratuit</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {data.freeTrialDuration} minutes
                      </dd>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Durée de session</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {data.minSessionDuration} - {data.maxSessionDuration} min
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Section 5: Availability */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              Disponibilités
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(5)}
              className="text-gray-500 hover:text-teal-600"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {totalSlots} créneau{totalSlots > 1 ? 'x' : ''} sur {daysWithSlots} jour
                {daysWithSlots > 1 ? 's' : ''}
              </p>
              <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Voir le détail
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Disponibilités hebdomadaires</DialogTitle>
                  </DialogHeader>
                  <WeeklyAvailabilityDisplay
                    availability={data.weeklyAvailability as WeeklyAvailabilityDay[]}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <StepNavigation
        onPrevious={handlePrevious}
        onNext={handleSubmit}
        isFirstStep={false}
        isLastStep={true}
        isLoading={isLoading}
        canProceed={true}
      />
    </FormSection>
  );
}
