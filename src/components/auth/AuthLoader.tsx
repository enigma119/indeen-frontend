'use client';

import { BookOpen } from 'lucide-react';

interface AuthLoaderProps {
  message?: string;
}

/**
 * Full-screen loading component for auth initialization
 * Displays a pulsing logo and loading message
 */
export function AuthLoader({ message = 'Chargement...' }: AuthLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing logo */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-xl bg-teal-500/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-teal-500 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* App name */}
        <h1 className="text-2xl font-bold text-gray-900">Indeen</h1>

        {/* Loading indicator */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
          </div>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
}
