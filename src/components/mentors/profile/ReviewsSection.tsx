'use client';

import { useState } from 'react';
import { Star, MessageSquare, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewCard } from './ReviewCard';
import { useMentorReviews } from '@/hooks/use-mentors';
import type { MentorProfile, Review } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewsSectionProps {
  mentor: MentorProfile;
}

function RatingBar({ star, percentage }: { star: number; percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-sm text-gray-600">{star}</span>
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-sm text-gray-500 text-right">{percentage}%</span>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b last:border-b-0 pb-6 last:pb-0">
          <div className="flex items-start gap-3 mb-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ReviewsSection({ mentor }: ReviewsSectionProps) {
  const [page, setPage] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  const { data, isLoading, isFetching } = useMentorReviews(mentor.id, page, 5);

  // Merge new reviews with existing ones when page changes
  const reviews = page === 1 ? data?.reviews || [] : allReviews;

  const handleLoadMore = () => {
    if (data?.reviews) {
      setAllReviews((prev) => [...prev, ...data.reviews]);
    }
    setPage((p) => p + 1);
  };

  // Calculate rating distribution
  const ratingDistribution = data?.ratingDistribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const hasMoreReviews = data ? page < data.totalPages : false;

  return (
    <section className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Avis des élèves
      </h2>

      {/* Rating Overview */}
      <div className="flex flex-col md:flex-row gap-8 pb-6 border-b mb-6">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-baseline justify-center md:justify-start gap-1">
            <span className="text-5xl font-bold text-gray-900">
              {mentor.averageRating.toFixed(1)}
            </span>
            <span className="text-2xl text-gray-400">/5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-5 w-5',
                  star <= Math.round(mentor.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {mentor.totalReviews} avis
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar
              key={star}
              star={star}
              percentage={ratingDistribution[star as keyof typeof ratingDistribution] || 0}
            />
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {isLoading && page === 1 ? (
        <ReviewsSkeleton />
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="rounded-full bg-gray-100 p-4 w-fit mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">
            Aucun avis pour le moment
          </h3>
          <p className="text-gray-500 text-sm">
            Soyez le premier à laisser un avis !
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMoreReviews && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isFetching}
            className="gap-2"
          >
            {isFetching ? (
              'Chargement...'
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Voir plus d'avis
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
