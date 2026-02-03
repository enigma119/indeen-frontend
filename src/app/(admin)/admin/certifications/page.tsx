'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ScrollText,
  GraduationCap,
  Award,
  Globe,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Clock,
} from 'lucide-react';
import {
  usePendingCertifications,
  useApproveCertification,
  useRejectCertification,
} from '@/hooks/use-certifications';
import { cn } from '@/lib/utils';
import type { CertificationType, Certification } from '@/types';

const TYPE_CONFIG: Record<
  CertificationType,
  { label: string; icon: React.ElementType; color: string }
> = {
  ijaza: {
    label: 'Ijaza',
    icon: ScrollText,
    color: 'text-emerald-600',
  },
  university_degree: {
    label: 'Diplome universitaire',
    icon: GraduationCap,
    color: 'text-blue-600',
  },
  professional_training: {
    label: 'Formation professionnelle',
    icon: Award,
    color: 'text-purple-600',
  },
  online_certification: {
    label: 'Certification en ligne',
    icon: Globe,
    color: 'text-orange-600',
  },
  other: {
    label: 'Autre',
    icon: FileText,
    color: 'text-gray-600',
  },
};

type CertificationWithMentor = Certification & {
  mentor?: {
    id: string;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
};

export default function AdminCertificationsPage() {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] =
    useState<CertificationWithMentor | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: certifications, isLoading, error } = usePendingCertifications();
  const approveCertification = useApproveCertification();
  const rejectCertification = useRejectCertification();

  const handleApprove = async (id: string) => {
    await approveCertification.mutateAsync(id);
  };

  const handleRejectClick = (certification: CertificationWithMentor) => {
    setSelectedCertification(certification);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedCertification || !rejectReason.trim()) return;

    await rejectCertification.mutateAsync({
      id: selectedCertification.id,
      reason: rejectReason.trim(),
    });
    setRejectDialogOpen(false);
    setSelectedCertification(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Certifications en attente
        </h1>
        <p className="text-gray-500 mt-1">
          Vérifiez et approuvez les certifications des mentors
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">
                Erreur lors du chargement des certifications.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && certifications?.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune certification en attente
              </h3>
              <p className="text-gray-500">
                Toutes les certifications ont ete verifiees.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications List */}
      {!isLoading && !error && certifications && certifications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              <Clock className="h-3 w-3 mr-1" />
              {certifications.length} en attente
            </Badge>
          </div>

          {certifications.map((certification) => {
            const typeConfig =
              TYPE_CONFIG[certification.type] || TYPE_CONFIG.other;
            const TypeIcon = typeConfig.icon;
            const mentor = certification.mentor;
            const user = mentor?.user;

            return (
              <Card key={certification.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg bg-gray-100',
                          typeConfig.color
                        )}
                      >
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {certification.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {typeConfig.label}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700"
                    >
                      En attente
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Mentor Info */}
                  {user && (
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  )}

                  {/* Certification Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {certification.institution && (
                      <div>
                        <span className="font-medium text-gray-700">
                          Institution:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {certification.institution}
                        </span>
                      </div>
                    )}
                    {certification.year && (
                      <div>
                        <span className="font-medium text-gray-700">
                          Annee:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {certification.year}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">
                        Soumis le:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {formatDate(certification.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Visibilite:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {certification.isPublic ? 'Public' : 'Prive'}
                      </span>
                    </div>
                  </div>

                  {certification.description && (
                    <p className="text-sm text-gray-600 italic">
                      {certification.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t">
                    {certification.documentUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={certification.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Voir le document
                        </a>
                      </Button>
                    )}
                    <div className="flex-1" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectClick(certification)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={rejectCertification.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(certification.id)}
                      disabled={approveCertification.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {approveCertification.isPending ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Approuver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la certification</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet. Cette information sera
              communiquee au mentor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedCertification && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  {selectedCertification.name}
                </p>
                <p className="text-sm text-gray-500">
                  {TYPE_CONFIG[selectedCertification.type]?.label}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Raison du rejet *</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Document illisible, informations incompletes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={rejectCertification.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || rejectCertification.isPending}
            >
              {rejectCertification.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
