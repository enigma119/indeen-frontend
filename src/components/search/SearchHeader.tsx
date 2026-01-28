'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '@/stores/search-filters-store';
import { useDebouncedCallback } from '@/hooks/use-debounce';

interface SearchHeaderProps {
  total?: number;
}

export function SearchHeader({ total }: SearchHeaderProps) {
  const { filters, setFilter, removeFilter } = useSearchStore();
  const [searchValue, setSearchValue] = useState(filters.query || '');

  // Debounced search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.trim()) {
      setFilter('query', value.trim());
    } else {
      removeFilter('query');
    }
  }, 300);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    removeFilter('query');
  }, [removeFilter]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchValue.trim()) {
        setFilter('query', searchValue.trim());
      }
    },
    [searchValue, setFilter]
  );

  return (
    <div className="space-y-4 mb-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Trouver votre mentor idéal
        </h1>
        <p className="text-gray-600 mt-1">
          {total !== undefined ? (
            <>
              <span className="font-semibold text-teal-600">{total}</span> mentor
              {total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}
            </>
          ) : (
            'Chargement...'
          )}
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un mentor par nom ou mot-clé..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
