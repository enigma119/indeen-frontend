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
  Check,
  X,
  ExternalLink,
  User,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { format, formatDistanceToNow, isWithinInterval, subMinutes, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { SessionCountdown } from './SessionCountdown';
import { MentorConfirmDialog } from './MentorConfirmDialog';
import type { Session } from '@/types';

interface SessionCardMentorProps {
  session: Session;
  onActionSuccess?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon?: string }
> = {
  SCHEDULED: { label: 'Programmée', variant: 'secondary', icon: '📅' },
  IN_PROGRESS: { label: 'En cours', variant: 'default', icon: '🎯' },
  COMPLETED: { label: 'Terminée', variant: 'outline', icon: '✅' },
  CANCELLED_BY_MENTOR: { label: 'Annulée par vous', variant: 'destructive', icon: '❌' },
  CANCELLED_BY_MENTEE: { label: 'Annulée par l\'élève', variant: 'destructive', icon: '❌' },
  NO_SHOW_MENTOR: { label: 'Absence', variant: 'destructive', icon: '⚠️' },
  NO_SHOW_MENTEE: { label: 'Élève absent', variant: 'destructive', icon: '⚠️' },
};

function canStartSession(session: Session): boolean {
  if (session.status !== 'SCHEDULED' || !session.mentor_confirmed) {
    return false;
  }

  const now = new Date();
  const start = new Date(session.scheduled_at);
  const end = new Date(session.scheduled_end_at);

  // Can start 5 minutes before until 30 minutes after scheduled start
  return isWithinInterval(now, {
    start: subMinutes(start, 5),
    end: addMinutes(start, 30),
  });
}

function needsConfirmation(session: Session): boolean {
  return session.status === 'SCHEDULED' && !session.mentor_confirmed;
}

function isUpcoming(session: Session): boolean {
  return session.status === 'SCHEDULED' && session.mentor_confirmed;
}

function isPast(session: Session): boolean {
  return session.status === 'COMPLETED';
}

export function SessionCardMentor({ session, onActionSuccess }: SessionCardMentorProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'accept' | 'reject'>('accept');

  const mentee = session.mentee_profile;
  const menteeName = mentee?.user
    ? `${mentee.user.firstName} ${mentee.user.lastName}`
    : 'Élève';
  const initials = mentee?.user
    ? `${mentee.user.firstName[0]}${mentee.user.lastName[0]}`
    : 'E';

  const scheduledDate = new Date(session.scheduled_at);
  const statusConfig = STATUS_CONFIG[session.status] || STATUS_CONFIG.SCHEDULED;

  const showStartButton = canStartSession(session);
  const showConfirmButtons = needsConfirmation(session);

  const handleAccept = () => {
    setDialogAction('accept');
    setConfirmDialogOpen(true);
  };

  const handleReject = () => {
    setDialogAction('reject');
    setConfirmDialogOpen(true);
  };

  return (
    <>
      <Card className={cn(
        "hover:shadow-md transition-shadow",
        needsConfirmation(session) && "border-amber-300 bg-amber-50/50"
      )}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Mentee Info */}
            <div className="flex items-start gap-3 flex-1">
              <Avatar className="h-12 w-12 md:h-14 md:w-14">
                <AvatarImage src={mentee?.user?.avatarUrl} alt={menteeName} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{menteeName}</h3>
                  {mentee?.currentLevel && (
                    <Badge variant="outline" className="gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {mentee.currentLevel}
                    </Badge>
                  )}
                </div>

                {/* Session Details */}
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {isUpcoming(session) || needsConfirmation(session) ? (
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
                  {needsConfirmation(session) ? (
                    <Badge className="bg-amber-500 text-white">
                      ⏳ À confirmer
                    </Badge>
                  ) : (
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  )}
                </div>

                {/* Countdown for confirmed upcoming sessions */}
                {isUpcoming(session) && (
                  <div className="mt-3">
                    <SessionCountdown scheduledAt={session.scheduled_at} />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-2 md:items-end">
              {showConfirmButtons && (
                <>
                  <Button
                    className="bg-green-600 hover:bg-green-700 gap-2"
                    onClick={handleAccept}
                  >
                    <Check className="h-4 w-4" />
                    Accepter
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                    onClick={handleReject}
                  >
                    <X className="h-4 w-4" />
                    Refuser
                  </Button>
                </>
              )}

              {showStartButton && session.meeting_url && (
                <Button asChild className="bg-green-600 hover:bg-green-700 gap-2">
                  <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Démarrer
                  </a>
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

          {/* Lesson Plan & Mentee Goals */}
          {(session.lesson_plan || mentee?.learningGoals) && (needsConfirmation(session) || isUpcoming(session)) && (
            <div className="mt-4 pt-4 border-t space-y-2">
              {session.lesson_plan && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    Plan de session :
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2 mt-1">{session.lesson_plan}</p>
                </div>
              )}
              {mentee?.learningGoals && mentee.learningGoals.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    Objectifs de l'élève :
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {mentee.learningGoals.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <MentorConfirmDialog
        session={session}
        action={dialogAction}
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onSuccess={() => {
          setConfirmDialogOpen(false);
          onActionSuccess?.();
        }}
      />
    </>
  );
}
