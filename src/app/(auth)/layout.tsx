import { Logo } from '@/components/layout/Logo';
import { BookOpen, Users, Star, Calendar } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-teal-500 to-blue-600 px-12 py-12 text-white">
        <div className="max-w-md">
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Apprenez le Coran avec les meilleurs mentors
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Rejoignez notre communauté et bénéficiez d&apos;un accompagnement personnalisé
            pour progresser dans votre apprentissage du Coran, du Tajweed et de l&apos;arabe.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/70">Mentors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-sm text-white/70">Sessions</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm text-white/70">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
