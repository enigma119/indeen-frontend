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
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EndSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMentor: boolean;
  onConfirm: (data?: {
    notes?: string;
    topics?: string[];
    masteryLevel?: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

const TOPIC_OPTIONS = [
  'Lecture du Coran',
  'Tajwid',
  'Mémorisation',
  'Révision',
  'Arabe',
  'Fiqh',
  'Aqida',
  'Autre',
];

export function EndSessionDialog({
  open,
  onOpenChange,
  isMentor,
  onConfirm,
  isLoading = false,
}: EndSessionDialogProps) {
  const [notes, setNotes] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [masteryLevel, setMasteryLevel] = useState(50);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleConfirm = async () => {
    if (isMentor) {
      await onConfirm({
        notes,
        topics: selectedTopics,
        masteryLevel,
      });
    } else {
      await onConfirm();
    }
  };

  const getMasteryLabel = () => {
    if (masteryLevel < 25) return 'Débutant';
    if (masteryLevel < 50) return 'En progression';
    if (masteryLevel < 75) return 'Intermédiaire';
    if (masteryLevel < 90) return 'Avancé';
    return 'Maîtrisé';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isMentor ? 'Terminer la session' : 'Quitter la session'}
          </DialogTitle>
          <DialogDescription>
            {isMentor
              ? 'Prenez note de la progression de l\'élève avant de terminer.'
              : 'La session continuera sans vous. Êtes-vous sûr de vouloir quitter ?'}
          </DialogDescription>
        </DialogHeader>

        {isMentor ? (
          <div className="space-y-6 py-4">
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes de session (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Points abordés, observations, recommandations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Topics */}
            <div className="space-y-2">
              <Label>Sujets couverts</Label>
              <div className="flex flex-wrap gap-2">
                {TOPIC_OPTIONS.map((topic) => (
                  <Badge
                    key={topic}
                    variant={selectedTopics.includes(topic) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedTopics.includes(topic)
                        ? 'bg-teal-600 hover:bg-teal-700'
                        : 'hover:bg-gray-100'
                    )}
                    onClick={() => handleTopicToggle(topic)}
                  >
                    {topic}
                    {selectedTopics.includes(topic) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mastery Level */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Niveau de maîtrise</Label>
                <span className="text-sm text-teal-600 font-medium">
                  {masteryLevel}% - {getMasteryLabel()}
                </span>
              </div>
              <Slider
                value={[masteryLevel]}
                onValueChange={([value]) => setMasteryLevel(value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Si vous quittez maintenant, vous devrez demander au mentor de vous
              réinviter pour rejoindre à nouveau.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {isMentor ? 'Annuler' : 'Rester'}
          </Button>
          <Button
            variant={isMentor ? 'default' : 'destructive'}
            onClick={handleConfirm}
            disabled={isLoading}
            className={isMentor ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : isMentor ? (
              'Terminer la session'
            ) : (
              'Quitter'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
