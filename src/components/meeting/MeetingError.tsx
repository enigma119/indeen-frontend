'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle,
  WifiOff,
  Clock,
  ShieldOff,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import type { DailyError } from '@/types';

interface MeetingErrorProps {
  error: DailyError;
  onRetry?: () => void;
  onLeave?: () => void;
}

const ERROR_CONFIG: Record<
  DailyError['type'],
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    canRetry: boolean;
  }
> = {
  permissions: {
    icon: <ShieldOff className="h-12 w-12 text-red-500" />,
    title: 'Permissions refusées',
    description:
      'Nous n\'avons pas accès à votre caméra ou microphone. Veuillez autoriser l\'accès dans les paramètres de votre navigateur et réessayer.',
    canRetry: true,
  },
  network: {
    icon: <WifiOff className="h-12 w-12 text-amber-500" />,
    title: 'Problème de connexion',
    description:
      'Impossible de se connecter à la session. Vérifiez votre connexion internet et réessayez.',
    canRetry: true,
  },
  'room-expired': {
    icon: <Clock className="h-12 w-12 text-gray-500" />,
    title: 'Session expirée',
    description:
      'Cette session a expiré ou n\'est plus disponible. Veuillez retourner à la page de session.',
    canRetry: false,
  },
  'not-allowed': {
    icon: <AlertCircle className="h-12 w-12 text-red-500" />,
    title: 'Accès refusé',
    description:
      'Vous n\'êtes pas autorisé à rejoindre cette session. Vérifiez que vous êtes connecté avec le bon compte.',
    canRetry: false,
  },
  unknown: {
    icon: <HelpCircle className="h-12 w-12 text-gray-500" />,
    title: 'Erreur inattendue',
    description:
      'Une erreur est survenue. Veuillez réessayer ou contacter le support si le problème persiste.',
    canRetry: true,
  },
};

export function MeetingError({ error, onRetry, onLeave }: MeetingErrorProps) {
  const config = ERROR_CONFIG[error.type] || ERROR_CONFIG.unknown;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">{config.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {config.title}
            </h2>
            <p className="text-gray-600 mb-6">{config.description}</p>

            {error.details && (
              <p className="text-xs text-gray-400 mb-6 bg-gray-50 p-2 rounded">
                Détails: {error.details}
              </p>
            )}

            <div className="flex gap-4 justify-center">
              {onLeave && (
                <Button variant="outline" onClick={onLeave}>
                  Quitter
                </Button>
              )}
              {config.canRetry && onRetry && (
                <Button
                  onClick={onRetry}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
