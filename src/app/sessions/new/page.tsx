'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressStepper } from '@/components/booking/ProgressStepper';
import { StepSelectSlot } from '@/components/booking/StepSelectSlot';
import { StepDetails } from '@/components/booking/StepDetails';
import { StepConfirmation } from '@/components/booking/StepConfirmation';
import { useBookingStore } from '@/stores/booking-store';
import { useAuth } from '@/hooks/use-auth';
import { useCreateSession } from '@/hooks/use-sessions';
import { apiClient } from '@/lib/api/client';
import type { MentorProfile } from '@/types';

const STEPS = [
  { number: 1, title: 'Créneau', description: 'Choisissez une date' },
  { number: 2, title: 'Détails', description: 'Personnalisez' },
  { number: 3, title: 'Confirmation', description: 'Paiement' },
];

export default function NewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mentorIdParam = searchParams.get('mentorId');

  const { isAuthenticated, isMentee, isLoading: authLoading } = useAuth();
  const createSession = useCreateSession();

  const {
    mentorId,
    mentor,
    currentStep,
    selectedSlot,
    duration,
    lessonPlan,
    timezone,
    setMentor,
    nextStep,
    prevStep,
    reset,
    canProceedToStep2,
  } = useBookingStore();

  // Redirect if not authenticated or not a mentee
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirectTo=/sessions/new?mentorId=${mentorIdParam}`);
    }
  }, [authLoading, isAuthenticated, router, mentorIdParam]);

  // Redirect if no mentorId
  useEffect(() => {
    if (!mentorIdParam) {
      toast.error('Mentor non spécifié');
      router.push('/mentors');
    }
  }, [mentorIdParam, router]);

  // Fetch mentor data if not in store or different mentor
  useEffect(() => {
    async function fetchMentor() {
      if (!mentorIdParam) return;

      // If we already have this mentor in store, skip fetch
      if (mentorId === mentorIdParam && mentor) return;

      try {
        const mentorData = await apiClient.get<MentorProfile>(
          `/mentors/${mentorIdParam}`
        );
        setMentor(mentorIdParam, mentorData);
      } catch (error) {
        console.error('Error fetching mentor:', error);
        toast.error('Impossible de charger les informations du mentor');
        router.push('/mentors');
      }
    }

    fetchMentor();
  }, [mentorIdParam, mentorId, mentor, setMentor, router]);

  // Handle step navigation
  const handleNext = () => {
    if (currentStep === 1) {
      if (!canProceedToStep2()) {
        toast.error('Veuillez sélectionner un créneau');
        return;
      }
    }
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  // Handle booking confirmation
  const handleConfirm = async () => {
    if (!mentorId || !selectedSlot) {
      toast.error('Informations manquantes');
      return;
    }

    // Create the scheduled datetime from slot
    const scheduledAt = `${selectedSlot.date}T${selectedSlot.start_time}:00`;

    try {
      await createSession.mutateAsync({
        mentor_id: mentorId,
        scheduled_at: scheduledAt,
        duration,
        timezone,
        lesson_plan: lessonPlan || undefined,
      });

      // Reset store and redirect to success/sessions page
      reset();
      router.push('/sessions?success=true');
    } catch (error) {
      // Error is handled by the mutation
      console.error('Booking error:', error);
    }
  };

  // Loading state
  if (authLoading || !mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Access denied for non-mentees
  if (!isMentee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Accès réservé</h2>
            <p className="text-gray-600 mb-4">
              Seuls les élèves peuvent réserver des sessions.
            </p>
            <Button asChild>
              <Link href="/mentors">Retour aux mentors</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Link */}
        <Link
          href={`/mentors/${mentor.slug}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour au profil
        </Link>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Réserver une session
        </h1>
        <p className="text-gray-600 mb-8">
          avec{' '}
          <span className="font-medium">
            {mentor.user?.first_name} {mentor.user?.last_name}
          </span>
        </p>

        {/* Progress Stepper */}
        <div className="mb-8">
          <ProgressStepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {currentStep === 1 && <StepSelectSlot />}
            {currentStep === 2 && <StepDetails />}
            {currentStep === 3 && <StepConfirmation />}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} className="gap-2">
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={createSession.isPending}
              className="gap-2 bg-teal-600 hover:bg-teal-700"
            >
              {createSession.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Confirmer et payer'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
