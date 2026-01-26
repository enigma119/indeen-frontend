import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold">MI</span>
      </div>
      <span className="font-bold text-lg hidden sm:block">
        Mentorat Islamique
      </span>
    </Link>
  );
}
