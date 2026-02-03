'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Trash2, Loader2, XCircle } from 'lucide-react';
import {
  checkCanDeleteAccount,
  deleteAccount as deleteAccountApi,
} from '@/lib/api/settings';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import type { DeleteAccountCheck, DeleteAccountReason } from '@/types';

const DELETE_REASONS: { value: DeleteAccountReason; label: string }[] = [
  { value: 'no_longer_needed', label: 'Je n\'ai plus besoin du service' },
  { value: 'too_expensive', label: 'C\'est trop cher' },
  { value: 'technical_issues', label: 'Problèmes techniques' },
  { value: 'bad_experience', label: 'Mauvaise expérience' },
  { value: 'other', label: 'Autre raison' },
];

export function DeleteAccountSection() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-700">Zone Dangereuse</h3>
            <p className="text-sm text-gray-600 mt-1">
              Supprimer définitivement mon compte
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cette action est irréversible. Toutes vos données seront définitivement
              supprimées et ne pourront pas être récupérées.
            </p>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => setShowDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </section>

      <DeleteAccountDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
}

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [step, setStep] = useState<'check' | 'reason' | 'confirm'>('check');
  const [checkResult, setCheckResult] = useState<DeleteAccountCheck | null>(null);
  const [reason, setReason] = useState<DeleteAccountReason | ''>('');
  const [feedback, setFeedback] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      checkDeleteEligibility();
    } else {
      // Reset state when dialog closes
      setStep('check');
      setCheckResult(null);
      setReason('');
      setFeedback('');
      setConfirmation('');
      setUnderstood(false);
    }
  }, [open]);

  const checkDeleteEligibility = async () => {
    setIsLoading(true);
    try {
      const result = await checkCanDeleteAccount();
      setCheckResult(result);
      if (result.canDelete) {
        setStep('reason');
      }
    } catch {
      setCheckResult({
        canDelete: false,
        pendingSessions: 0,
        pendingPayments: 0,
        blockers: ['Erreur lors de la vérification. Veuillez réessayer.'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirmation !== 'SUPPRIMER' || !understood) return;

    setIsDeleting(true);
    try {
      await deleteAccountApi(reason || undefined, feedback || undefined);
      toast.success('Compte supprimé avec succès');
      await signOut();
      router.push('/compte-supprime');
    } catch {
      toast.error('Erreur lors de la suppression du compte');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-700 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Supprimer le compte
          </DialogTitle>
          <DialogDescription>
            Cette action est permanente et ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>

        {/* Step: Check Eligibility */}
        {step === 'check' && (
          <div className="py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Vérification en cours...</p>
              </div>
            ) : checkResult && !checkResult.canDelete ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vous ne pouvez pas supprimer votre compte pour le moment.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  {checkResult.pendingSessions > 0 && (
                    <p className="text-sm text-gray-600">
                      • Vous avez {checkResult.pendingSessions} session(s) à venir.
                      Annulez-les d&apos;abord.
                    </p>
                  )}
                  {checkResult.pendingPayments > 0 && (
                    <p className="text-sm text-gray-600">
                      • Vous avez {checkResult.pendingPayments} paiement(s) en attente.
                    </p>
                  )}
                  {checkResult.blockers.map((blocker, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      • {blocker}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step: Reason */}
        {step === 'reason' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pourquoi partez-vous ? (optionnel)</Label>
              <Select
                value={reason}
                onValueChange={(value) => setReason(value as DeleteAccountReason)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une raison" />
                </SelectTrigger>
                <SelectContent>
                  {DELETE_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Commentaires (optionnel)</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Aidez-nous à nous améliorer..."
                rows={3}
                maxLength={500}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => setStep('confirm')}>
                Continuer
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step: Final Confirmation */}
        {step === 'confirm' && (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Toutes vos données, sessions et historique seront définitivement supprimés.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="understood"
                  checked={understood}
                  onCheckedChange={(checked) => setUnderstood(checked as boolean)}
                />
                <Label htmlFor="understood" className="text-sm cursor-pointer">
                  Je comprends que cette action est irréversible et que toutes mes données
                  seront supprimées.
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  Pour confirmer, tapez <strong>SUPPRIMER</strong>
                </Label>
                <Input
                  id="confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
                  placeholder="SUPPRIMER"
                  className="uppercase"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('reason')}>
                Retour
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={
                  confirmation !== 'SUPPRIMER' || !understood || isDeleting
                }
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Supprimer définitivement
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Show cancel button only on check step when blocked */}
        {step === 'check' && checkResult && !checkResult.canDelete && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
