'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Key,
  Shield,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  LogOut,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { TwoFactorSetup } from './TwoFactorSetup';
import {
  getActiveSessions,
  getLoginHistory,
  getTwoFactorStatus,
  revokeSession,
  revokeAllSessions,
} from '@/lib/api/settings';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ActiveSession, LoginHistory } from '@/types';

export function SecuritySection() {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingSession, setRevokingSession] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      const [sessionsData, historyData, twoFactorData] = await Promise.all([
        getActiveSessions().catch(() => []),
        getLoginHistory().catch(() => []),
        getTwoFactorStatus().catch(() => ({ enabled: false })),
      ]);

      setSessions(sessionsData);
      setLoginHistory(historyData);
      setTwoFactorEnabled(twoFactorData.enabled);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingSession(sessionId);
    try {
      await revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success('Session déconnectée');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setRevokingSession(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    setRevokingAll(true);
    try {
      await revokeAllSessions();
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      toast.success('Toutes les autres sessions ont été déconnectées');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setRevokingAll(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('phone')) {
      return <Smartphone className="h-5 w-5 text-gray-500" />;
    }
    return <Monitor className="h-5 w-5 text-gray-500" />;
  };

  const maskIp = (ip: string) => {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
    return ip.substring(0, 10) + '***';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Key className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Mot de passe</h3>
            <p className="text-sm text-gray-600 mt-1">
              Modifiez votre mot de passe pour sécuriser votre compte.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowPasswordDialog(true)}
            >
              Changer le mot de passe
            </Button>
          </div>
        </div>
      </section>

      {/* Two-Factor Authentication */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                Authentification à deux facteurs (2FA)
              </h3>
              {twoFactorEnabled ? (
                <Badge className="bg-green-100 text-green-700">Activé</Badge>
              ) : (
                <Badge variant="secondary">Désactivé</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {twoFactorEnabled
                ? 'Votre compte est protégé par une authentification à deux facteurs.'
                : 'Ajoutez une couche de sécurité supplémentaire à votre compte.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowTwoFactorDialog(true)}
            >
              {twoFactorEnabled ? 'Gérer 2FA' : 'Activer 2FA'}
            </Button>
          </div>
        </div>
      </section>

      {/* Active Sessions */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Sessions actives</h3>
            <p className="text-sm text-gray-600 mt-1">
              Gérez les appareils connectés à votre compte.
            </p>
          </div>
          {sessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAllSessions}
              disabled={revokingAll}
            >
              {revokingAll && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tout déconnecter
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune session active trouvée
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                {getDeviceIcon(session.device)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {session.browser} sur {session.os}
                    </p>
                    {session.isCurrent && (
                      <Badge className="bg-teal-100 text-teal-700 text-xs">
                        Session actuelle
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {maskIp(session.ipAddress)}
                    </span>
                    <span>{session.location}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(session.lastActivity), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revokingSession === session.id}
                  >
                    {revokingSession === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Login History */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Historique de connexion</h3>
        <div className="space-y-2">
          {loginHistory.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun historique disponible
            </p>
          ) : (
            loginHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  {entry.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-900">
                      {entry.browser} sur {entry.os}
                    </p>
                    <p className="text-xs text-gray-500">
                      {maskIp(entry.ipAddress)} • {entry.location}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(entry.timestamp), "d MMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Dialogs */}
      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />

      <TwoFactorSetup
        open={showTwoFactorDialog}
        onOpenChange={setShowTwoFactorDialog}
        isEnabled={twoFactorEnabled}
        onStatusChange={setTwoFactorEnabled}
      />
    </div>
  );
}
