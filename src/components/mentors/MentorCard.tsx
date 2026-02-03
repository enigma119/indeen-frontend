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
import { FavoriteButton } from './FavoriteButton';
import { CompareButton } from './CompareButton';

interface MentorCardProps {
  mentor: MentorProfile;
  className?: string;
  showFavorite?: boolean;
  showCompare?: boolean;
}

export function MentorCard({
  mentor,
  className,
  showFavorite = true,
  showCompare = false,
}: MentorCardProps) {
  // Get language labels
  const getLanguageLabel = (code: string) => {
    return SEARCH_LANGUAGES.find((l) => l.value === code)?.label || code;
  };

  // Get specialty label
  const getSpecialtyLabel = (code: string) => {
    return SEARCH_SPECIALTIES.find((s) => s.value === code)?.label || code;
  };

  // Get initials from user
  const getInitials = () => {
    if (mentor.user) {
      return `${mentor.user.firstName[0]}${mentor.user.lastName[0]}`;
    }
    return '??';
  };

  // Get full name
  const getFullName = () => {
    if (mentor.user) {
      return `${mentor.user.firstName} ${mentor.user.lastName}`;
    }
    return 'Mentor';
  };

  // Get country flag
  const getCountryFlag = (countryCode?: string) => {
    if (!countryCode) return null;
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
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
      XOF: 'CFA',
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

  // Student types
  const studentTypes = [];
  if (mentor.teaches_children) studentTypes.push('Enfants');
  if (mentor.teaches_teenagers) studentTypes.push('Ados');
  if (mentor.teaches_adults) studentTypes.push('Adultes');

  // Profile link - use slug if available, otherwise id
  const profileLink = `/mentors/${mentor.slug || mentor.id}`;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        className
      )}
    >
      {/* Favorite Button */}
      {showFavorite && (
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton mentorId={mentor.id} size="sm" />
        </div>
      )}

      <CardContent className="p-4">
        {/* Header: Avatar + Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={mentor.user?.avatarUrl} alt={getFullName()} />
              <AvatarFallback className="bg-teal-100 text-teal-700 text-lg font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {mentor.verification_status === 'APPROVED' && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <BadgeCheck className="h-5 w-5 text-teal-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {getFullName()}
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
            {mentor.user?.countryCode && (
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{getCountryFlag(mentor.user.countryCode)}</span>
              </div>
            )}
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
            {displayedLanguages.map((lang, idx) => (
              <span key={lang} className="text-sm text-gray-600">
                {getLanguageLabel(lang)}
                {idx < displayedLanguages.length - 1 && ', '}
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

        {/* Student types */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-4 w-4 text-gray-400" />
          <span>
            {studentTypes.length > 0 ? studentTypes.join(', ') : 'Tous niveaux'}
          </span>
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
          {mentor.free_trial_available && (
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Essai gratuit
            </Badge>
          )}
        </div>

        {/* Compare checkbox */}
        {showCompare && (
          <div className="w-full">
            <CompareButton mentor={mentor} />
          </div>
        )}

        <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
          <Link href={profileLink}>Voir le profil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
