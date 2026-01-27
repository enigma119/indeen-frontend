'use client';

import { Logo } from '@/components/layout/Logo';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Logo */}
      <div className="fixed top-0 left-0 p-6 z-10">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      </div>
    </div>
  );
}
