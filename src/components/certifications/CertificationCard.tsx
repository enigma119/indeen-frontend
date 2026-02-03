'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ScrollText,
  GraduationCap,
  Award,
  Globe,
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useDeleteCertification } from '@/hooks/use-certifications';
import { cn } from '@/lib/utils';
import type { Certification, CertificationType } from '@/types';

interface CertificationCardProps {
  certification: Certification;
  onEdit: (certification: Certification) => void;
}

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
    label: 'Diplôme universitaire',
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

const STATUS_CONFIG = {
  PENDING: {
    label: 'En attente de vérification',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700',
  },
  VERIFIED: {
    label: 'Vérifiée',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Rejetée',
    icon: XCircle,
    className: 'bg-red-100 text-red-700',
  },
  EXPIRED: {
    label: 'Expirée',
    icon: AlertTriangle,
    className: 'bg-gray-100 text-gray-700',
  },
};

export function CertificationCard({ certification, onEdit }: CertificationCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteCertification = useDeleteCertification();

  const typeConfig = TYPE_CONFIG[certification.type] || TYPE_CONFIG.other;
  const statusConfig = STATUS_CONFIG[certification.status];
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  const handleDelete = async () => {
    await deleteCertification.mutateAsync(certification.id);
    setShowDeleteDialog(false);
  };

  const isDocumentImage = certification.documentUrl?.match(/\.(jpg|jpeg|png|webp)$/i);

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn('p-3 rounded-lg bg-gray-100', typeConfig.color)}>
              <TypeIcon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {certification.name}
                  </h3>
                  <p className="text-sm text-gray-500">{typeConfig.label}</p>
                </div>
                <Badge className={statusConfig.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                {certification.institution && (
                  <p>
                    <span className="font-medium">Institution :</span>{' '}
                    {certification.institution}
                  </p>
                )}
                {certification.year && (
                  <p>
                    <span className="font-medium">Année :</span> {certification.year}
                  </p>
                )}
                {certification.description && (
                  <p className="text-gray-500 italic">{certification.description}</p>
                )}
              </div>

              {/* Rejection reason */}
              {certification.status === 'REJECTED' && certification.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Raison du rejet :</span>{' '}
                    {certification.rejectionReason}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {certification.documentUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={certification.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {isDocumentImage ? 'Voir image' : 'Voir document'}
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => onEdit(certification)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>

              {/* Public badge */}
              {certification.isPublic && certification.status === 'VERIFIED' && (
                <p className="mt-3 text-xs text-teal-600 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Visible sur votre profil public
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette certification ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La certification &quot;{certification.name}&quot;
              sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCertification.isPending}
            >
              {deleteCertification.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
