'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flag, Loader2 } from 'lucide-react';
import { useReportMentor } from '@/hooks/use-mentors';

interface ReportDialogProps {
  mentorId: string;
}

const REPORT_REASONS = [
  { value: 'incorrect_info', label: 'Informations incorrectes' },
  { value: 'inappropriate_behavior', label: 'Comportement inapproprié' },
  { value: 'spam', label: 'Spam ou publicité' },
  { value: 'other', label: 'Autre' },
];

export function ReportDialog({ mentorId }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: reportMentor, isPending } = useReportMentor();

  const handleSubmit = () => {
    if (!reason) return;

    reportMentor(
      {
        mentor_id: mentorId,
        reason,
        description,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => {
            setOpen(false);
            setSubmitted(false);
            setReason('');
            setDescription('');
          }, 2000);
        },
        onError: () => {
          // Handle error silently or show toast
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isPending) {
      setOpen(newOpen);
      if (!newOpen) {
        setReason('');
        setDescription('');
        setSubmitted(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 gap-2">
          <Flag className="h-4 w-4" />
          Signaler ce profil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Flag className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="mb-2">Signalement envoyé</DialogTitle>
            <DialogDescription>
              Merci pour votre signalement. Notre équipe l'examinera dans les
              plus brefs délais.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Signaler ce profil</DialogTitle>
              <DialogDescription>
                Indiquez la raison de votre signalement. Notre équipe examinera
                votre demande.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Raison du signalement
                </label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une raison" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Description (optionnel)
                </label>
                <Textarea
                  placeholder="Décrivez le problème en détail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason || isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Envoyer le signalement'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
