'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

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
  direction = 'left',
}: StepCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-center gap-6 md:gap-8',
        direction === 'right' && 'md:flex-row-reverse'
      )}
    >
      {/* Number badge */}
      <div className="flex-shrink-0 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
        {number}
      </div>

      {/* Content */}
      <Card className="flex-1 p-6 border-l-4 border-l-primary-500 md:border-l-0 hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-500 flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {title}
            </h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
