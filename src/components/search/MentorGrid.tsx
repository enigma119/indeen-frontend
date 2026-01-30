'use client';

import { MentorCard } from '@/components/mentors/MentorCard';
import { Button } from '@/components/ui/button';
import { SearchX, RotateCcw } from 'lucide-react';
import { useSearchStore } from '@/stores/search-filters-store';
import type { MentorProfile } from '@/types';

interface MentorGridProps {
  mentors?: MentorProfile[];
}

export function MentorGrid({ mentors }: MentorGridProps) {
  const { resetFilters, hasActiveFilters } = useSearchStore();

  // Empty state
  if (!mentors || mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <SearchX className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun mentor trouvé
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          Nous n'avons trouvé aucun mentor correspondant à vos critères. Essayez de
          modifier vos filtres pour élargir votre recherche.
        </p>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            onClick={resetFilters}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  );
}
