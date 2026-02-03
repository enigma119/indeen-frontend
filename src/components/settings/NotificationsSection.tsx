'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Mail, Bell, Smartphone, Loader2 } from 'lucide-react';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  sendTestNotification,
} from '@/lib/api/settings';
import { toast } from 'sonner';
import type { NotificationPreferences } from '@/types';

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  emailSessions: true,
  emailPayments: true,
  emailReviews: true,
  emailMarketing: false,
  emailNewsletter: false,
  inAppNotifications: true,
  inAppMessages: true,
  inAppSessions: true,
  inAppBookingRequests: true,
  pushNotifications: false,
  notificationFrequency: 'immediate',
};

export function NotificationsSection() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      const data = await getNotificationPreferences();
      setPreferences(data);
    } catch {
      // Use defaults if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNotificationPreferences(preferences);
      setHasChanges(false);
      toast.success('Préférences enregistrées');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (type: 'email' | 'push' | 'in_app') => {
    setIsTesting(type);
    try {
      await sendTestNotification(type);
      toast.success('Notification de test envoyée');
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsTesting(null);
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Les notifications push ne sont pas supportées par votre navigateur');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      handleChange('pushNotifications', true);
      toast.success('Notifications push activées');
    } else {
      toast.error('Permission refusée pour les notifications');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Mail className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications par email</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recevez des mises à jour importantes par email.
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
              />
            </div>
          </div>
        </div>

        {preferences.emailNotifications && (
          <div className="ml-14 space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="emailSessions"
                checked={preferences.emailSessions}
                onCheckedChange={(checked) =>
                  handleChange('emailSessions', checked as boolean)
                }
              />
              <Label htmlFor="emailSessions" className="text-sm cursor-pointer">
                Sessions (rappels, confirmations)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="emailPayments"
                checked={preferences.emailPayments}
                onCheckedChange={(checked) =>
                  handleChange('emailPayments', checked as boolean)
                }
              />
              <Label htmlFor="emailPayments" className="text-sm cursor-pointer">
                Paiements (reçus, remboursements)
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="emailReviews"
                checked={preferences.emailReviews}
                onCheckedChange={(checked) =>
                  handleChange('emailReviews', checked as boolean)
                }
              />
              <Label htmlFor="emailReviews" className="text-sm cursor-pointer">
                Avis & Messages
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="emailMarketing"
                checked={preferences.emailMarketing}
                onCheckedChange={(checked) =>
                  handleChange('emailMarketing', checked as boolean)
                }
              />
              <Label htmlFor="emailMarketing" className="text-sm cursor-pointer">
                Offres et promotions
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="emailNewsletter"
                checked={preferences.emailNewsletter}
                onCheckedChange={(checked) =>
                  handleChange('emailNewsletter', checked as boolean)
                }
              />
              <Label htmlFor="emailNewsletter" className="text-sm cursor-pointer">
                Newsletter hebdomadaire
              </Label>
            </div>
          </div>
        )}
      </section>

      {/* In-App Notifications */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications dans l&apos;application</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recevez des notifications en temps réel dans l&apos;application.
                </p>
              </div>
              <Switch
                checked={preferences.inAppNotifications}
                onCheckedChange={(checked) => handleChange('inAppNotifications', checked)}
              />
            </div>
          </div>
        </div>

        {preferences.inAppNotifications && (
          <div className="ml-14 space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="inAppMessages"
                checked={preferences.inAppMessages}
                onCheckedChange={(checked) =>
                  handleChange('inAppMessages', checked as boolean)
                }
              />
              <Label htmlFor="inAppMessages" className="text-sm cursor-pointer">
                Nouveaux messages
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="inAppSessions"
                checked={preferences.inAppSessions}
                onCheckedChange={(checked) =>
                  handleChange('inAppSessions', checked as boolean)
                }
              />
              <Label htmlFor="inAppSessions" className="text-sm cursor-pointer">
                Sessions à venir
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="inAppBookingRequests"
                checked={preferences.inAppBookingRequests}
                onCheckedChange={(checked) =>
                  handleChange('inAppBookingRequests', checked as boolean)
                }
              />
              <Label htmlFor="inAppBookingRequests" className="text-sm cursor-pointer">
                Demandes de réservation (Mentor)
              </Label>
            </div>
          </div>
        )}
      </section>

      {/* Push Notifications */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Smartphone className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications push</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recevez des notifications même quand l&apos;application est fermée.
                </p>
              </div>
              <Switch
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => {
                  if (checked && Notification.permission !== 'granted') {
                    requestPushPermission();
                  } else {
                    handleChange('pushNotifications', checked);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notification Frequency */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Fréquence des notifications</h3>
        <Select
          value={preferences.notificationFrequency}
          onValueChange={(value) =>
            handleChange('notificationFrequency', value as 'immediate' | 'daily' | 'weekly')
          }
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Immédiatement</SelectItem>
            <SelectItem value="daily">Résumé quotidien</SelectItem>
            <SelectItem value="weekly">Résumé hebdomadaire</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* Test & Save */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTestNotification('email')}
            disabled={isTesting !== null}
          >
            {isTesting === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tester email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTestNotification('in_app')}
            disabled={isTesting !== null}
          >
            {isTesting === 'in_app' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tester in-app
          </Button>
        </div>

        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les préférences
        </Button>
      </div>
    </div>
  );
}
