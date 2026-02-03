'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Gift,
  Clock,
  MessageCircle,
  Calendar,
  Shield,
  CreditCard,
  Headphones,
  Check,
} from 'lucide-react';
import type { MentorProfile } from '@/types';

interface BookingCardProps {
  mentor: MentorProfile;
}

const formatCurrency = (amount: number, currency: string) => {
  const symbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    MAD: 'DH',
    XOF: 'CFA',
  };
  return `${amount}${symbols[currency] || currency}`;
};

const formatResponseTime = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes < 60) return `< ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `< ${hours}h`;
};

export function BookingCard({ mentor }: BookingCardProps) {
  const router = useRouter();

  const handleBookSession = () => {
    router.push(`/sessions/new?mentorId=${mentor.id}`);
  };

  const responseTime = formatResponseTime(mentor.averageResponseTime);

  const guarantees = [
    { icon: CreditCard, label: 'Paiement sécurisé' },
    { icon: Shield, label: 'Annulation gratuite (24h)' },
    { icon: Headphones, label: 'Support client' },
  ];

  return (
    <Card className="border-2 border-teal-100 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Price */}
        <div>
          <p className="text-sm text-gray-500 mb-1">À partir de</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(mentor.hourlyRate, mentor.currency)}
            </span>
            <span className="text-gray-500">/heure</span>
          </div>
        </div>

        {/* Free Trial Badge */}
        {mentor.freeTrialAvailable && (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 w-full justify-center py-2">
            <Gift className="h-4 w-4 mr-2" />
            Essai gratuit 30 min
          </Badge>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleBookSession}
          className="w-full bg-teal-600 hover:bg-teal-700 text-lg h-12"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Réserver une session
        </Button>

        {/* Info */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Durée des sessions : 30-120 min</span>
          </div>
          {responseTime && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              <span>Réponse moyenne : {responseTime}</span>
            </div>
          )}
        </div>

        {/* Guarantees */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium text-gray-900 mb-3">Garanties</p>
          <div className="space-y-2">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.label}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Check className="h-4 w-4 text-green-600" />
                <span>{guarantee.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
