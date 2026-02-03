'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CertificationCard } from '@/components/certifications/CertificationCard';
import { CertificationDialog } from '@/components/certifications/CertificationDialog';
import { useCertifications } from '@/hooks/use-certifications';
import { Plus, ScrollText, Loader2, AlertCircle } from 'lucide-react';
import type { Certification } from '@/types';

export default function CertificationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const { data: certifications, isLoading, error } = useCertifications();

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingCertification(null);
    }
  };

  return (
    <AuthGuard requiredRole="MENTOR">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Certifications</h1>
            <p className="text-gray-500 mt-1">
              Gérez vos certifications et qualifications professionnelles
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
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
                  Erreur lors du chargement des certifications. Veuillez réessayer.
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
                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <ScrollText className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune certification
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Ajoutez vos certifications, diplômes et ijazas pour renforcer votre crédibilité
                  auprès des apprenants.
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une certification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certifications List */}
        {!isLoading && !error && certifications && certifications.length > 0 && (
          <div className="space-y-4">
            {/* Info Alert */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <p className="text-sm text-blue-700">
                  <strong>Note :</strong> Toutes les certifications sont vérifiées par notre équipe
                  avant d&apos;apparaître sur votre profil public.
                </p>
              </CardContent>
            </Card>

            {/* Cards */}
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* Dialog */}
        <CertificationDialog
          open={dialogOpen}
          onOpenChange={handleOpenChange}
          certification={editingCertification}
        />
      </div>
    </AuthGuard>
  );
}
