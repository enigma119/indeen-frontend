'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  Clock,
  Info,
} from 'lucide-react';
import { requestDataExport, getDataExportStatus } from '@/lib/api/settings';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DataExportRequest } from '@/types';

export function DataSection() {
  const [exportStatus, setExportStatus] = useState<DataExportRequest | null>(null);
  const [format_, setFormat] = useState<'json' | 'csv'>('json');
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkExportStatus();
  }, []);

  const checkExportStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getDataExportStatus();
      setExportStatus(status);
    } catch {
      // No pending export
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestExport = async () => {
    setIsRequesting(true);
    try {
      const request = await requestDataExport(format_);
      setExportStatus(request);
      toast.success('Demande d\'export envoyée. Vous recevrez un email quand vos données seront prêtes.');
    } catch {
      toast.error('Erreur lors de la demande d\'export');
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusBadge = (status: DataExportRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Terminé</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* GDPR Info */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Download className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Télécharger mes données</h3>
            <p className="text-sm text-gray-600 mt-1">
              Conformément au RGPD, vous pouvez télécharger une copie de toutes vos données.
            </p>
          </div>
        </div>

        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            L&apos;export inclut : votre profil, historique de sessions, paiements, messages
            et progression d&apos;apprentissage.
          </AlertDescription>
        </Alert>
      </section>

      {/* Export Request */}
      <section className="bg-white rounded-lg border p-6">
        <h4 className="font-medium text-gray-900 mb-4">Demander un export</h4>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : exportStatus &&
          (exportStatus.status === 'pending' || exportStatus.status === 'processing') ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Export en cours</span>
              {getStatusBadge(exportStatus.status)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                Demandé{' '}
                {formatDistanceToNow(new Date(exportStatus.requestedAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Vous recevrez un email avec le lien de téléchargement quand l&apos;export sera
              prêt.
            </p>
          </div>
        ) : exportStatus && exportStatus.status === 'completed' && exportStatus.downloadUrl ? (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">Export prêt</span>
              </div>
              {getStatusBadge(exportStatus.status)}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Votre export est disponible. Le lien expire le{' '}
              {exportStatus.expiresAt &&
                format(new Date(exportStatus.expiresAt), 'd MMM yyyy', { locale: fr })}
              .
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <a href={exportStatus.downloadUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleRequestExport}>
                Nouvel export
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Format de l&apos;export
                </label>
                <Select
                  value={format_}
                  onValueChange={(value) => setFormat(value as 'json' | 'csv')}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        JSON
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        CSV
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleRequestExport} disabled={isRequesting}>
              {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Demander un export
            </Button>

            <p className="text-xs text-gray-500">
              Le traitement peut prendre quelques minutes. Vous recevrez un email avec le
              lien de téléchargement. Le lien sera valide pendant 7 jours.
            </p>
          </div>
        )}
      </section>

      {/* Data Included */}
      <section className="bg-white rounded-lg border p-6">
        <h4 className="font-medium text-gray-900 mb-4">Données incluses dans l&apos;export</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Profil complet (informations personnelles, préférences)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Historique des sessions
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Historique des paiements et factures
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Messages et conversations
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Avis donnés et reçus
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Progression d&apos;apprentissage (pour les élèves)
          </li>
        </ul>
      </section>
    </div>
  );
}
