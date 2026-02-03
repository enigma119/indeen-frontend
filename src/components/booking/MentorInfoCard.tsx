'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, CheckCircle2, Clock, Users } from 'lucide-react';
import type { MentorProfile } from '@/types';

interface MentorInfoCardProps {
  mentor: MentorProfile;
  compact?: boolean;
  showViewProfile?: boolean;
}

export function MentorInfoCard({
  mentor,
  compact = false,
  showViewProfile = true,
}: MentorInfoCardProps) {
  const mentorName = mentor.user
    ? `${mentor.user.first_name} ${mentor.user.last_name}`
    : 'Mentor';
  const initials = mentor.user
    ? `${mentor.user.first_name[0]}${mentor.user.last_name[0]}`
    : 'M';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={mentor.user?.avatar_url} alt={mentorName} />
          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{mentorName}</p>
          {mentor.average_rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{mentor.average_rating.toFixed(1)}</span>
              <span className="text-gray-400">({mentor.total_reviews})</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.user?.avatar_url} alt={mentorName} />
            <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">{mentorName}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {mentor.headline}
                </p>
              </div>
            </div>

            {/* Rating */}
            {mentor.average_rating > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{mentor.average_rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">
                  ({mentor.total_reviews} avis)
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {mentor.verification_status === 'APPROVED' && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Vérifié
                </Badge>
              )}
              {mentor.free_trial_available && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  Essai gratuit
                </Badge>
              )}
              {mentor.total_sessions && mentor.total_sessions > 50 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {mentor.total_sessions}+ sessions
                </Badge>
              )}
              {mentor.total_students && mentor.total_students > 10 && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 gap-1"
                >
                  <Users className="h-3 w-3" />
                  {mentor.total_students}+ élèves
                </Badge>
              )}
            </div>

            {/* View Profile Button */}
            {showViewProfile && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="mt-3 h-8 text-teal-600 hover:text-teal-700 p-0"
              >
                <Link
                  href={`/mentors/${mentor.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Voir le profil complet
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
