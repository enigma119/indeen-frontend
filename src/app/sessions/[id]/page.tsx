'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  Globe,
  Video,
  X,
  ArrowLeft,
  User,
  BookOpen,
  FileText,
  MessageSquare,
  Download,
  CheckCircle2,
  AlertCircle,
  Star,
  ExternalLink,
  History,
} from 'lucide-react';
import { format, isWithinInterval, subMinutes, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSession } from '@/hooks/use-sessions';
import { useAuth } from '@/hooks/use-auth';
import { SessionCountdown, CancelSessionDialog } from '@/components/sessions';
import type { Session } from '@/types';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  SCHEDULED: {
    label: 'Programmée',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <Calendar className="h-4 w-4" />,
  },
  IN_PROGRESS: {
    label: 'En cours',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: <Video className="h-4 w-4" />,
  },
  COMPLETED: {
    label: 'Terminée',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  CANCELLED_BY_MENTOR: {
    label: 'Annulée par le mentor',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <X className="h-4 w-4" />,
  },
  CANCELLED_BY_MENTEE: {
    label: 'Annulée',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <X className="h-4 w-4" />,
  },
  NO_SHOW_MENTOR: {
    label: 'Mentor absent',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  NO_SHOW_MENTEE: {
    label: 'Élève absent',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

function canJoinSession(session: Session): boolean {
  if (session.status !== 'SCHEDULED' || !session.mentor_confirmed) {
    return false;
  }

  const now = new Date();
  const start = new Date(session.scheduled_at);
  const end = new Date(session.scheduled_end_at);

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
  return now < start;
}

function SessionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { user, isMentor, isMentee } = useAuth();
  const { data: session, isLoading, error, refetch } = useSession(sessionId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <SessionDetailSkeleton />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Session introuvable</h2>
            <p className="text-gray-600 mb-4">
              Cette session n'existe pas ou vous n'avez pas accès.
            </p>
            <Button asChild>
              <Link href="/sessions">Retour aux sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[session.status] || STATUS_CONFIG.SCHEDULED;
  const scheduledDate = new Date(session.scheduled_at);

  // Determine if user is mentor or mentee for this session
  const isSessionMentor = user?.id === session.mentor_profile?.user_id;
  const isSessionMentee = !isSessionMentor;

  // Get the other participant's info
  const otherParticipant = isSessionMentor
    ? {
        name: session.mentee_profile?.user
          ? `${session.mentee_profile.user.firstName} ${session.mentee_profile.user.lastName}`
          : 'Élève',
        avatar: session.mentee_profile?.user?.avatarUrl,
        initials: session.mentee_profile?.user
          ? `${session.mentee_profile.user.firstName[0]}${session.mentee_profile.user.lastName[0]}`
          : 'E',
        role: 'Élève',
        level: session.mentee_profile?.current_level,
        goals: session.mentee_profile?.learning_goals,
      }
    : {
        name: session.mentor_profile?.user
          ? `${session.mentor_profile.user.firstName} ${session.mentor_profile.user.lastName}`
          : 'Mentor',
        avatar: session.mentor_profile?.user?.avatarUrl,
        initials: session.mentor_profile?.user
          ? `${session.mentor_profile.user.firstName[0]}${session.mentor_profile.user.lastName[0]}`
          : 'M',
        role: 'Mentor',
        rating: session.mentor_profile?.average_rating,
        headline: session.mentor_profile?.headline,
        slug: session.mentor_profile?.slug,
      };

  const showJoinButton = canJoinSession(session);
  const showCancelButton = canCancelSession(session);
  const showReviewButton = session.status === 'COMPLETED' && !session.has_review && isSessionMentee;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Link */}
      <Link
        href={isSessionMentor ? '/mes-sessions' : '/sessions'}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Retour aux sessions
      </Link>

      {/* Status Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </div>

              {session.status === 'SCHEDULED' && !session.mentor_confirmed && (
                <Badge
                  variant="outline"
                  className="ml-2 text-amber-600 border-amber-300"
                >
                  En attente de confirmation du mentor
                </Badge>
              )}

              <h1 className="text-2xl font-bold text-gray-900 mt-3">
                Session de {session.duration} minutes
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span className="capitalize">
                    {format(scheduledDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(scheduledDate, 'HH:mm')} -{' '}
                    {format(new Date(session.scheduled_end_at), 'HH:mm')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span>{session.timezone}</span>
                </div>
              </div>

              {/* Countdown */}
              {session.status === 'SCHEDULED' && session.mentor_confirmed && (
                <div className="mt-4">
                  <SessionCountdown scheduledAt={session.scheduled_at} />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {showJoinButton && session.meeting_url && (
                <Button asChild className="bg-green-600 hover:bg-green-700 gap-2">
                  <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Rejoindre la session
                  </a>
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

              {showReviewButton && (
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Laisser un avis
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Participant Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                {isSessionMentor ? 'Élève' : 'Mentor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                    {otherParticipant.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{otherParticipant.name}</h3>

                  {'headline' in otherParticipant && otherParticipant.headline && (
                    <p className="text-sm text-gray-500">{otherParticipant.headline}</p>
                  )}

                  {'rating' in otherParticipant && otherParticipant.rating && otherParticipant.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{otherParticipant.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {'level' in otherParticipant && otherParticipant.level && (
                    <Badge variant="outline" className="mt-2">
                      Niveau: {otherParticipant.level}
                    </Badge>
                  )}

                  {'goals' in otherParticipant && otherParticipant.goals && otherParticipant.goals.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Objectifs:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {otherParticipant.goals.map((goal, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {'slug' in otherParticipant && otherParticipant.slug && (
                    <Button variant="ghost" size="sm" asChild className="mt-3 p-0 h-auto">
                      <Link href={`/mentors/${otherParticipant.slug}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Voir le profil
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-600" />
                Détails de la session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.lesson_plan && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    Plan de session
                  </h4>
                  <p className="mt-1 text-gray-700">{session.lesson_plan}</p>
                </div>
              )}

              {session.mentor_notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes du mentor</h4>
                  <p className="mt-1 text-gray-700">{session.mentor_notes}</p>
                </div>
              )}

              {session.topics_covered && session.topics_covered.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sujets abordés</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.topics_covered.map((topic, i) => (
                      <Badge key={i} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {!session.lesson_plan && !session.mentor_notes && !session.topics_covered?.length && (
                <p className="text-gray-500 text-sm">
                  Aucun détail supplémentaire pour cette session.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Cancellation Info */}
          {session.cancellation_reason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Raison de l'annulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{session.cancellation_reason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-teal-600" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    <div className="w-0.5 h-full bg-gray-200" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">Session réservée</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(session.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>

                {session.confirmed_at && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-full bg-gray-200" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Confirmée par le mentor</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(session.confirmed_at), "d MMM yyyy 'à' HH:mm", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {session.completed_at && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Session terminée</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(session.completed_at), "d MMM yyyy 'à' HH:mm", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {session.cancelled_at && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Session annulée</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(session.cancelled_at), "d MMM yyyy 'à' HH:mm", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Info */}
          {session.price && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Prix de la session</span>
                  <span className="font-semibold text-lg">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: session.currency || 'EUR',
                    }).format(session.price)}
                  </span>
                </div>

                {session.status === 'COMPLETED' && (
                  <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger la facture
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <CancelSessionDialog
        session={session}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onSuccess={() => {
          setCancelDialogOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
