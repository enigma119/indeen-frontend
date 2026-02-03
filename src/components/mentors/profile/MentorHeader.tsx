'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  BadgeCheck,
  Zap,
  Gift,
  Share2,
  Trophy,
  Check,
} from 'lucide-react';
import type { MentorProfile } from '@/types';
import { cn } from '@/lib/utils';

interface MentorHeaderProps {
  mentor: MentorProfile;
}

// Country flag emoji helper
const getCountryFlag = (countryCode?: string) => {
  if (!countryCode) return null;
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function MentorHeader({ mentor }: MentorHeaderProps) {
  const [copied, setCopied] = useState(false);

  const isVerified = mentor.verification_status === 'APPROVED';
  const isTopMentor =
    mentor.average_rating >= 4.8 && mentor.total_reviews >= 20;
  const hasQuickResponse =
    mentor.average_response_time && mentor.average_response_time < 120; // < 2h
  const hasFreeTrialAvailable = mentor.free_trial_available;

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials = mentor.user
    ? `${mentor.user.firstName[0]}${mentor.user.lastName[0]}`
    : 'M';

  const fullName = mentor.user
    ? `${mentor.user.firstName} ${mentor.user.lastName}`
    : 'Mentor';

  return (
    <div className="bg-white rounded-xl border p-6 md:p-8">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-lg">
              <AvatarImage
                src={mentor.user?.avatarUrl}
                alt={fullName}
              />
              <AvatarFallback className="text-2xl md:text-3xl bg-teal-100 text-teal-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                <BadgeCheck className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name & Share */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                {fullName}
                {isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 text-xs"
                  >
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{mentor.headline}</p>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-shrink-0 gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Copié !</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Partager</span>
                </>
              )}
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-5 w-5',
                      star <= Math.round(mentor.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">
                {mentor.average_rating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({mentor.total_reviews} avis)
              </span>
            </div>

            {/* Location */}
            {mentor.user?.countryCode && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{getCountryFlag(mentor.user.countryCode)}</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {isTopMentor && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Trophy className="h-3 w-3 mr-1" />
                Top mentor
              </Badge>
            )}
            {hasQuickResponse && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Zap className="h-3 w-3 mr-1" />
                Réponse rapide
              </Badge>
            )}
            {hasFreeTrialAvailable && (
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                <Gift className="h-3 w-3 mr-1" />
                Essai gratuit
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
