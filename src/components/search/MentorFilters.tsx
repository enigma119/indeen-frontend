'use client';

import { useCallback } from 'react';
import { useSearchStore } from '@/stores/search-filters-store';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Star, RotateCcw, Baby, GraduationCap, User } from 'lucide-react';
import {
  SEARCH_LANGUAGES,
  SEARCH_SPECIALTIES,
  SPECIAL_FEATURES,
  RATING_OPTIONS,
} from '@/lib/constants/search';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/use-debounce';

interface MentorFiltersProps {
  className?: string;
}

export function MentorFilters({ className }: MentorFiltersProps) {
  const {
    filters,
    setFilter,
    removeFilter,
    resetFilters,
    hasActiveFilters,
    getActiveFiltersCount,
  } = useSearchStore();

  // Debounced price update
  const debouncedSetFilter = useDebouncedCallback(
    (key: 'minPrice' | 'maxPrice', value: number | undefined) => {
      if (value === undefined) {
        removeFilter(key);
      } else {
        setFilter(key, value);
      }
    },
    300
  );

  // Toggle array filter
  const toggleArrayFilter = useCallback(
    (key: 'languages' | 'specialties', value: string) => {
      const current = filters[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      if (updated.length === 0) {
        removeFilter(key);
      } else {
        setFilter(key, updated);
      }
    },
    [filters, setFilter, removeFilter]
  );

  // Toggle boolean filter
  const toggleBooleanFilter = useCallback(
    (key: keyof typeof filters, value: boolean) => {
      if (value) {
        setFilter(key, true);
      } else {
        removeFilter(key);
      }
    },
    [setFilter, removeFilter]
  );

  // Set rating filter
  const setRatingFilter = useCallback(
    (rating: number) => {
      if (filters.minRating === rating) {
        removeFilter('minRating');
      } else {
        setFilter('minRating', rating);
      }
    },
    [filters.minRating, setFilter, removeFilter]
  );

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <p className="text-sm text-teal-600 font-medium">
          {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif
          {activeFiltersCount > 1 ? 's' : ''}
        </p>
      )}

      <Separator />

      {/* Section 1: Languages */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Langues</Label>
        <div className="space-y-2">
          {SEARCH_LANGUAGES.map((lang) => (
            <div key={lang.value} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang.value}`}
                checked={filters.languages?.includes(lang.value) || false}
                onCheckedChange={() => toggleArrayFilter('languages', lang.value)}
              />
              <label
                htmlFor={`lang-${lang.value}`}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Section 2: Specialties */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Spécialités</Label>
        <div className="grid grid-cols-2 gap-2">
          {SEARCH_SPECIALTIES.map((spec) => (
            <div key={spec.value} className="flex items-center space-x-2">
              <Checkbox
                id={`spec-${spec.value}`}
                checked={filters.specialties?.includes(spec.value) || false}
                onCheckedChange={() => toggleArrayFilter('specialties', spec.value)}
              />
              <label
                htmlFor={`spec-${spec.value}`}
                className="flex items-center gap-1 text-sm cursor-pointer truncate"
              >
                <span>{spec.icon}</span>
                <span className="truncate">{spec.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Section 3: Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Prix horaire</Label>
        <Slider
          value={[filters.minPrice || 0, filters.maxPrice || 100]}
          min={0}
          max={100}
          step={5}
          onValueChange={([min, max]) => {
            debouncedSetFilter('minPrice', min === 0 ? undefined : min);
            debouncedSetFilter('maxPrice', max === 100 ? undefined : max);
          }}
          className="mt-2"
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              debouncedSetFilter('minPrice', value);
            }}
            className="w-20 h-8 text-sm"
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              debouncedSetFilter('maxPrice', value);
            }}
            className="w-20 h-8 text-sm"
          />
          <span className="text-sm text-gray-500">€/h</span>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="free-only"
            checked={filters.freeSessionsOnly || false}
            onCheckedChange={(checked) =>
              toggleBooleanFilter('freeSessionsOnly', checked === true)
            }
          />
          <label htmlFor="free-only" className="text-sm cursor-pointer">
            Sessions gratuites uniquement
          </label>
        </div>
      </div>

      <Separator />

      {/* Section 4: Student Types */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Type d'élèves</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="teaches-children"
              checked={filters.teachesChildren || false}
              onCheckedChange={(checked) =>
                toggleBooleanFilter('teachesChildren', checked === true)
              }
            />
            <label
              htmlFor="teaches-children"
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Baby className="h-4 w-4 text-gray-500" />
              <span>Enfants (&lt; 13 ans)</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="teaches-teenagers"
              checked={filters.teachesTeenagers || false}
              onCheckedChange={(checked) =>
                toggleBooleanFilter('teachesTeenagers', checked === true)
              }
            />
            <label
              htmlFor="teaches-teenagers"
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <span>Adolescents (13-17 ans)</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="teaches-adults"
              checked={filters.teachesAdults || false}
              onCheckedChange={(checked) =>
                toggleBooleanFilter('teachesAdults', checked === true)
              }
            />
            <label
              htmlFor="teaches-adults"
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <User className="h-4 w-4 text-gray-500" />
              <span>Adultes (18+)</span>
            </label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 5: Special Features */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Critères pédagogiques</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="beginner-friendly"
              checked={filters.beginnerFriendly || false}
              onCheckedChange={(checked) =>
                toggleBooleanFilter('beginnerFriendly', checked === true)
              }
            />
            <label htmlFor="beginner-friendly" className="text-sm cursor-pointer">
              Débutants acceptés
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-muslims"
              checked={filters.experiencedWithNewMuslims || false}
              onCheckedChange={(checked) =>
                toggleBooleanFilter('experiencedWithNewMuslims', checked === true)
              }
            />
            <label htmlFor="new-muslims" className="text-sm cursor-pointer">
              Expérience avec nouveaux musulmans
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="free-trial"
              checked={filters.freeTrialAvailable || false}
              onCheckedChange={(checked) =>
                toggleBooleanFilter('freeTrialAvailable', checked === true)
              }
            />
            <label htmlFor="free-trial" className="text-sm cursor-pointer">
              Essai gratuit disponible
            </label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 6: Rating */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Note minimum</Label>
        <div className="space-y-2">
          {RATING_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${option.value}`}
                checked={filters.minRating === option.value}
                onCheckedChange={() => setRatingFilter(option.value)}
              />
              <label
                htmlFor={`rating-${option.value}`}
                className="flex items-center gap-1 text-sm cursor-pointer"
              >
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(option.value)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-gray-600">{option.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
