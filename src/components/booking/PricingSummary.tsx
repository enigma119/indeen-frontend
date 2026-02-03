'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Receipt, Gift, Info } from 'lucide-react';
import { formatPrice } from '@/stores/booking-store';
import type { SessionDuration } from '@/types';

const PLATFORM_FEE_RATE = 0.15; // 15%

interface PricingSummaryProps {
  hourlyRate: number;
  currency: string;
  duration: SessionDuration;
  isFreeTrialApplied?: boolean;
  compact?: boolean;
}

interface PriceBreakdown {
  sessionPrice: number;
  platformFee: number;
  total: number;
}

export function calculatePriceBreakdown(
  hourlyRate: number,
  duration: SessionDuration,
  isFreeTrialApplied: boolean = false
): PriceBreakdown {
  const sessionPrice = (hourlyRate / 60) * duration;
  const platformFee = sessionPrice * PLATFORM_FEE_RATE;
  const total = isFreeTrialApplied ? 0 : sessionPrice + platformFee;

  return {
    sessionPrice,
    platformFee,
    total,
  };
}

export function PricingSummary({
  hourlyRate,
  currency,
  duration,
  isFreeTrialApplied = false,
  compact = false,
}: PricingSummaryProps) {
  const { sessionPrice, platformFee, total } = calculatePriceBreakdown(
    hourlyRate,
    duration,
    isFreeTrialApplied
  );

  if (compact) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Session ({duration} min)</span>
          <span>{formatPrice(sessionPrice, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frais de service (15%)</span>
          <span>{formatPrice(platformFee, currency)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          {isFreeTrialApplied ? (
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">
                {formatPrice(sessionPrice + platformFee, currency)}
              </span>
              <Badge variant="default" className="bg-green-600">
                GRATUIT
              </Badge>
            </div>
          ) : (
            <span className="text-teal-600">{formatPrice(total, currency)}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="h-5 w-5 text-teal-600" />
          Récapitulatif des frais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFreeTrialApplied && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-700">
              <Gift className="h-5 w-5" />
              <span className="font-medium">Première session gratuite !</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Profitez de votre session découverte offerte avec ce mentor.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {/* Session Price */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Prix de la session</p>
              <p className="text-sm text-gray-500">{duration} minutes</p>
            </div>
            <span className="font-medium">
              {formatPrice(sessionPrice, currency)}
            </span>
          </div>

          {/* Platform Fee */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Frais de service</p>
              <p className="text-sm text-gray-500">15% du prix de la session</p>
            </div>
            <span className="font-medium">
              {formatPrice(platformFee, currency)}
            </span>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center pt-2">
            <div>
              <p className="text-lg font-semibold">Total à payer</p>
            </div>
            {isFreeTrialApplied ? (
              <div className="flex items-center gap-3">
                <span className="line-through text-gray-400 text-lg">
                  {formatPrice(sessionPrice + platformFee, currency)}
                </span>
                <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                  GRATUIT
                </Badge>
              </div>
            ) : (
              <span className="text-2xl font-bold text-teal-600">
                {formatPrice(total, currency)}
              </span>
            )}
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 pt-4 text-sm text-gray-500">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Le paiement est sécurisé par Stripe. Vous ne serez débité qu'après
            confirmation du mentor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
