'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  Languages,
  BookOpen,
  Users,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MentorProfile } from '@/types';
import { SEARCH_LANGUAGES, SEARCH_SPECIALTIES } from '@/lib/constants/search';

interface MentorCardProps {
  mentor: MentorProfile;
  className?: string;
}

export function MentorCard({ mentor, className }: MentorCardProps) {
  // Get language labels
  const getLanguageLabel = (code: string) => {
    return SEARCH_LANGUAGES.find((l) => l.value === code)?.label || code;
  };

  // Get specialty label
  const getSpecialtyLabel = (code: string) => {
    return SEARCH_SPECIALTIES.find((s) => s.value === code)?.label || code;
  };

  // Get initials from name
  const getInitials = () => {
    // Assuming mentor has user info or we need to add it to MentorProfile
    return '??';
  };

  // Format price
  const formatPrice = (price: number, currency: string) => {
    const symbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£',
      MAD: 'DH',
      TND: 'DT',
      DZD: 'DA',
    };
    return `${price}${symbols[currency] || currency}`;
  };

  // Render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  // Displayed languages (max 3)
  const displayedLanguages = mentor.languages.slice(0, 3);
  const remainingLanguages = mentor.languages.length - 3;

  // Displayed specialties (max 3)
  const displayedSpecialties = mentor.specialties.slice(0, 3);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        className
      )}
    >
      <CardContent className="p-4">
        {/* Header: Avatar + Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={undefined} alt={mentor.headline} />
              <AvatarFallback className="bg-teal-100 text-teal-700 text-lg font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {mentor.is_active && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <BadgeCheck className="h-5 w-5 text-teal-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {mentor.headline?.split(' - ')[0] || 'Mentor'}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">{renderStars(mentor.average_rating)}</div>
              <span className="text-sm font-medium text-gray-700">
                {mentor.average_rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({mentor.total_reviews} avis)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>France</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {mentor.headline || 'Mentor expérimenté'}
        </p>

        {/* Languages */}
        <div className="flex items-center gap-2 mb-3">
          <Languages className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {displayedLanguages.map((lang) => (
              <span key={lang} className="text-sm text-gray-600">
                {getLanguageLabel(lang)}
                {displayedLanguages.indexOf(lang) < displayedLanguages.length - 1 && ', '}
              </span>
            ))}
            {remainingLanguages > 0 && (
              <span className="text-sm text-gray-400">+{remainingLanguages}</span>
            )}
          </div>
        </div>

        {/* Specialties */}
        <div className="flex items-start gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-1.5">
            {displayedSpecialties.map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs"
              >
                {getSpecialtyLabel(spec)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Student types - simplified */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-4 w-4 text-gray-400" />
          <span>Adultes acceptés</span>
        </div>
      </CardContent>

      {/* Footer: Price + CTA */}
      <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-3">
        <div className="w-full flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(mentor.hourly_rate, mentor.currency)}
            </span>
            <span className="text-sm text-gray-500">/h</span>
          </div>

          {/* Free trial badge */}
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Essai gratuit
          </Badge>
        </div>

        <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
          <Link href={`/mentors/${mentor.id}`}>Voir le profil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
