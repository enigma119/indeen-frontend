'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import {
  getUserProfile,
  updateUserProfile,
  updateMentorProfile,
  updateMenteeProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  deleteAccount,
} from '@/lib/api/profile';
import type {
  UserWithProfile,
  UpdateUserProfile,
  UpdateMentorProfile,
  UpdateMenteeProfile,
} from '@/types';

/**
 * Hook to fetch current user profile with mentor/mentee profile
 */
export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: getUserProfile,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update user's basic profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateUserProfile) => updateUserProfile(data),
    onSuccess: (updatedUser) => {
      // Update cache
      queryClient.setQueryData(['profile', user?.id], (old: UserWithProfile | undefined) => {
        if (!old) return old;
        return { ...old, ...updatedUser };
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profil mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    },
  });
}

/**
 * Hook to update mentor profile
 */
export function useUpdateMentorProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateMentorProfile) => updateMentorProfile(data),
    onSuccess: (updatedProfile) => {
      // Update cache
      queryClient.setQueryData(['profile', user?.id], (old: UserWithProfile | undefined) => {
        if (!old) return old;
        return { ...old, mentorProfile: { ...old.mentorProfile, ...updatedProfile } };
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profil mentor mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du profil mentor');
    },
  });
}

/**
 * Hook to update mentee profile
 */
export function useUpdateMenteeProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateMenteeProfile) => updateMenteeProfile(data),
    onSuccess: (updatedProfile) => {
      // Update cache
      queryClient.setQueryData(['profile', user?.id], (old: UserWithProfile | undefined) => {
        if (!old) return old;
        return { ...old, menteeProfile: { ...old.menteeProfile, ...updatedProfile } };
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profil élève mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du profil élève');
    },
  });
}

/**
 * Hook to upload avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (avatarUrl) => {
      // Update cache with new avatar URL
      queryClient.setQueryData(['profile', user?.id], (old: UserWithProfile | undefined) => {
        if (!old) return old;
        return { ...old, avatarUrl };
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Photo de profil mise à jour');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors du téléchargement de la photo');
    },
  });
}

/**
 * Hook to delete avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => {
      // Update cache
      queryClient.setQueryData(['profile', user?.id], (old: UserWithProfile | undefined) => {
        if (!old) return old;
        return { ...old, avatarUrl: undefined };
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Photo de profil supprimée');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression de la photo');
    },
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    },
  });
}

/**
 * Hook to delete account (soft delete)
 */
export function useDeleteAccount() {
  const { signOut } = useAuth();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      toast.success('Compte supprimé avec succès');
      await signOut();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du compte');
    },
  });
}
