'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Check, X, Loader2, User, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useConfirmSession, useRejectSession } from '@/hooks/use-sessions';
import type { Session } from '@/types';

interface MentorConfirmDialogProps {
  session: Session;
  action: 'accept' | 'reject';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MentorConfirmDialog({
  session,
  action,
  open,
  onOpenChange,
  onSuccess,
}: MentorConfirmDialogProps) {
  const [reason, setReason] = useState('');
  const confirmSession = useConfirmSession();
  const rejectSession = useRejectSession();

  const isAccept = action === 'accept';
  const isPending = confirmSession.isPending || rejectSession.isPending;

  const mentee = session.mentee_profile;
  const menteeName = mentee?.user
    ? `${mentee.user.firstName} ${mentee.user.lastName}`
    : 'Élève';
  const initials = mentee?.user
    ? `${mentee.user.firstName[0]}${mentee.user.lastName[0]}`
    : 'E';

  const scheduledDate = new Date(session.scheduled_at);

  const canSubmit = isAccept || reason.trim().length >= 10;

  const handleSubmit = async () => {
    if (isAccept) {
      await confirmSession.mutateAsync(session.id, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    } else {
      await rejectSession.mutateAsync(
        { sessionId: session.id, reason: reason.trim() },
        {
          onSuccess: () => {
            setReason('');
            onSuccess?.();
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAccept ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                Accepter la session
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-600" />
                Refuser la session
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isAccept
              ? 'Confirmez que vous êtes disponible pour cette session.'
              : 'Indiquez la raison du refus. L\'élève sera remboursé intégralement.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Session Info */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={mentee?.user?.avatarUrl} alt={menteeName} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{menteeName}</h4>
                {mentee?.currentLevel && (
                  <Badge variant="outline" className="text-xs">
                    {mentee.currentLevel}
                  </Badge>
                )}
              </div>

              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="capitalize">
                    {format(scheduledDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {format(scheduledDate, 'HH:mm')} - {session.duration} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Plan */}
          {session.lesson_plan && (
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-medium flex items-center gap-1.5 text-gray-700">
                <BookOpen className="h-4 w-4" />
                Plan de session demandé :
              </p>
              <p className="text-sm text-gray-600 mt-1">{session.lesson_plan}</p>
            </div>
          )}

          {/* Mentee Goals */}
          {mentee?.learningGoals && mentee.learningGoals.length > 0 && (
            <div className="p-3 border rounded-lg">
              <p className="text-sm font-medium flex items-center gap-1.5 text-gray-700">
                <User className="h-4 w-4" />
                Objectifs de l'élève :
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {mentee.learningGoals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reason textarea for rejection */}
          {!isAccept && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                Raison du refus <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Je ne suis plus disponible à cette date, j'ai un imprévu personnel..."
                rows={3}
              />
              {reason.length > 0 && reason.length < 10 && (
                <p className="text-sm text-red-500">
                  Minimum 10 caractères requis ({reason.length}/10)
                </p>
              )}
              <p className="text-sm text-gray-500">
                L'élève sera automatiquement remboursé et notifié par email.
              </p>
            </div>
          )}

          {/* Accept confirmation */}
          {isAccept && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                En acceptant, vous vous engagez à être présent et à assurer la session.
                L'élève recevra un email de confirmation.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant={isAccept ? 'default' : 'destructive'}
            className={isAccept ? 'bg-green-600 hover:bg-green-700' : ''}
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isAccept ? 'Confirmation...' : 'Refus...'}
              </>
            ) : isAccept ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirmer la session
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Refuser la session
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
