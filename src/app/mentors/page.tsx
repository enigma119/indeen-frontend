'use client';

import { useEffect } from 'react';
import { useSearchStore } from '@/stores/search-filters-store';
import { useSearchMentors } from '@/hooks/use-mentors';
import { useSearchParamsSync } from '@/hooks/use-search-params-sync';
import {
  MentorFilters,
  SearchHeader,
  SortSelect,
  MentorGrid,
  Pagination,
  LoadingGrid,
  MobileFiltersSheet,
} from '@/components/search';

export default function MentorsPage() {
  // Sync URL params with store
  useSearchParamsSync();

  const { filters, sort, page } = useSearchStore();
  const { data, isLoading, error } = useSearchMentors(filters, sort, page);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <SearchHeader total={data?.total} />

          {/* Mobile: Filters + Sort */}
          <div className="flex items-center gap-3 lg:hidden">
            <MobileFiltersSheet />
            <SortSelect />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-8">
              <MentorFilters />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-end mb-6">
              <SortSelect />
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">
                  Une erreur est survenue lors du chargement des mentors.
                  Veuillez réessayer.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && <LoadingGrid count={12} />}

            {/* Results */}
            {!isLoading && !error && (
              <>
                <MentorGrid mentors={data?.mentors} />
                <Pagination
                  page={data?.page}
                  totalPages={data?.totalPages}
                  total={data?.total}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
