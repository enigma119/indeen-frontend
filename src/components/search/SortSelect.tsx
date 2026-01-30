'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchStore } from '@/stores/search-filters-store';
import { SORT_OPTIONS } from '@/lib/constants/search';
import type { SortBy } from '@/types';

export function SortSelect() {
  const { sort, setSort } = useSearchStore();

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm text-gray-600 whitespace-nowrap">Trier par :</span>
      <Select value={sort} onValueChange={(value) => setSort(value as SortBy)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
