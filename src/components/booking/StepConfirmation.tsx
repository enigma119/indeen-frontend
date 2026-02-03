'use client';

import { useState } from 'react';
import { useBookingStore } from '@/stores/booking-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Calendar,
  Clock,
  Globe,
  FileText,
  Shield,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  CreditCard,
  Gift,
  Lock,
} from 'lucide-react';
import { PricingSummary } from './PricingSummary';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StepConfirmationProps {
  onConfirm?: () => void;
  isPending?: boolean;
  isFreeTrial?: boolean;
}

export function StepConfirmation({
  onConfirm,
  isPending = false,
  isFreeTrial: externalIsFreeTrial,
}: StepConfirmationProps) {
  const { mentor, selectedSlot, duration, lessonPlan, timezone } =
    useBookingStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [cancellationPolicyOpen, setCancellationPolicyOpen] = useState(false);

  if (!mentor || !selectedSlot) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Informations manquantes</p>
      </div>
    );
  }

  // Check if free trial applies (mentor offers it)
  // In production, also check if this is the user's first session with this mentor
  const isFreeTrial = externalIsFreeTrial ?? mentor.free_trial_available;

  const mentorName = mentor.user
    ? `${mentor.user.firstName} ${mentor.user.lastName}`
    : 'Mentor';
  const initials = mentor.user
    ? `${mentor.user.firstName[0]}${mentor.user.lastName[0]}`
    : 'M';

  const sessionDate = new Date(selectedSlot.date);
  const formattedDate = format(sessionDate, "EEEE d MMMM yyyy", { locale: fr });

  // Calculate end time
  const [startHour, startMin] = selectedSlot.start_time.split(':').map(Number);
  const endDate = new Date(sessionDate);
  endDate.setHours(startHour, startMin + duration);
  const endTime = format(endDate, 'HH:mm');

  const canConfirm = termsAccepted && !isPending;

  return (
    <div className="space-y-6">
      {/* Confirmation Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
          <CheckCircle2 className="h-8 w-8 text-teal-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Confirmez votre réservation
        </h2>
        <p className="text-gray-500 mt-1">
          Vérifiez les détails avant de procéder
          {isFreeTrial ? '' : ' au paiement'}
        </p>
      </div>

      {/* Free Trial Banner */}
      {isFreeTrial && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Gift className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">
                Première session gratuite !
              </h3>
              <p className="text-sm text-green-700">
                Profitez de cette session découverte offerte par {mentorName}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Détails de la réservation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mentor Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={mentor.user?.avatarUrl} alt={mentorName} />
              <AvatarFallback className="bg-teal-100 text-teal-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{mentorName}</h3>
              <p className="text-sm text-gray-500">{mentor.headline}</p>
              {mentor.average_rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">
                    {mentor.average_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({mentor.total_reviews} avis)
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium capitalize">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Horaire</p>
                <p className="font-medium">
                  {selectedSlot.start_time} - {endTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Fuseau horaire</p>
                <p className="font-medium">{timezone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Durée</p>
                <p className="font-medium">{duration} minutes</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              En attente de confirmation
            </Badge>
          </div>

          {lessonPlan && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Plan de session</p>
                  <p className="text-sm mt-1">{lessonPlan}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <PricingSummary
        hourlyRate={mentor.hourly_rate}
        currency={mentor.currency}
        duration={duration}
        isFreeTrialApplied={isFreeTrial}
      />

      {/* Cancellation Policy */}
      <Card>
        <Collapsible
          open={cancellationPolicyOpen}
          onOpenChange={setCancellationPolicyOpen}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Conditions d'annulation
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    cancellationPolicyOpen ? 'rotate-180' : ''
                  }`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800">
                      Annulation &gt; 24h avant la session
                    </p>
                    <p className="text-green-700">Remboursement intégral</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Annulation entre 2h et 24h avant
                    </p>
                    <p className="text-amber-700">Remboursement de 50%</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">
                      Annulation &lt; 2h avant la session
                    </p>
                    <p className="text-red-700">Pas de remboursement</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">
                      Absence du mentor (no-show)
                    </p>
                    <p className="text-blue-700">
                      Remboursement intégral + compensation de 10%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Terms Acceptance */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          className="mt-0.5"
        />
        <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
          J'ai lu et j'accepte les{' '}
          <a href="/terms" className="text-teal-600 hover:underline">
            conditions d'annulation
          </a>{' '}
          et les{' '}
          <a href="/privacy" className="text-teal-600 hover:underline">
            conditions générales d'utilisation
          </a>
          .
        </label>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge variant="outline" className="gap-1.5 py-1.5">
          <Lock className="h-3.5 w-3.5" />
          Paiement sécurisé par Stripe
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5">
          <Shield className="h-3.5 w-3.5" />
          Protection acheteur
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Annulation gratuite 24h
        </Badge>
      </div>

      {/* Action Button (shown only when onConfirm is provided) */}
      {onConfirm && (
        <div className="pt-4">
          <Button
            onClick={onConfirm}
            disabled={!canConfirm}
            className="w-full h-12 text-base gap-2 bg-teal-600 hover:bg-teal-700"
          >
            {isPending ? (
              <>
                <span className="animate-spin">◌</span>
                Traitement en cours...
              </>
            ) : isFreeTrial ? (
              <>
                <Gift className="h-5 w-5" />
                Confirmer la réservation gratuite
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Procéder au paiement
              </>
            )}
          </Button>
          {!termsAccepted && (
            <p className="text-sm text-center text-gray-500 mt-2">
              Veuillez accepter les conditions pour continuer
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Export a hook to check if user can confirm
export function useCanConfirm() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  return { termsAccepted, setTermsAccepted, canConfirm: termsAccepted };
}
