'use client';

import { useBookingStore, formatPrice, calculatePrice } from '@/stores/booking-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Globe,
  FileText,
  CreditCard,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export function StepConfirmation() {
  const { mentor, selectedSlot, duration, lessonPlan, timezone } = useBookingStore();

  if (!mentor || !selectedSlot) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Informations manquantes</p>
      </div>
    );
  }

  const price = calculatePrice(mentor.hourly_rate, duration);
  const mentorName = mentor.user
    ? `${mentor.user.first_name} ${mentor.user.last_name}`
    : 'Mentor';
  const initials = mentor.user
    ? `${mentor.user.first_name[0]}${mentor.user.last_name[0]}`
    : 'M';

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
          Vérifiez les détails avant de procéder au paiement
        </p>
      </div>

      {/* Session Details Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Détails de la session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mentor Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={mentor.user?.avatar_url} alt={mentorName} />
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
                <p className="font-medium">
                  {new Date(selectedSlot.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Heure</p>
                <p className="font-medium">
                  {selectedSlot.start_time} - {selectedSlot.end_time}
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

      {/* Price Summary */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-teal-600" />
            Résumé du paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Session {duration} min avec {mentorName}
              </span>
              <span className="font-medium">
                {formatPrice(price, mentor.currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Frais de service</span>
              <span>Inclus</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-teal-600">
                {formatPrice(price, mentor.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge variant="outline" className="gap-1.5 py-1.5">
          <Shield className="h-3.5 w-3.5" />
          Paiement sécurisé
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Annulation gratuite 24h avant
        </Badge>
      </div>

      {/* Payment Note */}
      <p className="text-sm text-center text-gray-500">
        En cliquant sur "Confirmer et payer", vous acceptez nos conditions
        générales d'utilisation et notre politique de confidentialité.
      </p>
    </div>
  );
}
