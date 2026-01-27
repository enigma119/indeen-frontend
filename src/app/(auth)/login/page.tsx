'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createBrowserClient } from '@/lib/supabase/client';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { apiClient } from '@/lib/api/client';
import type { User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const remember = watch('remember');

  /**
   * Get redirect URL based on user role
   */
  const getRedirectUrl = (user: User): string => {
    // If there's a specific redirect URL, use it
    if (redirectTo) {
      return redirectTo;
    }

    // Otherwise, redirect based on role
    switch (user.role) {
      case 'MENTOR':
        return '/dashboard';
      case 'MENTEE':
        return '/mentors';
      case 'ADMIN':
        return '/admin';
      default:
        return '/dashboard';
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createBrowserClient();
      if (!supabase) {
        setError('Service d\'authentification non configuré');
        return;
      }

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(getAuthErrorMessage(signInError));
        return;
      }

      // Fetch user profile to get role for redirect
      let userProfile: User | null = null;
      if (authData.user) {
        try {
          userProfile = await apiClient.get<User>(`/users/${authData.user.id}`);
        } catch {
          // Continue even if profile fetch fails
          console.error('[Login] Error fetching user profile');
        }
      }

      // Show success toast
      toast.success('Bienvenue !', {
        description: 'Vous êtes maintenant connecté.',
      });

      // Redirect based on role or specified URL
      const redirectUrl = userProfile ? getRedirectUrl(userProfile) : (redirectTo || '/dashboard');
      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      console.error('[Login] Error:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
      <p className="text-gray-600 mb-6">
        Connectez-vous à votre compte Indeen
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            disabled={isLoading}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setValue('remember', checked === true)}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Se souvenir de moi
            </Label>
          </div>
          <Link
            href="/reset-password"
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion...
            </>
          ) : (
            'Se connecter'
          )}
        </Button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Pas encore de compte ?{' '}
        <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
