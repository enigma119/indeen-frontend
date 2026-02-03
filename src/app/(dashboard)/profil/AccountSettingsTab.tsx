'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Mail, Key, Trash2, CheckCircle } from 'lucide-react';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations/profile';
import { useChangePassword, useDeleteAccount } from '@/hooks/use-profile';
import { requestEmailVerification } from '@/lib/api/profile';
import { toast } from 'sonner';
import type { User } from '@/types';

interface AccountSettingsTabProps {
  user: User;
}

export function AccountSettingsTab({ user }: AccountSettingsTabProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    await changePassword.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
  };

  const handleRequestVerification = async () => {
    setIsVerifying(true);
    try {
      await requestEmailVerification();
      toast.success('Email de vérification envoyé !');
    } catch {
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') return;
    await deleteAccount.mutateAsync();
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-8">
      {/* Email Verification */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Mail className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Vérification de l&apos;email</h2>
            <p className="text-sm text-gray-600 mt-1">{user.email}</p>

            {user.emailVerified ? (
              <div className="flex items-center gap-2 mt-3 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Email vérifié</span>
              </div>
            ) : (
              <div className="mt-3">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    Votre email n&apos;est pas vérifié. Certaines fonctionnalités peuvent être limitées.
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestVerification}
                  disabled={isVerifying}
                  className="mt-3"
                >
                  {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Renvoyer l&apos;email de vérification
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Key className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Changer le mot de passe</h2>
            <p className="text-sm text-gray-600 mt-1">
              Assurez-vous d&apos;utiliser un mot de passe fort et unique.
            </p>

            <form onSubmit={handleSubmit(onPasswordSubmit)} className="mt-6 space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register('currentPassword')}
                  placeholder="••••••••"
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500">
                  Minimum 8 caractères avec majuscule, minuscule et chiffre.
                </p>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Modifier le mot de passe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Delete Account */}
      <section className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-700">Supprimer le compte</h2>
            <p className="text-sm text-gray-600 mt-1">
              Cette action est irréversible. Toutes vos données seront supprimées.
            </p>

            <Button
              variant="outline"
              className="mt-4 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={() => setShowDeleteDialog(true)}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700">Supprimer le compte</DialogTitle>
            <DialogDescription>
              Cette action est permanente et ne peut pas être annulée. Toutes vos données,
              sessions et historique seront définitivement supprimés.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous.
              </AlertDescription>
            </Alert>

            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="SUPPRIMER"
              className="uppercase"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmation('');
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'SUPPRIMER' || deleteAccount.isPending}
            >
              {deleteAccount.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
