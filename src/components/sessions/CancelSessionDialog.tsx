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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { differenceInHours } from 'date-fns';
import { useCancelSession } from '@/hooks/use-sessions';
import type { Session } from '@/types';

interface CancelSessionDialogProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type RefundLevel = 'full' | 'partial' | 'none';

function getRefundLevel(scheduledAt: Date): RefundLevel {
  const now = new Date();
  const hoursUntil = differenceInHours(scheduledAt, now);

  if (hoursUntil > 24) return 'full';
  if (hoursUntil > 2) return 'partial';
  return 'none';
}

const REFUND_CONFIG: Record<
  RefundLevel,
  { title: string; description: string; variant: 'default' | 'warning' | 'destructive'; requiresReason: boolean }
> = {
  full: {
    title: 'Remboursement intégral',
    description: 'Vous serez remboursé à 100% car vous annulez plus de 24h avant la session.',
    variant: 'default',
    requiresReason: false,
  },
  partial: {
    title: 'Remboursement partiel (50%)',
    description: 'Vous serez remboursé à 50% car vous annulez entre 2h et 24h avant la session.',
    variant: 'warning',
    requiresReason: true,
  },
  none: {
    title: 'Pas de remboursement',
    description: 'Aucun remboursement car vous annulez moins de 2h avant la session.',
    variant: 'destructive',
    requiresReason: true,
  },
};

export function CancelSessionDialog({
  session,
  open,
  onOpenChange,
  onSuccess,
}: CancelSessionDialogProps) {
  const [reason, setReason] = useState('');
  const cancelSession = useCancelSession();

  const scheduledAt = new Date(session.scheduled_at);
  const refundLevel = getRefundLevel(scheduledAt);
  const config = REFUND_CONFIG[refundLevel];

  const canSubmit = !config.requiresReason || reason.trim().length >= 10;

  const handleCancel = async () => {
    await cancelSession.mutateAsync(
      { sessionId: session.id, reason: reason.trim() || 'Annulation par le mentee' },
      {
        onSuccess: () => {
          setReason('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Annuler la session</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d'annuler votre session. Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Refund Info */}
          <Alert
            variant={config.variant === 'warning' ? 'default' : config.variant === 'destructive' ? 'destructive' : 'default'}
            className={config.variant === 'warning' ? 'border-amber-500 bg-amber-50' : ''}
          >
            {config.variant === 'default' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle className={config.variant === 'warning' ? 'text-amber-800' : ''}>
              {config.title}
            </AlertTitle>
            <AlertDescription className={config.variant === 'warning' ? 'text-amber-700' : ''}>
              {config.description}
            </AlertDescription>
          </Alert>

          {/* Reason textarea */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Raison de l'annulation
              {config.requiresReason && <span className="text-red-500"> *</span>}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez la raison de votre annulation..."
              rows={3}
            />
            {config.requiresReason && reason.length > 0 && reason.length < 10 && (
              <p className="text-sm text-red-500">
                Minimum 10 caractères requis ({reason.length}/10)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Retour
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={!canSubmit || cancelSession.isPending}
          >
            {cancelSession.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Annulation...
              </>
            ) : (
              'Confirmer l\'annulation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
