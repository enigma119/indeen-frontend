'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';
import { MentorFilters } from './MentorFilters';
import { useSearchStore } from '@/stores/search-filters-store';

export function MobileFiltersSheet() {
  const [open, setOpen] = useState(false);
  const { resetFilters, getActiveFiltersCount } = useSearchStore();
  const activeFiltersCount = getActiveFiltersCount();

  const handleApply = () => {
    setOpen(false);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden gap-2 relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-teal-600 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle>Filtres</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto py-4">
          <MentorFilters />
        </div>

        {/* Footer */}
        <SheetFooter className="flex-shrink-0 border-t pt-4 gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            Appliquer
            {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
