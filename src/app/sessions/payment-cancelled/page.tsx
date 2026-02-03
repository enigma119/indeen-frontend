'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PendingBooking {
  mentorId?: string;
  sessionId?: string;
  timestamp?: number;
}

export default function PaymentCancelledPage() {
  const router = useRouter();
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);

  // Retrieve pending booking from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('pendingBooking');
      if (stored) {
        try {
          setPendingBooking(JSON.parse(stored));
        } catch {
          // Ignore parse errors
        }
      }

      // Also check booking-store for mentor info
      const bookingStore = sessionStorage.getItem('booking-store');
      if (bookingStore) {
        try {
          const parsed = JSON.parse(bookingStore);
          if (parsed.state?.mentorId) {
            setPendingBooking((prev) => ({
              ...prev,
              mentorId: parsed.state.mentorId,
            }));
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);

  const handleRetry = () => {
    if (pendingBooking?.mentorId) {
      // Return to the booking page with the mentor pre-selected
      router.push(`/sessions/new?mentorId=${pendingBooking.mentorId}`);
    } else {
      // Fallback to mentors list
      router.push('/mentors');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* Cancel Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement annulé
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Votre paiement a été annulé.
            <br />
            Aucun montant n'a été débité de votre compte.
          </p>

          {/* Info Box */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-gray-600">
              Si vous avez rencontré un problème lors du paiement, vous pouvez réessayer
              ou contacter notre support à{' '}
              <a
                href="mailto:support@indeen.com"
                className="text-teal-600 hover:underline"
              >
                support@indeen.com
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-teal-600 hover:bg-teal-700 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>

            <Button variant="outline" asChild className="w-full gap-2">
              <Link href="/mentors">
                <ArrowLeft className="h-4 w-4" />
                Choisir un autre mentor
              </Link>
            </Button>

            <Button variant="ghost" asChild className="w-full gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
