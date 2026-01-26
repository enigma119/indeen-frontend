'use client';

import { cn } from '@/lib/utils';

interface StepCardProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  direction?: 'left' | 'right';
}

export function StepCard({
  number,
  icon,
  title,
  description,
}: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Number badge with icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {number}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 text-navy-800">{title}</h3>
      <p className="text-navy-600/70 text-sm leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}
