'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Calendar, ArrowRight, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useConfirmPayment } from '@/hooks/use-sessions';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get('session_id');

  const [countdown, setCountdown] = useState(5);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const confirmPayment = useConfirmPayment();

  // Confirm payment on mount
  useEffect(() => {
    if (!stripeSessionId) {
      router.push('/sessions');
      return;
    }

    // Confirm the payment with the backend
    confirmPayment.mutate(stripeSessionId, {
      onSuccess: (session) => {
        setSessionId(session.id);
      },
      onError: () => {
        // Even on error, we might have a pending booking in sessionStorage
        const pendingBooking = sessionStorage.getItem('pendingBooking');
        if (pendingBooking) {
          try {
            const { sessionId } = JSON.parse(pendingBooking);
            setSessionId(sessionId);
          } catch {
            // Ignore parse errors
          }
        }
      },
    });
  }, [stripeSessionId]);

  // Countdown and redirect
  useEffect(() => {
    if (!sessionId) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/sessions/${sessionId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, router]);

  // Loading state while confirming
  if (confirmPayment.isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Confirmation en cours...</h2>
            <p className="text-gray-600">
              Nous vérifions votre paiement, veuillez patienter.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Votre session a été réservée avec succès.
            <br />
            Le mentor confirmera votre demande sous 24h.
          </p>

          {/* Info Cards */}
          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Email de confirmation</p>
                <p className="text-blue-700">
                  Vous recevrez un email avec tous les détails de votre réservation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
              <Calendar className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-teal-800">Lien de visioconférence</p>
                <p className="text-teal-700">
                  Le lien sera envoyé 15 minutes avant la session.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-teal-600 hover:bg-teal-700 gap-2"
            >
              <Link href={sessionId ? `/sessions/${sessionId}` : '/sessions'}>
                Voir ma session
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/sessions">Voir toutes mes sessions</Link>
            </Button>
          </div>

          {/* Redirect countdown */}
          {sessionId && countdown > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              Redirection automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
