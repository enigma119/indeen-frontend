'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useSearchStore } from '@/stores/search-filters-store';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page?: number;
  totalPages?: number;
  total?: number;
}

export function Pagination({ page = 1, totalPages = 1, total }: PaginationProps) {
  const { setPage } = useSearchStore();

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage]
  );

  // Don't show pagination if only 1 page
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('ellipsis');
      }

      // Pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
      {/* Info */}
      <p className="text-sm text-gray-600 order-2 sm:order-1">
        Page <span className="font-medium">{page}</span> sur{' '}
        <span className="font-medium">{totalPages}</span>
        {total !== undefined && (
          <span className="text-gray-400">
            {' '}
            • {total} résultat{total !== 1 ? 's' : ''}
          </span>
        )}
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Précédent</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  'min-w-[36px]',
                  page === pageNum && 'bg-teal-600 hover:bg-teal-700'
                )}
              >
                {pageNum}
              </Button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="gap-1"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
