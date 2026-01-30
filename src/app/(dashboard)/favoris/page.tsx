'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Search, Loader2 } from 'lucide-react';
import { MentorCard } from '@/components/mentors/MentorCard';
import { useFavorites } from '@/hooks/use-favorites';
import { ComparisonBadge } from '@/components/mentors/ComparisonBadge';
import { ComparisonModal } from '@/components/mentors/ComparisonModal';

export default function FavorisPage() {
  const { favorites, isLoading } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Mes mentors favoris
          </h1>
          <p className="text-gray-600 mt-1">
            Retrouvez vos mentors sauvegardés et comparez-les
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Vous n'avez pas encore de favoris
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Explorez notre catalogue de mentors et ajoutez vos préférés
              en cliquant sur le bouton cœur.
            </p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 gap-2">
              <Link href="/mentors">
                <Search className="h-4 w-4" />
                Découvrir des mentors
              </Link>
            </Button>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && favorites.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {favorites.length} mentor{favorites.length > 1 ? 's' : ''} sauvegardé
              {favorites.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  showCompare
                  showFavorite
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Comparison Badge */}
      <ComparisonBadge />

      {/* Comparison Modal */}
      <ComparisonModal />
    </div>
  );
}
