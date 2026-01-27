'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calculator, TrendingUp } from 'lucide-react';

const PLATFORM_COMMISSION = 0.15; // 15%
const SESSIONS_PER_WEEK_ESTIMATE = 10;
const WEEKS_PER_MONTH = 4.33;

interface PricingEstimatorProps {
  hourlyRate?: number;
  currency?: string;
  sessionsPerWeek?: number;
}

export function PricingEstimator({
  hourlyRate,
  currency = 'EUR',
  sessionsPerWeek = SESSIONS_PER_WEEK_ESTIMATE,
}: PricingEstimatorProps) {
  if (!hourlyRate || hourlyRate <= 0) {
    return null;
  }

  const currencySymbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    MAD: 'DH',
    TND: 'DT',
    DZD: 'DA',
  };

  const symbol = currencySymbols[currency] || currency;

  // Calculate estimates
  const weeklyRevenue = hourlyRate * sessionsPerWeek;
  const monthlyRevenue = weeklyRevenue * WEEKS_PER_MONTH;
  const platformFee = monthlyRevenue * PLATFORM_COMMISSION;
  const netRevenue = monthlyRevenue - platformFee;

  return (
    <Card className="border-teal-200 bg-teal-50">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="h-5 w-5 text-teal-600" />
          <h4 className="font-medium text-teal-900">Estimation de revenus</h4>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              À {hourlyRate}
              {symbol}/h pour {sessionsPerWeek} sessions/semaine
            </span>
          </div>

          <div className="pt-2 border-t border-teal-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Revenu mensuel estimé :</span>
              <span className="font-semibold text-gray-900">
                {monthlyRevenue.toFixed(0)}
                {symbol}
              </span>
            </div>

            <div className="flex justify-between items-center mb-2 text-gray-500">
              <span className="text-xs">Commission plateforme (15%) :</span>
              <span className="text-xs">
                -{platformFee.toFixed(0)}
                {symbol}
              </span>
            </div>

            <div className="pt-2 border-t border-teal-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-teal-900">Votre revenu net :</span>
                <span className="font-bold text-teal-600 text-lg">
                  {netRevenue.toFixed(0)}
                  {symbol}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-600">
              Estimation basée sur {sessionsPerWeek} sessions par semaine. Les revenus réels
              dépendent de votre disponibilité et du nombre d'étudiants.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
