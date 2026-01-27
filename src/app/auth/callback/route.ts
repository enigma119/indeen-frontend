import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('[Auth Callback] Error exchanging code:', error);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }
    } catch (err) {
      console.error('[Auth Callback] Error:', err);
      return NextResponse.redirect(
        new URL('/login?error=Une erreur est survenue', requestUrl.origin)
      );
    }
  }

  // Redirect to the specified URL or dashboard
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
