'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageCircle } from 'lucide-react';
import type { Review } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.mentee
    ? `${review.mentee.first_name[0]}${review.mentee.last_name[0]}`
    : '?';

  const displayName = review.mentee
    ? `${review.mentee.first_name} ${review.mentee.last_name[0]}.`
    : 'Anonyme';

  const timeAgo = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <div className="border-b last:border-b-0 pb-6 last:pb-0">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.mentee?.avatar_url} alt={displayName} />
          <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{displayName}</p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Stars */}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-4 w-4',
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Mentor Response */}
      {review.mentor_response && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 ml-4 border-l-2 border-teal-500">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">
              Réponse du mentor
            </span>
          </div>
          <p className="text-gray-600 text-sm">{review.mentor_response}</p>
        </div>
      )}
    </div>
  );
}
