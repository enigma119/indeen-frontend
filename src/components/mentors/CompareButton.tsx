'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useComparisonStore } from '@/stores/comparison-store';
import type { MentorProfile } from '@/types';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  mentor: MentorProfile;
  className?: string;
}

export function CompareButton({ mentor, className }: CompareButtonProps) {
  const { isInComparison, toggleMentor, mentors } = useComparisonStore();

  const isSelected = isInComparison(mentor.id);
  const isMaxReached = mentors.length >= 3 && !isSelected;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isMaxReached) {
      toggleMentor(mentor);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 cursor-pointer select-none',
        isMaxReached && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleToggle}
    >
      <Checkbox
        checked={isSelected}
        disabled={isMaxReached}
        className={cn(
          'data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600'
        )}
      />
      <span
        className={cn(
          'text-sm',
          isSelected ? 'text-teal-700 font-medium' : 'text-gray-600'
        )}
      >
        Comparer
      </span>
    </div>
  );
}
