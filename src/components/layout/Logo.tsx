import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center',
          isDark ? 'bg-teal-500' : 'bg-white/20'
        )}
      >
        <BookOpen
          className={cn('w-5 h-5', isDark ? 'text-white' : 'text-white')}
        />
      </div>
      <span
        className={cn(
          'font-bold text-xl tracking-tight',
          isDark ? 'text-navy-800' : 'text-white'
        )}
      >
        Indeen
      </span>
    </Link>
  );
}
