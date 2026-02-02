'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { differenceInMinutes, isAfter, isBefore, addMinutes, subMinutes } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import {
  useSession,
  useCreateMeetingRoom,
  useMeetingToken,
  useCompleteSession,
} from '@/hooks/use-sessions';
import {
  DailyProvider,
  useDailyContext,
  VideoGrid,
  MeetingControls,
  SessionTimer,
  ChatSidebar,
  PreCallCheck,
  WaitingRoom,
  EndSessionDialog,
  MeetingError,
} from '@/components/meeting';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Time window: 15 min before to 30 min after scheduled time
const EARLY_JOIN_MINUTES = 15;
const LATE_JOIN_MINUTES = 30;

function MeetingPageContent() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const { user, isMentor } = useAuth();
  const { data: session, isLoading: sessionLoading } = useSession(sessionId);
  const createMeetingMutation = useCreateMeetingRoom();
  const { data: tokenData, isLoading: tokenLoading } = useMeetingToken(sessionId);
  const completeSessionMutation = useCompleteSession();

  const {
    callState,
    error,
    participants,
    join,
    leave,
  } = useDailyContext();

  const [phase, setPhase] = useState<'loading' | 'not-available' | 'pre-call' | 'meeting'>('loading');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [meetingStartTime, setMeetingStartTime] = useState<Date | null>(null);

  // Determine if we're within the time window
  const checkTimeWindow = useCallback(() => {
    if (!session) return { canJoin: false, message: '' };

    const scheduledAt = new Date(session.scheduled_at);
    const now = new Date();
    const windowStart = subMinutes(scheduledAt, EARLY_JOIN_MINUTES);
    const windowEnd = addMinutes(scheduledAt, LATE_JOIN_MINUTES);

    if (isBefore(now, windowStart)) {
      const minutesUntil = differenceInMinutes(windowStart, now);
      return {
        canJoin: false,
        message: `La session n'est pas encore disponible. Vous pourrez rejoindre dans ${minutesUntil} minutes.`,
      };
    }

    if (isAfter(now, windowEnd)) {
      return {
        canJoin: false,
        message: 'La fenêtre de connexion pour cette session est expirée.',
      };
    }

    return { canJoin: true, message: '' };
  }, [session]);

  // Check session status and time window
  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      setPhase('not-available');
      return;
    }

    // Check if session is scheduled
    if (session.status !== 'SCHEDULED' && session.status !== 'IN_PROGRESS') {
      setPhase('not-available');
      return;
    }

    // Check time window
    const { canJoin } = checkTimeWindow();
    if (!canJoin) {
      setPhase('not-available');
      return;
    }

    // All good, show pre-call check
    setPhase('pre-call');
  }, [session, sessionLoading, checkTimeWindow]);

  // Handle joining the meeting
  const handleJoin = async (config: { audioEnabled: boolean; videoEnabled: boolean }) => {
    if (!session || !user) return;

    try {
      // Create meeting room if not exists
      let meetingUrl = session.meeting_url;
      if (!meetingUrl) {
        const result = await createMeetingMutation.mutateAsync(sessionId);
        meetingUrl = result.meeting_url;
      }

      // Get token if not loaded
      const token = tokenData?.token;

      // Join the call
      const userName = `${user.first_name} ${user.last_name}`;
      await join({
        roomUrl: meetingUrl,
        token,
        userName,
        startAudioOff: !config.audioEnabled,
        startVideoOff: !config.videoEnabled,
      });

      setPhase('meeting');
      setMeetingStartTime(new Date());
    } catch (err) {
      console.error('[Meeting] Join error:', err);
    }
  };

  // Handle leaving the meeting
  const handleLeave = async () => {
    await leave();
    router.push(`/sessions/${sessionId}`);
  };

  // Handle ending the session (mentor only)
  const handleEndSession = async (data?: {
    notes?: string;
    topics?: string[];
    masteryLevel?: number;
  }) => {
    if (isMentor && data) {
      await completeSessionMutation.mutateAsync({
        sessionId,
        data: {
          notes: data.notes,
          topics_covered: data.topics,
          mastery_level: data.masteryLevel,
        },
      });
    }
    await leave();
    router.push(`/sessions/${sessionId}?completed=true`);
  };

  // Handle chat toggle and unread count
  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadMessages(0);
    }
  };

  // Get other participant name
  const getOtherParticipantName = () => {
    if (!session) return 'l\'autre participant';
    if (isMentor) {
      return session.mentee_profile?.user
        ? `${session.mentee_profile.user.first_name} ${session.mentee_profile.user.last_name}`
        : 'l\'élève';
    }
    return session.mentor_profile?.user
      ? `${session.mentor_profile.user.first_name} ${session.mentor_profile.user.last_name}`
      : 'le mentor';
  };

  // Loading state
  if (sessionLoading || phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  // Not available state
  if (phase === 'not-available') {
    const { message } = checkTimeWindow();
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">
            Session non disponible
          </h1>
          <p className="text-gray-400 mb-6">
            {message || 'Cette session n\'est pas disponible pour le moment.'}
          </p>
          <Button asChild>
            <Link href={`/sessions/${sessionId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la session
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (error && callState === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <MeetingError
          error={error}
          onRetry={() => setPhase('pre-call')}
          onLeave={() => router.push(`/sessions/${sessionId}`)}
        />
      </div>
    );
  }

  // Pre-call check
  if (phase === 'pre-call') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <PreCallCheck
          userName={user ? `${user.first_name} ${user.last_name}` : 'Participant'}
          onJoin={handleJoin}
          onCancel={() => router.push(`/sessions/${sessionId}`)}
        />
      </div>
    );
  }

  // Meeting view
  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-medium truncate max-w-[200px] md:max-w-none">
            Session avec {getOtherParticipantName()}
          </h1>
        </div>
        {meetingStartTime && session && (
          <SessionTimer
            startTime={meetingStartTime}
            durationMinutes={session.duration}
          />
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 p-4 relative">
          <VideoGrid className="h-full" />

          {/* Waiting room overlay */}
          {callState === 'joined' && participants.length <= 1 && (
            <WaitingRoom
              otherParticipantName={getOtherParticipantName()}
              onLeave={handleLeave}
            />
          )}

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <MeetingControls
              onEndCall={() => setShowEndDialog(true)}
              onToggleChat={handleToggleChat}
              isChatOpen={isChatOpen}
              unreadMessages={unreadMessages}
            />
          </div>
        </div>

        {/* Chat sidebar */}
        <ChatSidebar
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </div>

      {/* End session dialog */}
      <EndSessionDialog
        open={showEndDialog}
        onOpenChange={setShowEndDialog}
        isMentor={isMentor}
        onConfirm={handleEndSession}
        isLoading={completeSessionMutation.isPending}
      />
    </div>
  );
}

export default function MeetingPage() {
  return (
    <DailyProvider>
      <MeetingPageContent />
    </DailyProvider>
  );
}
