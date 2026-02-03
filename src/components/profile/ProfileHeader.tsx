'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import type { User, MentorProfile, MenteeProfile } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

interface ProfileHeaderProps {
  user: User;
  profile?: MentorProfile | MenteeProfile;
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  const isMentor = user.role === 'MENTOR';
  const mentorProfile = isMentor ? (profile as MentorProfile) : undefined;

  const roleLabel = {
    MENTOR: 'Mentor',
    MENTEE: 'Élève',
    ADMIN: 'Administrateur',
    PARENT: 'Parent',
  }[user.role];

  const memberSince = user.createdAt
    ? format(new Date(user.createdAt), 'MMMM yyyy', { locale: fr })
    : null;

  // Get country name from code
  const getCountryName = (code: string): string => {
    const countries: Record<string, string> = {
      FR: 'France',
      MA: 'Maroc',
      DZ: 'Algérie',
      TN: 'Tunisie',
      BE: 'Belgique',
      CH: 'Suisse',
      CA: 'Canada',
      US: 'États-Unis',
      GB: 'Royaume-Uni',
      SA: 'Arabie Saoudite',
      AE: 'Émirats Arabes Unis',
      EG: 'Égypte',
    };
    return countries[code] || code;
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl sm:text-3xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            {user.emailVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <CheckCircle className="h-6 w-6 text-teal-500 fill-teal-50" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                  {roleLabel}
                </Badge>
                {isMentor && mentorProfile?.verificationStatus === 'APPROVED' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Vérifié
                  </Badge>
                )}
              </div>
            </div>

            {/* View public profile button for mentors */}
            {isMentor && mentorProfile?.slug && (
              <Link href={`/mentors/${mentorProfile.slug}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Voir profil public
                </Button>
              </Link>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            {user.countryCode && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{getCountryName(user.countryCode)}</span>
              </div>
            )}
            {memberSince && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Membre depuis {memberSince}</span>
              </div>
            )}
          </div>

          {/* Mentor headline */}
          {isMentor && mentorProfile?.headline && (
            <p className="mt-3 text-gray-700">{mentorProfile.headline}</p>
          )}
        </div>
      </div>
    </div>
  );
}
