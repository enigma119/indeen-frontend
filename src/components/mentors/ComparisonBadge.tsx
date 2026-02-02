'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scale, X } from 'lucide-react';
import { useComparisonStore } from '@/stores/comparison-store';
import { cn } from '@/lib/utils';

export function ComparisonBadge() {
  const { mentors, openModal, removeMentor, clearAll } = useComparisonStore();

  // Don't render if no mentors selected
  if (mentors.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300 animate-in slide-in-from-bottom-4',
        // Desktop: bottom-right
        'bottom-6 right-6',
        // Mobile: bottom-center
        'max-sm:left-4 max-sm:right-4 max-sm:bottom-4'
      )}
    >
      <div className="bg-white rounded-xl shadow-xl border p-4">
        <div className="flex items-center gap-4">
          {/* Mentor avatars */}
          <div className="flex items-center -space-x-2">
            {mentors.map((mentor) => {
              const initials = mentor.user
                ? `${mentor.user.first_name[0]}${mentor.user.last_name[0]}`
                : 'M';
              return (
                <div key={mentor.id} className="relative group">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage
                      src={mentor.user?.avatar_url}
                      alt={mentor.user?.first_name}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Remove button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMentor(mentor.id);
                    }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Count */}
          <div className="text-sm">
            <span className="font-semibold text-gray-900">
              {mentors.length}
            </span>
            <span className="text-gray-500 ml-1">
              mentor{mentors.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-gray-500"
            >
              Effacer
            </Button>
            <Button
              onClick={openModal}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 gap-2"
              disabled={mentors.length < 2}
            >
              <Scale className="h-4 w-4" />
              Comparer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
