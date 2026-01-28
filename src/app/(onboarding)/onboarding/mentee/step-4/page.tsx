'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { useMenteeOnboardingStore } from '@/stores/mentee-onboarding-store';
import { createMenteeProfile } from '@/lib/api/mentees';
import {
  COUNTRIES,
  GENDERS,
  LEARNER_CATEGORIES,
  LEARNING_LEVELS,
  LEARNING_CONTEXTS,
  LEARNING_GOALS,
  LANGUAGES,
  LEARNING_PACES,
  SESSION_DURATIONS,
} from '@/lib/constants/onboarding';
import { FormSection, StepNavigation } from '@/components/onboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, User, BookOpen, Target, CheckCircle } from 'lucide-react';

// Helper to get label from value
const getLabel = <T extends { value: string; label: string }>(
  items: T[],
  value: string | undefined
): string => {
  if (!value) return '-';
  return items.find((item) => item.value === value)?.label || value;
};

export default function MenteeStep4Page() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { data, reset, setSubmitting } = useMenteeOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrevious = () => {
    router.push('/onboarding/mentee/step-3');
  };

  const handleEdit = (step: number) => {
    router.push(`/onboarding/mentee/step-${step}`);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Erreur: utilisateur non connecté');
      return;
    }

    setIsLoading(true);
    setSubmitting(true);

    try {
      // Create mentee profile
      await createMenteeProfile(data, user.id);

      // Update user with new avatar if uploaded
      if (data.avatar) {
        // Refresh user profile would be handled by the auth hook
      }

      toast.success('Profil créé avec succès !');

      // Clear onboarding store
      reset();

      // Redirect to mentors page
      router.push('/mentors');
    } catch (error: any) {
      console.error('[MenteeStep4] Error creating profile:', error);
      const message = error?.response?.data?.message || 'Une erreur est survenue';
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

  return (
    <FormSection
      title="Confirmation"
      description="Vérifiez vos informations avant de finaliser"
    >
      <div className="space-y-6">
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

        {/* Section 2: Learner Profile */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal-600" />
              Profil d'apprenant
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
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Catégorie</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {getLabel(LEARNER_CATEGORIES, data.learnerCategory)}
                </dd>
              </div>
              {data.yearOfBirth && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Année de naissance</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {data.yearOfBirth}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Niveau actuel</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {getLabel(LEARNING_LEVELS, data.currentLevel)}
                </dd>
              </div>
              {data.learningContext && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Contexte</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {getLabel(LEARNING_CONTEXTS, data.learningContext)}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Section 3: Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-teal-600" />
              Objectifs et préférences
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
                <dt className="text-sm text-gray-500 mb-1">Objectifs</dt>
                <dd className="flex flex-wrap gap-2">
                  {data.learningGoals?.map((goal) => (
                    <span
                      key={goal}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                    >
                      {getLabel(LEARNING_GOALS, goal)}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 mb-1">Langues</dt>
                <dd className="flex flex-wrap gap-2">
                  {data.preferredLanguages?.map((lang) => {
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
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Rythme</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {getLabel(LEARNING_PACES, data.learningPace)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Durée de session</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {SESSION_DURATIONS.find(
                    (d) => d.value === data.preferredSessionDuration
                  )?.label || '-'}
                </dd>
              </div>
              {data.hasSpecialNeeds && data.specialNeedsDescription && (
                <div>
                  <dt className="text-sm text-gray-500 mb-1">Besoins spéciaux</dt>
                  <dd className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {data.specialNeedsDescription}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Success message preview */}
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg text-green-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Votre profil est prêt ! Cliquez sur "Terminer" pour commencer à
            rechercher un mentor.
          </p>
        </div>
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
