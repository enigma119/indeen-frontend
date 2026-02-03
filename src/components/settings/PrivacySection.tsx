'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Users, Cookie, Loader2, Info, ExternalLink } from 'lucide-react';
import { getPrivacySettings, updatePrivacySettings } from '@/lib/api/settings';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import type { PrivacySettings } from '@/types';
import Link from 'next/link';

const defaultSettings: PrivacySettings = {
  profileVisibleToMentors: true,
  shareFirstName: true,
  shareCountry: true,
  shareLearningGoals: true,
  appearInSearch: true,
  acceptingNewStudents: true,
  analyticalCookies: true,
  marketingCookies: false,
};

export function PrivacySection() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isMentor = user?.role === 'MENTOR';
  const isMentee = user?.role === 'MENTEE';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getPrivacySettings();
      setSettings(data);
    } catch {
      // Use defaults if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePrivacySettings(settings);
      setHasChanges(false);
      toast.success('Paramètres de confidentialité enregistrés');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mentee Privacy Settings */}
      {isMentee && (
        <>
          <section className="bg-white rounded-lg border p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Eye className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Visibilité du profil</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Contrôlez ce que les mentors peuvent voir de votre profil.
                    </p>
                  </div>
                  <Switch
                    checked={settings.profileVisibleToMentors}
                    onCheckedChange={(checked) =>
                      handleChange('profileVisibleToMentors', checked)
                    }
                  />
                </div>
              </div>
            </div>

            {!settings.profileVisibleToMentors && (
              <Alert className="ml-14 bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Si désactivé, les mentors ne pourront pas voir votre profil complet.
                </AlertDescription>
              </Alert>
            )}
          </section>

          <section className="bg-white rounded-lg border p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Données partagées</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choisissez quelles informations partager avec les mentors.
                </p>
              </div>
            </div>

            <div className="ml-14 space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="shareFirstName"
                  checked={settings.shareFirstName}
                  onCheckedChange={(checked) =>
                    handleChange('shareFirstName', checked as boolean)
                  }
                />
                <Label htmlFor="shareFirstName" className="text-sm cursor-pointer">
                  Partager mon prénom avec les mentors
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="shareCountry"
                  checked={settings.shareCountry}
                  onCheckedChange={(checked) =>
                    handleChange('shareCountry', checked as boolean)
                  }
                />
                <Label htmlFor="shareCountry" className="text-sm cursor-pointer">
                  Partager ma localisation (pays seulement)
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="shareLearningGoals"
                  checked={settings.shareLearningGoals}
                  onCheckedChange={(checked) =>
                    handleChange('shareLearningGoals', checked as boolean)
                  }
                />
                <Label htmlFor="shareLearningGoals" className="text-sm cursor-pointer">
                  Partager mes objectifs d&apos;apprentissage
                </Label>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Mentor Privacy Settings */}
      {isMentor && (
        <section className="bg-white rounded-lg border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Eye className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Visibilité du profil public</h3>
              <p className="text-sm text-gray-600 mt-1">
                Contrôlez comment votre profil apparaît dans les recherches.
              </p>
            </div>
          </div>

          <div className="ml-14 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Apparaître dans les recherches
                </p>
                <p className="text-xs text-gray-500">
                  Si désactivé, votre profil reste actif mais non visible
                </p>
              </div>
              <Switch
                checked={settings.appearInSearch}
                onCheckedChange={(checked) => handleChange('appearInSearch', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Accepter de nouveaux élèves
                </p>
                <p className="text-xs text-gray-500">
                  Affiche un badge &quot;Accepte de nouveaux élèves&quot;
                </p>
              </div>
              <Switch
                checked={settings.acceptingNewStudents}
                onCheckedChange={(checked) =>
                  handleChange('acceptingNewStudents', checked)
                }
              />
            </div>
          </div>

          {!settings.appearInSearch && (
            <Alert className="ml-14 mt-4 bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Votre profil ne sera pas visible dans les résultats de recherche.
              </AlertDescription>
            </Alert>
          )}
        </section>
      )}

      {/* Cookies & Tracking */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Cookie className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Cookies & Suivi</h3>
            <p className="text-sm text-gray-600 mt-1">
              Gérez vos préférences de cookies.
            </p>
          </div>
        </div>

        <div className="ml-14 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Cookies analytiques</p>
              <p className="text-xs text-gray-500">
                Nous aident à améliorer notre service
              </p>
            </div>
            <Switch
              checked={settings.analyticalCookies}
              onCheckedChange={(checked) => handleChange('analyticalCookies', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Cookies marketing</p>
              <p className="text-xs text-gray-500">
                Utilisés pour personnaliser les publicités
              </p>
            </div>
            <Switch
              checked={settings.marketingCookies}
              onCheckedChange={(checked) => handleChange('marketingCookies', checked)}
            />
          </div>

          <Link
            href="/politique-cookies"
            className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
          >
            En savoir plus sur notre politique de cookies
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
