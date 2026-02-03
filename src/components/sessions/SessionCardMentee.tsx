'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Globe,
  Video,
  X,
  ExternalLink,
  Star,
  MessageSquare,
} from 'lucide-react';
import { format, formatDistanceToNow, isWithinInterval, subMinutes, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { SessionCountdown } from './SessionCountdown';
import { CancelSessionDialog } from './CancelSessionDialog';
import type { Session } from '@/types';

interface SessionCardMenteeProps {
  session: Session;
  onCancelSuccess?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon?: string }
> = {
  SCHEDULED: { label: 'Programmée', variant: 'secondary', icon: '📅' },
  IN_PROGRESS: { label: 'En cours', variant: 'default', icon: '🎯' },
  COMPLETED: { label: 'Terminée', variant: 'outline', icon: '✅' },
  CANCELLED_BY_MENTOR: { label: 'Annulée par le mentor', variant: 'destructive', icon: '❌' },
  CANCELLED_BY_MENTEE: { label: 'Annulée', variant: 'destructive', icon: '❌' },
  NO_SHOW_MENTOR: { label: 'Mentor absent', variant: 'destructive', icon: '⚠️' },
  NO_SHOW_MENTEE: { label: 'Absence', variant: 'destructive', icon: '⚠️' },
};

function canJoinSession(session: Session): boolean {
  if (session.status !== 'SCHEDULED' || !session.mentor_confirmed) {
    return false;
  }

  const now = new Date();
  const start = new Date(session.scheduled_at);
  const end = new Date(session.scheduled_end_at);

  // Can join 15 minutes before until 30 minutes after scheduled end
  return isWithinInterval(now, {
    start: subMinutes(start, 15),
    end: addMinutes(end, 30),
  });
}

function canCancelSession(session: Session): boolean {
  if (session.status !== 'SCHEDULED') {
    return false;
  }

  const now = new Date();
  const start = new Date(session.scheduled_at);

  // Can cancel if session hasn't started yet
  return now < start;
}

function isUpcoming(session: Session): boolean {
  return session.status === 'SCHEDULED';
}

function isPast(session: Session): boolean {
  return session.status === 'COMPLETED';
}

function isCancelled(session: Session): boolean {
  return session.status.startsWith('CANCELLED_') || session.status.startsWith('NO_SHOW_');
}

export function SessionCardMentee({ session, onCancelSuccess }: SessionCardMenteeProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const mentor = session.mentor_profile;
  const mentorName = mentor?.user
    ? `${mentor.user.firstName} ${mentor.user.lastName}`
    : 'Mentor';
  const initials = mentor?.user
    ? `${mentor.user.firstName[0]}${mentor.user.lastName[0]}`
    : 'M';

  const scheduledDate = new Date(session.scheduled_at);
  const statusConfig = STATUS_CONFIG[session.status] || STATUS_CONFIG.SCHEDULED;

  const showJoinButton = canJoinSession(session);
  const showCancelButton = canCancelSession(session);
  const showReviewButton = isPast(session) && !session.has_review;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Mentor Info */}
            <div className="flex items-start gap-3 flex-1">
              <Avatar className="h-12 w-12 md:h-14 md:w-14">
                <AvatarImage src={mentor?.user?.avatarUrl} alt={mentorName} />
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{mentorName}</h3>
                  {mentor && mentor.average_rating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span>{mentor.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Session Details */}
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {isUpcoming(session) ? (
                      <span className="capitalize">
                        {format(scheduledDate, "EEEE d MMMM yyyy", { locale: fr })}
                      </span>
                    ) : (
                      <span>
                        {formatDistanceToNow(scheduledDate, { addSuffix: true, locale: fr })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {format(scheduledDate, 'HH:mm')} -{' '}
                      {format(new Date(session.scheduled_end_at), 'HH:mm')} ({session.duration} min)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>{session.timezone}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.icon} {statusConfig.label}
                  </Badge>

                  {session.status === 'SCHEDULED' && !session.mentor_confirmed && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      En attente de confirmation
                    </Badge>
                  )}
                </div>

                {/* Countdown for upcoming sessions */}
                {isUpcoming(session) && session.mentor_confirmed && (
                  <div className="mt-3">
                    <SessionCountdown scheduledAt={session.scheduled_at} />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-2 md:items-end">
              {showJoinButton && session.meeting_url && (
                <Button asChild className="bg-green-600 hover:bg-green-700 gap-2">
                  <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Rejoindre
                  </a>
                </Button>
              )}

              {showReviewButton && (
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Laisser un avis
                </Button>
              )}

              {showCancelButton && (
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              )}

              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href={`/sessions/${session.id}`}>
                  <ExternalLink className="h-4 w-4" />
                  Détails
                </Link>
              </Button>
            </div>
          </div>

          {/* Lesson Plan Preview */}
          {session.lesson_plan && isUpcoming(session) && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Plan de session :</p>
              <p className="text-sm text-gray-700 line-clamp-2 mt-1">{session.lesson_plan}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CancelSessionDialog
        session={session}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onSuccess={() => {
          setCancelDialogOpen(false);
          onCancelSuccess?.();
        }}
      />
    </>
  );
}
