'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createBrowserClient } from '@/lib/supabase/client';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already verified
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient();
      if (!supabase) {
        setIsCheckingAuth(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email_confirmed_at) {
        // Email is already verified, redirect to dashboard
        router.push('/dashboard');
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handleResendEmail = async () => {
    if (!email) {
      setError('Adresse email non trouvée. Veuillez vous réinscrire.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setResendSuccess(false);

    try {
      const supabase = createBrowserClient();
      if (!supabase) {
        setError('Service d\'authentification non configuré');
        return;
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (resendError) {
        if (resendError.message.includes('rate limit')) {
          setError('Trop de tentatives. Veuillez attendre quelques minutes.');
        } else {
          setError(resendError.message);
        }
        return;
      }

      setResendSuccess(true);
    } catch (err) {
      console.error('[VerifyEmail] Error:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
        <Mail className="h-8 w-8 text-teal-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Vérifiez votre email
      </h1>

      <p className="text-gray-600 mb-6">
        Nous avons envoyé un email de vérification à{' '}
        {email ? (
          <span className="font-medium text-gray-900">{email}</span>
        ) : (
          'votre adresse email'
        )}
        . Cliquez sur le lien dans l&apos;email pour activer votre compte.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4 text-left">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {resendSuccess && (
        <Alert className="mb-4 border-green-200 bg-green-50 text-left">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Email renvoyé avec succès. Vérifiez votre boîte de réception.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleResendEmail}
          disabled={isLoading || !email}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Renvoyer l\'email de vérification'
          )}
        </Button>

        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">Déjà vérifié ? Se connecter</Link>
        </Button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou{' '}
        <button
          onClick={handleResendEmail}
          disabled={isLoading || !email}
          className="text-teal-600 hover:text-teal-700 underline disabled:opacity-50"
        >
          cliquez ici pour renvoyer
        </button>
        .
      </p>
    </div>
  );
}
